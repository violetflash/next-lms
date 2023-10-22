import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import Mux from '@mux/mux-node';
import { NextResponse } from 'next/server';


const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
)

export async function PATCH(
  req: Request,
  { params }: { params: { course_id: string; chapter_id: string } }
) {
  try {
    const {userId} = auth();
    const {chapter_id, course_id} = params;
    // to prevent user from editing published flags
    // is_published will be controlled by separate api route
    const {isPublished, ...values} = await req.json();
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
        ...values
      }
    });

    if (values.video_url) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapter_id: chapter_id
        }
      });

      if (existingMuxData && existingMuxData.asset_id) {
        await Video.Assets.del(existingMuxData.asset_id);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
            chapter_id
          }
        })
      }

      const asset = await Video.Assets.create({
        input: values.video_url,
        playback_policy: 'public',
        test: false
      });

      await db.muxData.create({
        data: {
          chapter_id,
          asset_id: asset.id,
          playback_id: asset.playback_ids?.[0]?.id,
        }
      })
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTER_ID]", error);
    return new NextResponse('Internal Server Error', {  status: 500 });
  }
}