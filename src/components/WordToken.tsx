"use client";

export function WordToken({
  text,
  selected,
  onSelect,
}: {
  text: string;
  selected: boolean;
  onSelect: (text: string) => void;
}) {
  return (
    <button
      type="button"
      data-selected={selected}
      onClick={() => onSelect(text)}
      className={
        "rounded-md px-1 -mx-0.5 transition-all duration-200 " +
        "decoration-[var(--gold)] decoration-2 underline-offset-4 " +
        (selected
          ? "bg-[var(--terracotta)] text-[var(--parchment)] shadow-sm"
          : "hover:bg-[var(--parchment-deep)] hover:underline")
      }
    >
      {text}
    </button>
  );
}
