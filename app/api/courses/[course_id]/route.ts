import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { course_id: string } }
) {
  try {
    const { userId } = auth();
    const courseId = params.course_id;
    const values = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', {  status: 401 });
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        user_id: userId
      },
      data: {
        title: values.title
      }
    })

    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSE_ID]", error);
    return new NextResponse('Internal Server Error', {  status: 500 });
  }
}