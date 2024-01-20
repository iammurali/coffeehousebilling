import React from "react";
import { Button } from "~/components/ui/button";
import { Layout } from "~/layout/layout";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "~/components/ui/table";


import { api } from "~/utils/api";
import { Separator } from "~/components/ui/separator";
import { type MenuItemType } from "~/utils/common-types";
import toast from "react-hot-toast";


export default function Shortcut() {
    const [filteredData, setFilteredData] = React.useState<MenuItemType[]>([]);
    const [favoriteItems, setFavoriteItems] = React.useState<MenuItemType[]>([])
    const { isLoading, data, error } = api.menu.getAll.useQuery();

    React.useEffect(() => {
        if (data) {
            setFilteredData(data);
        }
    }, [data]);

    React.useEffect(() => {
        const existingFavItems = localStorage.getItem('favItems')
        if (existingFavItems) {
            const parsedExistingFavItems = JSON.parse(existingFavItems) as MenuItemType[] ;
            if (existingFavItems) {
                setFavoriteItems(parsedExistingFavItems)
            }
        }

    }, []);


    const setItemInLocalStorage = (item: MenuItemType) => {
        const foundIndex = favoriteItems.findIndex((fitem)=> fitem.id === item.id)

        if(foundIndex > -1) {
            toast("Item already exists")
        } else {
            setFavoriteItems(prevArray => [...prevArray, item])
        }
    }

    const removeItem = (itemId: number) => {
        setFavoriteItems(favoriteItems.filter((data) => data.id !== itemId))
    }

    const savePreference = () => {
        const stringfiedFavItems = JSON.stringify(favoriteItems)
        localStorage.setItem('favItems', stringfiedFavItems);
        toast("Favorite items stored successfully.!")
    }


    if (isLoading) return <div className="flex flex-col items-center justify-center h-screen bg-black text-white">Loading...</div>;

    if (error) return <div>{error.message}</div>;

    return (
        <Layout title="Home" description="Preferences">
            <div className="overflow-y-scroll w-[60%]">
                <div className="font-bold">All item</div>
                <Separator className="my-4" />
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
                                    <Button variant={'secondary'} onClick={() => setItemInLocalStorage(item)}>Add</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </div>
            <Separator orientation="vertical" className="mx-4" />
            <div className="overflow-y-scroll w-[40%]">
                <div className="font-bold flex items-center justify-between">Favorite items <Button onClick={() => savePreference()}>Save Favorite items</Button></div>
                <Separator className="my-4" />

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
                        {favoriteItems.map((item) => (
                            <TableRow className="border-neutral-500" key={item.id}>
                                <TableCell className="font-medium">{item.title}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell >{`₹${item.price}`}</TableCell>
                                <TableCell>
                                    <Button onClick={() => removeItem(item.id)} variant="destructive">Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Layout>
    );
}