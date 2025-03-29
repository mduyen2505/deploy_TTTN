import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { Bar, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

function Dashboard() {
  const [revenue, setRevenue] = useState(0);
  const [userGrowth, setUserGrowth] = useState({
    currentCount: 0,
    previousWeekCount: 0,
    growthPercentage: 0,
  });

  useEffect(() => {
    fetchRevenue();
    fetchUserGrowth();
  }, []);

  const fetchRevenue = async () => {
    try {
      const response = await fetch(
        "https://deploytttn-production.up.railway.app/api/orders/revenue"
      );
      const data = await response.json();
      setRevenue(data.totalRevenue || 0);
    } catch (error) {
      console.error("Lỗi khi lấy tổng doanh thu:", error);
    }
  };

  const fetchUserGrowth = async () => {
    try {
      const response = await fetch(
        "https://deploytttn-production.up.railway.app/api/users/usergrowth"
      );
      const data = await response.json();
      setUserGrowth({
        currentCount: data.data.currentCount || 0,
        previousWeekCount: data.data.previousWeekCount || 0,
        growthPercentage: parseFloat(data.data.growthPercentage) || 0,
      });
    } catch (error) {
      console.error("Lỗi khi lấy số lượng người dùng:", error);
    }
  };

  const revenueData = {
    labels: ["Doanh thu"],
    datasets: [
      {
        label: "VNĐ",
        data: [revenue],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const userGrowthData = {
    labels: ["Tuần trước", "Tuần này"],
    datasets: [
      {
        label: "Số lượng người dùng",
        data: [userGrowth.previousWeekCount, userGrowth.currentCount],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard">
      <div className="dashboard-metrics">
        <div className="metric-card">
          <h2>Số lượng đăng ký trong 7 ngày</h2>
          <p className="metric-value">{userGrowth.currentCount}</p>
        </div>
        <div className="metric-card">
          <h2>Doanh thu 7 ngày</h2>
          <p className="metric-value">{revenue.toLocaleString()} VNĐ</p>
        </div>
        <div className="metric-card">
          <h2>Tỷ lệ tăng trưởng</h2>
          <p className="metric-value">{userGrowth.growthPercentage}%</p>
        </div>
      </div>
      <div className="dashboard-charts">
        <div className="chart-card">
          <h3>Biểu đồ Doanh thu</h3>
          <Bar data={revenueData} />
        </div>
        <div className="chart-card">
          <h3>Biểu đồ Tăng trưởng Người dùng</h3>
          <Line data={userGrowthData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
