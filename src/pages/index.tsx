/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus, Trash2, XOctagon } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Layout } from "~/layout/layout";
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
import { toast } from "react-hot-toast";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ConfirmDialog } from "~/components/alertdialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// import { ComboboxDemo } from "~/components/menuSearchPopup";

type MenuItemType = RouterOutputs["menu"]["getAll"][number];

type BillItemType = {
  item: MenuItemType;
  quantity: number;
};

type draftBillType = {
  billId?: string;
  billItems: BillItemType[];
  total: number;
};

export default function Home() {
  const drawerTriggerRef = useRef<HTMLButtonElement>(null);
  const [filteredData, setFilteredData] = React.useState<MenuItemType[]>([]);
  const [search, setSearch] = React.useState("");
  const { isLoading, data, error } = api.menu.getAll.useQuery();
  const [bills, setBill] = React.useState<BillItemType[]>([]);
  const searchRef = useRef(null); // Create a reference for the search input
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [draftBillsState, setDraftBillsState] = React.useState<draftBillType[]>(
    [],
  );

  const handleKeyDown = (event: KeyboardEvent) => {
    // Check if Ctrl + D is pressed
    event.preventDefault()
    if (event.ctrlKey && event.key === 'd') {
      // Simulate click on the DrawerTrigger element
      if(drawerTriggerRef && drawerTriggerRef.current) {
        drawerTriggerRef.current.click();
      }
    }
    if (event.ctrlKey && event.key === 'p') {
      // Simulate click on the DrawerTrigger element
      event.preventDefault()
      printBill()
    }
    if (event.ctrlKey && event.key === 'h') {
      // Simulate click on the DrawerTrigger element
      event.preventDefault()
      holdBill()
    }
    console.log(event.key)
    if (event.ctrlKey && event.key === ' ') {
      // Simulate click on the DrawerTrigger element
      event.preventDefault()
      setBill([])
    }
  };

  React.useEffect(() => {
    // Add event listener for keydown
    document.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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

  const getDrafts = () => {
    let draftBillsArray: draftBillType[] = [];
    const draftBills = localStorage.getItem("draftBills");
    if (draftBills) {
      draftBillsArray = JSON.parse(draftBills);
      setDraftBillsState(draftBillsArray?.reverse());
    } else {
      setDraftBillsState(draftBillsArray);
    }
  };

  const deleteAllDrafts = () => {
    localStorage.setItem("draftBills", JSON.stringify([]));
    toast("Deleted all drafts");
    setDraftBillsState([]);
  };

  const holdBill = () => {
    if (bills.length > 0) {
      const draftBills = localStorage.getItem("draftBills");
      if (draftBills) {
        let draftBillsArray: draftBillType[] = JSON.parse(draftBills);
        draftBillsArray = draftBillsArray.concat({
          billId: Date.now().toString(),
          billItems: bills,
          total,
        });
        localStorage.setItem("draftBills", JSON.stringify(draftBillsArray));
      } else {
        localStorage.setItem(
          "draftBills",
          JSON.stringify([
            {
              billId: Date.now().toString(),
              billItems: bills,
              total,
            },
          ]),
        );
      }
      setBill([]);
    } else {
      toast("No items in bill list");
    }
  };

  const printBill = () => {
    // This function could fetch data from your backend or use local state
    // to retrieve bill items and total. For this example, I'll use sample data.
    const localBills = localStorage.getItem("bills");
    if (localBills) {
      let billArray: any[] = JSON.parse(localBills);
      billArray = billArray.concat({
        billId: Date.now().toString(),
        billItems: bills,
        total,
      });
      localStorage.setItem("bills", JSON.stringify(billArray));
    } else {
      localStorage.setItem(
        "bills",
        JSON.stringify([
          {
            billId: Date.now().toString(),
            billItems: bills,
            total,
          },
        ]),
      );
    }
    const billItems = bills;
    const totalAmount = total;

    const printContent = `
    <html>
<head>
  <title>Bill</title>
  <style>
    /* Styles for the bill */
    body {
      font-family: monospace;
      padding: 0;
      font-size: 15px;
      font-weight: 600;
      -webkit-font-smoothing: none; /* Disable font smoothing */
      font-smoothing: none;
      width: 72mm; /* Set width to 72mm */
    }
    @media print {
      body {
        margin: 0;
        padding: 1mm; /* Add padding for better visual appearance */
      }
    }
    .bill {
      border: 1px solid #ccc;
      padding: 2mm;
      max-width: 72mm;
      margin: 0 auto;
    }
    .restaurant-name {
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 10px;
    }
    .center {
      margin-top: 5px;
      text-align: center;
    }
    .bill-items {
      margin-bottom: 20px;
    }
    .bill-items table {
      width: 100%;
      border-collapse: collapse;
    }
    .bill-items th, .bill-items td {
      padding: 5px 0;
      text-align: left;
    }
    .item-separator {
      border-bottom: 1px dashed #000;
    }
    .total {
      font-weight: bold;
      text-align: right;
      padding-top: 10px;
    }
    .personal-message {
      font-style: italic;
      text-align: center;
      margin-top: 20px;
    }
    .footer {
      font-size: 12px;
      text-align: center;
      margin-top: 5px;
    }
  </style>
</head>
<body>
  <div class="bill">
  <img src="/coffeehouselogo.jpg" alt="Restaurant Logo" style="display: block; margin: 0 auto; max-width: 80%;" />
  <div class="restaurant-name">Edaikazhinadu Coffee House</div>
  <div class="center item-separator" style="margin-bottom: 5px;font-size: 14px;"><span>Vilambur, ECR, Phone: 9715019994</span></div>

    <div class="bill-items">
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Rs</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${billItems
            .map(
              (item) => `
                <tr class="item-separator">
                  <td style="font-weight: 600;">${item.item.title?.toUpperCase()}</td>
                  <td style="text-align: center;font-weight: 600;">${
                    item.quantity
                  }</td>
                  <td style="text-align: right;font-weight: 600;">${
                    item.item.price != null ? Number(item.item.price) : 0
                  }</td>
                  <td style="text-align: right;font-weight: 600;">${
                    item.item.price != null
                      ? Number(item.item.price) * Number(item.quantity)
                      : 0
                  }</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <div class="total">
      Total: ${totalAmount}
    </div>
    
    <div class="personal-message">
      பகுத்துண்டு பல்லுயிர் ஓம்புதல்
    </div>
    
    <div class="footer">
    - @edaikazhinadu_coffee_house -
    </div>
  </div>
  <script>
    // Automatically trigger print dialog when the window loads
    window.onload = function() {
      function getCurrentDateTime() {
        const now = new Date();
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return now.toLocaleDateString('en-US', options);
      }
  
      // Insert the current date and time into the bill
      const currentDate = getCurrentDateTime();
      const dateTimeElement = document.createElement('div');
      dateTimeElement.innerText = currentDate;
      dateTimeElement.classList.add('center');
      dateTimeElement.classList.add('item-separator');
      document.querySelector('.bill').insertBefore(dateTimeElement, document.querySelector('.restaurant-name'));
  
      // Trigger print dialog after modifying the bill content
      window.print();
    };
  </script>
</body>
</html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  };

  const handleButtonClick = (event: string) => {
    // alert('These buttons are not functional as of now')
    toast("Not functional");
  };

  const compareStrings = (searchText: string, itemText: string): boolean => {
    if (searchText.length > itemText.length) return false;

    let i = 0;
    let j = 0;

    while (i < searchText.length && j < itemText.length) {
      if (searchText[i] === itemText[j]) {
        i++;
      }
      j++;
    }

    return i === searchText.length;
  };

  if (isLoading)
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-black text-white">
        Loading...
      </div>
    );

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <Layout title="Home" description="Home page">
        <div className="w-1/2 p-2">
          {/* Your left column content here */}
          <div className="flex h-[10%] flex-row items-center">
            {/* <ComboboxDemo /> */}
            <Input
              ref={searchRef}
              placeholder="Search..."
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
            {
              <Button
                variant={"secondary"}
                className="ml-3"
                onClick={() => {
                  setSearch("");
                  setFilteredData(data);
                }}
              >
                <XOctagon size={14} color="red" />
              </Button>
            }
            {
              <Link href="/manage-menu">
                <Button variant={"outline"} className="ml-3">
                  <Plus size={14} />
                </Button>
              </Link>
            }
          </div>
          <div className="grid h-[90%] grid-cols-1 gap-2 overflow-y-scroll md:grid-cols-3 lg:grid-cols-4">
            {filteredData.map((item, index) => (
              <div
                onClick={() => onSelect(item)}
                key={index}
                className={`border-sm flex h-20 flex-col items-center justify-between rounded-md bg-card px-2 py-4 text-sm  ${
                  selectedIndex === index ? "bg-yellow-500" : ""
                }`}
              >
                <p className="text-xs font-semibold">{item.title}</p>
                <p className="text-xs text-gray-500">{`₹${item.price}`}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="h-88vh flex w-1/2 flex-col p-2">
          {/* Your right column content here */}
          <div className="h-[86%] overflow-x-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Item</TableHead>
                  <TableHead className="w-[100px] text-left">Price</TableHead>
                  <TableHead className="w-[100px] text-center">
                    Quantity
                  </TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.map((billItem, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="p-1 font-medium">
                      {billItem.item.title}
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="string"
                        value={billItem.item.price ? billItem.item.price : "0"}
                        onChange={(e) =>
                          setBill((prev) =>
                            prev.map((bill, i) =>
                              i === idx
                                ? {
                                    ...bill,
                                    item: {
                                      ...bill.item,
                                      price: e.target.value,
                                    },
                                  }
                                : bill,
                            ),
                          )
                        }
                      />
                      {/* {billItem.item.price} */}
                    </TableCell>
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
                    <TableCell className="p-1 text-right">
                      {Number(billItem.item.price) * billItem.quantity}
                    </TableCell>
                    <TableCell className="p-1 text-right">
                      <Button
                        variant={"outline"}
                        onClick={() =>
                          setBill((prev) => prev.filter((_, i) => i !== idx))
                        }
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex h-[14%] flex-col justify-end">
            <div>
              <div className="text-right">
                {" "}
                {bills.length > 0 ? <b>TOTAL: {total}</b> : <b>TOTAL: 0</b>}
              </div>
              <div className="grid grid-cols-5 gap-4 lg:pt-4">
                <button
                  onClick={() => {
                    setBill([]);
                    toast("Cleared bill");
                  }}
                  className="rounded-md text-xs bg-yellow-900 py-2 text-white hover:bg-yellow-600"
                >
                  Clear(Ctrl+space)
                </button>
                <button
                  onClick={() => handleButtonClick("Discount")}
                  className="rounded-md bg-purple-500 py-2 text-white hover:bg-purple-600"
                >
                  Discount
                </button>
                <button
                  onClick={() => {
                    holdBill();
                  }}
                  className="rounded-md bg-gray-500 py-2 text-white hover:bg-gray-600"
                >
                  Hold (Ctrl+H)
                </button>
                <Drawer>
                  <DrawerTrigger
                    ref={drawerTriggerRef}
                    onClick={() => getDrafts()}
                    className="rounded-md bg-red-500 py-2 text-white hover:bg-red-600"
                  >
                    Drafts(Ctrl+D)
                  </DrawerTrigger>
                  <DrawerContent>
                    {/* <DrawerHeader>
                      <DrawerTitle className="mx-48">Draft bills</DrawerTitle>
                      <DrawerDescription></DrawerDescription>
                    </DrawerHeader> */}
                    <div className="flex flex-row justify-center p-4">
                      <ScrollArea className="flex h-96 w-[75%] items-center p-2">
                        {
                          <div className="text-right mr-4">
                            <ConfirmDialog
                              onClickYes={deleteAllDrafts}
                              title="Delete all drafts"
                            />
                          </div>
                        }
                        <Accordion
                          type="single"
                          collapsible
                          className="w-[98%] text-center"
                        >
                          {draftBillsState.map(
                            (bill: draftBillType, idx: number) => (
                              <div key={idx} className="flex flex-row w-full items-center m-2 justify-between bg-neutral-800 rounded-md">
                                <AccordionItem
                                  className="w-[90%] border-none p-1"
                                  
                                  value={bill.billId ? bill.billId : ""}
                                >
                                  <AccordionTrigger className="border-none">
                                    <span>{bill.billId}</span>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead className="w-[200px] text-left">
                                            Name
                                          </TableHead>
                                          <TableHead></TableHead>
                                          <TableHead>Qty</TableHead>
                                          <TableHead className="text-right">
                                            Amount
                                          </TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {bill.billItems.map(
                                          (billItem: BillItemType) => (
                                            <TableRow key={billItem.item.id}>
                                              <TableCell className="font-medium text-left">
                                                {billItem.item.title}
                                              </TableCell>
                                              <TableCell>{""}</TableCell>
                                              <TableCell className="text-left">
                                                {billItem.quantity}
                                              </TableCell>
                                              <TableCell className="text-right">
                                                {billItem.item.price}
                                              </TableCell>
                                            </TableRow>
                                          ),
                                        )}
                                      </TableBody>
                                    </Table>
                                  </AccordionContent>
                                </AccordionItem>
                                <Button
                                    className=" mr-2"
                                    onClick={() => {
                                      setBill([...bill.billItems]);
                                    }}
                                  >
                                    Restore
                                  </Button>
                              </div>
                            ),
                          )}
                        </Accordion>
                      </ScrollArea>
                    </div>
                  </DrawerContent>
                </Drawer>

                <button
                  onClick={() => {
                    printBill();
                    toast("Billing success");
                  }}
                  className="rounded-md bg-green-500 py-2 text-white hover:bg-green-600"
                >
                  Print (Ctrl+P)
                </button>
                {/* Add more buttons for various POS actions */}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
