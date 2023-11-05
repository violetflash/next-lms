'use client'
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';
import { teacherRoute } from '@/lib/constants';
import { useToggle } from '@/lib/hooks/use-toggle';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import toast from 'react-hot-toast';

type ChapterActionsProps = {
  disabled: boolean;
  course_id: string;
  chapter_id: string;
  isPublished: boolean;
};
export const ChapterActions = ({
  disabled,
  isPublished,
  course_id,
  chapter_id
}: ChapterActionsProps) => {
  const router = useRouter();
  const [isLoading, toggleLoading, setIsLoading] = useToggle(false);
  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${course_id}/chapters/${chapter_id}`);
      toast.success('Chapter deleted');
      router.push(`${teacherRoute}/courses/${course_id}`);
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={() => {}}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button
          size="sm"
          variant="destructive"
          disabled={disabled || isLoading}
        >
          <Trash className="h-4 w-4"/>
        </Button>
      </ConfirmModal>
    </div>
  );
};