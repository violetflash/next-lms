import { db } from '@/lib/db';
import { fieldsCompletionProgress } from '@/lib/fieldsCompletionProgress';
import { getUserId } from '@/lib/hooks/get-user-id';
import { redirect } from 'next/navigation';

type ChapterIdPageProps = {
  params: {
    course_id: string;
    chapter_id: string;
  }
};
const ChapterIdPage = async ({ params }: ChapterIdPageProps) => {
  const { userId } = getUserId();

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapter_id,
      course_id: params.course_id
    },
    include: {
      mux_data: true
    }
  });

  if (!chapter) {
    return redirect('/');
  }

  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.video_url
  ];

  const {
    totalFields,
    completedFields,
    completionProgressText
  } = fieldsCompletionProgress(requiredFields);

  return (
    <div>
      Chapter with id {params.chapter_id}
      <div>
        {JSON.stringify(chapter, null, 2)}
      </div>
    </div>
  );
};

export default ChapterIdPage;