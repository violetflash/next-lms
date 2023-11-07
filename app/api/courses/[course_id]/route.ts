import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: { course_id: string } }
) {
  try {
    const { userId } = auth();
    const { course_id } = params;

    if (!userId) {
      return new NextResponse('Unauthorized', {  status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: course_id,
        user_id: userId
      },
      include: {
        chapters: {
          include: {
            mux_data: true
          }
        }
      }
    });

    console.log('course: >>', course);

    if (!course) {
      return new NextResponse('NOT FOUND', {status: 404});
    }

    // TODO We hav to manually delete all course's third party data from their services

    const deletedCourse = await db.course.delete({
      where: {
        id: course_id
      }
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.error("[COURSE_ID_DELETE]", error);
    return new NextResponse('Internal Server Error', {  status: 500 });
  }
};

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
        ...values
      }
    })

    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSE_ID]", error);
    return new NextResponse('Internal Server Error', {  status: 500 });
  }
}