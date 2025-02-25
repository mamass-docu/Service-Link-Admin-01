// Services.js
import React, { useState } from 'react';
import { FaPlus, FaSearch, FaClock, FaBookmark } from 'react-icons/fa';
import '../css/Services.css';

const Services = () => {
  const [services, ] = useState([
    {
      id: 1,
      name: "House Cleaning",
      price: 99.99,
      duration: "2 hours",
      status: "active",
      bookings: 25,
      description: "Complete house cleaning service including dusting, vacuuming, and sanitizing"
    },
    {
      id: 2,
      name: "Carpet Cleaning",
      price: 149.99,
      duration: "3 hours",
      status: "active",
      bookings: 18,
      description: "Deep carpet cleaning with professional equipment and eco-friendly products"
    },
    {
      id: 3,
      name: "Window Cleaning",
      price: 79.99,
      duration: "1.5 hours",
      status: "inactive",
      bookings: 12,
      description: "Professional window cleaning service for both interior and exterior"
    }
  ]);

  return (
    <div className="services-container">
      <div className="services-toolbar">
        <button className="add-service-btn">
          <FaPlus /> Add New Service
        </button>

        <div className="search-filters">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search services by name, price..." 
              className="search-input"
            />
          </div>
          <div className="filter-controls">
            <select className="filter-select">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <select className="filter-select">
              <option>Sort by Name</option>
              <option>Sort by Price</option>
              <option>Sort by Bookings</option>
            </select>
          </div>
        </div>
      </div>

      <div className="services-grid">
        {services.map(service => (
          <div key={service.id} className="service-card">
            <div className="service-header">
              <h3>{service.name}</h3>
              <span className={`status-badge ${service.status}`}>
                {service.status}
              </span>
            </div>
            
            <p className="service-description">{service.description}</p>
            
            <div className="service-info">
              <div className="info-item">
                <span className="label">Price:</span>
                <span className="value">${service.price}</span>
              </div>
              <div className="info-item">
                <FaClock className="info-icon" />
                <span className="value">{service.duration}</span>
              </div>
              <div className="info-item">
                <FaBookmark className="info-icon" />
                <span className="value">{service.bookings} bookings</span>
              </div>
            </div>

            <div className="service-actions">
              <button className="edit-btn">Edit</button>
              <button className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
