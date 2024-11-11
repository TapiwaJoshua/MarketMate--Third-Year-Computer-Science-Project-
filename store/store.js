import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { userReducer } from "../utils/reducers/userReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});
