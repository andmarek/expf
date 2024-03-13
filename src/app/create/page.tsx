"use client";

import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ColumnsInput from "./ColumnsInput";
import {
  Text,
  Checkbox,
  Heading,
  Button,
  Flex,
  TextField,
} from "@radix-ui/themes";
import { v4 } from "uuid";

export default function Create() {
  const router = useRouter();

  const [requirePassword, setRequirePassword] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [boardConfig, setBoardConfig] = useState<{
    boardName: string,
    boardDescription: string,
    columnsInput: { [key: number]: { columnName: string } },
  }>({
    boardName: "",
    boardDescription: "",
    columnsInput: {},
  });

  const { user } = useUser();

  function onColumnTextChange(value: string, index: number) {
    setBoardConfig(prevBoardConfig => ({
      ...prevBoardConfig,
      columnsInput: {
        ...prevBoardConfig.columnsInput,
        [index]: { columnName: value },
      },
    }));
  };

  function setAllBoardColumns(newColumnsInput) {
    setBoardConfig(prevBoardConfig => ({
      ...prevBoardConfig,
      columnsInput: newColumnsInput
    })
    )
  }

  function removeColumnById(columnId: number) {
    console.log("ColumnId to remove", columnId);
    const updatedObject = {
      ...boardConfig,
      columnsInput: {
        ...boardConfig.columnsInput
      }
    };
    if (updatedObject.columnsInput[columnId]) {
      delete updatedObject.columnsInput[columnId];
    }

    setBoardConfig(updatedObject);
    console.log(boardConfig);
  };


  function handleBoardAttributeChange(inputValue) {
    setBoardConfig((prevBoardConfig) => ({
      ...prevBoardConfig,
      ...inputValue,
    }));
  }

  function generateBoardId() {
    return v4();
  }

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsLoading(true);

    const boardId: string = generateBoardId();

    try {
      const response = await fetch("/api/board", {
        method: "PUT",
        body: JSON.stringify({
          boardConfig: boardConfig,
          boardId: boardId,
          userId: user.id,
          requirePassword: requirePassword
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseBodyJson = await response.json();

      if (response.ok) {
        router.push(`/board/${boardId}`);
      } else {
        console.error("Server responded with an error: ", responseBodyJson);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center space-y-3 section-create">
      <form className="flex flex-col w-96" onSubmit={submitForm}>
        <Heading size="6" className="self-center py-4">
          {" "}
          Create a New Board{" "}
        </Heading>
        <div className="flex flex-col">
          <Flex
            direction="column"
            gap="3"
            className="bg-base-950 rounded-md p-3"
          >
            <Heading> Board Title </Heading>
            <TextField.Input
              name="boardName"
              className="m-2"
              type="text"
              placeholder="Enter a title"
              onChange={(e) =>
                handleBoardAttributeChange({ boardName: e.target.value })
              }
            ></TextField.Input>
            <Heading> Board Details </Heading>
            <TextField.Input
              name="boardDescription"
              className="m-2"
              type="text"
              placeholder="Enter a Description"
              onChange={(e) =>
                handleBoardAttributeChange({ boardDescription: e.target.value })
              }
            ></TextField.Input>
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox color="cyan" variant="classic" defaultChecked onClick={() => setRequirePassword(!requirePassword)} /> Secure Board with Password
              </Flex>
            </Text>
            <Button size="3" variant="soft">
              {isLoading ? "Loading..." : "Create"}
            </Button>
          </Flex>
        </div>
      </form>
      <ColumnsInput handleRemoveColumn={removeColumnById} handleColumnTextChange={onColumnTextChange} onTemplateSet={setAllBoardColumns} />
    </div>
  );
}
