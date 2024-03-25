"use client";
import { useUser } from "@clerk/clerk-react";

import React, { useEffect, useState } from "react";
import {
  Heading,
  Table,
  Button,
  Container,
  Link,
  TextFieldInput
} from "@radix-ui/themes";

import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";


export default function NewBoards() {
  const [boards, setBoards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);

  const { user } = useUser();
  const userId = user?.id;
  const [passwordCache, setPasswordCache] = useState({});

  function handleSearch(event) {
    const searchKeyword = event.target.value.toLowerCase();
    if (searchKeyword === "") {
      // If the search input is empty, fetch the original list of boards
      setFilteredBoards(boards);
    } else {
      const filtered = boards.filter((board) =>
        board.BoardName.toLowerCase().includes(searchKeyword)
      );
      setFilteredBoards(filtered);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/boards", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching board data.");
        }
        const jsonData = await response.json();
        setBoards(jsonData);
        setFilteredBoards(jsonData);
        return jsonData;
      } catch (error) {
        console.error("Error initializing board page.");
      }
    };

    if (userId) {
      fetchData();
    } else {
      return;
    }
  }, [userId]);

  function populatePasswordCache(boardId: string, password: string) {
    setPasswordCache((prevCache) => ({
      ...prevCache,
      [boardId]: {
        boardPassword: password,
        showPassword: true,
      },
    }));
  }

  async function removeBoardPasswordFromView(boardId: string) {
    setPasswordCache((prevCache) => ({
      ...prevCache,
      [boardId]: {
        ...prevCache[boardId],
        showPassword: false,
      },
    }));
  }

  async function revealBoardPassword(boardId: string) {
    if (passwordCache[boardId]) {
      setPasswordCache((prevCache) => ({
        ...prevCache,
        [boardId]: {
          ...prevCache[boardId],
          showPassword: true,
        },
      }));
    } else {
      console.log("Getting from KMS");
      try {
        const response = await fetch(`/api/board/${boardId}/password`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const jsonData = await response.json();
          console.log("jsondata dawg", jsonData);
          populatePasswordCache(boardId, jsonData.password);
        }
      } catch (error) {
        console.error("Error fetching board password.");
      }
    }
  }

  async function handleDeleteBoard(boardId: string) {
    const newBoards = boards.filter((board) => board.BoardId !== boardId);
    setBoards(newBoards);
    try {
      const response = await fetch("/api/board", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boardId,
          userId,
        }),
      });
      if (response.ok) {
        await response.json();
      } else {
        console.error("Error deleting board.");
      }
    } catch (error) {
      console.error("error");
    }
  }

  return (
    <div className="flex flex-col space-y-3 py-2">
      <div className="flex flex-col self-center space-x-2 max-w-2/3">
        <div className="flex flex-row px-2 py-2 items-center justify-between">
          <TextFieldInput
            className="w-96"
            placeholder="Type to filter boards..."
            onChange={handleSearch}
          />
          <form action="/create">
            <Button size="2" variant="soft"> Create New Board </Button>
          </form>
        </div>
        <div className="flex flex-row space-x-4">
          {filteredBoards.map((board) => (
            <div className="flex flex-col p-2 border border-base-800 rounded-lg w-96 h-56 hover:border-base-600 duration-300 transition-all" key={board.BoardId}>
              <div className="flex flex-col justify-between">
                <Link href={`/board/${board.BoardId}`}>
                  <h1 className="text-lg">{board.BoardName}</h1>
                </Link>
                {new Date(board.DateCreated).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              {board.RequirePassword && (
                <p>
                  Password:{' '}
                  {passwordCache[board.BoardId]?.showPassword
                    ? passwordCache[board.BoardId].boardPassword
                    : "Hidden"}
                </p>
              )}
              <div className="flex flex-row space-x-2">
                <Link href={`/board/${board.BoardId}`}>
                  <Button variant="soft" className="cursor-pointer" size="2">View</Button>
                </Link>
                {board.RequirePassword && (
                  <Button variant="soft" className="cursor-pointer" size="2">
                    {passwordCache[board.BoardId]?.showPassword ? (
                      <EyeOpenIcon onClick={() => removeBoardPasswordFromView(board.BoardId)} />
                    ) : (
                      <EyeNoneIcon onClick={() => revealBoardPassword(board.BoardId)} />
                    )}
                  </Button>
                )}
                <Button variant="soft" className="cursor-pointer" size="2" onClick={() => handleDeleteBoard(board.BoardId)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
