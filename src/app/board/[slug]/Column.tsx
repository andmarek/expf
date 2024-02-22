import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Flex, TextArea, Button } from "@radix-ui/themes";
import Comment from "./Comment";

interface Comment {
  id: string;
  text: string;
  likes: number;
}

interface ColumnProps {
  boardId: string;
  boardName: string;
  name: string;
  currentText: string;
  comments: Comment[];
  dispatch: any; // TODO: fix this type
  columnId: string;
  socket: any; // TODO: fix this type
  cardTextBlurred: boolean;
  sortStatus: { "sortBy": string; "sortDirection": string; }
}

export default function Column({
  boardId,
  boardName,
  name,
  currentText,
  comments,
  dispatch,
  columnId,
  socket,
  cardTextBlurred,
  sortStatus,
}: ColumnProps) {
  console.log("comments", comments);

  const [curText, setCurText] = useState(currentText);
  const [sortBy, setSortBy] = useState(sortStatus.sortBy);

  async function postCommentsToDatabase(
    boardId: string,
    commentText: string,
    columnId: string,
    commentId: string
  ) {
    try {
      await fetch("/api/board/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boardId,
          columnId,
          commentId,
          commentText,
        }),
      });
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  }

  function dispatchAddComment(commentId: string, text: string) {
    dispatch({
      type: "ADD_COMMENT_TO_COLUMN",
      payload: {
        columnId: columnId,
        comment: {
          id: commentId, // TODO change to commentId
          text: text,
          likes: 0
        },
      },
    });
  }

  async function addComment() {
    const commentId = uuidv4();

    emitCommentToServer(socket, commentId, curText);
    dispatchAddComment(commentId, curText);
    try {
      await postCommentsToDatabase(boardId, curText, columnId, commentId);
      setCurText("");
    } catch (error) {
      console.error("Failed to post comments to database. ", error);
    }
  }

  // TODO: refactor this to emitActionToSocket("action", {data})
  function emitCommentToServer(socket, commentId, commentText) {
    if (socket.connected) {
      socket.emit("new comment", {
        boardId,
        columnId,
        commentId,
        commentText,
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
      <Button onClick={addComment} size="3" variant="soft">
        Post
      </Button>

      <div className="flex flex-col gap-3">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            boardId={boardId}
            columnId={columnId}
            commentObj={comment}
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
