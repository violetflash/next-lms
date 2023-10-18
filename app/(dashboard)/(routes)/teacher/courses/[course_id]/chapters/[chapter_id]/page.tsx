import { teacherRoute } from '@/lib/constants';
import { db } from '@/lib/db';
import { fieldsCompletionProgress } from '@/lib/fieldsCompletionProgress';
import { getUserId } from '@/lib/hooks/get-user-id';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type ChapterIdPageProps = {
  params: {
    course_id: string;
    chapter_id: string;
  }
};
const ChapterIdPage = async ({params}: ChapterIdPageProps) => {
  const {userId} = getUserId();

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
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            className="flex items-center gap-x-2 text-sm hover:opacity-75 transition mb-6"
            href={`/${teacherRoute}/courses/${params.course_id}`}
          >
            <ArrowLeft className="h-4 w-4 opacity-75"/>
            Back to course setup
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">
                Chapter Creation
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;