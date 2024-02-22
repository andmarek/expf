import { Flex, Box, Button, TextField, Heading } from "@radix-ui/themes";
import { Cross1Icon } from "@radix-ui/react-icons";

interface ColumnFieldProps {
  id: string;
  index: number;
  handleTextChange: (id: string, value: string) => void;
  handleRemove: (id: string) => void;
}
export default function ColumnField({ id, index, handleTextChange, handleRemove }: ColumnFieldProps) {
  return (
    <Flex gap="3" align="center">
      <h1> {index} </h1>
      <Box grow="1">
        <TextField.Input
          name="boardName"
          className="m-2"
          onChange={(e) => handleTextChange(e.target.value, index)}
          placeholder="Enter a column name"
          size="3"
        ></TextField.Input>
      </Box>
      <Cross1Icon onClick={() => handleRemove(id)} />
    </Flex>
  );
}
