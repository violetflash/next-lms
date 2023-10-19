'use client'
import { EditButton } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/shared/edit-button';
import { SubmitButton } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/shared/submit-button';
import {
  onSubmitCourse, SubmitHelpers
} from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/shared/submit-function';
import {
  chapterTitleFormSchema,
  ChapterTitleFormSchema
} from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/chapters/[chapter_id]/_components/schemas';
import { useToggle } from '@/lib/hooks/use-toggle';
import { Chapter } from '@prisma/client';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// ui
import {
  FormControl,
  FormMessage,
  FormField,
  FormItem,
  Form
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Props = {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
};

export const ChapterTitleForm = ({ initialData, courseId, chapterId }: Props) => {
  const router = useRouter();
  const [isEditing, toggleEdit] = useToggle(false);

  const submitHelpers: SubmitHelpers = {
    successCb: () => {
      toggleEdit()
      router.refresh();
    },
    // router,
    url: `/api/courses/${courseId}/chapters/${chapterId}`,
    successMsg: 'Chapter Title successfully updated',
    errMsg: 'Failed to update Chapter title'
  }

  const form = useForm<ChapterTitleFormSchema>({
    resolver: zodResolver(chapterTitleFormSchema),
    defaultValues: initialData
  });

  const {
    control,
    handleSubmit,
    formState: {
      isSubmitting
    }
  } = form;

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        Chapter Title
        <EditButton toggleCb={toggleEdit} isEditing={isEditing} />
      </div>
      {!isEditing ? (
        <p className="text-sm mt-2">
          {initialData.title}
        </p>
      ) : (
        <Form {...form} >
          <form
            onSubmit={handleSubmit(onSubmitCourse.bind(submitHelpers))}
            className="space-y-4 mt-4"
          >
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="title"
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course'"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton isSubmitting={isSubmitting} />
          </form>
        </Form>
      )}
    </div>
  );
};