'use client'
import {
  priceFormSchema,
  PriceFormSchema
} from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/schemas';
import { EditButton } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/shared/edit-button';
import { SubmitButton } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/shared/submit-button';
import {
  onSubmitCourse
} from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/shared/submit-function';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatPrice } from '@/lib/formatPrice';
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

type PriceFormProps = {
  initialData: Course
  courseId: string
};

export const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
  const router = useRouter();
  const [isEditing, toggleEdit] = useToggle(false);

  const submitHelpers = {
    courseId,
    toggleEdit,
    router
  }

  const form = useForm<PriceFormSchema>({
    resolver: zodResolver(priceFormSchema),
    defaultValues: {
      price: initialData?.price ?? undefined
    }
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
        Course price
        <EditButton toggleCb={toggleEdit} isEditing={isEditing} />
      </div>
      {!isEditing ? (
        <p className={cn(
          "text-sm mt-2",
          !initialData.price && "text-slate-500 italic"
        )}>
          {initialData.price
            ? formatPrice(initialData.price)
            : "No price provided"
          }
        </p>
      ) : (
        <Form {...form} >
          <form
            onSubmit={form.handleSubmit(onSubmitCourse.bind(submitHelpers))}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      id="price"
                      disabled={isSubmitting}
                      placeholder="Set price for your course"
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