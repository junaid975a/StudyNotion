import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signupData: null,
  loading: false,
  token: null,
};

// Attempt to parse the token from localStorage and handle potential errors
const storedToken = localStorage.getItem("token");

try {
  const parsedToken = storedToken ? JSON.parse(storedToken) : null;
  if (parsedToken) {
    initialState.token = parsedToken;
  }
} catch (error) {
  console.error("Error parsing token from localStorage:", error);
  // You may want to clear the token in case of an error
  localStorage.removeItem("token");
}

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, action) {
      state.signupData = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;
