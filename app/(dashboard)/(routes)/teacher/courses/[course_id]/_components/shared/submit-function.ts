import axios from 'axios';
import toast from 'react-hot-toast';

export type SubmitHelpers = {
  successCb: () => void;
  method?: 'PATCH' | 'POST';
  url: string;
  successMsg: string;
  errMsg: string;
}

export async function onSubmitCourse<T>(
  this: SubmitHelpers,
  values: T,
  ) {
  const {
    successCb,
    url,
    successMsg = 'Successfully updated',
    errMsg = 'Something went wrong',
    method = 'PATCH',
  } = this;
  const axiosMethod = method === 'PATCH' ? axios.patch : axios.post;

  try {
    await axiosMethod(url, values);
    toast.success(successMsg);
    successCb();
  } catch (error) {
    toast.error(errMsg);
  }
}