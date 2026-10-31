import { todayStr, addDays } from './utils/time.js';

export const makeSeed = () => {
  const today = todayStr();
  const tomorrow = addDays(today, 1);
  const yesterday = addDays(today, -1);

  const racunala = [
    { id: 'c1', oznaka: 'PC-01', cpu: 'Intel i7-13700K', gpu: 'RTX 4070', ram: '32 GB', monitor: '27" 165 Hz', cijenaH: 3, status: 'aktivno' },
    { id: 'c2', oznaka: 'PC-02', cpu: 'Intel i7-13700K', gpu: 'RTX 4070', ram: '32 GB', monitor: '27" 165 Hz', cijenaH: 3, status: 'aktivno' },
    { id: 'c3', oznaka: 'PC-03', cpu: 'Ryzen 7 7800X3D', gpu: 'RTX 4080', ram: '32 GB', monitor: '27" 240 Hz', cijenaH: 4, status: 'aktivno' },
    { id: 'c4', oznaka: 'PC-04', cpu: 'Ryzen 7 7800X3D', gpu: 'RTX 4080', ram: '32 GB', monitor: '27" 240 Hz', cijenaH: 4, status: 'aktivno' },
    { id: 'c5', oznaka: 'PC-05', cpu: 'Ryzen 5 7600', gpu: 'RTX 4060', ram: '16 GB', monitor: '24" 144 Hz', cijenaH: 2.5, status: 'aktivno' },
    { id: 'c6', oznaka: 'PC-06', cpu: 'Ryzen 5 7600', gpu: 'RTX 4060', ram: '16 GB', monitor: '24" 144 Hz', cijenaH: 2.5, status: 'aktivno' },
    { id: 'c7', oznaka: 'VIP-01', cpu: 'Intel i9-14900K', gpu: 'RTX 4090', ram: '64 GB', monitor: '34" ultrawide 175 Hz', cijenaH: 6, status: 'aktivno' },
    { id: 'c8', oznaka: 'PC-08', cpu: 'Ryzen 5 5600', gpu: 'RTX 3060', ram: '16 GB', monitor: '24" 144 Hz', cijenaH: 2, status: 'održavanje' },
  ];

  const korisnici = [
    { id: 'u1', ime: 'Luka', prezime: 'Horvat', nadimak: 'LukaH', email: 'luka.horvat@example.com', telefon: '091 111 2233' },
    { id: 'u2', ime: 'Ana', prezime: 'Kovačić', nadimak: 'Annie', email: 'ana.kovacic@example.com', telefon: '092 222 3344' },
    { id: 'u3', ime: 'Marko', prezime: 'Babić', nadimak: 'Bab1', email: 'marko.babic@example.com', telefon: '095 333 4455' },
    { id: 'u4', ime: 'Ivana', prezime: 'Jurić', nadimak: 'IvaJ', email: 'ivana.juric@example.com', telefon: '098 444 5566' },
    { id: 'u5', ime: 'Petar', prezime: 'Novak', nadimak: 'Pero', email: 'petar.novak@example.com', telefon: '099 555 6677' },
    { id: 'u6', ime: 'Dino', prezime: 'Matić', nadimak: 'DinoM', email: 'dino.matic@example.com', telefon: '091 666 7788' },
  ];

  const sva = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'];
  const jaca = ['c1', 'c2', 'c3', 'c4', 'c7'];
  const igre = [
    { id: 'g1', naslov: 'Counter-Strike 2', zanr: 'FPS', pegi: 18, racunala: sva },
    { id: 'g2', naslov: 'League of Legends', zanr: 'MOBA', pegi: 12, racunala: sva },
    { id: 'g3', naslov: 'Valorant', zanr: 'FPS', pegi: 16, racunala: sva },
    { id: 'g4', naslov: 'Fortnite', zanr: 'Battle royale', pegi: 12, racunala: sva },
    { id: 'g5', naslov: 'Cyberpunk 2077', zanr: 'RPG', pegi: 18, racunala: jaca },
    { id: 'g6', naslov: 'FIFA / EA FC 25', zanr: 'Sport', pegi: 3, racunala: sva },
    { id: 'g7', naslov: "Baldur's Gate 3", zanr: 'RPG', pegi: 18, racunala: jaca },
    { id: 'g8', naslov: 'Forza Horizon 5', zanr: 'Utrke', pegi: 3, racunala: ['c3', 'c4', 'c7'] },
  ];

  const r = (id, userId, computerId, gameId, date, start, end, note = '') => ({
    id, userId, computerId, gameId, date, start, end, note,
  });
  const rezervacije = [
    r('r1', 'u1', 'c1', 'g1', today, '10:00', '12:00'),
    r('r2', 'u2', 'c2', 'g2', today, '11:00', '13:30'),
    r('r3', 'u3', 'c3', 'g8', today, '12:00', '14:00'),
    r('r4', 'u4', 'c7', 'g5', today, '14:00', '17:00', 'Turnir trening'),
    r('r5', 'u5', 'c1', 'g3', today, '15:00', '17:30'),
    r('r6', 'u6', 'c5', 'g6', today, '16:00', '18:00'),
    r('r7', 'u1', 'c4', 'g1', today, '18:00', '21:00', 'LAN s ekipom'),
    r('r8', 'u3', 'c2', 'g4', today, '19:00', '21:00'),
    r('r9', 'u2', 'c7', 'g7', today, '19:30', '23:00'),
    r('r10', 'u4', 'c6', 'g2', tomorrow, '15:00', '18:00'),
    r('r11', 'u5', 'c3', 'g1', tomorrow, '17:00', '20:00'),
    r('r12', 'u6', 'c1', 'g3', yesterday, '17:00', '19:30'),
  ];

  return { korisnici, racunala, igre, rezervacije };
};
