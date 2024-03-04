import { useState } from "react";
import { Select, Text, Flex, Button, Heading, RadioGroup } from "@radix-ui/themes";
import { v4 as uuidv4 } from "uuid";
import ColumnField from "./ColumnField";

export default function ColumnsInput({ handleRemoveColumn, handleColumnTextChange }) {
  const [currentColumns, setCurrentColumns] = useState([]);
  const [numberColumns, setNumberColumns] = useState(0);

  const [useTemplate, setUseTemplate] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState("Classic");

  function removeColumn(columnId: number) {
    console.log("removing column at columnsInput level" )

    setCurrentColumns(columns =>
      columns.filter((column) => column.index !== columnId)
    );

    handleRemoveColumn(columnId);
  }

  function onColumnTextChange(value: string, index: number) {
    handleColumnTextChange(value, index);
  }

  const addComponent = () => {
    setNumberColumns(numberColumns + 1);

    const newColumn = {
      id: uuidv4(),
      text: "",
      index: numberColumns + 1,
    };
    setCurrentColumns((currentColumns) => [...currentColumns, newColumn]);

    console.log(currentColumns);
  };

  function handleRadioChange(value: string) {
    setUseTemplate(value === "1");
  };

  function handleTemplateChange(value: string) {
    setSelectedTemplate(value);
  }

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
          <Select.Root defaultValue="Classic" onValueChange={handleTemplateChange}>
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
                  index={index + 1}
                  handleTextChange={onColumnTextChange}
                  handleRemove={removeColumn}
                />
              ))}
            </>
          )}
      </Flex>
    </div>
  );
}
