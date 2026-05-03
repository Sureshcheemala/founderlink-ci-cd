import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getStartups } from "../../services/startupService";

// 🔥 Async thunk
export const fetchStartups = createAsyncThunk(
  "startups/fetchStartups",
  async ({ filters, page = 0 }, { rejectWithValue }) => {
    try {
      const res = await getStartups({
        ...filters,
        page,
        size: 6
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch startups"
      );
    }
  }
);

// 🔹 Initial state
const initialState = {
  startups: [],
  status: "idle",   // 🔥 better than loading boolean
  error: null,
  page: 0,
  totalPages: 0
};

// 🔹 Slice
const startupSlice = createSlice({
  name: "startups",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchStartups.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStartups.fulfilled, (state, action) => {
        const payload = action.payload || {};

        state.startups = Array.isArray(payload.content)
          ? payload.content
          : [];

        state.page =
          typeof payload.number === "number" ? payload.number : 0;

        state.totalPages =
          typeof payload.totalPages === "number"
            ? payload.totalPages
            : 0;

        state.status = "succeeded";
      })
      .addCase(fetchStartups.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.startups = [];
      });
  }
});

export default startupSlice.reducer;