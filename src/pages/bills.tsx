import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import ReportBarChart from "~/components/barchart";
import { Separator } from "~/components/ui/separator";
import { Layout } from "~/layout/layout";
import { RouterOutputs } from "~/utils/api";
type MenuItemType = RouterOutputs["menu"]["getAll"][number];

type BillItemType = {
  item: MenuItemType;
  quantity: number;
};

type LocalBillType = {
  billId?: string;
  billItems: BillItemType[];
  total: number;
};

type BillCountType = { item: MenuItemType; count: number | undefined };

export default function Bills() {
  const [bills, setBills] = useState<LocalBillType[]>([]);
  const [todaysBills, setTodaysBills] = useState<LocalBillType[]>([]);
  const [mostSoldItems, setMostSoldItems] = useState<BillCountType[]>([]);

  useEffect(() => {
    const localBillsString: string | null = localStorage.getItem("bills");
    if (localBillsString !== null) {
      const localBills = JSON.parse(localBillsString) as LocalBillType[];
      console.log(localBills, "localstorage");
      const sortFromLatest: LocalBillType[] = localBills.reverse();
      console.log(sortFromLatest, "latestbills");
      setBills(sortFromLatest);
    }
  }, []);

  useEffect(() => {
    getTodaysSales();
  }, [bills]);

  const getMostSoldItemsWithCount = (
    bills: LocalBillType[],
  ): BillCountType[] => {
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    const itemsMap: { [itemId: number]: number } = {};

    bills.forEach((bill) => {
      bill.billItems.forEach((billItem) => {
        const itemId = billItem.item.id;
        if (itemsMap[itemId]) {
          itemsMap[itemId] += billItem.quantity;
        } else {
          itemsMap[itemId] = billItem.quantity;
        }
      });
    });

    const sortedItemsWithCount = Object.keys(itemsMap)
      .sort((a, b) => {
        const parsedA = parseInt(a);
        const parsedB = parseInt(b);
        const countA = itemsMap[parsedA] ?? 0; // Nullish coalescing operator to handle undefined values
        const countB = itemsMap[parsedB] ?? 0; // Nullish coalescing operator to handle undefined values
        return countB - countA;
      })
      .map((itemId) => {
        const id = parseInt(itemId);
        const count = itemsMap[id];
        const foundItem = bills.reduce((prevItem, currentBill) => {
          const item = currentBill.billItems.find(
            (billItem) => billItem.item.id === id,
          );
          return item ? item.item : prevItem;
        }, {} as MenuItemType);
        return { item: foundItem, count };
      });

    console.log(sortedItemsWithCount);

    return sortedItemsWithCount;
  };

  const getDateTime = (date?: string) => {
    const dateofbill = new Date(Number(date));

    return dateofbill.toLocaleString();
  };

  const getTodaysSales = () => {
    const today = new Date().toDateString();
    console.log("todays date", today);
    const todaysBillsFiltered = bills.filter((singleBill: LocalBillType) => {
      return today === new Date(Number(singleBill.billId)).toDateString();
    });
    console.log(todaysBillsFiltered, "todays bills");
    setTodaysBills(todaysBillsFiltered);
    let mostSoldItems = getMostSoldItemsWithCount(bills);
    console.log(mostSoldItems, "most sold items");
    if (mostSoldItems && mostSoldItems.length > 10) {
      mostSoldItems = mostSoldItems.slice(0, 8);
      setMostSoldItems(mostSoldItems);
    }
  };

  return (
    <Layout title="Bills" description="Bills page">
      <div className="flex-col w-full">
      {/* <ReportBarChart bills={mostSoldItems} /> */}
      {/* table for sales count */}
      <div className="space-y-2 mt-4">
        <h4 className="text-sm font-medium leading-none">Todays sales</h4>
        <p className="text-sm text-muted-foreground">
          this shows the todays sales with bill value and overall total today
        </p>
      </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">S.no</TableHead>
              <TableHead className="">Bill date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todaysBills ? (
              todaysBills.map((singlebill: LocalBillType, idx: number) => (
                <TableRow key={singlebill.billId}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell className="font-medium">
                    {getDateTime(singlebill.billId)}
                  </TableCell>
                  <TableCell>{singlebill.billItems.length}</TableCell>
                  <TableCell>{}</TableCell>
                  <TableCell className="text-right">
                    {singlebill.total}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <span></span>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total Sales Today</TableCell>
              <TableCell className="text-right">
                {todaysBills
                  .reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.total;
                  }, 0)
                  .toString()}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        {/* table for sales count */}
        <div className="space-y-2 mt-4">
        <h4 className="text-sm font-medium leading-none">Overall sales count</h4>
        <p className="text-sm text-muted-foreground">
          this shows the overall sales count for each item which have been billed
        </p>
      </div>
      <Separator className="my-4" />
        <Table className="items-center">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">S.no</TableHead>
              <TableHead className="w-[300px]">item name</TableHead>
              <TableHead className="w-[100px]">count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mostSoldItems ? (
              mostSoldItems.map((singlebill: BillCountType, idx: number) => (
                <TableRow key={singlebill.item.title}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell className="font-medium">
                    {singlebill.item.title}
                  </TableCell>
                  <TableCell>{singlebill.count}</TableCell>
                </TableRow>
              ))
            ) : (
              <span></span>
            )}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
}
