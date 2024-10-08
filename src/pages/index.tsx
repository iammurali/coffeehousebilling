/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Minus, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Layout } from "~/layout/layout";
import {
  Table,
  TableBody,
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
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ConfirmDialog } from "~/components/alertdialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generatePrintContent } from "~/utils/constants";
import { type BillItemType } from "~/utils/common-types";
import { Separator } from "~/components/ui/separator";

// import { ComboboxDemo } from "~/components/menuSearchPopup";

type MenuItemType = RouterOutputs["menu"]["getAll"][number];



type draftBillType = {
  billId?: string;
  billItems: BillItemType[];
  total: number;
};

export default function Home() {
  const drawerTriggerRef = useRef<HTMLButtonElement>(null);
  const printTriggerRef = useRef<HTMLButtonElement>(null);
  const [filteredData, setFilteredData] = React.useState<MenuItemType[]>([]);
  const [search, setSearch] = React.useState("");
  const { isLoading, data, error } = api.menu.getAll.useQuery();
  const [bills, setBill] = React.useState<BillItemType[]>([]);
  const searchRef = useRef<HTMLInputElement>(null); // Create a reference for the search input
  const [draftBillsState, setDraftBillsState] = React.useState<draftBillType[]>(
    [],
  );
  const [favoriteItems, setFavoriteItems] = React.useState<MenuItemType[]>([])
  const bottomEl = useRef<HTMLTableSectionElement>(null);

  const scrollToBottom = () => {
    // bottomEl?.current?.scrollIntoView({ behavior: 'smooth' });
    const lastElement = bottomEl?.current?.lastElementChild;
    console.log(lastElement, 'last elemetn')
    lastElement?.scrollIntoView({ behavior: 'smooth' })
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleKeyDown = (event: KeyboardEvent) => {
    // console.log('event key pressed:::', event.key);
    // Check if Ctrl + D is pressed
    if (event.ctrlKey && event.key === 'd') {
      event.preventDefault()

      // Simulate click on the DrawerTrigger element
      // if(drawerTriggerRef && drawerTriggerRef.current) {
      drawerTriggerRef?.current?.click();
      // }
    }
    if (event.ctrlKey && event.key === 'p') {
      // Simulate click on the DrawerTrigger element
      event.preventDefault()
      printTriggerRef?.current?.click()
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
    if (event.key === ' ') {
      // Simulate click on the DrawerTrigger element
      // event.preventDefault()
      console.log('set focus to input')
      searchRef.current?.focus()
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

  React.useEffect(() => {
    const existingFavItems = localStorage.getItem('favItems')
    if (existingFavItems) {
      const parsedExistingFavItems: MenuItemType[] = JSON.parse(existingFavItems);
      if (existingFavItems) {
        setFavoriteItems(parsedExistingFavItems)
      }
    }

  }, []);

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
    // TODO: Make this setting enabled via environment variable or variable from local storage or a class variable
    scrollToBottom()
    setSearch('')
    searchRef.current?.focus()
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
    console.log(bills, 'billls +', bills.length)
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
      console.log(bills)
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

    const printContent = generatePrintContent(billItems, totalAmount);

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  };

  const handleButtonClick = (_event: string) => {
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
        <div className="w-1/2 p-2 mr-1 88vh border rounded-l-sm border-stone-800">

          {/* Your left column content here */}
          <div className="flex h-[7%] flex-row items-center">
            {/* <ComboboxDemo /> */}
            <Input
              ref={searchRef}
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
          </div>
          <div className="grid h-[60%] grid-cols-1 gap-2 overflow-auto overflow-y-scroll md:grid-cols-3 lg:grid-cols-4 my-2">
            {filteredData.map((item, index) => (
              <Button
                onClick={() => onSelect(item)}
                key={index}
                className={`border-sm flex-grow h-20 min-w-0 flex-col items-center justify-between rounded-md bg-card px-2 py-4 text-sm`}
              >
                <p className="text-xs font-semibold text-gray-50">{item.title}</p>
                <p className="text-xs text-gray-500">{`₹${item.price}`}</p>
              </Button>
            ))}
          </div>
          {/* favorites */}
          <Separator className="my-2" />
          <div className="grid h-[29%]  grid-cols-1 gap-1 md:grid-cols-3 lg:grid-cols-4 p-1 hover:overflow-y-scroll">

            {favoriteItems.slice(0, 20).map((item, index) => (
              <Button
                onClick={() => onSelect(item)}
                key={index}
                className={`border-sm min-w-0 h-12 rounded-md bg-card px-2 py-4 text-sm`}
              >
                <p className="text-sm font-semibold text-gray-50">{item.title}</p>
              </Button>
            ))}
          </div>
        </div>
        <div className="h-88vh border rounded-r-sm border-stone-800 flex w-1/2 flex-col p-3">
          {/* Your right column content here */}
          <div className="h-[86%] overflow-x-hidden">
            <Table >
              <TableHeader className="border border-stone-800 bg-stone-700">
                <TableRow className="border-stone-800">
                  <TableHead className="text-left">Item</TableHead>
                  <TableHead className="w-[100px] text-left">Price</TableHead>
                  <TableHead className="w-[100px] text-center">
                    Quantity
                  </TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody ref={bottomEl}>
                {bills.map((billItem, idx) => (
                  <TableRow key={idx} className="border-stone-800">
                    <TableCell className="px-1 py-0 font-medium">
                      {billItem.item.title}
                    </TableCell>
                    <TableCell className="px-1 py-0">
                      <Input
                        type="string"
                        className="m-1"
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
                    <TableCell className="py-0 m-1 whitespace-nowrap flex">
                      <Button onClick={() => setBill((prev) =>
                        prev.map((bill, i) =>
                          i === idx
                            ? {
                              ...bill,
                              quantity: bill.quantity - 1,
                            }
                            : bill,
                        ),
                      )} disabled={billItem.quantity == 0} variant="outline" size="icon">
                        <Minus />
                      </Button>
                      <Input
                        type="number"
                        max={900}
                        min={1}
                        inputMode="numeric"
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
                      <Button onClick={() => setBill((prev) =>
                        prev.map((bill, i) =>
                          i === idx
                            ? {
                              ...bill,
                              quantity: bill.quantity + 1,
                            }
                            : bill,
                        ),
                      )} variant="outline" size="icon">
                        <Plus />
                      </Button>
                    </TableCell>

                    <TableCell className="py-0 px-1 text-right">
                      {Number(billItem.item.price) * billItem.quantity}
                    </TableCell>
                    <TableCell className="px-1 py-0 text-right">
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
                {/* <div ref={bottomEl}></div> */}
                <div style={{ height: '5rem' }} />
              </TableBody>
            </Table>
          </div>
          <div className="flex h-[14%] flex-col justify-end">
            <div>
              <div className="text-right font-bold">
                {bills.length > 0 ? <b>TOTAL: {total}</b> : <b>TOTAL: 0</b>}
              </div>
              <div className="grid grid-cols-5 gap-4 lg:pt-1">
                <Button
                  onClick={() => {
                    setBill([]);
                    toast("Cleared bill");
                  }}
                  variant="destructive"
                  className="rounded-md text-xs py-2 text-white hover:bg-gray-600"
                >
                  Clear (Ctrl+Space)
                </Button>
                <Button
                  onClick={() => handleButtonClick("Bills")}
                  variant={'secondary'}
                  className="rounded-md py-2 bg-gray-600 text-white hover:bg-indigo-800"
                >
                  Bills
                </Button>
                <Button
                  onClick={() => {
                    holdBill();
                  }}
                  variant={'outline'}
                  className="rounded-md bg-gray-600 text-xs py-2 text-white hover:bg-gray-800"
                >
                  Hold
                  (Ctrl+H)
                </Button>
                <Drawer>
                  <DrawerTrigger
                    ref={drawerTriggerRef}
                    onClick={() => getDrafts()}
                    className="rounded-md bg-gray-600 text-xs py-2 text-white hover:bg-gray-800"
                  >
                    Drafts(Ctrl+D)
                  </DrawerTrigger>
                  <DrawerContent>
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
                <Button
                  ref={printTriggerRef}
                  onClick={() => {
                    printBill();
                    toast("Billing success");
                  }}
                  className="rounded-md  text-xs py-2 text-white hover:bg-gray-800"
                >
                  Print (Ctrl+P)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}


