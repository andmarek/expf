import { useState } from "react";
import { Flex, Button, Heading } from "@radix-ui/themes";
import { v4 as uuidv4 } from "uuid";
import ColumnField from "./ColumnField";


export default function ColumnsInput({ handleColumnChange }) {
  const [currentColumns, setCurrentColumns] = useState([]);
  const [numberColumns, setNumberColumns] = useState(0);

  function onRemoveColumn(columnId: string) {
    setCurrentColumns((columns) =>
      columns.filter((column) => column.id !== columnId)
    );
  }

  function onColumnTextChange(value: string, index: string) {
    handleColumnChange(value, index);
  }

  const addComponent = () => {
    setNumberColumns(numberColumns + 1);

    const newColumn = {
      id: uuidv4(),
      text: "",
      index: numberColumns + 1,
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
