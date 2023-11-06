'use client'
import { Editor } from '@/components/editor';
import { Preview } from '@/components/preview';
import { Checkbox } from '@/components/ui/checkbox';
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
  chapterAccessFormSchema,
  ChapterAccessFormSchema,
} from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/chapters/[chapter_id]/_components/schemas';
import { useToggle } from '@/lib/hooks/use-toggle';
// ui
import {
  FormControl,
  FormMessage,
  FormField,
  FormItem,
  Form, FormDescription
} from '@/components/ui/form';

type Props = {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
};

export const ChapterAccessForm = ({ initialData, courseId, chapterId }: Props) => {
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

  const form = useForm<ChapterAccessFormSchema>({
    resolver: zodResolver(chapterAccessFormSchema),
    defaultValues: {
      is_free: Boolean(initialData.is_free)
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
    <div className="mt-4 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        Chapter Access
        <EditButton toggleCb={toggleEdit} isEditing={isEditing} buttonText="Edit access"/>
      </div>
      {!isEditing ? (
        <div
          className={cn(
            'text-sm mt-2',
            !initialData.is_free && 'text-slate-500 italic'
          )}
        >
          {initialData.is_free ? 'Free' : 'Paid'}
        </div>
      ) : (
        <Form {...form} >
          <form
            onSubmit={handleSubmit(onSubmitCourse.bind(submitHelpers))}
            className="space-y-4 mt-4"
          >
            <FormField
              control={control}
              name="is_free"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>
                      Check this box if you want to make this chapter free for preview
                    </FormDescription>
                  </div>
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