import SortDropDown from "./SortDropDown";

interface BoardStatusBarProps {
  boardName: string;
  userName: string;
  selectSortStatus: (sortBy: string) => void;
}

export default function BoardStatusBar(props: BoardStatusBarProps) {
  return (
    <div className="text-center">
      <div className="flex flex-row justify-center space-x-3">
        <h1 className="text-lg"> Board Name: </h1>
        <h1 className="text-lg text-magenta-light">
          {" "}
          {props.boardName}{" "}
        </h1>
        <h1 className="text-lg"> Username:</h1>
        <h1 className="text-lg text-magenta-light"> {props.userName} </h1>
        <SortDropDown selectSortStatus={props.selectSortStatus} />
      </div>
    </div>
  )
}
