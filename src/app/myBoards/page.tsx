"use client";
import { useUser } from "@clerk/clerk-react";

import React, { useEffect, useState } from "react";
import {
  Heading,
  Table,
  Button,
  Container,
  Link,
} from "@radix-ui/themes";

import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";



export default function ControlPanel() {
  const [boards, setBoards] = useState([]);
  const { user } = useUser();
  const userId = user?.id;

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

  async function revealBoardPassword(boardId: string) {
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
        setBoards((currentBoards) => {
          return currentBoards.map((board) => {
            if (board.BoardId === boardId) {
              return { ...board, Password: jsonData.password };
            } else {
              return board;
            }
          });
        })
      }
    } catch (error) {
      console.error("Error fetching board password.");
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
      <div className="flex flex-col justify-center">
        <Heading weight="bold" align="center" color="mint" size="8">
          My Boards
        </Heading>
        <form className="my-2 self-center" action="/create">
          <Button size="3"> Create New Board </Button>
        </form>
      </div>
      <Container size="2">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell> Board Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                {" "}
                Board Description{" "}
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell> Actions </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell> Password </Table.ColumnHeaderCell>
            </Table.Row>
            {boards.map((board) => (
              <Table.Row key={board.BoardId}>
                <Table.Cell>
                  <Link
                    href={`/board/${board.BoardId}`}
                    className="transition-all duration-300 text-lg px-4"
                  >
                    {board.BoardName}
                  </Link>
                </Table.Cell>
                <Table.Cell>{board.BoardDescription}</Table.Cell>
                <Table.Cell>
                  <Button key={board.BoardId + "edit"} className="mx-2">
                    {" "}
                    Edit{" "}
                  </Button>
                  <Button
                    key={board.BoardId + "delete"}
                    className="mx-2"
                    onClick={() => handleDeleteBoard(board.BoardId)}
                  >
                    {" "}
                    Delete{" "}
                  </Button>{" "}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col">
                    {
                      (!board.Password ?
                        <EyeOpenIcon onClick={() => revealBoardPassword(board.BoardId)} className="ml-1" /> :
                        <div className="flex flex-row place-items-center space-x-2">
                          <p>{board.Password}</p>
                          <EyeNoneIcon />
                        </div>
                      )
                    }
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Header>
        </Table.Root>
      </Container>
    </div>
  );
}
