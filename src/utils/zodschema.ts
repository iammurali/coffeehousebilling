import * as z from "zod"

export const formSchema = z.object({
    productName: z.string().min(2, {
      message: "product name must be at least 2 characters.",
    }),
    price: z.string().min(1, {
      message: "price must be at least 2 characters.",
    }),
    description:  z.string().optional(),
    isActive: z.boolean().default(true)
})

export const deleteMenuItem = z.object({
  itemId: z.number()
})