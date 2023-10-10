'use client'
// @flow
import { Button } from '@/components/ui/button';
import { teacherRoute } from '@/lib/constants';
import { UserButton } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

type Props = {

};
export const NavbarRoutes = (props: Props) => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith(`/${teacherRoute}`);
  const isStudentPage = pathname?.startsWith('/chapter');

  return (
    <div className="flex gap-x-2 ml-auto">
      {isTeacherPage || isStudentPage ? (
        <Link href="/">
          <Button size="sm" variant="ghost" className="flex items-center gap-2">
            <LogOut/>
            Exit teacher mode
          </Button>
        </Link>
      ): (
        <Link href={`/${teacherRoute}/courses`}>
          <Button size="sm" variant="ghost">
            Teacher mode
          </Button>
        </Link>
      )}
      <UserButton afterSignOutUrl="/"/>
    </div>
  );
};