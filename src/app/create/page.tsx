"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ColumnsInput from "./ColumnsInput";
import { Heading, Button, Flex, TextField } from "@radix-ui/themes";

export default function Create() {
  const router = useRouter();
  /*
  This function needs to know about
  - the board name
  - the board description
  - the columns
    - column ID?
    - column desc
  - if it's loading or not
  */

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    boardName: "",
    boardDescription: "",
    columnsInput: {},
  });

  const onColumnChange = (id: string, value: string) => {
    /* All column changes are basically going to be adding or removing text */
    setFormData((prevFormData) => {
      const updatedColumnsInput = { ...prevFormData.columnsInput };
      updatedColumnsInput[id] = {
        name: value,
      };
      return {
        ...prevFormData,
        columnsInput: updatedColumnsInput,
      };
    });
  };

  const handleBoardAttributeChange = (inputValue) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...inputValue,
    }));
  };

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    setIsLoading(true);
    e.preventDefault();

    try {
      const response = await fetch("/api/board", {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        // TODO: use the data to redirect to the board
        router.push(`/board/${formData.boardName}`);
      } else {
        const errorData = await response.json();
        console.error("Server responded with an error: ", errorData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <form className="flex flex-col w-96" onSubmit={submitForm}>
        <Heading size="6" className="self-center py-4">
          {" "}
          Enter a title for your retrospective{" "}
        </Heading>
        <div className="flex flex-col">
          <Flex direction="column" gap="3">
            <TextField.Input
              name="boardName"
              className="m-2"
              type="text"
              placeholder="Enter a title"
              onChange={(e) =>
                handleBoardAttributeChange({ boardName: e.target.value })
              }
            ></TextField.Input>
            <TextField.Input
              name="boardDescription"
              className="m-2"
              type="text"
              placeholder="Enter a Description"
              onChange={(e) =>
                handleBoardAttributeChange({ boardDescription: e.target.value })
              }
            ></TextField.Input>
            <Button size="3" variant="soft">
              {isLoading ? "Loading..." : "Create"}
            </Button>
          </Flex>
        </div>
      </form>
      <ColumnsInput
        name="todo-placeholder"
        handleColumnChange={onColumnChange}
      />
    </div>
  );
}
