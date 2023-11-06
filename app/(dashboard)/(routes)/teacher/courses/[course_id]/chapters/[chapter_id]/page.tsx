import {
  ChapterAccessForm
} from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/chapters/[chapter_id]/_components/chapter-access-form';
import {
  ChapterDescriptionForm
} from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/chapters/[chapter_id]/_components/chapter-description-form';
import {
  ChapterTitleForm
} from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/chapters/[chapter_id]/_components/chapter-title-form';
import {
  ChapterVideoForm
} from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/chapters/[chapter_id]/_components/chapter-video-form';
import {
  ChapterActions
} from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/chapters/[chapter_id]/_components/ChapterActions';
import { Banner } from '@/components/banner';
import { IconBadge } from '@/components/icon-badge';
import { teacherRoute } from '@/lib/constants';
import { db } from '@/lib/db';
import { fieldsCompletionProgress } from '@/lib/fieldsCompletionProgress';
import { getUserId } from '@/lib/hooks/get-user-id';
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react';
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
  const { chapter_id, course_id } = params;

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapter_id,
      course_id
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
    // chapter.video_url
  ];

  const {
    totalFields,
    completedFields,
    completionProgressText
  } = fieldsCompletionProgress(requiredFields);

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.is_published && (
        <Banner
          label="This chapter is not published. It will not be visible in the course."
          variant="warning"
        />
      )}
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
                <span>
                Complete all fields {completionProgressText}
              </span>
              </div>
              <ChapterActions
                isComplete={isComplete}
                course_id={course_id}
                chapter_id={chapter_id}
                isPublished={chapter.is_published}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your chapter</h2>
              </div>
            </div>
            <ChapterTitleForm
              initialData={chapter}
              courseId={course_id}
              chapterId={chapter_id}
            />
            <ChapterDescriptionForm
              initialData={chapter}
              courseId={course_id}
              chapterId={chapter_id}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Eye} />
              <h2>
                Access Settings
              </h2>
            </div>
            <ChapterAccessForm
              initialData={chapter}
              courseId={course_id}
              chapterId={chapter_id}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2>
                Add a video
              </h2>
            </div>
            <ChapterVideoForm
              initialData={chapter}
              courseId={course_id}
              chapterId={chapter_id}
            />
          </div>
        </div>
      </div>
    </>

  );
};

export default ChapterIdPage;