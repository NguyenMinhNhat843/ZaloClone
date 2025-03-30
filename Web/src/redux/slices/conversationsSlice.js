import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export const fetchConversations = createAsyncThunk("conversations/fetchConversations", async () => {
  const querySnapshot = await getDocs(collection(db, "Conversations"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});

const conversationsSlice = createSlice({
  name: "conversations",
  initialState: { conversations: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => { state.loading = true; })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default conversationsSlice.reducer;
