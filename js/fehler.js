// Fehler wiederholen: Jede falsch beantwortete Frage aus Lernpfad und Berufsschule bleibt in der Liste,
// bis sie zweimal hintereinander richtig beantwortet ist. Gezählt wird nur der erste Versuch je Lektion.
// Fragen haben keine IDs. Der Schlüssel ist eine Prüfsumme aus Typ, Frage und Antworten. Ändert sich
// eine Frage, passt der alte Schlüssel nicht mehr und der Eintrag wird nicht mehr angezeigt.

export const FEHLER_RAUS = 2;   // so oft hintereinander richtig, dann ist die Frage erledigt
export const FEHLER_MAX = 10;   // Fragen je Runde

// Prüfsumme cyrb53: kurz, schnell und für ein paar Tausend Fragen eindeutig genug
export function itemKey(it) {
  const s = JSON.stringify([it.t, it.q, it.a === undefined ? null : it.a]);
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

// Antwort in die Liste eintragen. Liefert true, wenn sich etwas geändert hat.
// Eintrag: at = Tag des letzten Fehlers, n = wie oft falsch, ok = richtig in Folge seitdem
export function noteAnswer(list, key, ok, day) {
  const e = list[key];
  if (ok) {
    if (!e) return false;
    e.ok = (e.ok || 0) + 1;
    if (e.ok >= FEHLER_RAUS) delete list[key];
    return true;
  }
  list[key] = { at: day, n: (e && e.n ? e.n : 0) + 1, ok: 0 };
  return true;
}

// Wartende Fragen, die es noch gibt: neueste Fehler zuerst, am selben Tag die häufigsten zuerst
export function pickFehler(list, index, max = FEHLER_MAX) {
  return Object.entries(list)
    .filter(([k]) => index.has(k))
    .sort(([, a], [, b]) => (a.at < b.at) - (a.at > b.at) || (b.n || 0) - (a.n || 0))
    .slice(0, max)
    .map(([k]) => index.get(k));
}
export const countFehler = (list, index) => Object.keys(list).filter(k => index.has(k)).length;
