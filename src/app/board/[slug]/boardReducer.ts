export default function boardReducer(state, action) {
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
    case "INCREMENT_LIKES_ON_COMMENT":
      return {
        ...state,
        columns: state.columns.map((column) => {
          if (column.columnId === action.payload.columnId) {
            // Found the correct column, now update the comments array within it
            const updatedComments = column.comments.map((comment) => {
              console.log("comment", comment);
              console.log("hey", action.payload.commentId);
              if (comment.id === action.payload.commentId) {
                console.log("found a comment with the comment Id");
                // Found the correct comment, now increment its likes
                const newComment = {
                  ...comment,
                  likes: comment.likes + 1, // Assuming 'likes' is a numeric field
                };
                console.log(newComment);
                return newComment;
              }
              return comment; // Return the comment unchanged if it's not the one we're looking for
            });

            // Return the updated column with the updatedComments array
            const updatedColumn = {
              ...column,
              comments: updatedComments,
            }
            console.log("update col", updatedColumn);
            return updatedColumn;
          }
          return column; // Return the column unchanged if it's not the one we're looking for
        })
      };
    case "DECREMENT_LIKES_ON_COMMENT":
      return {
        ...state,
        columns: state.columns.map((column) => {
          if (column.columnId === action.payload.columnId) {
            // Found the correct column, now update the comments array within it
            const updatedComments = column.comments.map((comment) => {
              console.log("comment", comment);
              console.log("hey", action.payload.commentId);
              if (comment.id === action.payload.commentId) {
                console.log("found a comment with the comment Id");
                // Found the correct comment, now increment its likes
                const newComment = {
                  ...comment,
                  likes: comment.likes - 1, // Assuming 'likes' is a numeric field
                };
                console.log(newComment);
                return newComment;
              }
              return comment; // Return the comment unchanged if it's not the one we're looking for
            });

            // Return the updated column with the updatedComments array
            const updatedColumn = {
              ...column,
              comments: updatedComments,
            }
            console.log("update col", updatedColumn);
            return updatedColumn;
          }
          return column; // Return the column unchanged if it's not the one we're looking for
        })
      };

    default:
      return state;
  }
}
