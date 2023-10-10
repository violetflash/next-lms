// @flow
import { MobileSideBar } from '@/app/(dashboard)/_components/mobileSideBar';
import { NavbarRoutes } from '@/components/navbar-routes';
import * as React from 'react';

type Props = {

};
export const Navbar = (props: Props) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileSideBar />
      <NavbarRoutes />
    </div>
  );
};