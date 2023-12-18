import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    user:null,
    loading: false,
};

// Attempt to parse the token from localStorage and handle potential errors
const storedUser = localStorage.getItem("user");

try {
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  if (parsedUser) {
    initialState.user = parsedUser;
  }
} catch (error) {
  console.error("Error parsing token from localStorage:", error);
  // You may want to clear the token in case of an error
  localStorage.removeItem("user");
}

const profileSlice = createSlice({
    name:"profile",
    initialState: initialState,
    reducers: {
        setUser(state, value) {
            state.user = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
        }
    },
});

export const {setUser, setLoading} = profileSlice.actions;
export default profileSlice.reducer;