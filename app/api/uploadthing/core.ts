import { auth } from '@clerk/nextjs';
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = () => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return { userId };
}
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => handleAuth())
    .onUploadComplete(() => {}),
  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  chapterVideo: f({ video: { maxFileSize: "512GB", maxFileCount: 1 }})
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  // // Define as many FileRoutes as you like, each with a unique routeSlug
  // imageUploader: f({ image: { maxFileSize: "4MB" } })
  //   // Set permissions and file types for this FileRoute
  //   .middleware(async ({ req }) => {
  //     // This code runs on your server before upload
  //     const user = await auth(req);
  //
  //     // If you throw, the user will not be able to upload
  //     if (!user) throw new Error("Unauthorized");
  //
  //     // Whatever is returned here is accessible in onUploadComplete as `metadata`
  //     return { userId: user.id };
  //   })
  //   .onUploadComplete(async ({ metadata, file }) => {
  //     // This code RUNS ON YOUR SERVER after upload
  //     console.log("Upload complete for userId:", metadata.userId);
  //
  //     console.log("file url", file.url);
  //   }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;