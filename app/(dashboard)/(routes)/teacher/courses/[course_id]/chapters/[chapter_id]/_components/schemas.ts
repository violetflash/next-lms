import * as z from 'zod';

const chapterTitleFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" })
});
type ChapterTitleFormSchema = z.infer<typeof chapterTitleFormSchema>;


const chapterDescriptionFormSchema = z.object({
  description: z.string().min(1, { message: "Description is required" })
});
type ChapterDescriptionFormSchema = z.infer<typeof chapterDescriptionFormSchema>;



const chapterAccessFormSchema = z.object({
  is_free: z.boolean().default(false)
});

type ChapterAccessFormSchema = z.infer<typeof chapterAccessFormSchema>;

const chapterVideoFormSchema = z.object({
  video_url: z.string().min(1, { message: "Video URL is required" }),
});

type ChapterVideoFormSchema = z.infer<typeof chapterVideoFormSchema>;


export {
  chapterTitleFormSchema,
  chapterDescriptionFormSchema,
  chapterAccessFormSchema,
  type ChapterTitleFormSchema,
  type ChapterDescriptionFormSchema,
  type ChapterAccessFormSchema
}