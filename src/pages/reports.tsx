import {
  Table,
  TableBody,
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
import { type RouterOutputs } from "~/utils/api";
type MenuItemType = RouterOutputs["menu"]["getAll"][number];

type BillItemType = {
  item: MenuItemType;
  quantity: number;
};

type LocalBillType = {
  totalAmount: 0;
  billId?: string;
  billItems: BillItemType[];
  total: number;
};

type BillCountType = { item: MenuItemType; count: number | undefined };
type SalesPerMonthType = { month: string; totalSales: number | undefined };
type SalesPerDay = { date: string, totalSales: number | undefined }
type ItemSoldType = {
  count: number;
  totalAmount: number;
};

type ItemsSoldMapType = Record<string, ItemSoldType>
type SalesDataPerDay = { date: string; itemsSoldMap: ItemsSoldMapType }
export default function Reports() {
  const [bills, setBills] = useState<LocalBillType[]>([]);
  const [todaysBills, setTodaysBills] = useState<LocalBillType[]>([]);
  const [mostSoldItems, setMostSoldItems] = useState<BillCountType[]>([]);
  const [salesPerMonth, setSalesPerMonth] = useState<SalesPerMonthType[]>([])
  const [salesPerDay, setSalesPerDay] = useState<SalesDataPerDay[]>([])
  const [last5DaysSales, setLast5DaysSales] = useState<SalesPerDay[]>([])

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
    const mostSoldItems = getMostSoldItemsWithCount(bills);
    console.log(mostSoldItems, "most sold items");
    setMostSoldItems(mostSoldItems);
    getLast7DaysSales()
    getLast7DaysItemSales()
  };

  const getLast7DaysSales = () => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() - index);
      return day.toDateString();
    });
  
    console.log("last 5 days", last7Days);
  
    const salesData = last7Days.map((day) => {
      const filteredBills = bills.filter((singleBill: LocalBillType) => {
        return day === new Date(Number(singleBill.billId)).toDateString();
      });

      console.log(filteredBills, 'filtered bills')
  
      const totalSales = filteredBills.reduce(
        (sum, bill) => sum + bill.total,
        0
      );
  
      return { date: day, totalSales: totalSales };
    });
  
    console.log("last 7 days sales data", salesData);
  
    setLast5DaysSales(salesData);
  };
  
  const getLast7DaysItemSales = () => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() - index);
      return day.toDateString();
    });
  
    // Create an array to store sales data for each day
    const salesData: SalesDataPerDay[] = [];
  
    // Iterate through bills for the last 5 days
    last7Days.forEach((day) => {
      const filteredBills = bills.filter((singleBill: LocalBillType) => {
        return day === new Date(Number(singleBill.billId)).toDateString();
      });
  
      // Create a map to store item counts and total amounts for the current day
      const itemsSoldMap: ItemsSoldMapType = {};
  
      // Iterate through filtered bills to calculate counts and total amounts
      filteredBills.forEach((bill) => {
        bill.billItems.forEach((billItem) => {
          const itemId: string = billItem.item.title;
          const quantitySold: number = billItem.quantity;
          const totalAmount: number = quantitySold * parseFloat(billItem.item.price ?? '0');
  
          if (itemsSoldMap[itemId]) {
            const itemsSold = itemsSoldMap[itemId]
            if(itemsSold) {
              itemsSold.count += quantitySold;
              itemsSold.totalAmount += totalAmount;
            }
          } else {
            itemsSoldMap[itemId] = { count: quantitySold, totalAmount };
          }
        });
      });
  
      // Push the sales data for the current day to the array
      salesData.push({ date: day, itemsSoldMap });
    });
  
    // Log or use the salesData as needed
    console.log("Sales data for the last 5 days:", salesData);
    setSalesPerDay(salesData)
  };
  

  const getSalesPerMonthThisYear = (): SalesPerMonthType[] => {
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    const salesPerMonth: { [month: string]: number } = {};

    bills.forEach((bill) => {
      const dateOfBill = new Date(Number(bill.billId));
      // if (dateOfBill.getFullYear() === currentYear) {
      const monthYear = `${dateOfBill.getFullYear()}-${(dateOfBill.getMonth() + 1).toString().padStart(2, '0')}`;

      if (salesPerMonth[monthYear]) {
        salesPerMonth[monthYear] += bill.total;
      } else {
        salesPerMonth[monthYear] = bill.total;
      }
      // }
    });

    const salesData = Object.keys(salesPerMonth).map((month) => ({
      month,
      totalSales: salesPerMonth[month] ?? 0,
    }));
    setSalesPerMonth(salesData)

    return salesData;
  };

  useEffect(() => {
    getTodaysSales();
    getSalesPerMonthThisYear();
  }, [bills]);


  return (
    <Layout title="Bills" description="Bills page">
      <div className="flex-col w-full">
        <ReportBarChart bills={salesPerMonth} />
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
        {/* Table for last 5 days sales count */}
        <div className="space-y-2 mt-4">
          <h4 className="text-sm font-medium leading-none">Last 7 days sales</h4>
          <p className="text-sm text-muted-foreground">
            this shows the last 7 days sales with total for each day
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">S.no</TableHead>
              <TableHead className="">Bill date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {last5DaysSales ? (
              last5DaysSales.map((singlebill: SalesPerDay, idx: number) => (
                <TableRow key={singlebill.date}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell className="font-medium">
                    {singlebill.date}
                  </TableCell>
                  <TableCell className="text-right">
                    {singlebill.totalSales}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <span></span>
            )}
          </TableBody>
        </Table>
        {/* sales count per item */}
        <div className="space-y-2 mt-4">
          <h4 className="text-sm font-medium leading-none">Last 7 days sales</h4>
          <p className="text-sm text-muted-foreground">
            this shows the last 7 days sales with total for each day
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">S.no</TableHead>
              <TableHead className="">Bill date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesPerDay ? (
              salesPerDay.map((singlebill: SalesDataPerDay, idx: number) => (
                <TableRow key={singlebill.date}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell className="font-medium bg-slate-600">
                    {singlebill.date}
                  </TableCell>
                  <TableCell className="text-right bg-slate-700">
                  {/* table inside table */}
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-900">
                        <TableHead className="w-[100px]">title</TableHead>
                        <TableHead className="">count</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {Object.keys(singlebill.itemsSoldMap) ? (
                      Object.keys(singlebill.itemsSoldMap).map((key, idx: number) => (
                        <TableRow key={idx} className="border-gray-400">
                          <TableCell className="font-medium text-left p-1">{key}</TableCell>
                          <TableCell className="font-medium text-center w-3 p-1">
                            {singlebill.itemsSoldMap[key]?.count}
                          </TableCell>
                          <TableCell className="w-3 p-1">{singlebill.itemsSoldMap[key]?.totalAmount}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <span></span>
                    )}
                      
                    </TableBody>
                  </Table>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <span></span>
            )}
          </TableBody>
        </Table>
        {/* Table for last 5 days sales count */}
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
