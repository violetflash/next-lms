'use client'
import {
  chapterFormSchema,
  ChapterFormSchema,
} from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/schemas';
import { EditButton } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/shared/edit-button';
import { SubmitButton } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/shared/submit-button';
import { Input } from '@/components/ui/input';
import { useToggle } from '@/lib/hooks/use-toggle';
import { cn } from '@/lib/utils';
import { Chapter } from '@prisma/client';
import axios from 'axios';
import { Loader2, PlusCircle } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { Course } from '.prisma/client';
import { ChaptersList, ChapterUpdateData } from './chapters-list';

type CourseWithChapters = Course & {
  chapters: Chapter[]
};

type ChaptersFormProps = {
  initialData: CourseWithChapters
  courseId: string
};



export const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const router = useRouter();
  const [isUpdating, toggleUpdating, setIsUpdating] = useToggle(false);
  const [isCreating, toggleCreating] = useToggle(false);


  const submitHelpers = {
    courseId,
    toggleCreate: toggleCreating,
    router
  };

  const form = useForm<ChapterFormSchema>({
    resolver: zodResolver(chapterFormSchema),
    defaultValues: {
      title: ''
    }
  });

  const {
    control,
    handleSubmit,
    formState: {
      isSubmitting
    }
  } = form;

  const onSubmit = async (values: ChapterFormSchema) => {
    console.log('values: >>', values);
    try {
      const response = await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success('Chapter created successfully');
      toggleCreating();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong while creating a new chapter');
    }
  };

  const onReorder = async (orderData: ChapterUpdateData[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, { list: orderData });
      toast.success('Chapters reordered successfully');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong while reordering chapters');
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2  className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="flex items-center justify-between font-medium">
        Chapters
        <EditButton
          toggleCb={toggleCreating}
          isEditing={isCreating}
          icon={PlusCircle}
          buttonText="Add"
        />
      </div>
      {isCreating && (
        <Form {...form} >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="chapter_title"
                      disabled={isSubmitting}
                      placeholder="Chapter title"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton isSubmitting={isSubmitting} buttonText="Create" />
          </form>
        </Form>
      )}
      {!isCreating && (
        <div className={cn(
          'text-sm mt-2',
          !initialData.chapters.length && 'text-slate-500 italic'
        )}>
          {!initialData.chapters.length && "No chapters yet"}
          <ChaptersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapters ?? []}
            isDisabled={isUpdating}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-sm text-muted-foreground mt-4">
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  );
};