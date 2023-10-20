import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { course_id: string } }
) {
  try {
    const {userId} = auth()
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', {  status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.course_id,
        user_id: userId
      }
    })

    if (!courseOwner) {
      return new NextResponse('Unauthorized', {  status: 401 });
    }

    const lastChapter = await db.chapter.findFirst({
      where: {
        course_id: params.course_id,
      },
      orderBy: {
        position: 'desc'
      }
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        title,
        position: newPosition,
        course_id: params.course_id,
      }
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("[CHAPTERS]", error);
    return new NextResponse('Internal Server Error', {  status: 500 });
  }
}