import { AttachmentForm } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/attachment-form';
import { ChaptersForm } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/chapters-form';
import { fieldsCompletionProgress } from '@/lib/fieldsCompletionProgress';
import React from 'react';
import { redirect } from 'next/navigation';
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from 'lucide-react';
import { CategoryForm } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/category-form';
import { PriceForm } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/price-form';
import { DescriptionForm } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/description-form';
import { ImageForm } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/image-form';
import { TitleForm } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/title-form';
import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { getUserId } from '@/lib/hooks/get-user-id';

type Props = {
  params: {
    course_id: string;
  }
};
const CourseIdPage = async ({ params: { course_id } }: Props) => {
  const { userId } = getUserId();

  const course = await db.course.findUnique({
    where: {
      id: course_id,
      user_id: userId
    },
    include: {
      chapters: {
        orderBy: {
          position: 'asc'
        }
      },
      attachments: {
        orderBy: {
          created_at: 'desc'
        }
      }
    }
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc'
    }
  })

  if (!course) {
    return redirect('/')
  }

  const requiredFields = [
    course.title,
    course.description,
    course.image_url,
    course.price,
    course.category_id,
    course.chapters.some(chapter => chapter.is_published),
  ];

  const {
    totalFields,
    completedFields,
    completionProgressText
  } = fieldsCompletionProgress(requiredFields);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">
            Course setup
          </h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionProgressText}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">
              Customize your course
            </h2>
          </div>
          <TitleForm
            initialData={course}
            courseId={course_id}
          />
          <DescriptionForm
            initialData={course}
            courseId={course_id}
          />
          <ImageForm
            initialData={course}
            courseId={course_id}
          />
          <CategoryForm
            initialData={course}
            courseId={course_id}
            options={categories.map((category) => {
              return {
                label: category.name,
                value: category.id
              }
            })}
          />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">
                Course chapters
              </h2>
            </div>
            <ChaptersForm
              initialData={course}
              courseId={course_id}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={CircleDollarSign} />
            <h2 className="text-xl">
              Sell your course
            </h2>
          </div>
          <div>
            <PriceForm
              initialData={course}
              courseId={course_id}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={File} />
            <h2 className="text-xl">
              Resources & Attachments
            </h2>
          </div>
          <div>
            <AttachmentForm
              initialData={course}
              courseId={course_id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;