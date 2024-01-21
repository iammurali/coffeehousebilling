import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import React from "react";
import { type RouterOutputs } from "~/utils/api";

type MenuItemType = RouterOutputs["menu"]["getAll"][number];

export function MenuSearchEmbed({
  data,
  onSelect,
}: {
  data: MenuItemType[];
  onSelect: (item: MenuItemType) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput autoFocus placeholder="Type a command or search..." />
      {
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {data.map((item) => (
              <CommandItem
                onSelect={() => {
                  onSelect(item);
                  // console.log(item.title, item.price);
                }}
                key={item.id}
              >
                <span>{item.title}</span>
                <CommandShortcut>{item.price}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      }
    </Command>
  );
}
