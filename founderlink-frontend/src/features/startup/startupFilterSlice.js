import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
  industry: "",
  stage: "",
  minFunding: null,
  maxFunding: null,
  sortBy: "createdAt",
  sortDir: "desc"
};

const startupFilterSlice = createSlice({
  name: "startupFilters",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload.trimStart();
    },

    setIndustry: (state, action) => {
      state.industry = action.payload;
    },

    setStage: (state, action) => {
      state.stage = action.payload;
    },

    setFundingRange: (state, action) => {
      const { min, max } = action.payload;

      if (min !== undefined && min >= 0) {
        state.minFunding = min;
      }

      if (max !== undefined && max >= 0) {
        state.maxFunding = max;
      }
    },

    setSort: (state, action) => {
      const { sortBy, sortDir } = action.payload;
      state.sortBy = sortBy;
      state.sortDir = sortDir;
    },

    resetFilters: () => initialState
  }
});

export const {
  setSearch,
  setIndustry,
  setStage,
  setFundingRange,
  setSort,
  resetFilters
} = startupFilterSlice.actions;

export default startupFilterSlice.reducer;