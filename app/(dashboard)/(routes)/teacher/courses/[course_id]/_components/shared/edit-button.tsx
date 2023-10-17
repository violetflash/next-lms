import { Button } from '@/components/ui/button';
import { LucideIcon, Pencil } from 'lucide-react';
import * as React from 'react';

type EditButtonProps = {
  toggleCb: () => void;
  isEditing: boolean;
  customContent?: React.ReactNode;
  icon?: LucideIcon;
  buttonText?: string;
}
export const EditButton = ({
  toggleCb,
  isEditing,
  customContent,
  icon: Icon = Pencil,
  buttonText = 'Edit'
}: EditButtonProps) => {
  return (
    <Button variant="default" onClick={toggleCb} size="sm">
      {customContent
        ? customContent
        : (
          isEditing ?
            (<>Cancel</>)
            : (
              <>
                <Icon className="h-4 w-4 mr-2"/>
                {buttonText}
              </>
            )
        )
      }
    </Button>
  )
}