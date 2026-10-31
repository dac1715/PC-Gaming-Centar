import React, { useState } from 'react';
import { Empty, Field, Modal, PageHead } from '../components/ui.jsx';
import { useStore } from '../store.jsx';
import { hoursOf } from '../utils/time.js';

const EMPTY = { ime: '', prezime: '', nadimak: '', email: '', telefon: '' };

export default function KorisniciPage() {
  const { state, save, remove } = useStore();
  const [edit, setEdit] = useState(null);
  const [error, setError] = useState('');

  const stats = (id) => {
    const list = state.rezervacije.filter((r) => r.userId === id);
    return { n: list.length, h: list.reduce((s, r) => s + hoursOf(r), 0) };
  };

  const submit = (e) => {
    e.preventDefault();
    if (!edit.ime.trim() || !edit.prezime.trim()) return setError('Ime i prezime su obavezni.');
    if (edit.email && !/^\S+@\S+\.\S+$/.test(edit.email)) return setError('Email nije ispravan.');
    save('korisnici', { ...edit, ime: edit.ime.trim(), prezime: edit.prezime.trim() });
    setEdit(null);
  };

  const del = (u) => {
    const { n } = stats(u.id);
    if (n > 0) return window.alert(`Korisnik ima ${n} rezervacija. Prvo otkažite njegove rezervacije.`);
    if (window.confirm(`Obrisati korisnika ${u.ime} ${u.prezime}?`)) remove('korisnici', u.id);
  };

  const set = (k, v) => {
    setError('');
    setEdit((p) => ({ ...p, [k]: v }));
  };

  return (
    <section>
      <PageHead
        title="Korisnici"
        count={state.korisnici.length}
        action={
          <button type="button" className="btn btn--primary" onClick={() => setEdit({ ...EMPTY })}>
            + Novi korisnik
          </button>
        }
      />
      {state.korisnici.length === 0 ? (
        <Empty>Još nema korisnika.</Empty>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ime i prezime</th>
                <th>Nadimak</th>
                <th>Email</th>
                <th>Telefon</th>
                <th>Rezervacije</th>
                <th>Sati igranja</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {state.korisnici.map((u) => {
                const s = stats(u.id);
                return (
                  <tr key={u.id}>
                    <td>
                      {u.ime} {u.prezime}
                    </td>
                    <td>{u.nadimak || '—'}</td>
                    <td>{u.email || '—'}</td>
                    <td>{u.telefon || '—'}</td>
                    <td>{s.n}</td>
                    <td>{s.h} h</td>
                    <td className="actions">
                      <button type="button" className="btn btn--ghost btn--sm" onClick={() => setEdit({ ...u })}>
                        Uredi
                      </button>
                      <button type="button" className="btn btn--ghost btn--sm btn--danger-text" onClick={() => del(u)}>
                        Obriši
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {edit && (
        <Modal
          title={edit.id ? 'Uredi korisnika' : 'Novi korisnik'}
          onClose={() => setEdit(null)}
          footer={
            <>
              <span className="spacer" />
              <button type="button" className="btn btn--ghost" onClick={() => setEdit(null)}>
                Odustani
              </button>
              <button type="submit" form="user-form" className="btn btn--primary">
                Spremi
              </button>
            </>
          }
        >
          <form id="user-form" className="form-grid" onSubmit={submit}>
            <Field label="Ime">
              <input value={edit.ime} onChange={(e) => set('ime', e.target.value)} autoFocus />
            </Field>
            <Field label="Prezime">
              <input value={edit.prezime} onChange={(e) => set('prezime', e.target.value)} />
            </Field>
            <Field label="Nadimak (gamertag)">
              <input value={edit.nadimak} onChange={(e) => set('nadimak', e.target.value)} />
            </Field>
            <Field label="Telefon">
              <input value={edit.telefon} onChange={(e) => set('telefon', e.target.value)} />
            </Field>
            <Field label="Email">
              <input type="email" value={edit.email} onChange={(e) => set('email', e.target.value)} />
            </Field>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
          </form>
        </Modal>
      )}
    </section>
  );
}
