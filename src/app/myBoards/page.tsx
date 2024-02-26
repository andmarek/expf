"use client";
import { useUser } from "@clerk/clerk-react";

import React, { useEffect, useState } from "react";
import { Heading, Table, Button, Container, Link } from "@radix-ui/themes";

export default function ControlPanel() {
  const [boards, setBoards] = useState([]);

  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
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

        const boards = jsonData.Items;
        setBoards(boards);
      } catch (error) {
        console.error("Error initializing board page.");
      }
    };
    fetchData();
  }, [userId]);

  async function handleDeleteBoard(boardId: string) {
    const newBoards = boards.filter((board) => board.BoardId["S"] !== boardId);
    setBoards(newBoards);
    try {
      const response = await fetch("/api/board", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boardId,
        }),
      });
      if (response.ok) {
        const data = await response.json();
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
            </Table.Row>
            {boards.map((board) => (
              <Table.Row key={board.BoardId["S"]}>
                <Table.Cell>
                  <Link
                    href={`/board/${board.BoardId["S"]}`}
                    className="transition-all duration-300 text-lg px-4"
                  >
                    {board.BoardName["S"]}
                  </Link>
                </Table.Cell>
                <Table.Cell>{board.BoardDescription["S"]}</Table.Cell>
                <Table.Cell>
                  <Button key={board.BoardId["S"] + "edit"} className="mx-2">
                    {" "}
                    Edit{" "}
                  </Button>
                  <Button
                    key={board.BoardId["S"] + "delete"}
                    className="mx-2"
                    onClick={() => handleDeleteBoard(board.BoardId["S"])}
                  >
                    {" "}
                    Delete{" "}
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Header>
        </Table.Root>
      </Container>
    </div>
  );
}
