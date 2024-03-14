import { RadioGroup, Select, Text, Flex } from "@radix-ui/themes";

function TemplateSelector({ useTemplate, onTemplateChange, onRadioChange }) {
  return (
    <>
      <RadioGroup.Root defaultValue="1" onValueChange={onRadioChange}>
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
      {useTemplate && (
        <Select.Root defaultValue="Classic" onValueChange={onTemplateChange}>
          <Select.Trigger />
          <Select.Content>
            <Select.Group>
              <Select.Label>Board Templates</Select.Label>
              <Select.Item value="Classic"> Classic </Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
      )}
    </>
  );
};

export default TemplateSelector;
