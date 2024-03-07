import React, { useEffect, useReducer, useState, useId } from "react";
import boardReducer from "./boardReducer";
import Column from "./Column";
import { socket } from "./socket";
import SideBar from "./SideBar";
import BoardStatusBar from "./BoardStatusBar";
import BoardEntryView from "./BoardEntryView";
import { useUser } from "@clerk/clerk-react";

import { DndContext } from "@dnd-kit/core";

interface BoardProps {
  boardId: string;
}

export default function Board(props: BoardProps) {
  const DndId = useId();

  const boardId = props.boardId;

  const { user } = useUser();
  const userId = user?.id;

  console.log(user);

  const [boardName, setBoardName] = useState("");

  const [sortStatus, setSortStatus] = useState({
    sortBy: "time",
    sortDirection: "asc",
  });

  const [hasJoined, setHasJoined] = useState(false);
  const [userName, setUserName] = useState("");

  const [sidebarOpened, setSideBarOpened] = useState(false);

  /* isConnected is currently unused, but I think it'll be used soon,
     so I'm keeping it. */
  const [isConnected, setIsConnected] = useState(socket.connected);

  /* Board Options */
  const [passwordRequired, setPasswordRequired] = useState(true); // needs to be saved eventually

  const [setPassword, password] = useState("");

  const [boardBlurred, setBoardBlurred] = useState(false);

  const initialState = { columns: [] };
  const [boardState, dispatch] = useReducer(boardReducer, initialState);

  function switchBlurBoard() {
    setBoardBlurred(!boardBlurred);

    socket.emit("switch blur board", {
      boardBlurred,
    });
  }

  function switchRequirePassword() {
    setPasswordRequired(!passwordRequired);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId)  {
          return;
        }

        const response = await fetch("/api/board", {
          method: "POST",
          body: JSON.stringify({ boardId, userId }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching board data.");
        }

        const jsonData = await response.json();
        setBoardName(jsonData.Item.BoardName);
        const boardColumns = transformBoardColumns(jsonData);

        dispatch({
          type: "SET_CATEGORIES",
          payload: boardColumns,
        });
      } catch (error) {
        console.error("Error initializing board page.");
      }
    };
    fetchData();
  }, [boardId, userId]);

  useEffect(() => {
    socket.connect();

    function onConnect() {
      setIsConnected(true);
    }

    function onEmittedComment(data) {
      dispatch({
        type: "ADD_COMMENT_TO_COLUMN",
        payload: {
          columnId: data.columnId,
          comment: { id: data.commentText, text: data.commentText },
        },
      });
    }

    function onEmittedDeleteComment(data) {
      dispatch({
        type: "DELETE_COMMENT_FROM_COLUMN",
        payload: { columnId: data.columnId, commentId: data.commentId },
      });
    }

    function onEmittedSwitchBlurBoard(data) {
      setBoardBlurred(!data.boardBlurred);
    }

    function onDisconnect() {
      setIsConnected(false);
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("new comment", onEmittedComment);
    socket.on("switch blur board", onEmittedSwitchBlurBoard);
    socket.on("delete comment", onEmittedDeleteComment);

    return () => {
      socket.off("connect", onConnect);
      socket.off("new comment", onEmittedComment);
      socket.off("disconnect", onDisconnect);
      socket.off("switch blur board", onEmittedSwitchBlurBoard);
      socket.off("delete comment", onEmittedDeleteComment);
    };
  }, []);

  function transformBoardColumns(data) {
    return Object.entries(data.Item.BoardColumns).map(
      ([columnId, columnData]) => ({
        columnId: columnId,
        columnName: columnData.columnName,
        currentText: columnData.currentText,
        comments: Object.entries(columnData.comments || {}).map(
          ([commentId, commentObj]) => ({
            id: commentId,
            comment_text: commentObj.comment_text,
            comment_likes: commentObj.comment_likes,
          })
        ),
      })
    );
  }

  function selectSortStatus(sortBy: string) {
    if (sortBy === "Time") {
      console.log("sorting by time");
      setSortStatus({ sortBy: "time", sortDirection: "asc" });
    } else if (sortBy === "Likes") {
      console.log("sorting by likes");
      setSortStatus({ sortBy: "likes", sortDirection: "desc" });
      boardState.columns.forEach((column) => {
        column.comments.sort((a, b) => {
          return b.comment_likes - a.comment_likes;
        });
      });
    }
  }

  function swapColumns(commentId: string, columnA: string, columnB: string) {
    // move comment active.id
    // to column over.id

  }

  function handleDragEnd(event: any) {
    const { over, active } = event;

    console.log(over, active);

    if (!over || !active) {
      return;
    }
    const [sourceColumnId, sourceCommentId] = active.id.split("_");

    const destinationColumnId = over.id;

    console.log("source", sourceColumnId, "dest", destinationColumnId);
    if (sourceColumnId !== destinationColumnId) {
      console.log('dispatching yo');
      dispatch({
        type: 'MOVE_COMMENT',
        payload: { sourceColumnId, destinationColumnId, sourceCommentId},
      })
    }

    console.log("over", over, "active", active);

    console.log("drag has ended");

    return "";
  }

  return (
    <DndContext onDragEnd={handleDragEnd} id={DndId}>
      <div id="__next" className="flex flex-col antialiased min-h-full h-full">
        {!hasJoined ? (
          <BoardEntryView
            boardName={boardName}
            setHasJoined={setHasJoined}
            setUserName={setUserName}
            passwordRequired={passwordRequired}
          />
        ) : (
            <div className="grid w-full h-full">
              <SideBar
                switchPasswordRequired={switchRequirePassword}
                switchBlurCardText={switchBlurBoard}
                showSidebar={sidebarOpened}
                setShowSidebar={setSideBarOpened}
              />
              <div
                className={
                  "col-start-1 row-start-1 grow transition-transform duration-300 ease-in-out"
                }
              >
                <BoardStatusBar
                  boardName={boardName}
                  userName={userName}
                  selectSortStatus={selectSortStatus}
                />

                <div className="flex flex-row justify-center">
                  {boardState.columns.map((column) => {
                    return (
                      <Column
                        key={column.columnId}
                        boardId={boardId}
                        userId={user?.id}
                        name={column.columnName}
                        dispatch={dispatch}
                        currentText={column.currentText}
                        comments={column.comments}
                        columnId={column.columnId}
                        socket={socket}
                        cardTextBlurred={boardBlurred}
                        sortStatus={sortStatus}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
      </div>
    </DndContext>
  );
}
