export type WordReveal = {
  picture?: string;     // image asset path
  audio?: string;       // audio asset path (pronunciation)
  animation?: string;   // looping animation asset path (verbs)
  paraphrase?: string;  // Latin-only definition using already-known words
};

export type Token =
  | { kind: "word"; text: string; lemma: string; isVerb?: boolean; reveal: WordReveal }
  | { kind: "text"; text: string }; // spaces/punctuation; not tappable

export type Line = { tokens: Token[] };

export type Chapter = {
  id: string;
  lines: Line[];
  knownVocab: string[]; // cumulative vocabulary, as lemmas
  scene: string;        // scene illustration asset path
};
