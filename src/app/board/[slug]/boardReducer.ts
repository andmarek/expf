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
            const updatedComments = column.comments.map((comment) => {
              console.log("comment", comment);
              console.log("hey", action.payload.commentId);
              if (comment.id === action.payload.commentId) {
                console.log("found a comment with the comment Id");
                const newComment = {
                  ...comment,
                  comment_likes: comment.comment_likes + 1,
                };
                console.log(newComment);
                return newComment;
              }
              return comment;
            });

            const updatedColumn = {
              ...column,
              comments: updatedComments,
            };
            console.log("update col", updatedColumn);
            return updatedColumn;
          }
          return column;
        }),
      };
    case "DECREMENT_LIKES_ON_COMMENT":
      return {
        ...state,
        columns: state.columns.map((column) => {
          if (column.columnId === action.payload.columnId) {
            const updatedComments = column.comments.map((comment) => {
              console.log("comment", comment);
              console.log("hey", action.payload.commentId);
              if (comment.id === action.payload.commentId) {
                console.log("found a comment with the comment Id");
                const newComment = {
                  ...comment,
                  comment_likes: comment.comment_likes - 1,
                };
                console.log(newComment);
                return newComment;
              }
              return comment;
            });

            const updatedColumn = {
              ...column,
              comments: updatedComments,
            };
            console.log("update col", updatedColumn);
            return updatedColumn;
          }
          return column;
        }),
      };
    case "MOVE_COMMENT": {
      const { sourceColumnId, destinationColumnId, sourceCommentId } =
        action.payload;
      console.log(sourceColumnId, destinationColumnId, sourceCommentId);
      let commentToMove = null;

      const newColumns = state.columns.map((column) => {
        if (column.columnId === sourceColumnId) {
          const commentIndex = column.comments.findIndex(
            (comment) => comment.id === sourceCommentId
          );
          if (commentIndex > -1) {
            commentToMove = { ...column.comments[commentIndex] };
            return {
              ...column,
              comments: [
                ...column.comments.slice(0, commentIndex),
                ...column.comments.slice(commentIndex + 1),
              ],
            };
          }
        }
        return column;
      });

      if (commentToMove) {
        const newColumnsWithMovedComment = newColumns.map((column) => {
          if (column.columnId === destinationColumnId) {
            return { ...column, comments: [...column.comments, commentToMove] };
          }
          return column;
        });

        return { ...state, columns: newColumnsWithMovedComment };
      }
      return state;
    }
    default:
      return state;
  }
}
