import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

type SubmitButtonProps = {
  isSubmitting: boolean;
  buttonText?: string;
}
export const SubmitButton = ({ isSubmitting, buttonText = 'Save' }: SubmitButtonProps) => {
  return (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {buttonText}
    </Button>
  )
}