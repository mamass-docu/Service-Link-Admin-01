// pages/Messages.js
import React, { useState } from 'react';
import { FaSearch, FaPaperPlane, FaEllipsisV, FaFilter } from 'react-icons/fa';
import '../css/Messages.css';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [filterProvider, setFilterProvider] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample service providers data
  const serviceProviders = [
    { id: 1, name: "House Cleaning Services" },
    { id: 2, name: "Plumbing Services" },
    { id: 3, name: "Electrical Services" },
    { id: 4, name: "Carpentry Services" },
    { id: 5, name: "Landscaping Services" }
  ];

  // Sample chats data with service provider information
  const chats = [
    {
      id: 1,
      name: 'Alice Smith',
      serviceProvider: "House Cleaning Services",
      providerId: 1,
      lastMessage: 'Thank you for your service!',
      time: '10:30 AM',
      unread: 2,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500',
      status: 'online'
    },
    {
      id: 2,
      name: 'Bob Johnson',
      serviceProvider: "Plumbing Services",
      providerId: 2,
      lastMessage: 'When can you start?',
      time: '9:15 AM',
      unread: 0,
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=500',
      status: 'offline'
    },
    // Add more chat items as needed
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  // Filter chats based on search term and selected service provider
  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.serviceProvider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvider = filterProvider === 'all' || chat.providerId === parseInt(filterProvider);
    return matchesSearch && matchesProvider;
  });

  return (
    <div className="messages-container">
      <div className="chat-list">
        <div className="chat-list-header">
          <h2>Messages</h2>
          
          {/* Service Provider Filter */}
          <div className="provider-filter">
            <div className="filter-icon">
              <FaFilter />
            </div>
            <select 
              value={filterProvider}
              onChange={(e) => setFilterProvider(e.target.value)}
              className="provider-select"
            >
              <option value="all">All Service Providers</option>
              {serviceProviders.map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search messages or providers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="chats">
          {filteredChats.map(chat => (
            <div 
              key={chat.id}
              className={`chat-item ${selectedChat === chat.id ? 'active' : ''}`}
              onClick={() => setSelectedChat(chat.id)}
            >
              <div className="chat-avatar-container">
                <img src={chat.avatar} alt={chat.name} className="chat-avatar" />
                <span className={`status-indicator ${chat.status}`}></span>
              </div>
              <div className="chat-info">
                <div className="chat-header">
                  <h3>{chat.name}</h3>
                  <span className="chat-time">{chat.time}</span>
                </div>
                <p className="service-provider">{chat.serviceProvider}</p>
                <p className="last-message">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && (
                <span className="unread-badge">{chat.unread}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="chat-area">
        {selectedChat ? (
          <>
            <div className="chat-header">
              <div className="chat-user-info">
                <img 
                  src={chats.find(c => c.id === selectedChat)?.avatar} 
                  alt="User" 
                  className="user-avatar" 
                />
                <div>
                  <h3>{chats.find(c => c.id === selectedChat)?.name}</h3>
                  <span className="provider-label">
                    {chats.find(c => c.id === selectedChat)?.serviceProvider}
                  </span>
                </div>
              </div>
              <button className="more-options">
                <FaEllipsisV />
              </button>
            </div>

            <div className="messages">
              {/* Add message bubbles here */}
              <div className="message-notice">
                Start of your conversation
              </div>
            </div>

            <form className="message-input" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" className="send-button">
                <FaPaperPlane />
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <h3>Select a chat to start messaging</h3>
            <p>Choose a service provider from the list to begin your conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
