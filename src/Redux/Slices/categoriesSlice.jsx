import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  loading: false,
  error: "",
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    //GET ALL
    getCategoriesStart: (state) => {
      state.loading = true;
    },
    getCategoriesSuccess: (state, action) => {
      state.loading = false;
      state.categories = action.payload;
    },
    getCategoriesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    //ADD
    addCategoryStart: (state) => {
      state.loading = true;
    },
    addCategorySuccess: (state, action) => {
      state.loading = false;
      state.categories.push(action.payload);
    },
    addCategoryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    //DELETE
    deleteCategoryStart: (state) => {
      state.loading = true;
    },
    deleteCategorySuccess: (state, action) => {
      console.log(action.payload);
      state.loading = false;
      state.categories = state.categories.filter(
        (category) => category._id !== action.payload
      );
    },
    deleteCategoryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    //UPDATE
    updateCategoryStart: (state) => {
      state.loading = true;
    },
    updateCategorySuccess: (state, action) => {
      state.loading = false;
      state.categories.map((category) => {
        if (category._id === action.payload) {
          category.name = action.payload.name;
        }
      });
    },
    updateCategoryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    reset: (state) => {
      state.loading = false;
      state.error = "";
      state.categories = [];
    },
  },
});

const actions = categoriesSlice.actions;

export const {
  addCategoryFailure,
  addCategoryStart,
  addCategorySuccess,
  getCategoriesFailure,
  getCategoriesStart,
  getCategoriesSuccess,
  deleteCategoryFailure,
  deleteCategoryStart,
  deleteCategorySuccess,
  updateCategoryFailure,
  updateCategoryStart,
  updateCategorySuccess,
  reset,
  
} = actions;

export default categoriesSlice.reducer;
