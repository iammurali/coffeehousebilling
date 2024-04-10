import { eq } from "drizzle-orm";
import { undefined, z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { menuItem } from "~/server/db/schema";
import { MenuItemType } from "~/utils/common-types";
import { formSchema, deleteMenuItem, editMenuItemSchema } from "~/utils/zodschema";

export const menuRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx })=> {
    try{
      console.log("trying to fetch db");
      return ctx.db.select().from(menuItem).where(eq(menuItem.isActive, "true"));
    } catch (err) {
      console.log(err, 'errror::::::')
    }
  }),
  addMenu: publicProcedure.input(formSchema).mutation(async ({ input, ctx }) => {
    console.log(input)
    const { productName, price, description} = input
     // Create a new user in the database
     const menuAdded = await ctx.db.insert(menuItem).values({title: productName, category: '', price, description});
     //    ^?
     console.log(menuAdded)
     return menuAdded;
  }),
  deleteMenuItem: publicProcedure.input(deleteMenuItem).mutation(async ({input, ctx})=> {
    const { itemId } = input;

    const deletedMenu = await ctx.db.update(menuItem).set({isActive: "false"}).where(eq(menuItem.id, itemId));
    console.log(deletedMenu)
    return deletedMenu;
  }),
  editMenuItem: publicProcedure.input(editMenuItemSchema).mutation(async ({input, ctx})=> {
    const { id, title, description, isActive, price } = input
    const editedMenu = await ctx.db.update(menuItem).set({id, title, description, isActive, price}).where(eq(menuItem.id, input.id));
    console.log(editedMenu)
    return editedMenu;
  })


});
