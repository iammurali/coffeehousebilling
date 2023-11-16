import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { menuItem } from "~/server/db/schema";
import { formSchema } from "~/utils/zodschema";

export const menuRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.menuItem.findMany();
  }),
  addMenu: publicProcedure.input(formSchema).mutation(async ({ input, ctx }) => {
    console.log(input)
    const { productName, price, description} = input
     // Create a new user in the database
     const menuAdded = await ctx.db.insert(menuItem).values({title: productName, category: '', price, description});
     //    ^?
     console.log(menuAdded)
     return menuAdded;
  })
});
