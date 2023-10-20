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
  chapterAccessFormSchema,
  type ChapterTitleFormSchema,
  type ChapterDescriptionFormSchema,
  type ChapterAccessFormSchema
}