"use client";

import React, { useEffect, useState } from "react";
import {
  Heading,
  Table,
  Button,
  Container,
  Link,
} from "@radix-ui/themes";

export default function ControlPanel() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
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
  }, []);

  async function handleDeleteBoard(boardName: string) {
    const newBoards = boards.filter((board) => board.Name["S"] !== boardName);
    setBoards(newBoards);
    try {
      const response = await fetch("/api/board", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boardName: boardName,
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
    <div>
      <Heading weight="bold" align="center" color="purple">
        My Boards
      </Heading>
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
              <Table.Row key={board.Name["S"]}>
                <Table.Cell>
                  <Link
                    href={`/board/${board.Name["S"]}`}
                    className="transition-all duration-300 text-lg px-4"
                  >
                    {board.Name["S"]}
                  </Link>
                </Table.Cell>
                <Table.Cell>{board.BoardDescription["S"]}</Table.Cell>
                <Table.Cell>
                  <Button key={board.Name["S"] + "edit"} className="mx-2">
                    {" "}
                    Edit{" "}
                  </Button>
                  <Button
                    key={board.Name["S"] + "delete"}
                    className="mx-2"
                    onClick={() => handleDeleteBoard(board.Name["S"])}
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
