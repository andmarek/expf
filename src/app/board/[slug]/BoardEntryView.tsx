import { Button, TextField } from "@radix-ui/themes";
import { useEffect, useState } from "react";

interface BoardEntryPageProps {
  boardName: string;
  boardId: string;
  setUserName: (username: string) => void;
  setHasJoined: (hasJoined: boolean) => void;
  setPasswordRequired: (isPasswordRequired: boolean) => void;
  saveUserBoardAccess: (boardId: string, username: string) => void;
}

export default function BoardEntryView(props: BoardEntryPageProps) {
  const [boardName, setBoardName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRequired, setPasswordRequired] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMetadata(boardId: string) {
      const response = await fetch(`/api/board/${boardId}/metadata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const boardMetadata = await response.json();
        console.log(boardMetadata);

        setBoardName(boardMetadata.boardName);
        setPasswordRequired(boardMetadata.passwordRequired);
        props.setPasswordRequired(boardMetadata.passwordRequired);

        setIsLoading(false);
      } else {
        throw new Error("Error fetching board data.");
      }
    }
    fetchMetadata(props.boardId);
  }, [boardName, passwordRequired, isLoading, props]);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Form submitted!", { username, password, passwordRequired });
    
    // Validate required fields
    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }
    
    if (passwordRequired && !password.trim()) {
      alert("Please enter the password");
      return;
    }
    
    props.setUserName(username);
    
    try {
      const response = await fetch(`/api/board/join/${props.boardId}`, {
        method: "POST",
        body: JSON.stringify({ boardId: props.boardId, enteredPassword: password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseJson = await response.json();
      console.log("Join response:", responseJson);
      
      if (response.ok) {
        // redirect here
        props.setHasJoined(true);
        props.saveUserBoardAccess(props.boardId, username);
      } else {
        console.error("Failed to join board:", responseJson);
        alert("Failed to join board: " + (responseJson.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error occurred. Please try again.");
    }
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      {!isLoading ? (
        <form className="flex flex-col space-y-2" onSubmit={submitForm}>
          <h1> Joining {boardName} </h1>
          <h1> Please provide a username </h1>
          <TextField.Input value={username} onChange={(e) => setUsername(e.target.value)} />
          {
            passwordRequired ? (
              <div>
                <h1> Please provide the password </h1>
                <TextField.Input onChange={(e) => setPassword(e.target.value)} />
              </div>
            ) : null
          }
          <Button type="submit" size="3" variant="soft">
            {" "}
            Join{" "}
          </Button>
        </form>
      ) : (< div> Loading... </div>)
      }
    </div>
  );
}
