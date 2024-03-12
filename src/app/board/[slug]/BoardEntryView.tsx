import { Button, TextField } from "@radix-ui/themes";
import { useState } from "react";

interface BoardEntryPageProps {
  boardName: string;
  boardId: string;
  setUserName: (username: string) => void;
  setHasJoined: (hasJoined: boolean) => void;
  passwordRequired: boolean;
}

export default function BoardEntryView(props: BoardEntryPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  console.log("boardId", props.boardId);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const response = await fetch(`/api/board/join/${props.boardId}`, {
      method: "POST",
      body: JSON.stringify({ boardId: props.boardId, enteredPassword: password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.status);
    if (response.ok) {
      // redirect here
      console.log("testing123")
      console.log("joined successfully");
      props.setHasJoined(true);
    } else {
      console.error("Failed to join board");
    }
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      <form onSubmit={submitForm}>
        <h1> Welcome to {props.boardName} </h1>
        <h1> Please provide a username </h1>
        <TextField.Input value={username} onChange={(e) => setUsername(e.target.value)} />
        {
          props.passwordRequired ? (
            <div>
              <h1> Please provide the password </h1>
              <TextField.Input onChange={(e) => setPassword(e.target.value)} />
            </div>
          ) : null
        }
        <Button size="3" variant="soft">
          {" "}
          Join{" "}
        </Button>
      </form>
    </div>
  );
}
