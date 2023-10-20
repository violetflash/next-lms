import { Button } from '@/components/ui/button';
import { teacherRoute } from '@/lib/constants';
import { db } from '@/lib/db';
import { getUserId } from '@/lib/hooks/get-user-id';
import { auth } from '@clerk/nextjs';
import Link from 'next/link';

type Props = {

};
const CoursesPage = async (props: Props) => {

  const { userId } = getUserId();

  const courses = await db.course.findMany({
    where: {
      user_id: userId
    }
  })

 return (
  <div className="p-6">
    <h1>Courses</h1>
    <ul className="flex flex-col gap-y-2 mb-6">
      {courses.map(course => (
        <li key={course.id}>
          <Link href={`/${teacherRoute}/courses/${course.id}`}>
            {course.title}
          </Link>
        </li>
      ))}
    </ul>
    <Link href={`/${teacherRoute}/create`}>
      <Button>New Course</Button>
    </Link>
  </div>
 );
};

export default CoursesPage;