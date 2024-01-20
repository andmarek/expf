"use client";

import { Button, TextField } from "@radix-ui/themes";
import React, { useRef, useEffect, useReducer, useState } from "react";
import boardReducer from "./categoriesReducer";
import Column from "./Column";
import { socket } from "./socket";

export default function Page({ params }: { params: { slug: string } }) {
  const [isConnected, setIsConnected] = useState(socket.connected);

  /* Board stuff */
  const [hasJoined, setHasJoined] = useState(false);
  const [userName, setUserName] = useState("");
  const boardName: string = params.slug;

  const initialState = { columns: [] };

  const [boardState, dispatch] = useReducer(boardReducer, initialState);

  const [blur, setBlur] = useState(false);

  useEffect(() => {
    /* Get initial board info */
    const fetchData = async () => {
      try {
        const response = await fetch("/api/board", {
          method: "POST",
          body: JSON.stringify({ boardName: boardName }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching board data.");
        }

        const jsonData = await response.json();
        const transformedData = transformBoardData(jsonData);
        console.log(transformedData);

        dispatch({
          type: "SET_CATEGORIES",
          payload: transformedData,
        });
        console.log(boardState);
        console.log(jsonData);
      } catch (error) {
        console.error("Error initializing board page.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    socket.connect();

    function onConnect() {
      console.log("On connect triggered.");
      setIsConnected(true);
    }

    function onEmittedComment(data) {
      console.log("On emitted comment triggered.");
      dispatch({
        type: "ADD_COMMENT",
        payload: {
          columnId: data.columnId,
          commentId: data.commentId,
          commentText: data.commentText,
        },
      });
      console.log(data);
      console.log("BOARD SYAYE");
      console.log(boardState);
    }

    function onDisconnect() {
      console.log("On disconnect triggered.");
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("new comment", onEmittedComment);

    return () => {
      socket.off("connect", onConnect);
      socket.off("new comment", onEmittedComment);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  function handleJoin() {
    setHasJoined(true);
    // TODO: interact with websocket here
  }

  /* TODO: implement this in admin panel */
  const handleBlur = () => {
    if (blur === true) {
      setBlur(false);
    } else {
      setBlur(true);
    }
  };
  function transformBoardData(data) {
    console.log(data);
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
    <div className="flex flex-col">
      {hasJoined === false ? (
        <div className="flex flex-col items-center space-y-3">
          <h1> Please provide a username </h1>
          <TextField.Input onChange={(e) => setUserName(e.target.value)} />
          <Button onClick={handleJoin} size="3" variant="soft">
            {" "}
            Join{" "}
          </Button>
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-r from-purple text-center">
            <div className="flex flex-row justify-center space-x-3">
              <h1 className="text-lg font-bold"> board name: </h1>
              <h1 className="text-lg font-bold text-magenta-light">
                {" "}
                {boardName}{" "}
              </h1>
              <h1 className="text-lg font-bold "> username:</h1>
              <h1 className="text-lg font-bold text-magenta-light">
                {" "}
                {userName}{" "}
              </h1>
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
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
