// Reports.js
import React, { useState } from 'react';
import { 
  FaChartLine, 
  FaUsers, 
  FaStar, 
  FaClock,
  FaCalendarAlt,
  FaDownload
} from 'react-icons/fa';
import { Line, Bar } from 'react-chartjs-2'; // Removed Doughnut since it's not used
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
} from 'chart.js';

import '../css/Reports.css'; 

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
  const [dateRange, setDateRange] = useState('This Month');

  // Chart Data
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue',
      data: [30000, 35000, 25000, 45000, 40000, 50000],
      borderColor: '#ff4d8f',
      backgroundColor: 'rgba(255, 77, 143, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const bookingsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Bookings',
      data: [25, 30, 20, 35, 28, 15, 22],
      backgroundColor: '#6c5dd3'
    }]
  };

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
            <div className="metric-value">$45,678</div>
            <div className="metric-trend positive">+12.5% from last period</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bookings">
            <FaUsers />
          </div>
          <div className="metric-info">
            <h3>Total Bookings</h3>
            <div className="metric-value">234</div>
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
                  legend: { display: false }
                }
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
                  legend: { display: false }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="services-performance">
        <h3>Top Performing Services</h3>
        <div className="service-stats">
          {[
            { name: 'House Cleaning', bookings: 156, revenue: 15600, growth: 12 },
            { name: 'Carpet Cleaning', bookings: 98, revenue: 12250, growth: 8 },
            { name: 'Window Cleaning', bookings: 67, revenue: 8375, growth: -3 }
          ].map((service, index) => (
            <div key={index} className="service-stat-card">
              <div className="service-details">
                <h4>{service.name}</h4>
                <div className="stat-row">
                  <span>Bookings: {service.bookings}</span>
                  <span>Revenue: ${service.revenue}</span>
                </div>
              </div>
              <div className="service-growth">
                <div className={`growth-indicator ${service.growth >= 0 ? 'positive' : 'negative'}`}>
                  {service.growth}%
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
