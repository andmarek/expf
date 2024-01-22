export default function boardReducer(state, action) {
  console.log("this is the state");
  console.log(state);
  console.log("***");

  switch (action.type) {
    case "UPDATE_TEXT":
      return {
        ...state,
        [action.columnName]: {
          ...state[action.columnName],
          current_text: action.newText,
        },
      };
    case "SET_CATEGORIES":
      return { ...state, columns: action.payload };
    case "DELETE_COMMENT_FROM_COLUMN":
      return {
        ...state,
        columns: state.columns.map((column) => {
          if (column.columnId === action.payload.columnId) {
            return {
              ...column,
              comments: column.comments.filter(
                (comment) => comment.id !== action.payload.commentId
              ),
            };
          }
          return column;
        }),
      };
    case "ADD_COMMENT_TO_COLUMN":
      return {
        ...state,
        columns: state.columns.map((column) => {
          if (column.columnId === action.payload.columnId) {
            return {
              ...column,
              comments: [...column.comments, action.payload.comment],
            };
          }
          return column;
        }),
      };

    default:
      return state;
  }
}
