import React from 'react';
import Timeline from '../components/Timeline.jsx';
import { PageHead } from '../components/ui.jsx';
import { useStore } from '../store.jsx';
import { addDays, dayName, fmtDate, todayStr } from '../utils/time.js';

export default function TimelinePage({ date, setDate, onNew, onSlot, onOpen }) {
  const { state } = useStore();
  const count = state.rezervacije.filter((r) => r.date === date).length;

  return (
    <section>
      <PageHead
        title="Timeline zauzetosti"
        count={`${count} rez.`}
        action={
          <button type="button" className="btn btn--primary" onClick={onNew}>
            + Nova rezervacija
          </button>
        }
      />
      <div className="datebar">
        <button type="button" className="btn btn--ghost" onClick={() => setDate(addDays(date, -1))} aria-label="Prethodni dan">
          ←
        </button>
        <input type="date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} aria-label="Datum" />
        <button type="button" className="btn btn--ghost" onClick={() => setDate(addDays(date, 1))} aria-label="Sljedeći dan">
          →
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setDate(todayStr())} disabled={date === todayStr()}>
          Danas
        </button>
        <span className="datebar__label">
          {dayName(date)}, {fmtDate(date)}
        </span>
      </div>
      <Timeline date={date} onSlot={onSlot} onOpen={onOpen} />
    </section>
  );
}
