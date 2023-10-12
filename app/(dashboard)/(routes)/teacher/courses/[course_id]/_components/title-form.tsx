'use client'
import { Pencil, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
// @flow
import * as React from 'react';
import toast from 'react-hot-toast';
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// ui
import {
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormItem,
  FormLabel,
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

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" })
});

type TitleFormSchema = z.infer<typeof formSchema>;
export const TitleForm = ({ initialData, courseId }: Props) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const form = useForm<TitleFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  });

  const {
    handleSubmit,
    formState: {
      isSubmitting
    }
  } = form;

  const onSubmit = async (values: TitleFormSchema) => {
    console.log('values: >>', values);
    try {
      const response = await axios.patch(`/api/courses/${courseId}`, values);
      toast.success('Course updated successfully');
      console.log('response: >>', response);
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong while updating your course');
    }
  }

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        Course Title
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ?
            (<>Cancel</>)
            : (
              <>
                <Pencil className="h-4 w-4 mr-2"/>
                Edit title
              </>
            )
        }
        </Button>
      </div>
      {!isEditing ? (
        <p className="text-sm mt-2">
          {initialData.title}
        </p>
      ) : (
        <Form {...form} >
          <form
            onSubmit={form.handleSubmit(onSubmit)}
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};