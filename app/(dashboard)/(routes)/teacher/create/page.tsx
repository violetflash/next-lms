'use client'
import { teacherRoute } from '@/lib/constants';
import Link from 'next/link';
import toast from 'react-hot-toast';
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
})
type FormSchema = z.infer<typeof formSchema>;

const CreateCourse = () => {
  const router = useRouter();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ''
    }
  });

  const {
    handleSubmit,
    formState: {
      isSubmitting,
      isValid,
      errors
    }
  } = form;

  const onSubmit = async (values: FormSchema) => {
    console.log('values: >>', values);
    try {
      const response = await axios.post('/api/courses', values);
      router.push(`/${teacherRoute}/courses/${response.data.id}`);
    } catch (error) {
      toast.error('Something went wrong while creating your course');
      console.error(error);
    }
  }

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">
          Name your course
        </h1>
        <p className="text-sm text-slate-600">
          What name would you like to give your course? Don&apos;t worry, you can change it later.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({field}) => (
                <FormItem>
                  <FormLabel htmlFor="title">Course title</FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to React'"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button type="button" variant="ghost">Cancel</Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateCourse;