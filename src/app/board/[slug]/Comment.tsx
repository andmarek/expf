import { useState, useRef, useEffect } from "react";
import { Flex, Text } from "@radix-ui/themes";
import { Pencil1Icon, TrashIcon, CheckIcon } from "@radix-ui/react-icons";

export default function Comment({
  boardName,
  columnId,
  commentId,
  commentText,
  dispatch,
  socket,
}: {
  boardName: string;
  columnId: string;
  commentId: string;
  commentText: string;
  dispatch: Function;
  socket;
}) {
  /* TODO: use comment text from reducer */
  const [currentText, setCurrentText] = useState(commentText);
  const [isContentEditable, setIsContentEditable] = useState(false);
  const inputRef = useRef(null);

  async function deleteCommentFromDatabase(
    columnId: string,
    commentId: string
  ) {
    console.log("Deleting from database");
    console.log(columnId, commentId);

    socket.emit("delete comment", {
      columnId,
      commentId,
    });

    const response = await fetch("/api/board/comments", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        boardName,
        columnId,
        commentId,
      }),
    });
    const data = await response.json();
    console.log(data);
  }
  /*
  const saveEditedComment = async (commentId: string, commentText: string) => {
    //const previousComments = { ...curComments };

    //const commentsCopy = { ...curComments };
    //commentsCopy[commentId] = commentText;
    //setCurComments(commentsCopy);

    try {
      await postCommentsToDatabase(
        commentText,
        columnId,
        commentId
      );
    } catch (error) {
      setCurComments(previousComments);
      console.error("Failed to post comments to database. ", error);
    }
  };
  */

  function deleteComment(commentId: string) {
    console.log("DELETE the comment ID is ", commentId);
    console.log(columnId, commentId);
    dispatch({
      type: "DELETE_COMMENT_FROM_COLUMN",
      payload: { columnId: columnId, commentId: commentId },
    });
    try {
      deleteCommentFromDatabase(columnId, commentId);
    } catch (error) {
      console.error("Failed to delete comment from database. ", error);
    }
  }

  useEffect(() => {
    if (isContentEditable) {
      inputRef.current.focus();
    }
  }, [isContentEditable]);

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
                //handleEditComment(commentId, editedText);
                setIsContentEditable(!isContentEditable);
              }}
            />
          </button>
        ) : null}
        <button
          className="text-blue duration-300 hover:text-red transition-all"
          onClick={() => setIsContentEditable(!isContentEditable)}
        >
          {" "}
          <Pencil1Icon />{" "}
        </button>
        <button
          className="text-blue duration-300 hover:text-red transition-all"
          onClick={() => deleteComment(commentId)}
        >
          {" "}
          <TrashIcon />{" "}
        </button>
      </Flex>
    </Flex>
  );
}
