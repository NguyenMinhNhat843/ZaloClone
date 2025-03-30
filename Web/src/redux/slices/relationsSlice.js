import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export const fetchRelations = createAsyncThunk("relations/fetchRelations", async () => {
  const querySnapshot = await getDocs(collection(db, "Relations"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});

const relationsSlice = createSlice({
  name: "relations",
  initialState: { relations: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRelations.pending, (state) => { state.loading = true; })
      .addCase(fetchRelations.fulfilled, (state, action) => {
        state.loading = false;
        state.relations = action.payload;
      })
      .addCase(fetchRelations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default relationsSlice.reducer;
