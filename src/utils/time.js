export const OPEN = 10 * 60;
export const CLOSE = 24 * 60;
export const STEP = 30;

export const pad = (n) => String(n).padStart(2, '0');

export const toMin = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

export const toStr = (min) => (min >= 1440 ? '24:00' : `${pad(Math.floor(min / 60))}:${pad(min % 60)}`);

export const dateToStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const todayStr = () => dateToStr(new Date());

export const addDays = (dateStr, n) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return dateToStr(new Date(y, m - 1, d + n));
};

export const fmtDate = (dateStr) => {
  const [y, m, d] = dateStr.split('-');
  return `${d}.${m}.${y}.`;
};

const DANI = ['nedjelja', 'ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota'];
export const dayName = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return DANI[new Date(y, m - 1, d).getDay()];
};

export const slots = (from = OPEN, to = CLOSE) => {
  const out = [];
  for (let m = from; m <= to; m += STEP) out.push(m);
  return out;
};

export const overlaps = (a, b) => a.date === b.date && toMin(a.start) < toMin(b.end) && toMin(a.end) > toMin(b.start);

const toDate = (dateStr, min) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 0, min);
};

export const statusOf = (r, now = new Date()) => {
  if (now < toDate(r.date, toMin(r.start))) return 'predstoji';
  if (now < toDate(r.date, toMin(r.end))) return 'utijeku';
  return 'zavrseno';
};

export const STATUS_LABEL = { predstoji: 'Predstoji', utijeku: 'U tijeku', zavrseno: 'Završeno' };

export const hoursOf = (r) => (toMin(r.end) - toMin(r.start)) / 60;

export const nowMinutes = () => {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
};
