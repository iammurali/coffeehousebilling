import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { BellRing, Minus, Plus, Trash, Trash2 } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { MenuSearch } from "~/components/menusearch";
import { MenuSearchEmbed } from "~/components/menusearchembed";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { api } from "~/utils/api";
import { type RouterOutputs } from "~/utils/api";

type MenuItemType = RouterOutputs["menu"]["getAll"][number];

type BillItemType = {
  item: MenuItemType;
  quantity: number;
};

export default function Home() {
  const { isLoading, data, error } = api.menu.getAll.useQuery();

  const [bills, setBill] = React.useState<BillItemType[]>([]);

  const onSelect = (item: MenuItemType) => {
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
        <div className="flex w-4/5">
          <div className="w-1/2 p-4">
            {/* Your left column content here */}
            <div>
              <MenuSearchEmbed data={data} onSelect={onSelect} />
            </div>
          </div>
          <div className="w-1/2 p-4">
            {/* Your right column content here */}
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded my-6">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                      Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {bills.map((bill, idx) => (
                    <tr key={idx}>
                      <td className="whitespace-nowrap px-6 py-4">
                        {bill.item.title}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {bill.item.price}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <Input
                          type="number"
                          max={900}
                          min={1}
                          value={bill.quantity}
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
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {/* quantity should be editabel */}
                        {Number(bill.item.price) * bill.quantity}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <Button
                          variant="outline"
                          onClick={() =>
                            // decrease the quantity if quantity is greater than 1 else delete the item
                            setBill((prev) =>
                              prev.map((bill, i) =>
                                i === idx
                                  ? {
                                      ...bill,
                                      quantity:
                                        bill.quantity > 1
                                          ? bill.quantity - 1
                                          : 1,
                                    }
                                  : bill,
                              ),
                            )
                          }
                        >
                          <Minus size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          className="mx-2"
                          onClick={() =>
                            // decrease the quantity
                            setBill((prev) =>
                              prev.map((bill, i) =>
                                i === idx
                                  ? {
                                      ...bill,
                                      quantity: bill.quantity + 1,
                                    }
                                  : bill,
                              ),
                            )
                          }
                        >
                          <Plus size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            setBill((prev) => prev.filter((_, i) => i !== idx))
                          }
                        >
                          <Trash2 size={16} color="red" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {bills.length > 0 && (
                    <tr>
                      <td className="whitespace-nowrap px-6 py-4 font-bold">
                        Total
                      </td>
                      <td className="whitespace-nowrap px-6 py-4"></td>
                      <td className="whitespace-nowrap px-6 py-4"></td>
                      <td className="whitespace-nowrap px-6 py-4 font-bold">
                        {total}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4"></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
