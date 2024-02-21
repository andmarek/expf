import { useState, useRef, useEffect } from "react";
import { Flex, Text } from "@radix-ui/themes";
import { Pencil1Icon, TrashIcon, CheckIcon } from "@radix-ui/react-icons";

interface CommentProps {
  boardId: string;
  columnId: string;
  commentId: string;
  commentText: string;
  dispatch: Function;
  socket: any; // Specify a more detailed type if possible
  cardTextBlurred: boolean;
}

export default function Comment({
  boardId,
  columnId,
  commentId,
  commentText,
  dispatch,
  socket,
  cardTextBlurred,
}: CommentProps) {
  /* TODO: use comment text from reducer */
  const [currentText, setCurrentText] = useState(commentText);
  const [isContentEditable, setIsContentEditable] = useState(false);
  const inputRef = useRef<HTMLParagraphElement>(null);

  const blurPlaceholder = "***";

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
        boardId,
        columnId,
        commentId,
      }),
    });
    const data = await response.json();
    console.log(data);
  }

  /*
  // not supporting this right now
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

  async function deleteComment(commentId: string) {
    dispatch({
      type: "DELETE_COMMENT_FROM_COLUMN",
      payload: { columnId, commentId },
    });
    try {
      await deleteCommentFromDatabase(columnId, commentId);
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
    <Flex
      direction="column"
      gap="4"
      className="bg-magenta-light p-1 rounded-md drop-shadow-md"
    >
      <Text
        className={`${cardTextBlurred ? "blur-sm" : "blur-none"}`}
        contentEditable={isContentEditable}
        ref={inputRef}
        as="p"
      >
        {" "}
        {cardTextBlurred ? blurPlaceholder : currentText}{" "}
      </Text>
      <Flex gap="3" justify="end">
        {isContentEditable ? (
          <button>
            <CheckIcon
              className="text-blue"
              onClick={() => {
                const editedText = inputRef.current.textContent;
                // handleEditComment(commentId, editedText);
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
