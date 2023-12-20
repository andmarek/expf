export default function Column({ name, currentText, onTextChange, comments }) {
  return (
    <div className="flex flex-col p-5">
      <h1>{name}</h1>

      <textarea className="text-red" />

      {comments.map((comment, index) => (
        <p key={index}> {comment} </p>
      ))}

      <button className="bg-green rounded text-center my-1"> Post </button>

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
  );
}
