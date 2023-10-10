import { Button } from '@/components/ui/button';
import { teacherRoute } from '@/lib/constants';
import Link from 'next/link';

type Props = {

};
const CoursesPage = (props: Props) => {
 return (
  <div className="p-6">
    <Link href={`/${teacherRoute}/create`}>
      <Button>New Course</Button>
    </Link>
  </div>
 );
};

export default CoursesPage;