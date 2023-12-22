import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit } from "lucide-react";
import { BaseSyntheticEvent, MouseEventHandler, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { editMenuItemSchema } from "~/utils/zodschema";
type MenuItemType = RouterOutputs["menu"]["getAll"][number];
 
export function EditDialog({refetch, item}: {refetch: ()=> Promise<void>, item: MenuItemType}) {
    const [editedItem, setEditedItem] = useState(item);
    const [open, setOpen] = useState(false)
    console.log("log item vlauer::::",item)
    const { register, handleSubmit, setValue } = useForm({
        defaultValues: item // Set default values to the item
    });
    const editMutation = api.menu.editMenuItem.useMutation();
    const onSubmit = (data: MenuItemType) => {
        console.log(data)
        // editMenuItem(data); // Call your mutation with the updated data
        // Close dialog or perform additional actions after mutation
        const result =  editMutation.mutate(data as z.infer<typeof editMenuItemSchema>,{
            onSuccess: () => {
                toast("Item edited successfully")
                refetch()
                setOpen(false)
            }
        })
    };
  
    return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="pr-2 text-yellow-300" >
            <Edit />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
          <DialogDescription>
            {`Make changes to your menu here. Click save when you're done.`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(): (e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void> => handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              {...register('title')}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"    
              {...register('price')}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              description
            </Label>
            <Input
              id="description"    
              {...register('description')}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  )
}