import { Switch } from "@radix-ui/themes";
import { ChevronRightIcon } from "@radix-ui/react-icons";

export default function SideBar({
  boardId,
  switchBlurCardText,
  showSidebar,
  setShowSidebar,
}) {
  const sidebarWidthPx = "250";

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
