'use client'
import {
  titleFormSchema,
  TitleFormSchema
} from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/schemas';
import { EditButton } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/shared/edit-button';
import { SubmitButton } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/shared/submit-button';
import {
  onSubmitCourse
} from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/shared/submit-function';
import { useToggle } from '@/lib/hooks/use-toggle';
import { useRouter } from 'next/navigation';
// @flow
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
  initialData: {
    title: string;
  }
  courseId: string
};

export const TitleForm = ({ initialData, courseId }: Props) => {
  const router = useRouter();
  const [isEditing, toggleEdit] = useToggle(false);

  const submitHelpers = {
    courseId,
    toggleEdit,
    router
  }

  const form = useForm<TitleFormSchema>({
    resolver: zodResolver(titleFormSchema),
    defaultValues: initialData
  });

  const {
    handleSubmit,
    formState: {
      isSubmitting
    }
  } = form;

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        Title
        <EditButton toggleCb={toggleEdit} isEditing={isEditing} />
      </div>
      {!isEditing ? (
        <p className="text-sm mt-2">
          {initialData.title}
        </p>
      ) : (
        <Form {...form} >
          <form
            onSubmit={form.handleSubmit(onSubmitCourse.bind(submitHelpers))}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="title"
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to React'"
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