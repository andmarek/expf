import { useState, useRef, useEffect } from "react";
import { Flex, Text } from "@radix-ui/themes";
import { Pencil1Icon, TrashIcon, CheckIcon } from "@radix-ui/react-icons";

export default function Comment(props: {
  boardName: string;
  columnId: string,
  commentId: string,
  commentText: string,
  dispatch: Function,
}) {
  /* TODO: use comment text from reducer */
  const [currentText, setCurrentText] = useState(props.commentText);
  const [isContentEditable, setIsContentEditable] = useState(false);
  const inputRef = useRef(null);

  async function deleteCommentFromDatabase(
    columnId: string,
    commentId: string
  ) {
    console.log("wtf");
    console.log(columnId, commentId);
    props.dispatch({
      type: "DELETE_COMMENT_FROM_COLUMN",
      payload: {
        columnId: props.columnId,
        commentId: props.commentId
      },
    });
    // Attempt to add a comment to the database
    const response = await fetch("/api/board/comments", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        boardName: props.boardName,
        columnId: columnId,
        commentId: commentId,
      }),
    });
    const data = await response.json();
    console.log(data);
  }

  async function saveEditedComment(commentId: string, commentText: string) {
    //const previousComments = { ...curComments };

    //const commentsCopy = { ...curComments };
    //commentsCopy[commentId] = commentText;
    //setCurComments(commentsCopy);

    try {
      await postCommentsToDatabase(props.commentText, props.columnId, commentId);
    } catch (error) {
      setCurComments(previousComments);
      console.error("Failed to post comments to database. ", error);
    }
  }

  function deleteComment(commentId: string) {
    console.log("the comment ID is ", commentId);
    //const previousComments = { ...curComments };
    props.dispatch({
      type: "DELETE_COMMENT_FROM_COLUMN",
      payload: { columnId: props.columnId, comment: commentId },
    });
    //const commentsCopy = { ...curComments };

    console.log("comments copy");
    //console.log(commentsCopy);

    //delete commentsCopy[commentId];
    //setCurComments(commentsCopy);
    try {
      deleteCommentFromDatabase(props.columnId, props.commentId);
    } catch (error) {
      //setCurComments(previousComments);
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
                //props.handleEditComment(props.commentId, editedText);
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
          onClick={() => deleteComment(props.columnId)}
        >
          {" "}
          <TrashIcon />{" "}
        </button>
      </Flex>
    </Flex>
  );
}
