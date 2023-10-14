import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { utapi } from 'uploadthing/server';

export async function DELETE(
  req: Request,
  { params }: { params: { course_id: string; attachment_id: string } }
) {
  try {
    const {userId} = auth();
    const { attachment_id, course_id } = params;

    if (!userId) {
      return new NextResponse('Unauthorized', {  status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: course_id,
        user_id: userId
      }
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', {  status: 401 });
    }

    console.log('attachmentId: >>', attachment_id);

    const attachment = await db.attachment.delete({
      where: {
        id: attachment_id,
        course_id: course_id
      }
    });
    await utapi.deleteFiles(attachment.name)

    return NextResponse.json(attachment);

  } catch (error) {
    console.error("[COURSE_ID_DELETE_ATTACHMENT]", error);
    return new NextResponse('Internal Server Error', {  status: 500 });
  }
}