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

    const unpublishedChapter = await db.chapter.update({
      where: {
        id: chapter_id,
        course_id: course_id,
      },
      data: {
        is_published: false
      }
    });


    // check if there still published chapters in the course
    const publishedChapters = await db.chapter.findMany({
      where: {
        course_id: course_id,
        is_published: true
      }
    });

    if (!publishedChapters.length) {
      // if not - un-publish the whole course
      await db.course.update({
        where: {
          id: course_id
        }, data: {
          is_published: false
        }
      })
    }

    return NextResponse.json(unpublishedChapter);
  } catch (e) {
    console.log('[CHAPTER_ID_UN-PUBLISH]', e);
    return new NextResponse("internal Error", { status: 500 })
  }
}