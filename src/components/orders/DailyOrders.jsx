import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const dailyOrdersData = [
  { date: "jan", orders: 45 },
  { date: "feb", orders: 52 },
  { date: "mar", orders: 49 },
  { date: "apr", orders: 60 },
  { date: "may", orders: 55 },
  { date: "jun", orders: 58 },
  { date: "jul", orders: 62 },
  { date: "aug", orders: 65 },
  { date: "sep", orders: 70 },
  { date: "oct", orders: 75 },
  { date: "nov", orders: 80 },
  { date: "dec", orders: 85 },
];

const transformOrderData = (orders) => {
  const monthlyOrders = {};

  orders.forEach((order) => {
    const month = new Date(order.createdAt).toLocaleString("default", {
      month: "short",
    });

    if (!monthlyOrders[month]) {
      monthlyOrders[month] = 0;
    }

    // Summing the orders for each month based on quantity
    monthlyOrders[month] += order.quantity;
  });

  // Convert the object to an array format that Recharts can use
  return Object.keys(monthlyOrders).map((month) => ({
    date: month,
    orders: monthlyOrders[month],
  }));
};

const DailyOrders = ({ orderData = ordersData, setOrders }) => {
  // Transforming the order data to be grouped by month
  const monthlyOrdersData = transformOrderData(orderData);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Monthly Orders
      </h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={monthlyOrdersData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#8B5CF6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DailyOrders;
