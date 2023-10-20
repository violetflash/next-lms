'use client'
import { EditButton } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/shared/edit-button';
import {
  onSubmitCourse, SubmitHelpers
} from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/shared/submit-function';
import { FileUpload } from '@/components/file-upload';
import { useToggle } from '@/lib/hooks/use-toggle';

// @flow
import { Pencil,  PlusCircle, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';

// ui
import { Course } from '.prisma/client';

type ImageFormProps = {
  initialData: Course;
  courseId: string
};


export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const router = useRouter();
  const [isEditing, toggleEdit] = useToggle(false);

  const submitHelpers: SubmitHelpers = {
    successCb: () => {
      toggleEdit()
      router.refresh();
    },
    url: `/api/courses/${courseId}`,
    method: 'PATCH',
    errMsg: 'Failed to update image',
    successMsg: 'Image successfully updated'
  };

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
        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-2">
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
          className="object-contain rounded-md"
        />
      </div>

    )
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        Image
        <EditButton
          toggleCb={toggleEdit}
          isEditing={isEditing}
          customContent={getButtonContent()}
        />
      </div>
      {!isEditing
        ? getImageContent()
        : (
          <div>
            <FileUpload
              endpoint="courseImage"
              onChange={(url) => {
                if (url) {
                  onSubmitCourse.call(submitHelpers, { image_url: url });
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