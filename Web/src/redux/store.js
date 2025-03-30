// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import callsReducer from "./slices/callsSlice";
import messagesReducer from "./slices/messagesSlice";
import conversationsReducer from "./slices/conversationsSlice";
import usersReducer from "./slices/usersSlice";
import relationsReducer from "./slices/relationsSlice";

const store = configureStore({
  reducer: {
    calls: callsReducer,
    messages: messagesReducer,
    conversations: conversationsReducer,
    users: usersReducer,
    relations: relationsReducer,
  },
});

export default store;
