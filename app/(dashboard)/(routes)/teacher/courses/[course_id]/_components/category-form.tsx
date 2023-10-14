'use client'
import {
  categoryFormSchema,
  CategoryFormSchema
} from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/schemas';
import { EditButton } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/shared/edit-button';
import { SubmitButton } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/shared/submit-button';
import {
  onSubmitCourse
} from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/shared/submit-function';
import { Combobox, Option } from '@/components/ui/combobox';
import { useToggle } from '@/lib/hooks/use-toggle';
import { cn } from '@/lib/utils';
// @flow
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
import { Course } from '.prisma/client';

type CategoryFormProps = {
  initialData: Course
  courseId: string
  options: Option[];
};


export const CategoryForm = ({ initialData, courseId, options }: CategoryFormProps) => {
  const router = useRouter();
  const [isEditing, toggleEdit] = useToggle(false);

  const submitHelpers = {
    courseId,
    toggleEdit,
    router
  };
  const form = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      category_id: initialData?.category_id ?? ''
    }
  });

  const {
    control,
    handleSubmit,
    formState: {
      isSubmitting,
    }
  } = form;

  const selectedOption = options.find((option) => option.value === initialData.category_id);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        Category
        <EditButton toggleCb={toggleEdit} isEditing={isEditing} />
      </div>
      {!isEditing ? (
        <p className={cn(
          "text-sm mt-2",
          !initialData.category_id && "text-slate-500 italic"
        )}>
          {selectedOption?.label || "No category provided"}
        </p>
      ) : (
        <Form {...form} >
          <form
            onSubmit={handleSubmit(onSubmitCourse.bind(submitHelpers))}
            className="space-y-4 mt-4"
          >
            <FormField
              control={control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={options}
                      {...field}
                      placeholder="Select category"
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