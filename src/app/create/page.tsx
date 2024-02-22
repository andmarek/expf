"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ColumnsInput from "./ColumnsInput";
import { Heading, Button, Flex, TextField } from "@radix-ui/themes";
import { v4 } from "uuid";

export default function Create() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    boardName: "",
    boardDescription: "",
    columnsInput: {},
  });

  const onColumnChange = (value: string, index: string) => {
    setFormData((prevFormData) => {
      const updatedColumnsInput = { ...prevFormData.columnsInput };
      updatedColumnsInput[index] = {
        columnName: value,
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
        body: JSON.stringify({ formData: formData, boardId: boardId }),
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
        handleColumnChange={onColumnChange}
      />
    </div>
  );
}
