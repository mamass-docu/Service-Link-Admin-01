import { createSlice } from "@reduxjs/toolkit";

const globalsSlice = createSlice({
  name: "globals",
  initialState: { user: null, loading: false, specificLoading: false },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSpecificLoading: (state, action) => {
      state.specificLoading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setLoading, setSpecificLoading, setUser } = globalsSlice.actions;
export default globalsSlice.reducer;
