import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export const fetchCalls = createAsyncThunk("calls/fetchCalls", async () => {
  const querySnapshot = await getDocs(collection(db, "Calls"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});

const callsSlice = createSlice({
  name: "calls",
  initialState: { calls: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalls.pending, (state) => { state.loading = true; })
      .addCase(fetchCalls.fulfilled, (state, action) => {
        state.loading = false;
        state.calls = action.payload;
      })
      .addCase(fetchCalls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default callsSlice.reducer;
