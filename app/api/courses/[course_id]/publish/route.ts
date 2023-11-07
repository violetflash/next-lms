import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { course_id: string} }
) {
  try {
    const {userId} = auth();
    const {course_id} = params;
    if (!userId) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    const course = await db.course.findUnique({
      where: {
        id: course_id,
        user_id: userId
      },
      include: {
        chapters: {
        }
      }
    })

    if (!course) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    const hasPublishedChapters = course.chapters.some(chapter => chapter.is_published);

    if (!course.title || !course.description || !course.image_url || !hasPublishedChapters || !course.category_id) {
      return new NextResponse('Missing required fields', {status: 400});
    }

    const publishedCourse = await db.course.update({
      where: {
        id: course_id,
        user_id: userId
      },
      data: {
        is_published: true
      }
    });

    return NextResponse.json(publishedCourse);
  } catch (e) {
    console.log('[COURSE_ID_PUBLISH]', e);
    return new NextResponse("internal Error", { status: 500 })
  }
}