import { useState } from "react";
import { Flex, Box, Button, TextField, Heading } from "@radix-ui/themes";
import { Cross1Icon } from "@radix-ui/react-icons";
import { v4 as uuidv4 } from "uuid";
import ColumnField from "./ColumnField";


export default function ColumnsInput({ name, handleColumnChange }) {
  const [currentText, setCurrentText] = useState("");
  const [currentColumns, setCurrentColumns] = useState([]);

  function onRemoveColumn(columnId) {
    setCurrentColumns((columns) =>
      columns.filter((column) => column.id !== columnId)
    );
  }

  function onColumnTextChange(id: string, value: string) {
    setCurrentText(value);
    handleColumnChange(id, value);
  }

  const addComponent = () => {
    const newColumn = {
      id: uuidv4(),
      text: "",
    };
    setCurrentColumns((currentColumns) => [...currentColumns, newColumn]);
  };

  return (
    <div className="flex flex-col w-96 py-4">
      <Flex direction="column" gap="3">
        <Heading size="6" className="self-center">
          Choose your columns
        </Heading>
        <Button variant="soft" size="3" onClick={addComponent}>
          {" "}
          Add Column{" "}
        </Button>
        {currentColumns.map((column, index) => (
          <ColumnField
            key={column.id}
            id={column.id}
            index={index + 1}
            handleTextChange={onColumnTextChange}
            handleRemove={onRemoveColumn}
          />
        ))}
      </Flex>
    </div>
  );
}
