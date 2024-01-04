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
      <Text contentEditable={isContentEditable} ref={inputRef} as="p">
        {" "}
        {text}{" "}
      </Text>
      <Flex gap="3" justify="end">
        {isContentEditable ? (
          <CheckIcon className="text-blue" onClick={() => handleEdit()} />
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

export default function Column({
  boardName,
  name,
  currentText,
  comments,
  columnId,
}) {
  const [curText, setCurText] = useState(currentText);
  const [curComments, setCurComments] = useState(comments);
  console.log("COMMENTS BELOW");
  console.log(curComments);

  async function deleteCommentFromDatabase(
    columnId: string,
    commentId: string
  ) {
    // Attempt to add a comment to the database
    const response = await fetch("/api/board/comments", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        boardName: boardName,
        columnId: columnId,
        commentId: commentId,
      }),
    });
    const data = await response.json();
    console.log(data);
  }

  async function postCommentsToDatabase(
    commentText: string,
    columnId: string,
    commentId: string
  ) {
    // Attempt to add a comment to the database
    const response = await fetch("/api/board/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        boardName: boardName,
        columnId: columnId,
        commentId: commentId,
        commentText: commentText,
      }),
    });
    const data = await response.json();

    // TODO: handle the case where the comment fails to post to Dynamo
    console.log(data);
  }

  function deleteCommentHandler(commentId: string) {
    const previousComments = { ...curComments };

    const commentsCopy = { ...curComments };
    delete commentsCopy[commentId];
    setCurComments(commentsCopy);

    try {
      deleteCommentFromDatabase(columnId, commentId);
    } catch (error) {
      setCurComments(previousComments);
      console.error("Failed to delete comment from database. ", error);
    }
  }

  async function addCommentHandler() {
    console.log(curText);
    const commentId = uuidv4();

    // Optimistic UI updates
    const previousComments = { ...curComments };

    setCurComments({
      ...curComments,
      [commentId]: curText,
    });

    try {
      await postCommentsToDatabase(curText, columnId, commentId);
    } catch (error) {
      setCurComments(previousComments);
      console.error("Failed to post comments to database. ", error);
    }
    setCurText("");
  }

  return (
    <Flex className="p-5" direction="column" gap="2">
      <h1>{name}</h1>
      <TextArea
        onChange={(e) => setCurText(e.target.value)}
        placeholder="Post a comment..."
        value={curText}
      />
      <Button onClick={addCommentHandler} size="3" variant="soft">
        Post
      </Button>

      <div className="flex flex-col gap-3">
        {Object.entries(curComments).map(([commentId, comment]) => (
          <Comment
            key={commentId}
            text={comment}
            handleDelete={() => deleteCommentHandler(commentId)}
            id={commentId}
          />
        ))}
      </div>
    </Flex>
  );
}
