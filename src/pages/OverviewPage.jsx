import { BarChart2, ShoppingBag, Users, Zap, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import OrdersTable from "../components/orders/OrdersTable.jsx";

const OverviewPage = ({ users, products, categories, orders }) => {
  const [showTodayOrders, setShowTodayOrders] = useState(false);
  const todayOrders = orders?.filter(
    (order) => new Date(order.createdAt).toDateString() === new Date().toDateString()
  );

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />

      <div className="absolute top-4 right-6 flex items-center space-x-4">
        <button
          className="relative"
          onClick={() => setShowTodayOrders(!showTodayOrders)}
        >
          <Bell size={24} className="text-gray-700" />
          {todayOrders.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
              {todayOrders.length}
            </span>
          )}
        </button>
      </div>

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Customers"
            icon={Users}
            value={users?.length}
            color="#8B5CF6"
          />
          <StatCard
            name="Total Categories"
            icon={ShoppingBag}
            value={categories?.length}
            color="#10B981"
          />
          <StatCard
            name="Total Items"
            icon={ShoppingBag}
            value={products?.length}
            color="#EC4899"
          />
          <StatCard
            name="Total Orders"
            icon={Zap}
            value={orders?.length}
            color="#6366F1"
          />
        </motion.div>

        {/* Conditional Rendering for Today's Orders */}
        {showTodayOrders ? (
          <OrdersTable orderData={todayOrders} setOrders={() => {}} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SalesOverviewChart orders={orders} />
            <CategoryDistributionChart
              categories={categories}
              products={products}
              users={users}
              orders={orders}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default OverviewPage;
