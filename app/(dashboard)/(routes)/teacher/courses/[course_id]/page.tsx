import { DescriptionForm } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/description-form';
import { ImageForm } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/image-form';
import { TitleForm } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/title-form';
import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { LayoutDashboard } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
  params: {
    course_id: string;
  }
};
const CourseIdPage = async ({ params: { course_id } }: Props) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/')
  }

  const course = await db.course.findUnique({
    where: {
      id: course_id,
      user_id: userId
    },
  });

  console.log('course: >>', course);

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc'
    }
  })

  console.log('categories: >>', categories);

  if (!course) {
    return redirect('/')
  }

  const requiredFields = [
    course.title,
    course.description,
    course.image_url,
    course.price,
    course.category_id
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionProgressText = `(${completedFields}/${totalFields})`;

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
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;