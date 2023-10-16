import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { BellRing } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { MenuSearch } from "~/components/menusearch";
import { MenuSearchEmbed } from "~/components/menusearchembed";
import { Button } from "~/components/ui/button";

import { api } from "~/utils/api";
import { type RouterOutputs } from "~/utils/api";

type MenuItemType = RouterOutputs["menu"]["getAll"][number];

type BillItemType = {
  item: MenuItemType;
  quantity: number;
};

export default function Shortcut() {
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
        <nav className="flex w-full items-center justify-between bg-orange-200 p-1">
          <p className="text-xl ">EDAIKAZHINADU COFFEE HOUSE</p>
        </nav>
        <div className="w-full justify-center">
          <div className="flex justify-center p-4">
            <MenuSearch data={data} onSelect={onSelect} />
          </div>
          <div className="w-full flex justify-center">
            <table className="table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill, idx) => (
                  <tr key={idx}>
                    <td className="border px-4 py-2">{bill.item.title}</td>
                    <td className="border px-4 py-2">{bill.item.price}</td>
                    <td className="border px-4 py-2">{bill.quantity}</td>

                    <td className="border px-4 py-2">
                      {Number(bill.item.price) * bill.quantity}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() =>
                          setBill((prev) => prev.filter((_, i) => i !== idx))
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {bills.length > 0 && (
                  <tr>
                    <td className="border px-4 py-2">Total</td>
                    <td className="border px-4 py-2"></td>
                    <td className="border px-4 py-2"></td>
                    <td className="border px-4 py-2">{total}</td>
                    <td className="border px-4 py-2"></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}