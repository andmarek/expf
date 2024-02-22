import { useState, useRef, useEffect } from "react";
import { Flex, Text } from "@radix-ui/themes";
import {
  Pencil1Icon,
  TrashIcon,
  CheckIcon,
  HeartFilledIcon,
  HeartIcon,
} from "@radix-ui/react-icons";
import CommentButtonIcon from "./CommentButtonIcon";

interface CommentObject {
  text: string;
  likes: number;
}

interface CommentProps {
  boardId: string;
  columnId: string;
  commentId: string;
  commentObj: CommentObject;
  dispatch: Function;
  socket: any; // TODO: specify a more detailed type if possible
  cardTextBlurred: boolean;
}

export default function Comment({
  boardId,
  columnId,
  commentId,
  commentObj,
  dispatch,
  socket,
  cardTextBlurred,
}: CommentProps) {
  /* TODO: use comment text from reducer */
  const [currentText, setCurrentText] = useState(commentObj.text);

  const [isContentEditable, setIsContentEditable] = useState(false);
  const inputRef = useRef<HTMLParagraphElement>(null);
  const [commentLiked, setCommentLiked] = useState(false);

  const blurPlaceholder = "***";


  async function removeCommentLikedInDatabase(columnId: string, commentId: string) {
    console.log(columnId, commentId);
  }

  async function updateCommentLikesInDatabase(
    columnId: string,
    commentId: string,
    boardId: string
  ) {
    console.log("Deleting from database");
    console.log("columnId " + columnId + "commentId " + commentId);

    const response = await fetch(`/api/board/comments/${commentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        boardId,
        columnId
      }),
    });
    const data = await response.json();
    console.log(data);
  }

  async function deleteCommentFromDatabase(
    columnId: string,
    commentId: string
  ) {
    console.log("Deleting from database");
    console.log(columnId, commentId);
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
  TODO: not supporting this right now
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
      socket.emit("delete comment", {
        columnId,
        commentId,
      });
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

  function handleCommentLiked(commentId: string, columnId: string, boardId: string) {
    const commentLiked = changeCommentLiked();
    console.log("yo");
    console.log(commentLiked);
    if (commentLiked) {
      dispatch({ type: "INCREMENT_LIKES_ON_COMMENT", payload: { columnId, commentId } });

      updateCommentLikesInDatabase(
        columnId, commentId, boardId
      );
    } else {
      removeCommentLikedInDatabase(commentId, columnId);
    }
  }
  function changeCommentLiked() {
    setCommentLiked(!commentLiked);
    return commentLiked;
  }

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
        {commentLiked ? (
          <CommentButtonIcon
            icon={<HeartFilledIcon />}
            onClick={() => { handleCommentLiked(commentId, columnId, boardId) }}
          />
        ) : (
          <CommentButtonIcon
            icon={<HeartIcon />}
            onClick={() => { handleCommentLiked(commentId, columnId, boardId) }}
          />
        )}
        <p className="text-radix-mintDefault"> {commentObj.likes} </p>
        {isContentEditable ? (
          <CommentButtonIcon
            icon={<CheckIcon />}
            onClick={() => {
              const editedText = inputRef.current.textContent;
              // handleEditComment(commentId, editedText);
              setIsContentEditable(!isContentEditable);
            }}
          />
        ) : null}
        <CommentButtonIcon
          icon={<Pencil1Icon />}
          onClick={() => setIsContentEditable(!isContentEditable)}
        />
        <CommentButtonIcon
          icon={<TrashIcon />}
          onClick={() => deleteComment(commentId)}
        />
      </Flex>
    </Flex>
  );
}
