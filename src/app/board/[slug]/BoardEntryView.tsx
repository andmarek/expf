import { Button, TextField } from "@radix-ui/themes";

interface BoardEntryPageProps {
  boardName: string;
  setUserName: (username: string) => void;
  setHasJoined: (hasJoined: boolean) => void;
  passwordRequired: boolean;
}

export default function BoardEntryView(props: BoardEntryPageProps) {
  return (
    <div className="flex flex-col items-center space-y-3">
      <h1> Welcome to {props.boardName} </h1>
      <h1> Please provide a username </h1>
      <TextField.Input onChange={(e) => props.setUserName(e.target.value)} />
      <Button onClick={() => props.setHasJoined(true)} size="3" variant="soft">
        {" "}
        Join{" "}
      </Button>
      {
        props.passwordRequired ? (
          <div>
            <h1> Please provide the password </h1>
            <TextField.Input />
          </div>
        ) : null
      }
    </div>
  );
}
