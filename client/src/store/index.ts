import fileReducer from "./fileSlice";

import { combineReducers, configureStore } from "@reduxjs/toolkit";

// const rootReducer = combineReducers({
//   booksReducer,
//   authorsReducer
// });
const store = configureStore({
    reducer: fileReducer
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const selectUserFiles = (state: RootState) => state.userFiles
export const selectCustomers = (state: RootState) => state.customers
