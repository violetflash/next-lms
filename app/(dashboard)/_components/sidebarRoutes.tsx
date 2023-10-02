'use client'
import { SidebarRouteItem } from '@/app/(dashboard)/_components/sidebarRouteItem';
import { Compass, Layout } from 'lucide-react';
// @flow
import * as React from 'react';

const guestRoutes = [
  {
    icon: Layout,
    label: 'Dashboard',
    href: '/',
  },
  {
    icon: Compass,
    label: 'Browse',
    href: '/search',
  }
]

type Props = {

};
export const SidebarRoutes = (props: Props) => {
  return (
    <div className="flex flex-col w-full">
      {guestRoutes.map((route) => (
        <SidebarRouteItem
          key={route.href}
          href={route.href}
          icon={route.icon}
          label={route.label}
        />
      ))}
    </div>
  );
};