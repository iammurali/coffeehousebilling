/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { BellRing, Minus, Plus, Trash, Trash2, XOctagon } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import React, { useRef } from "react";
import { MenuSearch } from "~/components/menusearch";
import { MenuSearchEmbed } from "~/components/menusearchembed";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { api } from "~/utils/api";
import { type RouterOutputs } from "~/utils/api";

type MenuItemType = RouterOutputs["menu"]["getAll"][number];

type BillItemType = {
  item: MenuItemType;
  quantity: number;
};

export default function Home() {
  const [filteredData, setFilteredData] = React.useState<MenuItemType[]>([]);
  const [search, setSearch] = React.useState("");
  const { isLoading, data, error } = api.menu.getAll.useQuery();
  const [bills, setBill] = React.useState<BillItemType[]>([]);
  const searchRef = useRef(null); // Create a reference for the search input
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  React.useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSelect = (item: any) => {
    console.log(item.title, item.price);
    // if item already exists in the bill, increase the quantity
    if (bills.some((bill) => bill.item.id === item.id)) {
      setBill((prev) =>
        prev.map((bill) =>
          bill.item.id === item.id
            ? { ...bill, quantity: bill.quantity + 1 }
            : bill,
        ),
      );
      return;
    }
    // else add the item to the bill
    setBill((prev) => [...prev, { item, quantity: 1 }]);
  };

  // add total of all the items price, null check price and convert to number and check quantity and multiply with price
  const total = bills.reduce(
    (acc, bill) => acc + (Number(bill.item.price) || 0) * bill.quantity,
    0,
  );

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <Head>
        <title>Edaikazhinadu coffeehouse billing</title>
        <meta name="description" content="Edaikazhinadu coffee house billing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen w-full flex-col items-center">
        <header className="supports-backdrop-blur:bg-background/60 bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur">
          <div className="container flex h-14 items-center">
            <div className="mr-2 hidden md:flex">
              <Link href="/" className="mr-2 flex items-center space-x-2">
                <span className="hidden font-bold sm:inline-block">
                  Edaikazhinadu coffee house
                </span>
              </Link>
            </div>
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
              <MenuSearch data={data} onSelect={onSelect} />
            </div>
          </div>
        </header>
        <div className="flex w-full lg:w-4/5">
          <div className="w-1/2 p-4">
            {/* Your left column content here */}
            <div className="flex flex-row">
              <Input
                ref={searchRef}
                placeholder="Search..."
                autoFocus
                className="mb-2 shadow-sm"
                value={search}
                onChange={(e) => {
                  const searchText = e.target.value;
                  setSearch(searchText);
                  if (searchText === "") {
                    setFilteredData(data);
                  } else {
                    setFilteredData(
                      data.filter(
                        (item) =>
                          item.title &&
                          item.title
                            .toLowerCase()
                            .includes(searchText.toLowerCase()),
                      ),
                    );
                  }
                }}
               
              />
              {search !== "" && (
                <Button
                  variant={'secondary'}
                  className="ml-3"
                  onClick={() => {
                    setSearch("");
                    setFilteredData(data);
                  }}
                >
                  <XOctagon size={14} color="red" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredData.map((item, index) => (
                <div
                  onClick={() => onSelect(item)}
                  key={index}
                  className={`flex h-20 flex-col items-center justify-between rounded-md border px-2 py-4 font-mono text-sm shadow-sm  ${
                    selectedIndex === index ? 'bg-yellow-500' : ''
                  }`}
                >
                  <p className="text-xs font-semibold">{item.title}</p>
                  <p className="text-xs text-gray-500">{`₹${item.price}`}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/2 p-4">
            {/* Your right column content here */}
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="w-[100px]">Quantity</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bills.map((billItem, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium p-1">
                        {billItem.item.title}
                      </TableCell>
                      <TableCell className="p-1">{billItem.item.price}</TableCell>
                      <TableCell className="whitespace-nowrap p-1">
                        <Input
                          type="number"
                          max={900}
                          min={1}
                          value={billItem.quantity}
                          onChange={(e) =>
                            setBill((prev) =>
                              prev.map((bill, i) =>
                                i === idx
                                  ? {
                                      ...bill,
                                      quantity: Number(e.target.value),
                                    }
                                  : bill,
                              ),
                            )
                          }
                        />
                      </TableCell>
                      <TableCell className="text-right p-1">
                        {Number(billItem.item.price) * billItem.quantity}
                      </TableCell>
                      <TableCell className="text-right p-1">
                        <Button
                          variant={'outline'}
                          onClick={() =>
                            setBill((prev) =>
                              prev.filter((_, i) => i !== idx),
                            )
                          }
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {bills.length > 0 && (
                    <TableRow>
                      <TableCell className="font-medium">Total</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-right">{total}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
