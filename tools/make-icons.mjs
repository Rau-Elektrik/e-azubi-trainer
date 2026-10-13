// Erzeugt die App-Icons (PNG) ohne Zusatzpakete: node tools/make-icons.mjs
// Motiv: gelber Blitz auf anthrazitfarbenem Grund.
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'icons');
mkdirSync(out, { recursive: true });

const BG = [28, 37, 40], BOLT = [255, 184, 28], EDGE = [176, 120, 0];
const BOLT_PTS = [[13.5, 2], [4.5, 13.6], [10.8, 13.6], [9.8, 22], [19.5, 9.7], [13.1, 9.7]];

const CRC = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = buf => { let c = 0xffffffff; for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(w, h, px) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; px.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4); }
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}
const inPoly = (x, y, pts) => {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const inRound = (x, y, s, r) => {
  const cx = Math.min(Math.max(x, r), s - r), cy = Math.min(Math.max(y, r), s - r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
};

function icon(size, { radius, boltScale }) {
  const px = Buffer.alloc(size * size * 4);
  const N = 4, bs = size * boltScale, off = (size - bs) / 2;
  const pts = BOLT_PTS.map(([x, y]) => [off + x / 24 * bs, off + y / 24 * bs]);
  const grow = 0.035 * bs;  // dunkler Rand um den Blitz
  const ptsEdge = BOLT_PTS.map(([x, y]) => [off + ((x - 12) * (1 + grow / bs * 2) + 12) / 24 * bs, off + ((y - 12) * (1 + grow / bs * 2) + 12) / 24 * bs]);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    let r = 0, g = 0, b = 0, a = 0;
    for (let sy = 0; sy < N; sy++) for (let sx = 0; sx < N; sx++) {
      const fx = x + (sx + 0.5) / N, fy = y + (sy + 0.5) / N;
      if (radius !== null && !inRound(fx, fy, size, radius)) continue;
      const c = inPoly(fx, fy, pts) ? BOLT : inPoly(fx, fy, ptsEdge) ? EDGE : BG;
      r += c[0]; g += c[1]; b += c[2]; a += 255;
    }
    const n = N * N, i = (y * size + x) * 4;
    const al = a / n;
    px[i] = al ? r / (a / 255) : 0; px[i + 1] = al ? g / (a / 255) : 0; px[i + 2] = al ? b / (a / 255) : 0; px[i + 3] = al;
  }
  return png(size, size, px);
}

writeFileSync(join(out, 'icon-192.png'), icon(192, { radius: 38, boltScale: 0.66 }));
writeFileSync(join(out, 'icon-512.png'), icon(512, { radius: 100, boltScale: 0.66 }));
writeFileSync(join(out, 'icon-maskable-512.png'), icon(512, { radius: null, boltScale: 0.5 }));
writeFileSync(join(out, 'apple-touch-icon.png'), icon(180, { radius: null, boltScale: 0.6 }));
writeFileSync(join(out, 'icon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="4.7" fill="#1c2528"/><g transform="translate(4.1 4.1) scale(0.66)"><path d="M13.5 2 4.5 13.6h6.3L9.8 22l9.7-12.3h-6.4z" fill="#ffb81c" stroke="#b07800" stroke-width="0.8" stroke-linejoin="round"/></g></svg>\n`);
console.log('Icons geschrieben nach', out);
