"use client";

import React, { useEffect, useReducer, useState } from "react";
import columnsReducer from "./categoriesReducer";
import Column from "./Column";

export default function Page({ params }: { params: { slug: string } }) {
  const boardName: string = params.slug;

  const [boardState, dispatch] = useReducer(columnsReducer, []);
  const [blur, setBlur] = useState(false);

  useEffect(() => {
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
        dispatch({
          type: "SET_CATEGORIES",
          payload: jsonData.Item.BoardColumns,
        });
        console.log(boardState);
        console.log("all the stuffs");
        console.log(jsonData);
        console.log("woot");
      } catch (error) {
        console.error("Error initializing board page.");
      }
    };
    fetchData();
  }, []);

  /* TODO: implement use this in admin panel */
  const handleBlur = () => {
    if (blur === true) {
      setBlur(false);
    } else {
      setBlur(true);
    }
  };

  /* TODO: define columnData type */
  return (
    <div className="flex flex-col">
      <div className="bg-gradient-to-r from-purple text-center"> 
        <h1 className="text-lg font-bold"> {boardName} </h1>
      </div>
      <div className="flex flex-row justify-center">
        {Object.entries(boardState).map(([columnId, columnData]) => (
          <Column
            key={columnId}
            boardName={boardName}
            name={columnData.columnName}
            currentText={columnData.currentText}
            comments={columnData.comments}
            columnId={columnId}
          />
        ))}
      </div>
    </div>
  );
}
