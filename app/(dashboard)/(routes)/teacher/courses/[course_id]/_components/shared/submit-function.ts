import axios from 'axios';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import toast from 'react-hot-toast';

export async function onSubmitCourse<T>(
  this: {
    courseId: string;
    router: AppRouterInstance;
    toggleEdit: () => void;
  },
  values: T,
  ) {
  const { courseId, router, toggleEdit } = this;
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