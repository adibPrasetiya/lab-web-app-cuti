// Util kalender murni (tanpa dependency), berbasis tanggal lokal.
const MS_DAY = 86400000;

const pad = (n) => String(n).padStart(2, '0');

/** (year, monthIndex 0-11) → "YYYY-MM" untuk query backend. */
export function toMonthParam(year, monthIndex) {
  return `${year}-${pad(monthIndex + 1)}`;
}

/** Tanggal lokal → "YYYY-MM-DD". */
export function toDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Geser bulan sebanyak delta, kembalikan { year, monthIndex }. */
export function addMonth(year, monthIndex, delta) {
  const d = new Date(year, monthIndex + delta, 1);
  return { year: d.getFullYear(), monthIndex: d.getMonth() };
}

/** Label bulan dalam bahasa Indonesia, mis. "November 2026". */
export function monthLabel(year, monthIndex) {
  return new Date(year, monthIndex, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

/**
 * Matriks kalender: array sel (Date) dari Senin minggu pertama hingga Minggu
 * minggu terakhir yang menutupi bulan ini (selalu kelipatan 7).
 */
export function monthMatrix(year, monthIndex) {
  const first = new Date(year, monthIndex, 1);
  // getDay(): 0=Min..6=Sab → offset agar minggu dimulai Senin.
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(year, monthIndex, 1 - offset);

  const last = new Date(year, monthIndex + 1, 0);
  const endOffset = (7 - ((last.getDay() + 6) % 7) - 1 + 7) % 7;
  const totalDays = offset + last.getDate() + endOffset;

  const cells = [];
  for (let i = 0; i < totalDays; i += 1) {
    cells.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  }
  return cells;
}

/** Semua tanggal (inklusif) yang dicakup satu pengajuan → array "YYYY-MM-DD". */
export function enumerateDays(startDate, endDate) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const keys = [];
  for (let t = start.getTime(); t <= end.getTime(); t += MS_DAY) {
    keys.push(toDateKey(new Date(t)));
  }
  return keys;
}

/** Map "YYYY-MM-DD" → array pengajuan yang aktif pada tanggal itu. */
export function groupByDate(items) {
  const map = new Map();
  for (const item of items) {
    for (const key of enumerateDays(item.startDate, item.endDate)) {
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    }
  }
  return map;
}

/** Pecah array sel (hasil monthMatrix) menjadi baris minggu berisi 7 sel. */
export function splitIntoWeeks(cells) {
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/**
 * Segmen bar cuti dalam satu minggu (gaya Google Calendar).
 * → { item, colStart (1-7), span, isStart, isEnd } untuk tiap pengajuan yang beririsan minggu itu.
 */
export function weekSegments(week, items) {
  const keys = week.map(toDateKey);
  const wStart = keys[0];
  const wEnd = keys[6];
  const segments = [];
  for (const item of items) {
    const s = item.startDate;
    const e = item.endDate;
    if (e < wStart || s > wEnd) continue;
    const segStart = s < wStart ? wStart : s;
    const segEnd = e > wEnd ? wEnd : e;
    const colStart = keys.indexOf(segStart);
    const colEnd = keys.indexOf(segEnd);
    segments.push({ item, colStart: colStart + 1, span: colEnd - colStart + 1, isStart: s >= wStart, isEnd: e <= wEnd });
  }
  return segments;
}
