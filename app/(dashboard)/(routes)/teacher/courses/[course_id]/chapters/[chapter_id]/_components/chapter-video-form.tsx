'use client'

import MuxPlayer from '@mux/mux-player-react';
import { Pencil, PlusCircle, ImageIcon, VideoIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { EditButton } from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/shared/edit-button';
import {
  onSubmitCourse, SubmitHelpers
} from '@/app/(dashboard)/(routes)/teacher/courses/[course_id]/_components/shared/submit-function';
import { FileUpload } from '@/components/file-upload';
import { useToggle } from '@/lib/hooks/use-toggle';
import { Chapter, MuxData } from '@prisma/client';

type ChapterVideoFormProps = {
  initialData: Chapter & {
    mux_data?: MuxData | null
  };
  courseId: string;
  chapterId: string;
};


export const ChapterVideoForm = ({ initialData, courseId, chapterId }: ChapterVideoFormProps) => {
  const router = useRouter();
  const [isEditing, toggleEdit] = useToggle(false);

  const submitHelpers: SubmitHelpers = {
    successCb: () => {
      toggleEdit()
      router.refresh();
    },
    url: `/api/courses/${courseId}/chapters/${chapterId}`,
    method: 'PATCH',
    errMsg: 'Failed to update Chapter',
    successMsg: 'Chapter successfully updated'
  };

  const getButtonContent = () => {
    if (isEditing) return 'Cancel';
    if (!initialData.video_url) {
      return (
        <>
          <PlusCircle className="h-4 w-4 mr-2"/>
          Add a video
        </>
      );
    }
    if (!isEditing) {
      return (
        <>
          <Pencil className="h-4 w-4 mr-2"/>
          Edit video
        </>
      );
    }
  };

  const getVideoContent = () => {
    if (!initialData.video_url) {
      return (
        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-2">
          <VideoIcon className="h-10 w-10 text-slate-500" />
        </div>
      );
    }
    return (
      <div className="relative aspect-video mt-2">
        <MuxPlayer
          playbackId={initialData.mux_data?.playback_id ?? ''}
        />
      </div>

    )
  };

  const getEditContent = () => (
    <div>
      <FileUpload
        endpoint="chapterVideo"
        onChange={(url) => {
          if (url) {
            onSubmitCourse.call(submitHelpers, { video_url: url });
          }
        }}
      />
      <div className="text-xs text-muted-foreground mt-4">
        Upload this chapter&apos;s video
      </div>
    </div>
  );

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        Chapter Video
        <EditButton
          toggleCb={toggleEdit}
          isEditing={isEditing}
          customContent={getButtonContent()}
        />
      </div>
      {isEditing && getEditContent()}
      {!isEditing && getVideoContent()}
      {initialData.video_url && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can make a few minutes to upload. Refresh the page if video does not appear
        </div>
      )}
    </div>
  );
};