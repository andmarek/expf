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
  cardTextBlurred
}) {
  console.log("FROM COLUMN");
  console.log(cardTextBlurred);
  console.log("***");
  const [curText, setCurText] = useState(currentText);
  async function postCommentsToDatabase(
    commentText: string,
    columnId: string,
    commentId: string
  ) {
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

  async function addCommentHandler() {
    console.log(curText);
    const commentId = uuidv4();
    emitComment(socket, commentId, curText);

    dispatch({
      type: "ADD_COMMENT_TO_COLUMN",
      payload: {
        columnId: columnId,
        comment: {
          id: commentId,
          text: curText,
        },
      },
    });

    try {
      await postCommentsToDatabase(curText, columnId, commentId);
    } catch (error) {
      console.error("Failed to post comments to database. ", error);
    }

    setCurText("");
  }

  function emitComment(socket, commentId, commentText) {
    if (socket.connected) {
      socket.emit("new comment", {
        boardName: boardName,
        columnId: columnId,
        commentId: commentId,
        commentText: commentText,
      });
    } else {
      console.log("SOCKET NOT CONNECTED");
    }
  }

  return (
    <Flex className="p-5 w-96" direction="column" gap="2">
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
        {comments.map((comment) => (
          <Comment
            key={comment.commentId}
            boardName={boardName}
            columnId={columnId}
            commentText={comment.text}
            dispatch={dispatch}
            commentId={comment.id}
            socket={socket}
            cardTextBlurred={cardTextBlurred}
          />
        ))}
      </div>
    </Flex>
  );
}
