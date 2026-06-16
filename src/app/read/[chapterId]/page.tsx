import { getChapter } from "@/content/fixtures";
import { ReadingScreen } from "@/components/ReadingScreen";

export default async function ReadPage({ params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = await params;
  const chapter = getChapter(chapterId);
  return <ReadingScreen chapter={chapter} />;
}
