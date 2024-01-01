export default function columnsReducer(state, action)  {
    switch (action.type) {
        case 'UPDATE_TEXT':
            return {
                ...state,
                [action.columnName]: {
                    ...state[action.columnName],
                    current_text: action.newText
                }
            };
        // Add other cases for different actions
        case 'SET_CATEGORIES':
            return action.payload;
        default:
            return state;
    }
};
