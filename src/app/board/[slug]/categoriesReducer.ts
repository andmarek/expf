export default function columnsReducer(state, action) {
  switch (action.type) {
    case "ADD_COMMENT_TO_COLUMN":
      return state.map((column) => {
        if (column.columnId === action.payload.columnId) {
          return {
            ...column,
            comments: [...column.comments, action.payload.comment],
          };
        } else {
          return column;
        }
      });
    case "UPDATE_TEXT":
      return {
        ...state,
        [action.columnName]: {
          ...state[action.columnName],
          current_text: action.newText,
        },
      };
    // Add other cases for different actions
    case "SET_CATEGORIES":
      return action.payload;
    default:
      return state;
  }
}
