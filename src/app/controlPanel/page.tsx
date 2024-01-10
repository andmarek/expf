"use client";

import React, { useEffect, useState } from "react";
import { Heading, Flex, Text, Table, Button, Container } from "@radix-ui/themes";
import { Pencil1Icon, TrashIcon, CheckIcon } from "@radix-ui/react-icons";

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
  return (
    <div>
      <Heading weight="bold" align="center" color="purple">
        Control Panel
      </Heading>
      <Container size="2">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
                <Table.ColumnHeaderCell> Board Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell> Board Description </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell> Actions </Table.ColumnHeaderCell>
            </Table.Row>
          {boards.map((board) => (
            <Table.Row key={board.Name}>
              <Table.Cell>
                {board.Name["S"]}
              </Table.Cell>
              <Table.Cell>{board.BoardDescription["S"]}</Table.Cell>
              <Table.Cell>
                <Button className="mx-2"> Edit </Button>
                <Button className="mx-2"> Delete </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Header>
        </Table.Root>
      </Container>
    </div>
  );
}
