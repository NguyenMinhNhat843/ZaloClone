import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export const fetchMessages = createAsyncThunk("messages/fetchMessages", async () => {
  const querySnapshot = await getDocs(collection(db, "Messages"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});

const messagesSlice = createSlice({
  name: "messages",
  initialState: { messages: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => { state.loading = true; })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default messagesSlice.reducer;
