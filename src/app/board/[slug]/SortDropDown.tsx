import { DropdownMenu, Button } from "@radix-ui/themes";

import { CaretDownIcon } from "@radix-ui/react-icons";

interface SortDropDownProps {
  selectSortStatus: (sortBy: string) => void;
}

export default function SortDropDown({ selectSortStatus }: SortDropDownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="soft">
          Sort By
          <CaretDownIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={() => selectSortStatus("Likes")} shortcut="⌘ E">Votes</DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => selectSortStatus("Time")} shortcut="⌘ D">Time</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
