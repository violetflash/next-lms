'use client'
import { FileUpload } from '@/components/file-upload';

// @flow
import { Pencil, Loader2, PlusCircle, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import toast from 'react-hot-toast';
import * as z from 'zod';
import axios from 'axios';

// ui
import { Button } from '@/components/ui/button';
import { Course } from '.prisma/client';

type ImageFormProps = {
  initialData: Course;
  courseId: string
};

const formSchema = z.object({
  image_url: z.string().min(1, { message: "Image url is required" })
});

type TitleFormSchema = z.infer<typeof formSchema>;
export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);

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

  const getButtonContent = () => {
    if (isEditing) return 'Cancel';
    if (!initialData.image_url) {
      return (
        <>
          <PlusCircle className="h-4 w-4 mr-2"/>
          Add image
        </>
      );
    }
    if (!isEditing) {
      return (
        <>
          <Pencil className="h-4 w-4 mr-2"/>
          Edit image
        </>
      );
    }
  };

  const getImageContent = () => {
    if (!initialData.image_url) {
      return (
        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
          <ImageIcon className="h-10 w-10 text-slate-500" />
        </div>
      );
    }
    return (
      <div className="relative aspect-video mt-2">
        <Image
          src={initialData.image_url}
          alt={'Upload'}
          fill
          className="object-cover rounded-md"
        />
      </div>

    )
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        Course image
        <Button variant="ghost" onClick={toggleEdit}>
          {getButtonContent()}
        </Button>
      </div>
      {!isEditing
        ? getImageContent()
        : (
          <div>
            <FileUpload
              endpoint="courseImage"
              onChange={(url) => {
                if (url) {
                  onSubmit({ image_url: url });
                }
              }}
            />
            <div className="text-xs text-muted-foreground mt-4">
              16:9 aspect ratio recommended
            </div>
          </div>
      )}
    </div>
  );
};