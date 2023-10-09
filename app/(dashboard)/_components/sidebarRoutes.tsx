'use client'
import { SidebarRouteItem } from '@/app/(dashboard)/_components/sidebarRouteItem';
import { teacherRoute } from '@/lib/constants';
import { BarChart, Compass, Layout, List } from 'lucide-react';
import { usePathname } from 'next/navigation';
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
];

const teacherRoutes = [
  {
    icon: List,
    label: 'Courses',
    href: `/${teacherRoute}/courses`,
  },
  {
    icon: BarChart,
    label: 'Analytics',
    href: `/${teacherRoute}/analytics`,
  }
]

type Props = {

};
export const SidebarRoutes = (props: Props) => {
  const pathname = usePathname();
  const isTeacher = pathname.startsWith(`/${teacherRoute}`);
  const routes = isTeacher ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
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