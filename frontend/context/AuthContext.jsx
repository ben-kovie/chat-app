import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendURL =
  import.meta.env.VITE_BACKEND_URL || "https://chat-app-8hwi.onrender.com";

axios.defaults.baseURL = backendURL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const socketRef = useRef(null);

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  /* =========================
     🔌 SOCKET MANAGEMENT
  ========================= */

  const connectSocket = (user) => {
    if (!user || socketRef.current?.connected) return;

    const socket = io(backendURL, {
      query: { userId: user._id },
      auth: { token } // optional (if backend uses it)
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  /* =========================
     🔐 AUTH LOGIC
  ========================= */

  const setAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/v1/app/check");

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      } else {
        logout(false);
      }
    } catch {
      logout(false);
    }
  };

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(
        `/api/v1/app/${state}`,
        credentials
      );

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      // Save token
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setAuthHeader(data.token);

      // Set user
      setAuthUser(data.user);
      connectSocket(data.user);

      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const logout = (showToast = true) => {
    localStorage.removeItem("token");
    setAuthHeader(null);

    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);

    disconnectSocket();

    if (showToast) toast.success("Logged out successfully");
  };

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put(
        "/api/v1/app/updateProfile",
        body
      );

      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  /* =========================
     ⚡ INITIAL AUTH CHECK
  ========================= */

  useEffect(() => {
    if (!token) return;

    setAuthHeader(token);
    checkAuth();

    return () => disconnectSocket();
  }, [token]);

  /* =========================
     📦 CONTEXT VALUE
  ========================= */

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket: socketRef.current,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};