/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Plus, Trash2, XOctagon } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";
import { AddMenuForm } from "~/components/addmenuform";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Layout } from "~/layout/layout";

import { type RouterOutputs } from "~/utils/api";

type MenuItemType = RouterOutputs["menu"]["getAll"][number];

type BillItemType = {
  item: MenuItemType;
  quantity: number;
};

export default function Home() {
  

  return (
    <>
      <Layout title="Home" description="Home page">
        <div className="flex flex-row container mt-10">
            <AddMenuForm />
            <div className="ml-10">
                Menu list comes here
            </div>
        </div>
        
      </Layout>
    </>
  );
}
