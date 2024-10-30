import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";
import { useSelector } from "react-redux";

const OverviewPage = ({ users, products, categories, orders }) => {
  // const categories = useSelector((state) => state.categories.categories);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />

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
          />{" "}
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

        {/* CHARTS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesOverviewChart orders={orders} />
          <CategoryDistributionChart
            categories={categories}
            products={products}
            users={users}
            orders={orders}
          />
          {/* <SalesChannelChart /> */}
        </div>
      </main>
    </div>
  );
};
export default OverviewPage;
