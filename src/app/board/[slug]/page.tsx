"use client";

import { Button, TextField } from "@radix-ui/themes";
import React, { useEffect, useReducer, useState } from "react";
import boardReducer from "./boardReducer";
import Column from "./Column";
import { socket } from "./socket";
import SideBar from "./SideBar";
import SortDropDown from "./SortDropDown";

export default function Page({ params }: { params: { slug: string } }) {
  const boardName: string = params.slug;
  const decodedBoardName: string = decodeURI(boardName);

  const [hasJoined, setHasJoined] = useState(false);
  const [userName, setUserName] = useState("");

  const [sidebarOpened, setSideBarOpened] = useState(false);

  /* isConnected is currently unused, but I think it'll be used soon,
     so I'm keeping it. */
  const [isConnected, setIsConnected] = useState(socket.connected);

  /* Board Options */
  const [passwordRequired, setPasswordRequired] = useState(false); // needs to be saved eventually
  const [setPassword, password] = useState("");
  const [boardBlurred, setBoardBlurred] = useState(false);

  const initialState = { columns: [] };
  const [boardState, dispatch] = useReducer(boardReducer, initialState);

  function switchBlurBoard() {
    setBoardBlurred(!boardBlurred);

    socket.emit("switch blur board", {
      boardBlurred,
    });
  };

  function switchRequirePassword() {
    setPasswordRequired(!passwordRequired);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/board", {
          method: "POST",
          body: JSON.stringify({ boardName: decodedBoardName }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching board data.");
        }

        const jsonData = await response.json();
        const transformedData = transformBoardData(jsonData);

        dispatch({
          type: "SET_CATEGORIES",
          payload: transformedData,
        });
      } catch (error) {
        console.error("Error initializing board page.");
      }
    };
    fetchData();
  }, [decodedBoardName]);

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

  function transformBoardData(data) {
    return Object.entries(data.Item.BoardColumns).map(
      ([columnId, columnData]) => ({
        columnId: columnId,
        columnName: columnData.columnName,
        currentText: columnData.currentText,
        comments: Object.entries(columnData.comments).map(
          ([commentId, commentText]) => ({
            id: commentId,
            text: commentText,
          })
        ),
      })
    );
  }

  /* TODO: define columnData type */
  return (
    <div id="__next" className="flex flex-col antialiased min-h-full h-full">
      {!hasJoined ? (
        <div className="flex flex-col items-center space-y-3">
          <h1> Please provide a username </h1>
          <TextField.Input onChange={(e) => setUserName(e.target.value)} />
          <Button onClick={() => setHasJoined(true)} size="3" variant="soft">
            {" "}
            Join{" "}
          </Button>
        </div>
      ) : (
        <>
          <div className="flex w-full h-full">
            <SideBar
              switchPasswordRequired={switchRequirePassword}
              switchBlurCardText={switchBlurBoard}
              showSidebar={sidebarOpened}
              setShowSidebar={setSideBarOpened}
            />
            <div
              className={`grow transition-transform duration-300 ease-in-out ${
                sidebarOpened ? "ml-64" : "ml-0"
              }`}
            >
              <div className="text-center">
                <div className="flex flex-row justify-center space-x-3">
                  <h1 className="text-lg"> Board Name: </h1>
                  <h1 className="text-lg text-magenta-light">
                    {" "}
                    {decodedBoardName}{" "}
                  </h1>
                  <h1 className="text-lg"> Username:</h1>
                  <h1 className="text-lg text-magenta-light"> {userName} </h1>
                  <SortDropDown />
                </div>
              </div>

              <div className="flex flex-row justify-center">
                {boardState.columns.map((column) => {
                  return (
                    <Column
                      key={column.columnId}
                      boardName={boardName}
                      name={column.columnName}
                      dispatch={dispatch}
                      currentText={column.currentText}
                      comments={column.comments}
                      columnId={column.columnId}
                      socket={socket}
                      cardTextBlurred={boardBlurred}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
