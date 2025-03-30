import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const querySnapshot = await getDocs(collection(db, "Users"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});
// Thunk xử lý đăng nhập
export const loginUser = createAsyncThunk("users/loginUser", async ({ phone, password }) => {
  const q = query(collection(db, "Users"), where("phone", "==", phone), where("password", "==", password));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("Số điện thoại hoặc mật khẩu không đúng!");
  }

  return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
});
const usersSlice = createSlice({
  name: "users",
  initialState: { users: [], loading: false, error: null },
  reducers: {
    reducers: {
      logoutUser: (state) => {
        state.user = null;
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logoutUser } = usersSlice.actions;
export default usersSlice.reducer;
