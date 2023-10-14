import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import * as React from 'react';

type EditButtonProps = {
  toggleCb: () => void;
  isEditing: boolean;
  customContent?: React.ReactNode;
}
export const EditButton = ({ toggleCb, isEditing, customContent }: EditButtonProps) => {
  return (
    <Button variant="default" onClick={toggleCb} size="sm">
      {customContent
        ? customContent
        : (
          isEditing ?
            (<>Cancel</>)
            : (
              <>
                <Pencil className="h-4 w-4 mr-2"/>
                Edit
              </>
            )
        )
      }
    </Button>
  )
}