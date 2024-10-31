import { configureStore } from "@reduxjs/toolkit";
import mainSlice from "./MainSlice";

const store = configureStore({
  reducer: { mainSlice: mainSlice.reducer },
});

export default store;
