import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import startupReducer from "../features/startup/startupSlice";
import startupFilterReducer from "../features/startup/startupFilterSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    startups: startupReducer,          // ✅ THIS MUST EXIST
    startupFilters: startupFilterReducer
  }
});

// export default store