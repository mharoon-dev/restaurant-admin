import { configureStore } from "@reduxjs/toolkit";

import categoriesReducer from "./Slices/categoriesSlice.jsx";
import productsReducer from "./Slices/productsSlice.jsx";
import userReducer from "./Slices/userSlice.jsx";

const store = configureStore(
  {
    reducer: {
      user: userReducer,
      categories: categoriesReducer,
      products: productsReducer,
    },
  },
  +window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
