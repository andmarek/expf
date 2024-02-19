import { useState } from "react";
import { Switch, TextField } from "@radix-ui/themes";
import { ChevronRightIcon } from "@radix-ui/react-icons";

export default function SideBar({
  switchPasswordRequired,
  switchBlurCardText,
  showSidebar,
  setShowSidebar,
}) {
  const sidebarWidthPx = "250";

  return (
    <div className="flex items-start">
      <div
        className={`top-0 left-0 h-full  border-r transition-transform duration-300 ease-in-out ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: `${sidebarWidthPx}px` }}
      >
        <div className="px-5 py-5">
          <h1>Blur card text</h1>
          <Switch onCheckedChange={switchBlurCardText} />
          <h1>Protect Board with Password</h1>
          <Switch onCheckedChange={switchPasswordRequired} />
          <TextField.Input placeholder="Enter a password" />
        </div>
      </div>
      <ChevronRightIcon
        onClick={() => setShowSidebar(!showSidebar)}
        width="24"
        height="24"
        className={`cursor-pointer absolute top-0 left-0 transition-transform duration-300 ${
          showSidebar ? `rotate-180 transform translate-x-64` : "rotate-0"
        }`}
      />
    </div>
  );
}
