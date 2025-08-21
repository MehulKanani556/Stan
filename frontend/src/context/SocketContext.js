import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "../Utils/axiosInstance";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import { addMessage, setOnlineUsers } from "../Redux/Slice/manageState.slice"; // You'll need this action

export const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState(null);
  const [deviceType, setDeviceType] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Helper to get userId/token from storage
  const getAuth = () => ({
    userId:
      sessionStorage.getItem("userId") || localStorage.getItem("userId"),
    token: sessionStorage.getItem("token") || localStorage.getItem("token"),
  });

  const { userId, token } = getAuth();

  // Connect socket when component mounts
  useEffect(() => {
    // Connect socket immediately when user visits the site
    socketRef.current = io("http://localhost:8000", {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      forceNew: true,
    });

    window.socketRef = socketRef;

    socketRef.current.on("connect", () => {
      console.log("Socket connected to server");
      setIsConnected(true);

      // If user is logged in, join their room
      if (userId) {
        socketRef.current.emit("user-join", { userId });
      }
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    // Listen for incoming messages
    socketRef.current.on("newMessage", (message) => {
      console.log("New message received:", message);
      // Add message to Redux store
      dispatch(addMessage(message));
      
      // Show notification
      enqueueSnackbar("New message received!", {
        variant: "info",
        autoHideDuration: 3000,
      });
    });
    socketRef.current.on("online-users", (users) => {
      console.log("Online users:", users);
      dispatch(setOnlineUsers(users));
    });

    // Listen for message sent confirmation
    socketRef.current.on("messageSent", (message) => {
      console.log("Message sent successfully:", message);
      // Add message to Redux store for sender
      dispatch(addMessage(message));
    });

    // Listen for message errors
    socketRef.current.on("messageError", (error) => {
      console.error("Message error:", error);
      enqueueSnackbar("Failed to send message", {
        variant: "error",
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, []); // Remove dependencies that cause reconnection issues

  // Handle user login separately when user logs in
  useEffect(() => {
    if (!socketRef.current || !isConnected || !userId || !token) {
      return;
    }

    console.log("User logged in, joining user room");
    socketRef.current.emit("user-join", { userId });
  }, [userId, token, isConnected]);

  // Send message function
  const sendMessage = (receiverId, message, senderId) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("sendMessage", {
        receiverId,
        message,
        senderId
      });
    } else {
      enqueueSnackbar("Not connected to server", { variant: "error" });
    }
  };

  // Fetch devices from API
  const fetchDevices = async () => {
    try {
      const response = await axiosInstance.get("/devices");
      setDevices(response.data.devices || []);
    } catch (error) {
      console.error("Error fetching devices:", error);
      setDevices([]);
    }
  };

  // Handle other socket events
  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("devices-updated", () => {
      console.log("devices-updated event received");
      fetchDevices();
    });

    socketRef.current.on("force-logout", (data) => {
      console.log("Force logout received:", data);
      enqueueSnackbar(data.message || "Force logout received", {
        variant: "info",
      });
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      sessionStorage.clear();
      localStorage.clear();
      navigate("/");
    });

    socketRef.current.on("login-msg", (data) => {
      console.log("login-msg already login to other device:", data);
      const devices = data.devices || [];
    });

    socketRef.current.on("reconnect", () => {
      console.log("Socket reconnected");
      setIsConnected(true);

      // Re-join user room if logged in
      if (userId) {
        socketRef.current.emit("user-join", { userId });
      }
      fetchDevices();
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("devices-updated");
        socketRef.current.off("force-logout");
        socketRef.current.off("login-msg");
        socketRef.current.off("reconnect");
      }
    };
  }, [socketRef.current, userId, token]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        devices,
        fetchDevices,
        isConnected,
        deviceId,
        deviceType,
        sendMessage, // Expose sendMessage function
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};