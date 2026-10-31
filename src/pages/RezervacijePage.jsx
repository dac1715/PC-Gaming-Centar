import React, { useMemo, useState } from 'react';
import { Empty, PageHead } from '../components/ui.jsx';
import { useStore } from '../store.jsx';
import { STATUS_LABEL, fmtDate, hoursOf, statusOf, todayStr } from '../utils/time.js';

const FILTERS = [
  ['sve', 'Sve'],
  ['danas', 'Danas'],
  ['predstoji', 'Predstojeće'],
  ['zavrseno', 'Završene'],
];

export default function RezervacijePage({ onNew, onOpen }) {
  const { state, userName, pcName, gameName } = useStore();
  const [filter, setFilter] = useState('sve');
  const [q, setQ] = useState('');

  const rows = useMemo(() => {
    const today = todayStr();
    return state.rezervacije
      .filter((r) => {
        const st = statusOf(r);
        if (filter === 'danas' && r.date !== today) return false;
        if (filter === 'predstoji' && st === 'zavrseno') return false;
        if (filter === 'zavrseno' && st !== 'zavrseno') return false;
        if (q && !`${userName(r.userId)} ${pcName(r.computerId)} ${gameName(r.gameId)}`.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
  }, [state, filter, q]);

  return (
    <section>
      <PageHead
        title="Rezervacije"
        count={rows.length}
        action={
          <button type="button" className="btn btn--primary" onClick={onNew}>
            + Nova rezervacija
          </button>
        }
      />
      <div className="toolbar">
        <div className="segmented" role="group" aria-label="Filtar">
          {FILTERS.map(([k, l]) => (
            <button key={k} type="button" className={filter === k ? 'is-on' : ''} onClick={() => setFilter(k)}>
              {l}
            </button>
          ))}
        </div>
        <input type="search" placeholder="Pretraži korisnika, računalo, igru…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {rows.length === 0 ? (
        <Empty>Nema rezervacija za odabrani filtar.</Empty>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Datum</th>
                <th>Vrijeme</th>
                <th>Korisnik</th>
                <th>Računalo</th>
                <th>Igra</th>
                <th>Trajanje</th>
                <th>Cijena</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const st = statusOf(r);
                const pc = state.racunala.find((c) => c.id === r.computerId);
                return (
                  <tr key={r.id} className="is-click" onClick={() => onOpen(r)}>
                    <td>{fmtDate(r.date)}</td>
                    <td>
                      {r.start}–{r.end}
                    </td>
                    <td>{userName(r.userId)}</td>
                    <td>{pcName(r.computerId)}</td>
                    <td>{gameName(r.gameId) || '—'}</td>
                    <td>{hoursOf(r)} h</td>
                    <td>{pc ? (hoursOf(r) * pc.cijenaH).toFixed(2) + ' €' : '—'}</td>
                    <td>
                      <span className={`pill pill--${st}`}>{STATUS_LABEL[st]}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
