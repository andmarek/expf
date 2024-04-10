import { Switch, TextField, Button } from "@radix-ui/themes";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { useState } from 'react';

export default function SideBar({
  boardId,
  switchPasswordRequired,
  switchBlurCardText,
  showSidebar,
  setShowSidebar,
  passwordRequired,
}) {
  const sidebarWidthPx = "250";
  const [currentProposedBoardPassword, setCurrentProposedBoardPassword] = useState("");

  async function setBoardPassword(newBoardPassword: string) {
    try {
      const response = await fetch(`/api/board/${boardId}/password`, {
        method: "PUT",
        body: JSON.stringify({
          boardId,
          newBoardPassword
        })
      }
      )
      const responseBodyJson = await response.json();
      if (response.ok) {
        console.log("Password updated successfully");
      } else {
        console.log("Server responded with an error: ", responseBodyJson);

      }
    } catch (error) {
      console.error("Erorr: ", error);
    }
  }

  console.log("pwd", passwordRequired);
  return (
    <div className="grid col-start-1 row-start-1 items-start">
      <div
        className={`z-50 bg-base-950 h-full border-r transition-transform duration-300 ease-in-out ${showSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
        style={{ width: `${sidebarWidthPx}px` }}
      >
        <div className="px-5 py-5">
          <h1>Blur card text</h1>
          <Switch defaultChecked={false} onCheckedChange={switchBlurCardText} />
          <h1>Protect Board with Password</h1>
          <Switch defaultChecked={passwordRequired} onCheckedChange={switchPasswordRequired} />
          <TextField.Input onChange={(e) => setCurrentProposedBoardPassword(e.target.value)} placeholder="Enter a password" />
          <Button onClick={() => setBoardPassword(currentProposedBoardPassword)} className="mt-2">
            Set Password
          </Button>
        </div>
      </div>
      <ChevronRightIcon
        onClick={() => setShowSidebar(!showSidebar)}
        width="24"
        height="24"
        className={`hover:text-base-600 cursor-pointer absolute top-0 left-0 transition-all duration-300 ${showSidebar ? `rotate-180 transform translate-x-64` : "rotate-0"
          }`}
      />

    </div>
  );
}
