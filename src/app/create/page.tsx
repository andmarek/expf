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

/*
 * Columns need to work like this:
 * {
 *  Board:
 *    BoardName:
 *    BoardDescription:
 *    UseTemplate?
 *      yes --> TemplateName
 *      no --> Columns 
 * }
 *
 *
 * {
 *  "boards": {
 *    description: ""
 *    template: ""
 *    useTemplate: bool
 *    Columns
 *
 *    
 *  }
 * }
 *
 *
 *
 */
export default function Create() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
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
    setFormData(prevFormData => ({
      ...prevFormData,
      columnsInput: {
        ...prevFormData.columnsInput,
        [index]: { columnName: value },
      },
    }));
  };

  function removeColumnById(columnId: number){
    console.log("ColumnId to remove", columnId);
    const updatedObject = {
      ...formData,
      columnsInput: {
        ...formData.columnsInput
      }
    };
    if (updatedObject.columnsInput[columnId]) {
      delete updatedObject.columnsInput[columnId];
    }

    setFormData(updatedObject);
    console.log(formData);
  };


  function handleBoardAttributeChange(inputValue) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...inputValue,
    }));
  }

  function generateBoardId() {
    return v4();
  }

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsLoading(true);

    console.log(formData);

    const boardId: string = generateBoardId();
    try {
      const response = await fetch("/api/board", {
        method: "PUT",
        body: JSON.stringify({
          formData: formData,
          boardId: boardId,
          userId: user.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseBody = await response.json();
      if (response.ok) {
        router.push(`/board/${boardId}`);
      } else {
        console.error("Server responded with an error: ", responseBody);
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
                <Checkbox  color="ruby" variant="classic" defaultChecked /> Secure Board with Password
              </Flex>
            </Text>
            <Button size="3" variant="soft">
              {isLoading ? "Loading..." : "Create"}
            </Button>
          </Flex>
        </div>
      </form>
      <ColumnsInput handleRemoveColumn={removeColumnById} handleColumnTextChange={onColumnTextChange} />
    </div>
  );
}
