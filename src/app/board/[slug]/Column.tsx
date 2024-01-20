import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Flex, TextArea, Button } from "@radix-ui/themes";
import Comment from "./Comment";


export default function Column({
  boardName,
  name,
  currentText,
  comments,
  dispatch,
  columnId,
  socket,
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
    console.log(commentText);
    console.log(columnId);
    console.log(commentId);

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
  dispatch({
      type: "DELETE_COMMENT_FROM_COLUMN",
      payload: { columnId: columnId, comment: curText }
    });   
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

  async function saveEditedComment(commentId: string, commentText: string) {
    const previousComments = { ...curComments };

    const commentsCopy = { ...curComments };
    commentsCopy[commentId] = commentText;
    setCurComments(commentsCopy);

    try {
      await postCommentsToDatabase(commentText, columnId, commentId);
    } catch (error) {
      setCurComments(previousComments);
      console.error("Failed to post comments to database. ", error);
    }
  }

  async function addCommentHandler() {
    console.log(curText);
    const commentId = uuidv4();
    emitComment(socket, commentId, curText); // should we await?

    // Optimistic UI updates
    const previousComments = { ...curComments };
    setCurComments({
      ...curComments,
      [commentId]: {text: curText},
    });
    dispatch({
      type: "ADD_COMMENT_TO_COLUMN",
      payload: { columnId: columnId, comment: curText }
    });

    try {
      await postCommentsToDatabase(curText, columnId, commentId);
    } catch (error) {
      setCurComments(previousComments);
      console.error("Failed to post comments to database. ", error);
    }
    setCurText("");
  }
  function emitComment(socket, commentId, commentText) {
    console.log("emitting :)");
    console.log(socket);
    if (socket.connected) {
      socket.emit("new comment", {
        boardName: boardName,
        columnId: columnId,
        commentId: commentId,
        commentText: commentText,
      });
    } else {
      console.log("SOCKET NOT CONNECT");
    }
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
            text={comment.text}
            handleDelete={() => deleteCommentHandler(commentId)}
            handleEditComment={saveEditedComment}
            id={commentId}
          />
        ))}
      </div>
    </Flex>
  );
}
