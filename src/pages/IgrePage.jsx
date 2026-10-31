import React, { useState } from 'react';
import { Empty, Field, Modal, PageHead } from '../components/ui.jsx';
import { useStore } from '../store.jsx';

const EMPTY = { naslov: '', zanr: '', pegi: 12, racunala: [] };
const PEGI = [3, 7, 12, 16, 18];

export default function IgrePage() {
  const { state, save, remove } = useStore();
  const [edit, setEdit] = useState(null);
  const [error, setError] = useState('');

  const set = (k, v) => {
    setError('');
    setEdit((p) => ({ ...p, [k]: v }));
  };

  const toggle = (id) =>
    set('racunala', edit.racunala.includes(id) ? edit.racunala.filter((x) => x !== id) : [...edit.racunala, id]);

  const submit = (e) => {
    e.preventDefault();
    if (!edit.naslov.trim()) return setError('Naslov je obavezan.');
    save('igre', { ...edit, naslov: edit.naslov.trim(), pegi: Number(edit.pegi) });
    setEdit(null);
  };

  const del = (g) => {
    const n = state.rezervacije.filter((r) => r.gameId === g.id).length;
    const msg = n > 0 ? `Igra je u ${n} rezervacija (ostat će bez igre). Obrisati "${g.naslov}"?` : `Obrisati igru "${g.naslov}"?`;
    if (!window.confirm(msg)) return;
    state.rezervacije.filter((r) => r.gameId === g.id).forEach((r) => save('rezervacije', { ...r, gameId: '' }));
    remove('igre', g.id);
  };

  return (
    <section>
      <PageHead
        title="Računalne igre"
        count={state.igre.length}
        action={
          <button type="button" className="btn btn--primary" onClick={() => setEdit({ ...EMPTY, racunala: state.racunala.map((c) => c.id) })}>
            + Nova igra
          </button>
        }
      />
      {state.igre.length === 0 ? (
        <Empty>Još nema igara.</Empty>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Naslov</th>
                <th>Žanr</th>
                <th>PEGI</th>
                <th>Instalirano na</th>
                <th>Rezervacija</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {state.igre.map((g) => (
                <tr key={g.id}>
                  <td><strong>{g.naslov}</strong></td>
                  <td>{g.zanr || '—'}</td>
                  <td><span className="pegi">{g.pegi}</span></td>
                  <td>
                    {g.racunala.length === state.racunala.length
                      ? 'sva računala'
                      : g.racunala.map((id) => state.racunala.find((c) => c.id === id)?.oznaka).filter(Boolean).join(', ') || '—'}
                  </td>
                  <td>{state.rezervacije.filter((r) => r.gameId === g.id).length}</td>
                  <td className="actions">
                    <button type="button" className="btn btn--ghost btn--sm" onClick={() => setEdit({ ...g })}>Uredi</button>
                    <button type="button" className="btn btn--ghost btn--sm btn--danger-text" onClick={() => del(g)}>Obriši</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {edit && (
        <Modal
          title={edit.id ? 'Uredi igru' : 'Nova igra'}
          onClose={() => setEdit(null)}
          footer={
            <>
              <span className="spacer" />
              <button type="button" className="btn btn--ghost" onClick={() => setEdit(null)}>Odustani</button>
              <button type="submit" form="game-form" className="btn btn--primary">Spremi</button>
            </>
          }
        >
          <form id="game-form" className="form-grid" onSubmit={submit}>
            <Field label="Naslov"><input value={edit.naslov} onChange={(e) => set('naslov', e.target.value)} autoFocus /></Field>
            <Field label="Žanr"><input value={edit.zanr} onChange={(e) => set('zanr', e.target.value)} placeholder="npr. FPS, RPG…" /></Field>
            <Field label="PEGI oznaka">
              <select value={edit.pegi} onChange={(e) => set('pegi', e.target.value)}>
                {PEGI.map((p) => <option key={p} value={p}>PEGI {p}</option>)}
              </select>
            </Field>
            <fieldset className="field field--wide">
              <legend className="field__label">Instalirano na računalima</legend>
              <div className="checks">
                {state.racunala.map((c) => (
                  <label key={c.id} className="check">
                    <input type="checkbox" checked={edit.racunala.includes(c.id)} onChange={() => toggle(c.id)} />
                    {c.oznaka}
                  </label>
                ))}
              </div>
            </fieldset>
            {error && <p className="form-error" role="alert">{error}</p>}
          </form>
        </Modal>
      )}
    </section>
  );
}
