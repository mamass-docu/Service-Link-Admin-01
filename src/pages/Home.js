// pages/Home.js
import React from "react";
import { FaDollarSign, FaEye, FaChartLine, FaChartBar } from "react-icons/fa";
import "../css/Home.css";

const Home = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Dashboard</h1>
          <div className="time-filters">
            <button className="active">Daily</button>
            <button>Weekly</button>
            <button>Monthly</button>
            <button>Yearly</button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="earnings-section">
          <div className="earnings-card">
            <h3>Current Month Earnings</h3>
            <div className="amount">₱6,468.96</div>
            <div className="chart-area">
              {/* Add your chart component here */}
            </div>
          </div>

          <div className="traffic-card">
            <h3>Traffic</h3>
            <div className="traffic-stats">
              <div className="stat-item">
                <span className="dot product"></span>
                <span>Product</span>
                <span>55%</span>
              </div>
              <div className="stat-item">
                <span className="dot facebook"></span>
                <span>Facebook</span>
                <span>33%</span>
              </div>
              <div className="stat-item">
                <span className="dot direct"></span>
                <span>Direct</span>
                <span>12%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="icon revenue">
              <FaDollarSign />
            </div>
            <div className="stat-info">
              <h4>Revenue Status</h4>
              <div className="value">₱500</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon pageviews">
              <FaEye />
            </div>
            <div className="stat-info">
              <h4>Page Views</h4>
              <div className="value">60,236</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon bounce">
              <FaChartLine />
            </div>
            <div className="stat-info">
              <h4>Bounce Rate</h4>
              <div className="value">42%</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon visits">
              <FaChartBar />
            </div>
            <div className="stat-info">
              <h4>Unique Visits</h4>
              <div className="value">₱800</div>
            </div>
          </div>
        </div>

        <div className="bottom-section">
          <div className="activities-section">
            <h3>Recent Activities</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-time">09:45 AM</div>
                <div className="activity-info">
                  <div>New service booking received</div>
                  <span className="tag booking">Booking</span>
                </div>
              </div>
              {/* Add more activity items */}
            </div>
          </div>

          <div className="orders-section">
            <h3>Order Status</h3>
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>CUSTOMER</th>
                  <th>FROM</th>
                  <th>PRICE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#4455</td>
                  <td>Candy Shop</td>
                  <td>Russia</td>
                  <td>₱524</td>
                  <td>
                    <span className="status pending">Pending</span>
                  </td>
                </tr>
                {/* Add more order rows */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
