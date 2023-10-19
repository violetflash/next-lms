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
    const { title } = await req.json();
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

    const chapter = await db.chapter.update({
      where: {
        id: chapter_id,
        course_id: course_id
      },
      data: {
        title: title
      }
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTER_ID]", error);
    return new NextResponse('Internal Server Error', {  status: 500 });
  }
}