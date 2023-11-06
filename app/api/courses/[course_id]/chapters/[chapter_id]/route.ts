import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import Mux from '@mux/mux-node';
import { NextResponse } from 'next/server';

// routes for chapters with id

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
)

export async function DELETE(
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

    // clean-up function for mux
    if (chapter.video_url) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapter_id: chapter_id
        }
      });
      if (existingMuxData && existingMuxData.asset_id) {
        // FIXME mux service bugged
        // await Video.Assets.del(existingMuxData.asset_id);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
            chapter_id
          }
        })
      }
    }

    // check if there are any chapters in the course that are published
    const publishedChaptersInThisCourse = await db.chapter.findMany({
      where: {
        course_id: course_id,
        is_published: true
      }
    });


    // if there are no published chapters in the course, un-publish the course
    if (!publishedChaptersInThisCourse.length) {
      await db.course.update({
        where: {
          id: course_id
        },
        data: {
          is_published: false
        }
      });
    }

    const deleted = await db.chapter.delete({
      where: {
        id: chapter_id,
        course_id: course_id
      }
    });

    return NextResponse.json(deleted);
  } catch (e) {
    console.log('[CHAPTER_ID_DELETE]', e);
    return new NextResponse("internal Error", { status: 500 })
  }
}

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

      // clean-up function (if user just changing the video)
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