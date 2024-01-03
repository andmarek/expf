import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Flex, Text, TextArea, Button } from "@radix-ui/themes";
import { Pencil1Icon, TrashIcon, CheckIcon } from "@radix-ui/react-icons";

function Comment({ text, handleDelete, id }) {
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
      <Text contentEditable={isContentEditable} ref={inputRef} as="p"> {text} </Text>
      <Flex gap="3" justify="end">
        { isContentEditable ? <CheckIcon className="text-blue" onClick={() => handleEdit()} /> : null }
        <button className="text-blue duration-300 hover:text-red transition-all"
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

export default function Column({ name, currentText, comments }) {
  const [curText, setCurText] = useState(currentText);
  const [curComments, setCurComments] = useState(comments);

  async function postCommentsToDatabase(comments: [string]) {
    const response = await fetch("/api/board/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comments }),
    });

    const data = await response.json();
    console.log(data);
  }

  function deleteCommentHandler(commentId: string) {
    setCurComments(curComments.filter((c) => c.id !== commentId));
  }

  async function addCommentHandler() {
    console.log(curText);
    const commentId = uuidv4();

    setCurComments([...curComments, { id: commentId, text: curText }]); // todo change to uuid
    postCommentsToDatabase(curComments);
  }

  return (
    <Flex className="p-5" direction="column" gap="2">
      <h1>{name}</h1>
      <TextArea
        onChange={(e) => setCurText(e.target.value)}
        placeholder="Post a comment..."
      />
      <Button onClick={addCommentHandler} size="3" variant="soft">
        Post
      </Button>

      <div className="flex flex-col gap-3">
        {curComments.map((comment, index) => (
          <Comment
            key={index}
            text={comment.text}
            handleDelete={(comment) => {
              deleteCommentHandler(comment);
            }}
            id={comment.id}
          />
        ))}
      </div>
    </Flex>
  );
}
