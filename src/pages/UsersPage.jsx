import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import UserGrowthChart from "../components/users/UserGrowthChart";
import UserActivityHeatmap from "../components/users/UserActivityHeatmap";
import UserDemographicsChart from "../components/users/UserDemographicsChart";
import axios from "axios";
import { url } from "../../utils/url.js";
import { useEffect, useState } from "react";

const userStats = {
  totalUsers: 152845,
  newUsersToday: 243,
  activeUsers: 98520,
  churnRate: "2.4%",
};

const UsersPage = ({ users }) => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Customers" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <UsersTable userData={users} />
        {/* USER CHARTS */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <UserGrowthChart />
          <UserActivityHeatmap />
          <UserDemographicsChart />
        </div> */}
      </main>
    </div>
  );
};
export default UsersPage;
