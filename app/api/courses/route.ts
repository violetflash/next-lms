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

    if (!course) {
      return new NextResponse('NOT FOUND', {status: 404});
    }

    // TODO We hava to manually delete all course's third party data from their services

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
export async function POST(
  req: Request
) {
  try {
    const { userId } = auth()
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', {  status: 401 });
    }

    const course = await db.course.create({
      data: {
        title,
        user_id: userId
      }
    })
    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSES]", error);
    return new NextResponse('Internal Server Error', {  status: 500 });
  }
}