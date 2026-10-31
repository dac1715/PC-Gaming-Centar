import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { makeSeed } from './seed.js';
import { CLOSE, OPEN, overlaps, toMin } from './utils/time.js';

const KEY = 'gaming-centar-v1';

export const uid = () => Math.random().toString(36).slice(2, 10);

const load = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return makeSeed();
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'save': {
      const list = state[action.entity];
      const exists = list.some((x) => x.id === action.item.id);
      return {
        ...state,
        [action.entity]: exists ? list.map((x) => (x.id === action.item.id ? action.item : x)) : [...list, action.item],
      };
    }
    case 'remove':
      return { ...state, [action.entity]: state[action.entity].filter((x) => x.id !== action.id) };
    case 'reset':
      return makeSeed();
    default:
      return state;
  }
};

export const validateReservation = (state, r) => {
  if (!r.userId) return 'Odaberite korisnika.';
  if (!r.computerId) return 'Odaberite računalo.';
  if (!r.date) return 'Odaberite datum.';
  const s = toMin(r.start);
  const e = toMin(r.end);
  if (e <= s) return 'Kraj mora biti nakon početka.';
  if (s < OPEN || e > CLOSE) return 'Centar radi od 10:00 do 24:00.';
  const comp = state.racunala.find((c) => c.id === r.computerId);
  if (comp && comp.status !== 'aktivno') return `Računalo ${comp.oznaka} trenutno nije dostupno (${comp.status}).`;
  const others = state.rezervacije.filter((x) => x.id !== r.id);
  const clashPc = others.find((x) => x.computerId === r.computerId && overlaps(x, r));
  if (clashPc) return `Računalo je već rezervirano ${clashPc.start}–${clashPc.end}.`;
  const clashUser = others.find((x) => x.userId === r.userId && overlaps(x, r));
  if (clashUser) {
    const pc = state.racunala.find((c) => c.id === clashUser.computerId);
    return `Korisnik već ima rezervaciju ${clashUser.start}–${clashUser.end} (${pc ? pc.oznaka : '?'}).`;
  }
  return null;
};

const StoreCtx = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  const api = useMemo(
    () => ({
      state,
      save: (entity, item) => dispatch({ type: 'save', entity, item: { ...item, id: item.id || uid() } }),
      remove: (entity, id) => dispatch({ type: 'remove', entity, id }),
      reset: () => dispatch({ type: 'reset' }),
      userName: (id) => {
        const u = state.korisnici.find((x) => x.id === id);
        return u ? `${u.ime} ${u.prezime}` : '(obrisan korisnik)';
      },
      userNick: (id) => {
        const u = state.korisnici.find((x) => x.id === id);
        return u ? u.nadimak || u.ime : '?';
      },
      pcName: (id) => {
        const c = state.racunala.find((x) => x.id === id);
        return c ? c.oznaka : '(obrisano računalo)';
      },
      gameName: (id) => {
        const g = state.igre.find((x) => x.id === id);
        return g ? g.naslov : '';
      },
    }),
    [state]
  );

  return <StoreCtx.Provider value={api}>{children}</StoreCtx.Provider>;
}

export const useStore = () => useContext(StoreCtx);
