import { createContext, useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize as null
  const [selectedChat, setSelectedChat] = useState(null); // Initialize as null
  const [chats, setChats] = useState([]); // Initialize as an empty array
  const [notification, setNotification] = useState([]); // Initialize as an empty array

  const history = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      history("/");; // navigate to home if userInfo is not present
    }
  }, [history]);

  return (
    <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification }}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
