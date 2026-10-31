import React, { useMemo, useState } from 'react';
import { Field, Modal } from './ui.jsx';
import { useStore, validateReservation } from '../store.jsx';
import { CLOSE, OPEN, slots, toMin, toStr } from '../utils/time.js';

export default function ReservationModal({ initial, onClose }) {
  const { state, save, remove } = useStore();
  const editing = Boolean(initial.id);
  const [r, setR] = useState(initial);
  const [error, setError] = useState('');

  const set = (k, v) => {
    setError('');
    setR((p) => {
      const next = { ...p, [k]: v };
      if (k === 'computerId' && next.gameId) {
        const g = state.igre.find((x) => x.id === next.gameId);
        if (g && !g.racunala.includes(v)) next.gameId = '';
      }
      if (k === 'start' && toMin(next.end) <= toMin(v)) next.end = toStr(Math.min(toMin(v) + 60, CLOSE));
      return next;
    });
  };

  const games = useMemo(
    () => state.igre.filter((g) => !r.computerId || g.racunala.includes(r.computerId)),
    [state.igre, r.computerId]
  );
  const pc = state.racunala.find((c) => c.id === r.computerId);
  const hrs = r.start && r.end ? (toMin(r.end) - toMin(r.start)) / 60 : 0;
  const price = pc && hrs > 0 ? (hrs * pc.cijenaH).toFixed(2) : null;

  const submit = (e) => {
    e.preventDefault();
    const err = validateReservation(state, r);
    if (err) return setError(err);
    save('rezervacije', r);
    onClose();
  };

  const del = () => {
    if (window.confirm('Otkazati ovu rezervaciju?')) {
      remove('rezervacije', r.id);
      onClose();
    }
  };

  return (
    <Modal
      title={editing ? 'Uredi rezervaciju' : 'Nova rezervacija'}
      onClose={onClose}
      footer={
        <>
          {editing && (
            <button type="button" className="btn btn--danger" onClick={del}>
              Otkaži rezervaciju
            </button>
          )}
          <span className="spacer" />
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Odustani
          </button>
          <button type="submit" form="res-form" className="btn btn--primary">
            Spremi
          </button>
        </>
      }
    >
      <form id="res-form" className="form-grid" onSubmit={submit}>
        <Field label="Korisnik">
          <select value={r.userId} onChange={(e) => set('userId', e.target.value)} autoFocus>
            <option value="">— odaberite —</option>
            {state.korisnici.map((u) => (
              <option key={u.id} value={u.id}>
                {u.ime} {u.prezime} ({u.nadimak})
              </option>
            ))}
          </select>
        </Field>
        <Field label="Računalo">
          <select value={r.computerId} onChange={(e) => set('computerId', e.target.value)}>
            <option value="">— odaberite —</option>
            {state.racunala.map((c) => (
              <option key={c.id} value={c.id} disabled={c.status !== 'aktivno'}>
                {c.oznaka} · {c.gpu} · {c.cijenaH.toFixed(2)} €/h{c.status !== 'aktivno' ? ` (${c.status})` : ''}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Datum">
          <input type="date" value={r.date} onChange={(e) => set('date', e.target.value)} />
        </Field>
        <Field label="Igra (neobavezno)" hint={r.computerId ? 'Prikazane su igre instalirane na odabranom računalu.' : ''}>
          <select value={r.gameId || ''} onChange={(e) => set('gameId', e.target.value)}>
            <option value="">— bez odabrane igre —</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.naslov} (PEGI {g.pegi})
              </option>
            ))}
          </select>
        </Field>
        <Field label="Početak">
          <select value={r.start} onChange={(e) => set('start', e.target.value)}>
            {slots(OPEN, CLOSE - 30).map((m) => (
              <option key={m} value={toStr(m)}>
                {toStr(m)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Kraj">
          <select value={r.end} onChange={(e) => set('end', e.target.value)}>
            {slots(OPEN + 30, CLOSE).map((m) => (
              <option key={m} value={toStr(m)}>
                {toStr(m)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Napomena">
          <input type="text" value={r.note || ''} onChange={(e) => set('note', e.target.value)} placeholder="npr. LAN, trening…" />
        </Field>
        <div className="summary">
          {hrs > 0 ? (
            <>
              Trajanje <strong>{hrs} h</strong>
              {price && (
                <>
                  {' '}
                  · procjena cijene <strong>{price} €</strong>
                </>
              )}
            </>
          ) : (
            'Odaberite vrijeme'
          )}
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
