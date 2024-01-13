import { RouterOutputs } from "./api";

export type MenuItemType = RouterOutputs["menu"]["getAll"][number];

export type BillItemType = {
    item: MenuItemType;
    quantity: number;
};