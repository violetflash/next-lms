'use client'
import { Editor } from '@/components/editor';
import { Preview } from '@/components/preview';
import { cn } from '@/lib/utils';
import { Chapter } from '@prisma/client';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { EditButton } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/shared/edit-button';
import { SubmitButton } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/shared/submit-button';
import {
  onSubmitCourse, SubmitHelpers
} from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/shared/submit-function';
import {
  chapterDescriptionFormSchema,
  ChapterDescriptionFormSchema,
} from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/chapters/[chapter_id]/_components/schemas';
import { useToggle } from '@/lib/hooks/use-toggle';
// ui
import {
  FormControl,
  FormMessage,
  FormField,
  FormItem,
  Form
} from '@/components/ui/form';

type Props = {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
};

export const ChapterDescriptionForm = ({ initialData, courseId, chapterId }: Props) => {
  const router = useRouter();
  const [isEditing, toggleEdit] = useToggle(false);

  const submitHelpers: SubmitHelpers = {
    successCb: () => {
      toggleEdit()
      router.refresh();
    },
    // router,
    url: `/api/courses/${courseId}/chapters/${chapterId}`,
    successMsg: 'Chapter Description successfully updated',
    errMsg: 'Failed to update Chapter description'
  }

  const form = useForm<ChapterDescriptionFormSchema>({
    resolver: zodResolver(chapterDescriptionFormSchema),
    defaultValues: {
      description: initialData.description ?? ''
    }
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
        Chapter Description
        <EditButton toggleCb={toggleEdit} isEditing={isEditing} />
      </div>
      {!isEditing ? (
        <div
          className={cn(
            'text-sm mt-2',
            !initialData.description && 'text-slate-500 italic'
          )}
        >
          {initialData.description
            ? <Preview value={initialData.description ?? ''} />
            : 'No description provided'
          }
        </div>
      ) : (
        <Form {...form} >
          <form
            onSubmit={handleSubmit(onSubmitCourse.bind(submitHelpers))}
            className="space-y-4 mt-4"
          >
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor
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