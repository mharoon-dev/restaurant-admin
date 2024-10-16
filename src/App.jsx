import { Route, Routes } from "react-router-dom";
import axios from "axios";
import { url } from "../utils/url.js";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import CategoriesPage from "./pages/CategoriesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import CreateCategory from "./pages/CreateCategory";
import CreateProduct from "./pages/CreateProduct";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategoriesStart,
  getCategoriesSuccess,
  getCategoriesFailure,
} from "./Redux/Slices/categoriesSlice";
import {
  getProductsFailure,
  getProductsStart,
  getProductsSuccess,
} from "./Redux/Slices/productsSlice.jsx";

const api = axios.create({
  baseURL: url,
});

function App() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  // const categories = useSelector((state) => state.categories.categories);
  //   const products = useSelector((state) => state.products.products);

  useEffect(() => {
    console.log("products:", products);
    console.log("Categories:", categories);
    console.log("users:", users);
  }, [categories, products, users]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        console.log("users API Response:", response.data);
        setUsers(response.data);
      } catch (error) {
        console.log(error);
        setUsers([]);
      }
    };

    const fetchCategories = async () => {
      try {
        // dispatch(getCategoriesStart());
        const response = await api.get("/categories");
        console.log("categories API Response:", response.data);
        setCategories(response.data);
        // dispatch(getCategoriesSuccess(response.data));
      } catch (error) {
        console.log(error);
        // dispatch(getCategoriesFailure());
      }
    };

    const fetchProducts = async () => {
      try {
        // dispatch(getProductsStart());
        const response = await api.get("/products");
        console.log("Products API Response:", response.data);
        setProducts(response.data);
        // dispatch(getProductsSuccess(response.data));
      } catch (error) {
        console.log(error);
        setProducts([]);
        // dispatch(getProductsFailure(error.message));
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders");
        console.log("Orders API Response:", response.data);
        setOrders(response.data);
      } catch (error) {
        console.log(error);
        setOrders([]);
      }
    };

    fetchUsers();
    fetchCategories();
    fetchProducts();
    fetchOrders();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* BG */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      <Sidebar />
      <Routes>
        <Route
          path="/"
          element={
            <OverviewPage
              users={users}
              products={products}
              categories={categories}
              orders={orders}
            />
          }
        />
        <Route
          path="/products"
          element={
            <ProductsPage products={products} setProducts={setProducts} />
          }
        />
        <Route path="/users" element={<UsersPage users={users} />} />
        <Route
          path="/categories"
          element={
            <CategoriesPage
              categories={categories}
              setCategories={setCategories}
            />
          }
        />
        <Route
          path="/orders"
          element={<OrdersPage orders={orders} setOrders={setOrders} />}
        />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/create-category"
          element={<CreateCategory setCategories={setCategories} />}
        />
        <Route
          path="/create-product"
          element={<CreateProduct setProducts={setProducts} />}
        />
      </Routes>
    </div>
  );
}

export default App;
