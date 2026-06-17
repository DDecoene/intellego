import Link from "next/link";

// Shown when a chapter id is on the map but its content is not authored yet.
// Latin-only: an honest "not ready" state, never a perpetual loading skeleton.
export function ChapterNotReady() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 bg-[var(--parchment)] px-6 text-center">
      <p className="text-2xl text-[var(--ink)]">Mox.</p>
      <p className="text-[var(--terracotta-deep)]">Hoc capitulum nōndum parātum est.</p>
      <Link
        href="/"
        aria-label="Ad tabulam"
        className="rounded-full border border-[var(--gold)] px-5 py-2 text-[var(--terracotta-deep)] transition-all hover:bg-[var(--terracotta)] hover:text-[var(--parchment)]"
      >
        ←
      </Link>
    </main>
  );
}
