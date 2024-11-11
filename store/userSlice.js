import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    uid: null,
    name: null,
    // other user fields...
  },
  reducers: {
    setUserName: (state, action) => {
      state.name = action.payload;
    },
    // other reducers...
  },
});

export const { setUserName } = userSlice.actions;
export default userSlice.reducer;
