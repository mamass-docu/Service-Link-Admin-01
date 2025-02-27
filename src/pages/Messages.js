// pages/Messages.js
import React, { useEffect, useRef, useState } from "react";
import {
  FaSearch,
  FaPaperPlane,
  FaEllipsisV,
  FaFilter,
  FaImage,
} from "react-icons/fa";
import "../css/Messages.css";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { add, specificLoadingProcess } from "../firebase/helper";
import { timestampToStringConverter } from "../helpers/TimestampToStringConverter";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import { setSpecificLoading } from "../state/globalsSlice";
import { uploadImage } from "../helpers/cloudinary";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const selectedId = useRef(null);
  const [message, setMessage] = useState("");
  const [filterProvider, setFilterProvider] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [supportChats, setSupportChats] = useState({});
  const [filteredChats, setFilteredChats] = useState([]);
  const [isSendingImage, setIsSendingImage] = useState(false);

  const inputImageRef = useRef(null);

  const lastMessageRef = useRef(null);
  // Sample service providers data
  const serviceProviders = [
    { id: "Aircon", name: "Aircon Services" },
    { id: "House Cleaning", name: "House Cleaning Services" },
    { id: "Plumbing", name: "Plumbing Services" },
    { id: "Electrical", name: "Electrical Services" },
    { id: "Carpentry", name: "Carpentry Services" },
    { id: "Landscaping", name: "Landscaping Services" },
  ];

  const isLoading = useSelector((state) => state.globals.specificLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSpecificLoading(false));
    let temp = {};
    let users = {};
    let unsubsChat = null;
    let unsubsActive = null;

    const q = query(
      collection(db, "users"),
      where("role", "!=", "Admin"),
      where("active", "==", true)
    );
    const w = query(collection(db, "supportChats"), orderBy("sentAt", "asc"));
    unsubsChat = onSnapshot(w, (snapshot) => {
      let c = {};
      snapshot.docs.forEach((item) => {
        const snapData = item.data();

        // let d = temp[snapData.senderId];

        // if (!d){
        //   temp[snapData.senderId] = {...users[snapData.senderId], chats:[]}
        // }

        const val = {
          id: item.id,
          message: snapData.message,
          image: snapData.image,
          isUser: snapData.isUser,
          sentAt: timestampToStringConverter(snapData.sentAt),
        };

        if (!c[snapData.senderId]) c[snapData.senderId] = [];
        c[snapData.senderId].push(val);

        // if (!d || !d?.chats) temp[snapData.senderId] = { ...d, chats: [] };
        // temp[snapData.senderId].chats = c[snapData.senderId];
      });

      if (selectedId.current) {
        const chatValue = c[selectedId.current];
        if (chatValue)
          setSelectedChat({ ...users[selectedId.current], chats: chatValue });
        else setSelectedChat(null);
      }

      temp = {};
      for (let id in c) {
        temp[id] = {
          ...users[id],
          chats: c[id],
        };
      }

      if (unsubsActive) {
        setSupportChats(temp);
        refresh(temp);
        return;
      }

      unsubsActive = onSnapshot(q, (snap) => {
        snap.docs.forEach((dc) => {
          const data = dc.data();
          const chatData = temp[dc.id];
          const userData = {
            senderId: dc.id,
            name: data.name,
            service: data.service,
            image: data.image,
            isOnline: data.isOnline,
          };

          users[dc.id] = userData;

          if (!chatData) return;

          temp[dc.id] = { ...userData, chats: chatData.chats };
        });

        setSupportChats(temp);
        refresh(temp);
      });
    });

    return () => {
      if (unsubsChat) unsubsChat();
      if (unsubsActive) unsubsActive();
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (isLoading || message.trim() == "" || !selectedChat) return;

    specificLoadingProcess(async () => {
      setMessage("");
      await add("supportChats", {
        isUser: false,
        message: message,
        senderId: selectedChat.senderId,
        sentAt: serverTimestamp(),
      });
    });
  };

  const onClickSelectImage = () => {
    if (!inputImageRef.current) return;

    inputImageRef.current.click();
  };

  const onSendImage = async (e) => {
    setIsSendingImage(true);
    try {
      const imageUrl = await uploadImage(
        e.target.files[0]
        // `image_${Date.now()}`
      );
      if (!imageUrl) {
        alert("Unable to save image!!!");
        return;
      }

      await add("supportChats", {
        message: "Sent a image",
        image: imageUrl,
        isUser: false,
        sentAt: serverTimestamp(),
        senderId: selectedChat.senderId,
      });
    } catch (e) {
      console.log(e, "error sending image");

      alert("Error sending image!!!");
    } finally {
      setIsSendingImage(false);
    }
  };

  useEffect(() => {
    refresh(supportChats);
  }, [searchTerm, filterProvider]);

  const refresh = (current) => {
    let temp = [];
    const search = searchTerm.trim().toLowerCase();
    for (let key in current) {
      const data = current[key];

      if (search != "" && !data.name.toLowerCase().includes(search)) continue;
      if (filterProvider != "All" && filterProvider != data.service) continue;

      temp.push(data);
    }
    setFilteredChats(temp);
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // const filteredChats = () => {
  //   let temp = [];
  //   const search = searchTerm.trim().toLowerCase();
  //   for (let key in supportChats) {
  //     const data = supportChats[key];

  //     if (search != "" && !data.name.toLowerCase().includes(search)) continue;
  //     if (filterProvider != "All" && filterProvider != data.service) continue;

  //     temp.push(data);
  //   }
  //   return temp;
  // };

  const onSelectChat = (chat) => {
    selectedId.current = chat.senderId;
    setSelectedChat(chat);
  };

  const getMessageStyle = (isUser) =>
    isUser
      ? {
          backgroundColor: "#D3D3D3",
          borderTopLeftRadius: 5,
        }
      : {
          backgroundColor: "#e67f12",
          color: "#fff",
          borderTopRightRadius: 5,
        };

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
              <option value="All">All Service Providers</option>
              {serviceProviders.map((provider) => (
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
          {filteredChats.map((chat) => (
            <div
              key={chat.senderId}
              className={`chat-item ${
                selectedChat && selectedChat.senderId === chat.senderId
                  ? "active"
                  : ""
              }`}
              onClick={() => onSelectChat(chat)}
            >
              <div className="chat-avatar-container">
                {chat.image ? (
                  <img
                    src={chat.image}
                    alt={chat.name}
                    className="chat-avatar"
                  />
                ) : (
                  <div className="chat-name">
                    {chat.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span
                  className={`status-indicator ${
                    chat.isOnline ? "online" : "offline"
                  }`}
                ></span>
              </div>
              <div className="chat-info">
                <div className="chat-header">
                  <h3>{chat.name}</h3>
                  <span className="chat-time">{chat.time}</span>
                </div>
                <p className="service-provider">{chat.service}</p>
                <p className="last-message">
                  {chat.chats[chat.chats.length - 1].message}
                </p>
              </div>
              {/* {chat.unread > 0 && (
                <span className="unread-badge">{chat.unread}</span>
              )} */}
            </div>
          ))}
        </div>
      </div>

      <div className="chat-area">
        {selectedId && selectedChat ? (
          <>
            <div className="chat-header">
              <div className="chat-user-info">
                <img
                  src={selectedChat.image}
                  alt="User"
                  className="user-avatar"
                />
                <div>
                  <h3>{selectedChat.name}</h3>
                  <span className="provider-label">{selectedChat.service}</span>
                </div>
              </div>
              <button className="more-options">
                <FaEllipsisV />
              </button>
            </div>

            <div className="messages">
              {/* Add message bubbles here */}
              {selectedChat.chats.length == 0 ? (
                <div className="message-notice">Start of your conversation</div>
              ) : null}

              {selectedChat.chats.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: item.isUser ? null : "flex-end",
                    marginBottom: 10,
                  }}
                  ref={
                    index === selectedChat.chats.length - 1
                      ? lastMessageRef
                      : null
                  }
                >
                  <div
                    style={{
                      padding: 12,
                      fontSize: 12,
                      borderRadius: 20,
                      ...getMessageStyle(item.isUser),
                    }}
                  >
                    {item.image ? (
                      <img
                        style={{
                          width: 100,
                          // height: 70,
                          aspectRatio: 1,
                        }}
                        src={item.image}
                      />
                    ) : (
                      <div>{item.message}</div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={lastMessageRef} />
            </div>

            <div className="message-input">
              <input
                type="file"
                ref={inputImageRef}
                onChange={onSendImage}
                style={{ display: "none" }}
                accept="image/*"
              />
              {isSendingImage ? (
                <Spinner size={"20px"} />
              ) : (
                <button
                  onClick={onClickSelectImage}
                  type="button"
                  className="send-button"
                >
                  <FaImage />
                </button>
              )}
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {isLoading ? (
                <Spinner size={"20px"} />
              ) : (
                <button
                  onClick={handleSendMessage}
                  type="button"
                  className="send-button"
                >
                  <FaPaperPlane />
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <h3>Select a chat to start messaging</h3>
            <p>
              Choose a service provider from the list to begin your conversation
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
