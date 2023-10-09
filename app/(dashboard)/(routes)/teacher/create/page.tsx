'use client'
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

// ui
import {
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
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
    // try {
    //   await axios.post('/api/courses', values);
    //   router.push('/courses');
    // } catch (error) {
    //   console.error(error);
    // }
  }

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">
          Name your course
        </h1>
        <p>
          What name would you like to give your course? Don&apos;t worry, you can change it later.
        </p>
      </div>
    </div>
  );
};

export default CreateCourse;