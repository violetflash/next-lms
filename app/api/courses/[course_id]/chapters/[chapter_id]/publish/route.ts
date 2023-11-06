import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { course_id: string; chapter_id: string } }
) {
  try {
    const {userId} = auth();
    const {chapter_id, course_id} = params;
    if (!userId) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: course_id,
        user_id: userId
      }
    })
    if (!courseOwner) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapter_id,
        course_id: course_id
      }
    });

    if (!chapter) {
      return new NextResponse('Chapter not found', {status: 404});
    }

    if (!chapter.title || !chapter.description) {
      return new NextResponse('Missing required fields', {status: 400});
    }

    const publishedChapter = await db.chapter.update({
      where: {
        id: chapter_id,
        course_id: course_id,
      },
      data: {
        is_published: true
      }
    });

    return NextResponse.json(publishedChapter);
  } catch (e) {
    console.log('[CHAPTER_ID_PUBLISH]', e);
    return new NextResponse("internal Error", { status: 500 })
  }
}