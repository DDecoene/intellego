import Link from "next/link";

export function ChapterNode({
  id,
  numeral,
  side,
}: {
  id: string;
  numeral: string;
  side: "left" | "right";
}) {
  return (
    <Link
      href={`/read/${id}`}
      data-side={side}
      aria-label={`Capitulum ${numeral}`}
      className={
        "flex h-14 w-14 items-center justify-center rounded-full " +
        "border-[3px] border-[var(--gold)] bg-[var(--parchment-deep)] " +
        "text-xl text-[var(--terracotta-deep)] shadow-sm transition-all duration-200 " +
        "hover:bg-[var(--terracotta)] hover:text-[var(--parchment)] " +
        (side === "right" ? "self-end" : "self-start")
      }
    >
      {numeral}
    </Link>
  );
}
