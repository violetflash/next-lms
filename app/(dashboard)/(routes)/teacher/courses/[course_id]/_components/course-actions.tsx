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

type CourseActionsProps = {
  isComplete: boolean;
  course_id: string;
  isPublished: boolean;
};
export const CourseActions = ({
  isComplete,
  isPublished,
  course_id,
}: CourseActionsProps) => {
  const router = useRouter();
  const [isLoading, toggleLoading, setIsLoading] = useToggle(false);

  const togglePublish = async () => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/courses/${course_id}/${isPublished ? 'un-publish' : 'publish'}`);
      toast.success(`Course successfully ${isPublished ? 'un-' : ''}published`);
      router.refresh();
    } catch (e) {
      toast.error(`Something went wrong while ${isPublished ? 'un-' : ''}publishing course`)
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${course_id}`);
      toast.success('Course deleted');
      router.push(`/${teacherRoute}/courses`);
    } catch (e) {
      toast.error('Something went wrong while deleting course')
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={togglePublish}
        disabled={!isComplete || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? 'Un-publish' : 'Publish'}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button
          size="sm"
          variant="destructive"
          disabled={isLoading}
        >
          <Trash className="h-4 w-4"/>
        </Button>
      </ConfirmModal>
    </div>
  );
};