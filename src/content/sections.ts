export type ChapterRef = {
  id: string;      // routes to /read/<id>
  numeral: string; // Roman numeral shown on the node
};

export type SectionEntry = {
  numeral: string;    // Roman numeral of the section
  titleLatin: string; // Latin-only section title
  chapters: ChapterRef[];
};

// Scaffolded seed. Sections I–II of the curriculum. Only ch6 is authored today;
// the other ids are valid routes that render the Latin "not ready" state
// (ChapterNotReady) until their content is written. Grow this manifest as
// chapters are authored.
const sections: SectionEntry[] = [
  {
    numeral: "I",
    titleLatin: "In Pistrīnā",
    chapters: [
      { id: "ch1", numeral: "I" },
      { id: "ch2", numeral: "II" },
      { id: "ch3", numeral: "III" },
      { id: "ch4", numeral: "IV" },
      { id: "ch5", numeral: "V" },
    ],
  },
  {
    numeral: "II",
    titleLatin: "In Forō",
    chapters: [
      { id: "ch6", numeral: "VI" },
      { id: "ch7", numeral: "VII" },
      { id: "ch8", numeral: "VIII" },
    ],
  },
];

export function getSections(): SectionEntry[] {
  return [...sections];
}
