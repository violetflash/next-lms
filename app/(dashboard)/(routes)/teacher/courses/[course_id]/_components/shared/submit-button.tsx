import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

type SubmitButtonProps = {
  isSubmitting: boolean;
}
export const SubmitButton = ({ isSubmitting }: SubmitButtonProps) => {
  return (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Save
    </Button>
  )
}