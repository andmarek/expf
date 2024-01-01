import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';


function Comment({ text, handleDelete, id }) {
  return (
    <div className={`h-16 bg-blue rounded flex flex-col`}>
      <p> {text} </p>
      <div className="flex space-x-1">
        <button className="text-red"> edit </button>
        <button className="text-yellow" onClick={() => handleDelete(id)}>
          {" "}
          delete{" "}
        </button>
      </div>
    </div>
  );
}

export default function Column({ name, currentText, comments }) {
  const [curText, setCurText] = useState(currentText);
  const [curComments, setCurComments] = useState(comments);

  async function postCommentsToDatabase(comments: [string]) {
    const response = await fetch("/api/board/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comments }),
    });

    const data = await response.json();
    console.log(data);
  }

  function deleteCommentHandler(commentId: string) {
    setCurComments(curComments.filter((c) => c.id !== commentId));
  }

  async function addCommentHandler() {
    console.log(curText);
    const commentId = uuidv4();

    setCurComments([...curComments, { id: commentId, text: curText }]); // todo change to uuid
    postCommentsToDatabase(curComments);
  }

  return (
    <div className="flex flex-col p-5">
      <h1>{name}</h1>

      <textarea
        className="text-red"
        onChange={(e) => setCurText(e.target.value)}
      />

      <button
        className="bg-green rounded text-center my-1"
        onClick={addCommentHandler}
      >
        {" "}
        Post{" "}
      </button>

      <div className="cardContainer">
        {curComments.map((comment, index) => (
          <Comment
            key={index}
            text={comment.text}
            handleDelete={(comment) => { deleteCommentHandler(comment) }}
            id={comment.id}
          />
        ))}
      </div>
    </div>
  );
}
