"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { formSchema } from "~/utils/zodschema"
import { api } from "~/utils/api";
import toast from 'react-hot-toast';


export function AddMenuForm() {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        productName: "",
        price: '',
        description: ''
      },
    })

    const resetForm = () => {
      form.reset({
          productName: "",
          price: '',
          description: ''
        })
    }
    const menuMutation = api.menu.addMenu.useMutation();
//   const { isLoading, data, error } = api.menu.getAll.useQuery();
  // 1. Define your form.


  // 2. Define a submit handler.
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    const result =  menuMutation.mutate(values,{
        onSuccess: () => {
            resetForm()
            toast("Item added successfully")
        }
    })
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="productName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="eg. bread omlette" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Price</FormLabel>
              <FormControl>
                <Input placeholder="price" {...field} />
              </FormControl>
              <FormDescription>
                This is your product price.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Description</FormLabel>
              <FormControl>
                <Input placeholder="description" {...field} />
              </FormControl>
              <FormDescription>
                This is your product description.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={menuMutation.isLoading} type="submit">Submit</Button>
      </form>
    </Form>
  )
}
