import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { Layout } from "~/layout/layout"
import { RouterOutputs } from "~/utils/api";
type MenuItemType = RouterOutputs["menu"]["getAll"][number];

type BillItemType = {
  item: MenuItemType;
  quantity: number;
};

type LocalBillType = {
  billId?: string,
  billItems: BillItemType[],
  total: number,
}

export default function Bills() {

  const [bills, setBills] = useState<LocalBillType[]>([]);
  const [todaysBills, setTodaysBills] = useState<LocalBillType[]>([]);

  useEffect(()=>{
    const localBillsString = localStorage.getItem('bills');
    if(localBillsString) {
      const localBills: LocalBillType[] = JSON.parse(localBillsString)
      const sortFromLatest = localBills.reverse()
      setBills(sortFromLatest)
      getTodaysSales()
      
    }
  },[])

  const getDate = (date?: string) => {

    const dateofbill = new Date(Number(date))

    return dateofbill.toLocaleString();
  }

  const getDateOnly = (date?: string) => {

    const dateofbill = new Date(Number(date))

    return dateofbill;
  }

  const getTodaysSales = () => {
    setTimeout(()=> {
      const today = new Date().toDateString()
      console.log('todays date', today);
      const todaysBillsFiltered = bills.filter((singleBill: LocalBillType) => {
        console.log(new Date(Number(singleBill.billId)).toDateString())
        return today === new Date(Number(singleBill.billId)).toDateString()
      })
      console.log(todaysBillsFiltered, 'todays bills')
      setTodaysBills(todaysBillsFiltered)
    }, 1000)

  }

  return (
    <Layout title="Bills" description="Bills page">
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
        {todaysBills && todaysBills.map((singlebill: LocalBillType, idx: number) => (
          <TableRow key={singlebill.billId}>
            <TableCell className="font-medium">{idx+1}</TableCell>

            <TableCell className="font-medium">{getDate(singlebill.billId)}</TableCell>
            <TableCell>{singlebill.billItems.length}</TableCell>
            <TableCell>{}</TableCell>
            <TableCell className="text-right">{singlebill.total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Total Sales Today</TableCell>
          <TableCell className="text-right">{todaysBills.reduce((accumulator, currentValue) => {
              return accumulator + currentValue.total;
            }, 0).toString()}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
    </Layout>
  )
}
