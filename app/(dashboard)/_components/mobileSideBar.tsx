// @flow
import Sidebar from '@/app/(dashboard)/_components/sidebar';
import { Menu } from 'lucide-react';
import * as React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

type Props = {

};
export const MobileSideBar = (props: Props) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};