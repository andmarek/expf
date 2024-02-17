import { DropdownMenu, Button } from "@radix-ui/themes";

import { CaretDownIcon } from "@radix-ui/react-icons";

export default function SortDropDown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="soft">
          Sort By
          <CaretDownIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item shortcut="⌘ E">Votes</DropdownMenu.Item>
        <DropdownMenu.Item shortcut="⌘ D">Time</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
