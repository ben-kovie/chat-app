import React, { useEffect, useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../chat-app-assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const Sidebar = () => {
  const navigate = useNavigate();

  const {
    getUsers,
    users = [], 
    selectedUser,
    setSelectedUser,
    unseenMessages = {}, 
    setUnseenMessages,
  } = useContext(ChatContext);

  const { logout, onlineUsers = [] } = useContext(AuthContext);

  const [input, setInput] = useState("");

  // Fetch users
  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  // Filter users safely
  const filteredUsers = useMemo(() => {
    if (!users) return []; 
    if (!input) return users;

    return users.filter((user) =>
      user.fullName.toLowerCase().includes(input.toLowerCase())
    );
  }, [input, users]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setUnseenMessages((prev) => ({
      ...prev,
      [user._id]: 0,
    }));
  };

  return (
    <div
      className={`bg-[#818582]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* HEADER */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />

          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer"
            />

            <div className="absolute top-full right-0 z-20 w-32 p-4 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>

              <hr className="my-2 border-gray-500" />

              <p onClick={logout} className="cursor-pointer text-sm">
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex items-center gap-2 mt-4">
          <img src={assets.search_icon} alt="search" className="w-3" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Search user..."
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#ccc] flex-1"
          />
        </div>
      </div>

      {/* USERS LIST */}
      <div className="flex flex-col">
        {filteredUsers.length === 0 ? (
          <p className="text-xs text-gray-400 px-2">No users found</p>
        ) : (
          filteredUsers.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            const unseenCount = unseenMessages[user._id] || 0;
            const isSelected = selectedUser?._id === user._id;

            return (
              <div
                key={user._id}
                onClick={() => handleSelectUser(user)}
                className={`relative flex items-center gap-3 p-2 pl-4 rounded cursor-pointer transition ${
                  isSelected
                    ? "bg-[#282142]/50"
                    : "hover:bg-[#282142]/30"
                }`}
              >
                <img
                  src={user.profilePic || assets.avatar_icon}
                  alt="avatar"
                  className="w-[35px] aspect-square rounded-full"
                />

                <div className="flex flex-col leading-5">
                  <p className="text-sm">{user.fullName}</p>
                  <span
                    className={`text-xs ${
                      isOnline ? "text-green-400" : "text-neutral-400"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>

                {unseenCount > 0 && (
                  <p className="absolute top-3 right-3 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/70">
                    {unseenCount}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Sidebar;