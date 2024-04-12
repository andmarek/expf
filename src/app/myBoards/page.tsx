"use client";
import { useUser } from "@clerk/clerk-react";

import React, { useEffect, useState } from "react";
import {
  Button,
  Link,
} from "@radix-ui/themes";

import { MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons";


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
      <div className="flex flex-col self-center space-x-2 w-11/12 sm:w-3/4">
        <SearchBar handleSearch={handleSearch} />
        <BoardGrid boards={filteredBoards} passwordCache={passwordCache} handleDeleteBoard={handleDeleteBoard} revealBoardPassword={revealBoardPassword} removeBoardPasswordFromView={removeBoardPasswordFromView} />
      </div>
    </div>
  );
  
  function SearchBar({ handleSearch }) {
    return (
      <div className="flex flex-row px-2 py-2 items-center space-x-2 justify-center">
        <div className="flex flex-row border-base-900 border rounded-md items-center space-x-2">
          <MagnifyingGlassIcon className="mx-2 text-base-850" />
          <input
            onChange={handleSearch}
            className="text-lg sm:text-xl bg-base-black rounded-md outline-none p-2"
            placeholder="Search boards..."
          />
        </div>
        <form action="/create">
          <Button size="2" variant="soft"><PlusIcon /></Button>
        </form>
      </div>
    );
  }
  
  function BoardGrid({ boards, passwordCache, handleDeleteBoard, revealBoardPassword, removeBoardPasswordFromView }) {
    return (
      <div className="flex justify-center items-center w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mx-auto">
          {boards.map((board) => (
            <BoardCard
              key={board.BoardId}
              board={board}
              passwordCache={passwordCache}
              handleDeleteBoard={handleDeleteBoard}
              revealBoardPassword={revealBoardPassword}
              removeBoardPasswordFromView={removeBoardPasswordFromView}
            />
          ))}
        </div>
      </div>
    );
  }
  
  function BoardCard({ board, passwordCache, handleDeleteBoard, revealBoardPassword, removeBoardPasswordFromView }) {
    return (
      <div className="flex flex-col p-2 border border-base-800 rounded-lg hover:border-base-600 transition-all duration-300 w-full min-h-[16rem]">
        <Link href={`/board/${board.BoardId}`}>
          <a className="text-lg">{board.BoardName}</a>
        </Link>
        <span className="italic text-sm sm:text-base">
          {new Date(board.DateCreated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        {board.RequirePassword && (
          <p className="font-bold">
            Password: {passwordCache[board.BoardId]?.showPassword ? passwordCache[board.BoardId].boardPassword : "Hidden"}
          </p>
        )}
        <div className="flex items-center med:space-x-2 mt-2 lg:flex-row sm:flex-col lg:space-y-0 sm:space-y-2">
          {board.RequirePassword && (
            <Button variant="soft" className="cursor-pointer" onClick={() => passwordCache[board.BoardId]?.showPassword ? removeBoardPasswordFromView(board.BoardId) : revealBoardPassword(board.BoardId)}>
              {passwordCache[board.BoardId]?.showPassword ? "Hide Password" : "Show Password"}
            </Button>
          )}
          <Button variant="soft" className="cursor-pointer" onClick={() => handleDeleteBoard(board.BoardId)}>Delete</Button>
          <Button variant="soft">
            <Link href={`/board/${board.BoardId}/settings`}>
              <a className="btn-variant-soft cursor-pointer">Settings</a>
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  
}
