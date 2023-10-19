import * as z from 'zod';

const chapterTitleFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" })
});
type ChapterTitleFormSchema = z.infer<typeof chapterTitleFormSchema>;


const chapterDescriptionFormSchema = z.object({
  description: z.string().min(1, { message: "Description is required" })
});
type ChapterDescriptionFormSchema = z.infer<typeof chapterDescriptionFormSchema>;



const imageFormSchema = z.object({
  image_url: z.string().min(1, { message: "Image url is required" })
});

type ImageFormSchema = z.infer<typeof imageFormSchema>;

const categoryFormSchema = z.object({
  category_id: z.string().min(1, { message: "Category is required" })
});

type CategoryFormSchema = z.infer<typeof categoryFormSchema>;

const priceFormSchema = z.object({
  price: z.coerce.number()
});

type PriceFormSchema = z.infer<typeof priceFormSchema>;

const attachmentFormSchema = z.object({
  url: z.string().min(1)
});

type AttachmentFormSchema = z.infer<typeof attachmentFormSchema>;

const chapterFormSchema = z.object({
  title: z.string().min(1)
});

type ChapterFormSchema = z.infer<typeof chapterFormSchema>;


export {
  chapterTitleFormSchema,
  chapterDescriptionFormSchema,
  type ChapterTitleFormSchema,
  type ChapterDescriptionFormSchema
}