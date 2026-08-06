// katamerosConstants.js
// Delade konstanter för hela Katameros-sektionen.
// Importeras av KatamerosPage, KatamerosReadingPage, DagDrawer och DagKort.
// Samlar allt på ett ställe — ändra här och det gäller överallt (DRY).

// ── LÄSNINGSTYP → VISNINGSNAMN ──
// Används av KatamerosReadingPage för att visa t.ex. "Paulusbrev" i sidhuvudet.
export const READING_LABELS = {
  pauline:        'Paulusbrev',
  catholic:       'Katolikons',
  praxis:         'Apostlagärningarna',
  psalm:          'Psalm',
  gospel:         'Evangelium',
  matins_psalm:   'Morgonpsalm',
  matins_gospel:  'Morgonevangelium',
  vespers_psalm:  'Kvällspsalm',
  vespers_gospel: 'Kvällsevangelium',
}

// ── LÄSNINGSTYPER ──
// Varje objekt beskriver en läsningstyp fullständigt.
// key     — matchar fältnamnen i days.json, great_lent.json och fifty_feast.json
// label   — svenska visningsnamnet (t.ex. "Paulusbrev")
// labelAr — arabiska visningsnamnet — visas i DagDrawer under svenska rubriken
// color   — accentfärg för varje typ — används i Fasta/Påsk-listorna
// icon    — litet texttecken framför läsningstypen i DagDrawer
export const READING_TYPES = [
  { key: 'pauline',        label: 'Paulusbrev',       labelAr: 'البولس',          color: '#7B5EA7', icon: '✉' },
  { key: 'catholic',       label: 'Katolikon',        labelAr: 'الكاثوليكون',     color: '#2A6B8A', icon: '📜' },
  { key: 'praxis',         label: 'Apostlagärningar', labelAr: 'الإبركسيس',       color: '#4A7C59', icon: '⚡' },
  { key: 'psalm',          label: 'Psalm',            labelAr: 'المزمور',         color: '#C5A059', icon: '♪' },
  { key: 'gospel',         label: 'Evangelium',       labelAr: 'إنجيل القداس',   color: '#8A3A2A', icon: '✦' },
  { key: 'matins_psalm',   label: 'Morgonpsalm',      labelAr: 'مزمور الباكر',   color: '#C5A059', icon: '♪' },
  { key: 'matins_gospel',  label: 'Morgonevangelium', labelAr: 'إنجيل الباكر',   color: '#8A3A2A', icon: '✦' },
  { key: 'vespers_psalm',  label: 'Kvällspsalm',      labelAr: 'مزمور الغروب',   color: '#C5A059', icon: '♪' },
  { key: 'vespers_gospel', label: 'Kvällsevangelium', labelAr: 'إنجيل الغروب',   color: '#8A3A2A', icon: '✦' },
]

// ── KOPTISKA MÅNADSNAMN ──
// 13 månader — månad 13 (Nasie) är en kort skottmånad med bara 5 dagar.
// sv = svenska visningsnamnet, ar = arabiska visningsnamnet.
export const COPTIC_MONTHS = {
  1:  { sv: 'Tout',       ar: 'توت'    },
  2:  { sv: 'Baba',       ar: 'بابة'   },
  3:  { sv: 'Hator',      ar: 'هاتور'  },
  4:  { sv: 'Kiahk',      ar: 'كيهك'   },
  5:  { sv: 'Toba',       ar: 'طوبة'   },
  6:  { sv: 'Amshir',     ar: 'أمشير'  },
  7:  { sv: 'Baramhat',   ar: 'برمهات' },
  8:  { sv: 'Baramouda',  ar: 'برمودة' },
  9:  { sv: 'Bashans',    ar: 'بشنس'   },
  10: { sv: "Ba'ouna",    ar: 'بؤونة'  },
  11: { sv: 'Abib',       ar: 'أبيب'   },
  12: { sv: 'Misra',      ar: 'مسرى'   },
  13: { sv: 'Nasie',      ar: 'النسيء' },
}

// ── SVENSKA VECKODAGSNAMN ──
// index 0 = söndag (matchar JavaScript Date.getDay())
// används i Fasta/Påsk-listorna för att visa dagnamn
export const WEEKDAYS = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag']
