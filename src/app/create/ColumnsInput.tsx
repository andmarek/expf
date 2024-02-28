import { useState } from "react";
import { Select, Text, Flex, Button, Heading, RadioGroup } from "@radix-ui/themes";
import { v4 as uuidv4 } from "uuid";
import ColumnField from "./ColumnField";


export default function ColumnsInput({ handleColumnChange }) {
  const [currentColumns, setCurrentColumns] = useState([]);
  const [numberColumns, setNumberColumns] = useState(0);

  const [useTemplate, setUseTemplate] = useState(true);

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

  function handleRadioChange(value: string) {
    setUseTemplate(value === "1");
  };

  return (
    <div className="flex flex-col w-96 py-4 bg-base-950 rounded-md p-3">
      <Flex direction="column" gap="3">
        <Heading size="6">
          Board Setup
        </Heading>
        <RadioGroup.Root defaultValue="1" onValueChange={handleRadioChange}>
          <Flex gap="2" direction="column">
            <Text as="label" size="2">
              <Flex gap="2">
                <RadioGroup.Item value="1" /> Template
              </Flex>
            </Text>
            <Text as="label" size="2">
              <Flex gap="2">
                <RadioGroup.Item value="2" /> Custom
              </Flex>
            </Text>
          </Flex>
        </RadioGroup.Root>
        {useTemplate ? (
          <Select.Root defaultValue="Classic">
            <Select.Trigger />
            <Select.Content>
              <Select.Group>
                <Select.Label>Board Templates</Select.Label>
                <Select.Item value="Classic"> Classic </Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
        ) : (
            <>
              <Button variant="soft" size="3" onClick={addComponent}>
                Add Column
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
            </>
          )}
      </Flex>
    </div>
  );
}
