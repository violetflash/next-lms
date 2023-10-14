import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { course_id: string } }
) {
  try {
    const {userId} = auth();
    const courseId = params.course_id;
    const { url } = await req.json()

    if (!userId) {
      return new NextResponse('Unauthorized', {  status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        user_id: userId
      }
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', {  status: 401 });
    }

    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split('/').pop(),
        course_id: courseId
      }
    });

    return NextResponse.json(attachment);

  } catch (error) {
    console.log('COURSE_ID_ATTACHMENT', error);
    return new NextResponse('Internal Server Error', {status: 500});
  }
}