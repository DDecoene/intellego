import { getChapter } from "@/content/fixtures";
import { ReadingScreen } from "@/components/ReadingScreen";
import { ChapterNotReady } from "@/components/ChapterNotReady";

export default async function ReadPage({ params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = await params;
  const chapter = getChapter(chapterId);
  if (!chapter) return <ChapterNotReady />;
  return <ReadingScreen chapter={chapter} />;
}
