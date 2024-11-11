const initialState = {
  userName: "",
  email: "",
  userImageURL: "",
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER_NAME":
      return {
        ...state,
        userName: action.payload,
      };
    case "SET_EMAIL":
      return {
        ...state,
        email: action.payload,
      };
    case "SET_IMAGE":
      return {
        ...state,
        userImageURL: action.payload,
      };
    default:
      return state;
  }
};
