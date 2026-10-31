import React, { useMemo, useState } from 'react';
import { useStore } from './store.jsx';
import TimelinePage from './pages/TimelinePage.jsx';
import RezervacijePage from './pages/RezervacijePage.jsx';
import KorisniciPage from './pages/KorisniciPage.jsx';
import RacunalaPage from './pages/RacunalaPage.jsx';
import IgrePage from './pages/IgrePage.jsx';
import ReservationModal from './components/ReservationModal.jsx';
import { statusOf, todayStr } from './utils/time.js';

const TABS = [
  ['timeline', 'Timeline'],
  ['rezervacije', 'Rezervacije'],
  ['korisnici', 'Korisnici'],
  ['racunala', 'Računala'],
  ['igre', 'Igre'],
];

const blank = (date, computerId = '', start = '18:00') => {
  const [h, m] = start.split(':').map(Number);
  const endMin = Math.min(h * 60 + m + 60, 24 * 60);
  const end = endMin >= 1440 ? '24:00' : `${String(Math.floor(endMin / 60)).padStart(2, '0')}:${String(endMin % 60).padStart(2, '0')}`;
  return { userId: '', computerId, gameId: '', date, start, end, note: '' };
};

export default function App() {
  const { state, reset } = useStore();
  const [tab, setTab] = useState('timeline');
  const [date, setDate] = useState(todayStr());
  const [modal, setModal] = useState(null);

  const stats = useMemo(() => {
    const today = todayStr();
    const todays = state.rezervacije.filter((r) => r.date === today);
    return {
      active: state.racunala.filter((c) => c.status === 'aktivno').length,
      total: state.racunala.length,
      today: todays.length,
      now: todays.filter((r) => statusOf(r) === 'utijeku').length,
    };
  }, [state]);

  const openNew = () => setModal(blank(tab === 'timeline' ? date : todayStr()));
  const openSlot = (computerId, start) => setModal(blank(date, computerId, start));

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand__logo" aria-hidden="true">▶</span>
          <div>
            <strong>Gaming centar</strong>
            <small>rezervacije računala</small>
          </div>
        </div>
        <ul className="chips" aria-label="Sažetak">
          <li><b>{stats.active}/{stats.total}</b> računala aktivno</li>
          <li><b>{stats.today}</b> rezervacija danas</li>
          <li><b>{stats.now}</b> trenutno igra</li>
        </ul>
        <nav className="tabs" aria-label="Glavna navigacija">
          {TABS.map(([k, l]) => (
            <button key={k} type="button" className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)} aria-current={tab === k ? 'page' : undefined}>
              {l}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {tab === 'timeline' && <TimelinePage date={date} setDate={setDate} onNew={openNew} onSlot={openSlot} onOpen={setModal} />}
        {tab === 'rezervacije' && <RezervacijePage onNew={openNew} onOpen={setModal} />}
        {tab === 'korisnici' && <KorisniciPage />}
        {tab === 'racunala' && <RacunalaPage />}
        {tab === 'igre' && <IgrePage />}
      </main>

      <footer className="foot">
        Podaci se spremaju u ovom pregledniku.{' '}
        <button
          type="button"
          className="link"
          onClick={() => window.confirm('Vratiti demo podatke? Sve promjene bit će izgubljene.') && reset()}
        >
          Vrati demo podatke
        </button>
      </footer>

      {modal && <ReservationModal key={modal.id || 'new'} initial={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
