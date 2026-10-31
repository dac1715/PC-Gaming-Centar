import React, { useState } from 'react';
import { Empty, Field, Modal, PageHead } from '../components/ui.jsx';
import { useStore } from '../store.jsx';

const EMPTY = { oznaka: '', cpu: '', gpu: '', ram: '', monitor: '', cijenaH: 3, status: 'aktivno' };

export default function RacunalaPage() {
  const { state, save, remove } = useStore();
  const [edit, setEdit] = useState(null);
  const [error, setError] = useState('');

  const set = (k, v) => {
    setError('');
    setEdit((p) => ({ ...p, [k]: v }));
  };

  const submit = (e) => {
    e.preventDefault();
    const oznaka = edit.oznaka.trim();
    if (!oznaka) return setError('Oznaka je obavezna.');
    if (state.racunala.some((c) => c.id !== edit.id && c.oznaka.toLowerCase() === oznaka.toLowerCase())) return setError('Oznaka već postoji.');
    const cijena = Number(edit.cijenaH);
    if (!(cijena >= 0)) return setError('Cijena po satu nije ispravna.');
    save('racunala', { ...edit, oznaka, cijenaH: cijena });
    setEdit(null);
  };

  const del = (c) => {
    const n = state.rezervacije.filter((r) => r.computerId === c.id).length;
    if (n > 0) return window.alert(`Računalo ima ${n} rezervacija. Prvo ih otkažite ili ga stavite u održavanje.`);
    if (window.confirm(`Obrisati računalo ${c.oznaka}?`)) {
      remove('racunala', c.id);
      state.igre.forEach((g) => g.racunala.includes(c.id) && save('igre', { ...g, racunala: g.racunala.filter((x) => x !== c.id) }));
    }
  };

  const toggleStatus = (c) => save('racunala', { ...c, status: c.status === 'aktivno' ? 'održavanje' : 'aktivno' });

  return (
    <section>
      <PageHead
        title="Računala"
        count={state.racunala.length}
        action={
          <button type="button" className="btn btn--primary" onClick={() => setEdit({ ...EMPTY })}>
            + Novo računalo
          </button>
        }
      />
      {state.racunala.length === 0 ? (
        <Empty>Još nema računala.</Empty>
      ) : (
        <div className="cards">
          {state.racunala.map((c) => {
            const games = state.igre.filter((g) => g.racunala.includes(c.id)).length;
            const n = state.rezervacije.filter((r) => r.computerId === c.id).length;
            return (
              <article key={c.id} className={`card pc${c.status !== 'aktivno' ? ' is-down' : ''}`}>
                <header>
                  <h3>{c.oznaka}</h3>
                  <span className={`pill pill--${c.status === 'aktivno' ? 'utijeku' : 'down'}`}>{c.status}</span>
                </header>
                <dl>
                  <div><dt>CPU</dt><dd>{c.cpu || '—'}</dd></div>
                  <div><dt>GPU</dt><dd>{c.gpu || '—'}</dd></div>
                  <div><dt>RAM</dt><dd>{c.ram || '—'}</dd></div>
                  <div><dt>Monitor</dt><dd>{c.monitor || '—'}</dd></div>
                  <div><dt>Cijena</dt><dd>{Number(c.cijenaH).toFixed(2)} €/h</dd></div>
                  <div><dt>Igre / rezervacije</dt><dd>{games} / {n}</dd></div>
                </dl>
                <footer>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => setEdit({ ...c })}>Uredi</button>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => toggleStatus(c)}>
                    {c.status === 'aktivno' ? 'U održavanje' : 'Vrati u rad'}
                  </button>
                  <button type="button" className="btn btn--ghost btn--sm btn--danger-text" onClick={() => del(c)}>Obriši</button>
                </footer>
              </article>
            );
          })}
        </div>
      )}

      {edit && (
        <Modal
          title={edit.id ? 'Uredi računalo' : 'Novo računalo'}
          onClose={() => setEdit(null)}
          footer={
            <>
              <span className="spacer" />
              <button type="button" className="btn btn--ghost" onClick={() => setEdit(null)}>Odustani</button>
              <button type="submit" form="pc-form" className="btn btn--primary">Spremi</button>
            </>
          }
        >
          <form id="pc-form" className="form-grid" onSubmit={submit}>
            <Field label="Oznaka"><input value={edit.oznaka} onChange={(e) => set('oznaka', e.target.value)} autoFocus placeholder="npr. PC-09" /></Field>
            <Field label="Status">
              <select value={edit.status} onChange={(e) => set('status', e.target.value)}>
                <option value="aktivno">aktivno</option>
                <option value="održavanje">održavanje</option>
              </select>
            </Field>
            <Field label="Procesor (CPU)"><input value={edit.cpu} onChange={(e) => set('cpu', e.target.value)} /></Field>
            <Field label="Grafička (GPU)"><input value={edit.gpu} onChange={(e) => set('gpu', e.target.value)} /></Field>
            <Field label="RAM"><input value={edit.ram} onChange={(e) => set('ram', e.target.value)} /></Field>
            <Field label="Monitor"><input value={edit.monitor} onChange={(e) => set('monitor', e.target.value)} /></Field>
            <Field label="Cijena po satu (€)"><input type="number" min="0" step="0.5" value={edit.cijenaH} onChange={(e) => set('cijenaH', e.target.value)} /></Field>
            {error && <p className="form-error" role="alert">{error}</p>}
          </form>
        </Modal>
      )}
    </section>
  );
}
