/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Trash } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { AddMenuForm } from "~/components/addmenuform";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "~/components/ui/table";
import { Layout } from "~/layout/layout";
import { api } from "~/utils/api";

import { type RouterOutputs } from "~/utils/api";
import { EditDialog } from "~/components/editdialog";
import { Input } from "~/components/ui/input";
import { compareStrings } from "~/utils/helpers";

type MenuItemType = RouterOutputs["menu"]["getAll"][number];

export default function Home() {
  const [filteredData, setFilteredData] = React.useState<MenuItemType[]>([]);
  const [search, setSearch] =  React.useState<string>('');
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
          <div className="w-1/4">
            <AddMenuForm />
          </div>
          <div className="ml-10 overflow-y-scroll w-3/4">
          <Input
              placeholder="Press Space key to Search..."
              autoFocus
              className="mb-1 shadow-sm"
              value={search}
              onChange={(e) => {
                const searchText = e.target.value;
                setSearch(searchText);
                if (searchText.trim() === "") {
                  setFilteredData(data);
                } else {
                  const sanitizedSearch = searchText
                    .trim()
                    .toLowerCase()
                    .replace(/\s/g, ""); // Remove spaces from search
                  const filtered = data.filter(
                    (item) =>
                      item.title &&
                      compareStrings(
                        sanitizedSearch,
                        item.title.toLowerCase().replace(/\s/g, ""),
                      ),
                  );
                  setFilteredData(filtered);
                }
              }}
            />
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
                    <EditDialog refetch={async (): Promise<void> => { 
                       try {
                         toast('Please close the popup');
                         await refetch(); // Assuming refetch is an asynchronous function that returns a Promise
                      } catch (error) {
                        // Handle any errors from the refetch
                        console.error('Error while refetching:', error);
                        toast('Error occurred. Please try again.'); // Display an error message using toast
                      }
                    }} item={item} />
                      <button className="text-red-300" onClick={() => deleteMenuItem(item.id)}>
                        <Trash />
                      </button>
                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </div>
   

      </Layout>
    </>
  );
}
