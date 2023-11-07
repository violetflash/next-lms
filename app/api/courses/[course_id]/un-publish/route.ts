import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { course_id: string } }
) {
  try {
    const {userId} = auth();
    const { course_id} = params;
    if (!userId) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    const course = await db.course.findUnique({
      where: {
        id: course_id,
        user_id: userId
      }
    })
    if (!course) {
      return new NextResponse('Course Not Found', {status: 404});
    }

    const unpublishedCourse = await db.course.update({
      where: {
        id: course_id,
        user_id: userId,
      },
      data: {
        is_published: false
      }
    });

    return NextResponse.json(unpublishedCourse);
  } catch (e) {
    console.log('[CHAPTER_ID_UN-PUBLISH]', e);
    return new NextResponse("internal Error", { status: 500 })
  }
}