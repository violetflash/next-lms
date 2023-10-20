import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Course } from '.prisma/client';


const descriptionFormSchema = z.object({
  description: z.string().min(1, { message: "Description is required" })
});
type DescriptionFormSchema = z.infer<typeof descriptionFormSchema>;

const titleFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" })
});
type TitleFormSchema = z.infer<typeof titleFormSchema>;

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
  titleFormSchema,
  descriptionFormSchema,
  imageFormSchema,
  categoryFormSchema,
  priceFormSchema,
  attachmentFormSchema,
  chapterFormSchema,
  type TitleFormSchema,
  type DescriptionFormSchema,
  type ImageFormSchema,
  type CategoryFormSchema,
  type PriceFormSchema,
  type AttachmentFormSchema,
  type ChapterFormSchema
}