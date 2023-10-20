'use client'
import { AttachmentFormSchema } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/schemas';
import { EditButton } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/shared/edit-button';
import {
  onSubmitCourse
} from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/shared/submit-function';
import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import { useToggle } from '@/lib/hooks/use-toggle';
import axios from 'axios';

// @flow
import { PlusCircle, ImageIcon, File, Loader2, Delete, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import toast from 'react-hot-toast';

// ui
import { Attachment, Course } from '.prisma/client';

type AttachmentFormProps = {
  initialData: Course & {
    attachments: Attachment[]
  };
  courseId: string
};

type GetAttachmentContentProps = {
  initialData: AttachmentFormProps['initialData'];
  deletingId: string | null;
  onDelete: (id: string) => Promise<void>;
}

const getAttachmentContent = ({ initialData, deletingId, onDelete }: GetAttachmentContentProps) => {
  if (!initialData.attachments.length) {
    return (
      <p className="text-sm mt-2 text-slate-500 italic">No attachments yet</p>
    );
  }
  return (
    <div className="space-y-2 mt-2">
      <ul className="flex flex-col gap-y-2">
        {initialData.attachments.map((attachment) => (
          <li key={attachment.id} className="group flex items-center p-3 w-full bg-sky-100 border border-sky-200 rounded-md gap-x-2">
            <File className="h-4 w-4 flex-shrink-0 group-hover:text-sky-700"/>
            <Link
              href={attachment.url}
              target="_blank"
              className="text-sm line-clamp-1 transition group-hover:text-sky-700 group-hover:underline"
            >
              {attachment.name}
            </Link>
            <Button
              disabled={deletingId === attachment.id}
              variant="ghost"
              size="sm"
              className="ml-auto transition hover:opacity-75"
              onClick={() => onDelete(attachment.id)}
            >
              {deletingId === attachment.id ? (
                <Loader2 className="h-4 w-4 animate-spin"/>
              ): (
                <X className="h-4 w-4 cu"/>
              )}
            </Button>
          </li>
        ))}
      </ul>

    </div>
  );
};

const getButtonContent = ( isEditing: boolean ) => {
  if (isEditing) return 'Cancel';
  return (
    <>
      <PlusCircle className="h-4 w-4 mr-2"/>
      Add a file
    </>
  );
};

export const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const router = useRouter();
  const [isEditing, toggleEdit] = useToggle(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const onSubmit = async (values: AttachmentFormSchema) => {
    try {
      const response = await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success('Course updated successfully');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong while updating your course');
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success('Attachment deleted successfully');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong while deleting your attachment');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        Attachments
        <EditButton
          toggleCb={toggleEdit}
          isEditing={isEditing}
          customContent={getButtonContent(isEditing)}
        />
      </div>
      {!isEditing
        ? getAttachmentContent({
            initialData,
            deletingId,
            onDelete
          })
        : (
          <div>
            <FileUpload
              endpoint="courseAttachment"
              onChange={(url) => {
                if (url) {
                  onSubmit({ url });
                }
              }}
            />
            <div className="text-xs text-muted-foreground mt-4">
              Add anything your students might need to complete the course.
            </div>
          </div>
      )}
    </div>
  );
};