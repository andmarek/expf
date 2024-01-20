import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Flex, Text, TextArea, Button } from "@radix-ui/themes";
import { Pencil1Icon, TrashIcon, CheckIcon } from "@radix-ui/react-icons";

export default function Comment({ text, handleDelete, handleEditComment, id }) {
    const [currentText, setCurrentText] = useState(text);
    const [isContentEditable, setIsContentEditable] = useState(false);
    const inputRef = useRef(null);
  
    useEffect(() => {
      if (isContentEditable) {
        inputRef.current.focus();
      }
    }, [isContentEditable]);
  
    function handleEdit() {
      setIsContentEditable(!isContentEditable);
    }
  
    return (
      <Flex direction="column" gap="4" className="bg-yellow-light p-1 rounded-md">
        <Text contentEditable={isContentEditable} ref={inputRef} as="p">
          {" "}
          {currentText}{" "}
        </Text>
        <Flex gap="3" justify="end">
          {isContentEditable ? (
            <button>
              <CheckIcon
                className="text-blue"
                onClick={() => {
                  const editedText = inputRef.current.textContent;
                  handleEditComment(id, editedText);
                  handleEdit();
                }}
              />
            </button>
          ) : null}
          <button
            className="text-blue duration-300 hover:text-red transition-all"
            onClick={() => handleEdit()}
          >
            {" "}
            <Pencil1Icon />{" "}
          </button>
          <button
            className="text-blue duration-300 hover:text-red transition-all"
            onClick={() => handleDelete(id)}
          >
            {" "}
            <TrashIcon />{" "}
          </button>
        </Flex>
      </Flex>
    );
  }