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
import CreateCoupen from "./pages/CreateCoupen.jsx";
import CreateDeal from "./pages/CreateDeal.jsx"; // Import CreateDeal component
import DealsPages from "./pages/DealPage.jsx"; // Import DealsPage for viewing deals
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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
import CoupensPages from "./pages/CoupensPages.jsx";

const api = axios.create({
  baseURL: url,
});

function App() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [coupens, setCoupens] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deals, setDeals] = useState([]); // Add state for deals

  useEffect(() => {
    console.log("products:", products);
    console.log("Categories:", categories);
    console.log("users:", users);
    console.log("deals:", deals);
  }, [categories, products, users, deals]);

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
        const response = await api.get("/categories");
        console.log("categories API Response:", response.data);
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        console.log("Products API Response:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.log(error);
        setProducts([]);
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

    const fetchCoupens = async () => {
      try {
        const response = await api.get("/coupens");
        console.log("Coupens API Response:", response.data);
        setCoupens(response.data);
      } catch (error) {
        console.log(error);
        setCoupens([]);
      }
    };

    const fetchDeals = async () => {
      try {
        const response = await api.get("/deals/deals");
        console.log("Deals API Response:", response.data);
        setDeals(response.data);
      } catch (error) {
        console.log(error);
        setDeals([]);
      }
    };

    fetchUsers();
    fetchCategories();
    fetchProducts();
    fetchOrders();
    fetchCoupens();
    fetchDeals(); // Fetch deals
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Background */}
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
              deals={deals} // Pass deals to OverviewPage if needed
            />
          }
        />
        <Route
          path="/products"
          element={
            <ProductsPage
              products={products}
              setProducts={setProducts}
              categories={categories}
              setCategories={setCategories}
            />
          }
        />
        <Route path="/users" element={<UsersPage users={users} />} />
        <Route
          path="/coupons"
          element={<CoupensPages coupens={coupens} setCoupens={setCoupens} />}
        />
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
        <Route
          path="/create-coupon"
          element={<CreateCoupen setCoupens={setCoupens} />}
        />
        <Route
          path="/deals"
          element={
            <DealsPages deals={deals} setDeals={setDeals} products={products} />
          }
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/create-category"
          element={<CreateCategory setCategories={setCategories} />}
        />
        <Route
          path="/create-product"
          element={<CreateProduct setProducts={setProducts} />}
        />
        {/* New Routes for Deals */}
        {/* <Route
          path="/deals"
          element={<DealsPage deals={deals} setDeals={setDeals} />} // View all deals
        /> */}
        <Route
          path="/create-deal"
          element={<CreateDeal products={products} setDeals={setDeals} />} // Create new deal
        />
      </Routes>
    </div>
  );
}

export default App;
