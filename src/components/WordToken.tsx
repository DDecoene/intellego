"use client";

export function WordToken({
  text, selected, onSelect,
}: { text: string; selected: boolean; onSelect: (text: string) => void }) {
  return (
    <button
      type="button"
      data-selected={selected}
      onClick={() => onSelect(text)}
      className={
        "rounded px-0.5 transition-colors " +
        (selected ? "bg-amber-700 text-amber-50" : "hover:bg-amber-100")
      }
    >
      {text}
    </button>
  );
}
