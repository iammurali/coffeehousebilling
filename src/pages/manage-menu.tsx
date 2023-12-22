/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Plus, Trash2, XOctagon, Edit, Trash } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import { AddMenuForm } from "~/components/addmenuform";
import { columns, payments } from "~/components/columns";
import { EditableTable } from "~/components/editabletable";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "~/components/ui/table";
import { Layout } from "~/layout/layout";
import { api } from "~/utils/api";
import { editMenuItemSchema } from "~/utils/zodschema"

import { type RouterOutputs } from "~/utils/api";
import { z } from "zod";
import { EditDialog } from "~/components/editdialog";

type MenuItemType = RouterOutputs["menu"]["getAll"][number];

export default function Home() {
  const [filteredData, setFilteredData] = React.useState<MenuItemType[]>([]);
  const { isLoading, data, error, refetch } = api.menu.getAll.useQuery();
  const menuMutation = api.menu.deleteMenuItem.useMutation();

  React.useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  const deleteMenuItem = (itemId: number) => {
    const deletedItem = menuMutation.mutate({ itemId }, {
      onSuccess: () => {
        toast('Menu item deleted successfully')
        refetch().then(()=>{
          console.log('fetched')
        }).catch((err)=> console.log(err))
      }
    })
    console.log('deleteMenuItem', deletedItem)
  }

  if (isLoading) return <div className="flex flex-col items-center justify-center h-screen bg-black text-white">Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <Layout title="Home" description="Home page">
        <div className="flex flex-row container mt-10 h-[89vh]">
          <div className="w-1/4">
            <AddMenuForm />
          </div>
          <div className="ml-10 overflow-y-scroll w-3/4">
            <Table >
              <TableHeader>
                <TableRow className="border-neutral-500">
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead >Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow className="border-neutral-500" key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell >{`₹${item.price}`}</TableCell>
                    <TableCell>  
                    <EditDialog refetch={async () => { await refetch();
                    toast('please close the popup')
                    }} item={item} />
                      <button className="text-red-300" onClick={() => deleteMenuItem(item.id)}>
                        <Trash />
                      </button>
                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* <EditableTable columns={columns} data={payments}  /> */}
          </div>
        </div>

      </Layout>
    </>
  );
}
