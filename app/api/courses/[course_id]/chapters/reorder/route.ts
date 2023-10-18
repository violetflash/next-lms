import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: { course_id: string } }
) {
  try {
    const { userId } = auth();
    const { list } = await req.json();

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

  for (let item of list) {
    await db.chapter.update({
      where: {
        id: item.id
      },
      data: {
        position: item.position
      }
    })
  }

    return new NextResponse('OK', {  status: 200 });
  } catch (e) {
    console.error('[REORDER]', e);
    return new NextResponse('Internal Server Error', {  status: 500 });
  }
}