'use client'
// @flow
import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

type Props = {

};
export const NavbarRoutes = (props: Props) => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith('/teacher');
  const isStudentPage = pathname?.startsWith('/chapter');

  return (
    <div className="flex gap-x-2 ml-auto">
      {isTeacherPage || isStudentPage ? (
        <Link href="/">
          <Button size="sm" variant="ghost">
            <LogOut/>
            Exit
          </Button>
        </Link>
      ): (
        <Link href="/teacher/courses">
          <Button size="sm" variant="ghost">
            Teacher mode
          </Button>
        </Link>
      )}
      <UserButton afterSignOutUrl="/"/>
    </div>
  );
};