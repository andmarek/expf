export default function categoriesReducer(state, action) {
  switch (action.type) {
    case "added": {
      return {
        ...state,
          text: action.text,
      };
    }
    default: {
        throw Error("Unknown action: " + action.type);
    }
  }
}
