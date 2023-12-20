"use client";

import React, { useReducer, useState } from "react";
import categoriesReducer from "./categoriesReducer";
import Column from "./Column";

export default function Page({ params }: { params: { slug: string } }) {
  const boardName: string = params.slug;
    function handleTextChange() {

    }
  /*
  const columns = ["What went well?", "What went wrong?", "Action Items"];
  */
  const initialCategories = {
    "What went well?": {
        "current_text": "",
        "comments": [] 
    },
    "What went wrong?": {
        "current_text": "",
        "comments": [],
    },
    "Action Items": {
        "current_text": "",
        "comments": [],
    },
  };

  
  const [state, dispatch] = useReducer(categoriesReducer, initialCategories);

    /*
    function handleAddComment(text) {
        dispatch({
            type: 'added',
            //column: columnIndex,
            //commentIndex: commentIndex,
            text: text,
        })
    }
    */
  /*const [comments, setComments] = useState(Array(Object.keys(columns).length).fill([]));*/

  const [text, setText] = useState("");

  const [blur, setBlur] = useState(false);

  const handleBlur = () => {
    if (blur === true) {
      setBlur(false);
    } else {
      setBlur(true);
    }
  };

  const handleTextChange = (column) => {
    setColumns( prevColumns => {return {...prevColumns, [e.target.value].push()}})

  };

  const postComment = (column) => {
    console.log("post comment function");

    /*const tempComments = [...comments];

    tempComments[index] = [...tempComments[index], text[index]];

    setComments(tempComments);
    */
    /*
    const response = await fetch("/api/comment", {
        method: "PUT",
        body: JSON.stringify({
            commentStr: text[index]
        })
      });
    */

    setText("");
  };

  return (
    <div>
     
    {
    /*
    <div className="flex flex-col items-center">
      <h1 className="p-5">Retrospective: {boardName}</h1>
      <button
        className={`bg-cyan p-2 rounded ${blur ? "bg-cyan" : "bg-red"}`}
        onClick={handleBlur}
      >
        {" "}
        toggle blur{" "}
      </button>
      <div className="flex flex-row">
        {Object.entries(columns).map(([column, comments]) => (
          <div key={column} className="flex flex-col p-5">
            <h1>{column}</h1>

            <textarea
              className="text-red"
              onChange={(event) => handleTextChange(column)}
              key={column}
            />

            {comments.map((comment, index) => (
              <p key={index}> {comment} </p>
            ))}

            <button className="bg-green rounded text-center my-1" onClick={()=> postComment(column)}>
              {" "}
              Post{" "}
            </button>

            <div className="cardContainer">
              {comments.map((comment, index) => (
                <div
                  className={`h-8 my-5 bg-blue rounded ${blur ? "blur" : ""}`}
                  key={index}
                >
                  {comment}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      */
    }
      {/*
      <div className="flex flex-row">
        {columns.map((column, index) => (
          <div className="flex flex-col p-5" key={index}>
            <h1>{column}</h1>
            <textarea
              className="text-red"
              value={text[index] || ""}
              onChange={(event) => handleTextChange(event, index)}
            />
            <button
              className="bg-green rounded text-center my-1"
              onClick={() => postComment(index)}
            >
              Post
            </button>
            <div id="cardContainer">
              {comments[index].map((comment, i) => (
                <div
                  className={`h-8 my-5 bg-blue rounded ${blur ? "blur" : ""}`}
                  key={i}
                >
                  {comment}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
        */}
    </div>
  );
}
