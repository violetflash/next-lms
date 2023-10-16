import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export const getUserId = () => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/')
  }

  return { userId };
}