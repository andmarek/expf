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


  

  async function addCommentHandler() {
    console.log(curText);
    const commentId = uuidv4();
    emitComment(socket, commentId, curText); // No need to await this, as it's just emitting an event
  
    // Optimistic UI update - Add the comment to the global state
    dispatch({
      type: "ADD_COMMENT_TO_COLUMN",
      payload: {
        columnId: columnId,
        comment: {
          id: commentId, // Use the UUID as the comment ID
          text: curText, // The text of the comment
        },
      },
    });
  
    try {
      await postCommentsToDatabase(curText, columnId, commentId);
      // Optionally handle the server response, e.g., updating the comment with server-generated data
    } catch (error) {
      console.error("Failed to post comments to database. ", error);
      // Handle the error - possibly by dispatching a 'remove' action if necessary
    }
  
    setCurText(""); // Clear the input field
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
        {comments.map(comment => (
          <Comment
            key={comment.commentId}
            boardName={boardName}
            columnId={columnId}
            commentText={comment.text}
            dispatch={dispatch}
            commentId={comment.id}
          />
        ))}
      </div>
    </Flex>
  );
}
