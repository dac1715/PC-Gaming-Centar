import React, { useEffect, useState } from 'react';
import { useStore } from '../store.jsx';
import { CLOSE, OPEN, STEP, nowMinutes, statusOf, todayStr, toMin, toStr } from '../utils/time.js';

const HOUR_W = 76;
const LABEL_W = 132;
const hours = [];
for (let h = OPEN / 60; h < CLOSE / 60; h++) hours.push(h);

const px = (min) => ((min - OPEN) / 60) * HOUR_W;

export default function Timeline({ date, onSlot, onOpen }) {
  const { state, userNick, gameName } = useStore();
  const [now, setNow] = useState(nowMinutes());

  useEffect(() => {
    const t = setInterval(() => setNow(nowMinutes()), 30000);
    return () => clearInterval(t);
  }, []);

  const isToday = date === todayStr();
  const width = hours.length * HOUR_W;
  const day = state.rezervacije.filter((r) => r.date === date);

  const handleSlot = (e, computerId) => {
    if (e.target !== e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const min = OPEN + ((e.clientX - rect.left) / HOUR_W) * 60;
    const start = Math.min(Math.floor(min / STEP) * STEP, CLOSE - STEP);
    onSlot(computerId, toStr(start));
  };

  return (
    <div className="timeline" role="table" aria-label="Zauzetost računala po satima">
      <div className="timeline__scroll">
        <div className="timeline__inner" style={{ width: LABEL_W + width }}>
          <div className="timeline__row timeline__row--head">
            <div className="timeline__label" />
            <div className="timeline__track" style={{ width }}>
              {hours.map((h) => (
                <div key={h} className="timeline__hour" style={{ left: (h - OPEN / 60) * HOUR_W, width: HOUR_W }}>
                  {String(h).padStart(2, '0')}:00
                </div>
              ))}
            </div>
          </div>

          {state.racunala.map((pc) => {
            const list = day.filter((r) => r.computerId === pc.id);
            const down = pc.status !== 'aktivno';
            return (
              <div className="timeline__row" key={pc.id} role="row">
                <div className="timeline__label">
                  <strong>{pc.oznaka}</strong>
                  <small>{down ? pc.status : pc.gpu}</small>
                </div>
                <div
                  className={`timeline__track timeline__track--lane${down ? ' is-down' : ''}`}
                  style={{ width }}
                  onClick={(e) => !down && handleSlot(e, pc.id)}
                  title={down ? 'Računalo nije dostupno' : 'Kliknite za novu rezervaciju'}
                >
                  {hours.map((h) => (
                    <i key={h} className="timeline__grid" style={{ left: (h - OPEN / 60) * HOUR_W }} />
                  ))}
                  {list.map((r) => {
                    const s = toMin(r.start);
                    const e = toMin(r.end);
                    const st = statusOf(r);
                    return (
                      <button
                        type="button"
                        key={r.id}
                        className={`block block--${st}`}
                        style={{ left: px(s), width: Math.max(px(e) - px(s) - 2, 24) }}
                        onClick={() => onOpen(r)}
                        title={`${userNick(r.userId)} · ${r.start}–${r.end}${gameName(r.gameId) ? ' · ' + gameName(r.gameId) : ''}`}
                      >
                        <span className="block__name">{userNick(r.userId)}</span>
                        <span className="block__meta">
                          {r.start}–{r.end}
                          {gameName(r.gameId) ? ` · ${gameName(r.gameId)}` : ''}
                        </span>
                      </button>
                    );
                  })}
                  {isToday && now >= OPEN && now <= CLOSE && <i className="timeline__now" style={{ left: px(now) }} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="legend">
        <span><i className="dot dot--predstoji" /> Predstoji</span>
        <span><i className="dot dot--utijeku" /> U tijeku</span>
        <span><i className="dot dot--zavrseno" /> Završeno</span>
        <span className="legend__tip">Kliknite na prazno mjesto za novu rezervaciju, na blok za uređivanje.</span>
      </div>
    </div>
  );
}
