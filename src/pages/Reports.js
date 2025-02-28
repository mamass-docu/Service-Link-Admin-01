// Reports.js
import React, { useEffect, useState } from "react";
import {
  FaChartLine,
  FaUsers,
  FaStar,
  FaClock,
  FaCalendarAlt,
  FaDownload,
} from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2"; // Removed Doughnut since it's not used
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import "../css/Reports.css";
import { get, loadingProcess, where } from "../firebase/helper";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reports = () => {
  const [dateRange, setDateRange] = useState("This Month");

  // Chart Data
  const [revenueData, setRevenueData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [0, 0, 0, 0, 0, 0],
        borderColor: "#ff4d8f",
        backgroundColor: "rgba(255, 77, 143, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  });

  const [topPerformingServices, setTopPerformingServices] = useState({});
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [bookingsData, setBookingsData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Bookings",
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "#6c5dd3",
      },
    ],
  });

  const getBookings = () => {
    loadingProcess(async () => {
      const now = new Date();
      // const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      // const lastDayOfMonth = new Date(
      //   now.getFullYear(),
      //   now.getMonth() + 1,
      //   0,
      //   23,
      //   59,
      //   59
      // );
      const currentMonth = now.getMonth();

      const currentDay = now.getDay();

      // Calculate the start of the week (Sunday)
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - currentDay); // Set the date to Sunday of the current week
      startOfWeek.setHours(0, 0, 0, 0); // Set to midnight

      // Calculate the end of the week (Saturday)
      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() + (6 - currentDay)); // Set the date to Saturday of the current week
      endOfWeek.setHours(23, 59, 59, 999);

      const snap = await get(
        "bookings",
        // where("createdAt", ">=", firstDayOfMonth),
        // where("createdAt", "<=", lastDayOfMonth),
        where("status", "!=", "Cancelled")
      );

      let totalR = 0;
      let totalB = 0;
      let topServices = {};
      let weeklyBookings = [0, 0, 0, 0, 0, 0, 0];
      let monthly = [0, 0, 0, 0, 0, 0];
      snap.docs.forEach((doc) => {
        const data = doc.data();
        if (data.status == "Declined") return;
        const price = parseInt(data.price);
        totalR += price;
        totalB++;

        const createdAt = data.createdAt.toDate();
        if (createdAt.getMonth() == currentMonth) {
          console.log("done");
          const d = topServices[data.service];
          if (d)
            topServices[data.service] = {
              bookings: d.bookings + 1,
              revenue: d.revenue + price,
            };
          else
            topServices[data.service] = {
              bookings: 1,
              revenue: price,
            };

          if (createdAt >= startOfWeek && createdAt <= endOfWeek) {
            let day = createdAt.getDay();
            if (day == 0) day = 6;
            else day--;
            weeklyBookings[day]++;
          }
        }
        monthly[createdAt.getMonth()] += price;
      });
      setBookingsData({
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Bookings",
            data: weeklyBookings,
            backgroundColor: "#6c5dd3",
          },
        ],
      });
      setTopPerformingServices(topServices);
      setTotalBookings(totalB);
      setTotalRevenue(totalR);
      setRevenueData({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Revenue",
            data: monthly,
            borderColor: "#ff4d8f",
            backgroundColor: "rgba(255, 77, 143, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      });
      // console.log(
      //   totalRevenue,
      //   totalB,
      //   topServices,
      //   weeklyBookings,
      //   (2/totalB * 100),
      //   "report"
      // );
    });
  };

  const getPercentage = (b) => (b / totalBookings) * 100;

  useEffect(() => {
    getBookings();
  }, []);

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div className="header-filters">
          <div className="date-filter">
            <FaCalendarAlt />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <button className="export-btn">
            <FaDownload /> Export Report
          </button>
        </div>
      </div>

      <div className="metrics-overview">
        <div className="metric-card">
          <div className="metric-icon revenue">
            <FaChartLine />
          </div>
          <div className="metric-info">
            <h3>Total Revenue</h3>
            <div className="metric-value">₱{totalRevenue}</div>
            <div className="metric-trend positive">+12.5% from last period</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bookings">
            <FaUsers />
          </div>
          <div className="metric-info">
            <h3>Total Bookings</h3>
            <div className="metric-value">{totalBookings}</div>
            <div className="metric-trend positive">+8.2% from last period</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon rating">
            <FaStar />
          </div>
          <div className="metric-info">
            <h3>Average Rating</h3>
            <div className="metric-value">4.8</div>
            <div className="metric-trend positive">+0.3 from last period</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon completion">
            <FaClock />
          </div>
          <div className="metric-info">
            <h3>Completion Rate</h3>
            <div className="metric-value">95%</div>
            <div className="metric-trend negative">-2.1% from last period</div>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container revenue-chart">
          <h3>Revenue Overview</h3>
          <div className="chart-content">
            <Line
              data={revenueData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
              }}
            />
          </div>
        </div>

        <div className="chart-container bookings-chart">
          <h3>Weekly Bookings</h3>
          <div className="chart-content">
            <Bar
              data={bookingsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="services-performance">
        <h3>Top Performing Services</h3>
        <div className="service-stats">
          {/* {[
            {
              name: "House Cleaning",
              bookings: 156,
              revenue: 15600,
              growth: 12,
            },
            {
              name: "Carpet Cleaning",
              bookings: 98,
              revenue: 12250,
              growth: 8,
            },
            {
              name: "Window Cleaning",
              bookings: 67,
              revenue: 8375,
              growth: -3,
            },
          ] */}
          {Object.keys(topPerformingServices).map((key) => (
            <div key={key} className="service-stat-card">
              <div className="service-details">
                <h4>{key}</h4>
                <div className="stat-row">
                  <span>Bookings: {topPerformingServices[key].bookings}</span>
                  <span>Revenue: ₱{topPerformingServices[key].revenue}</span>
                </div>
              </div>
              <div className="service-growth">
                <div
                  className={`growth-indicator ${
                    "positive"
                    // service.growth >= 0 ? "positive" : "negative"
                  }`}
                >
                  {getPercentage(topPerformingServices[key].bookings)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
