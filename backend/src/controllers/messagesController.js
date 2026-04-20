import { Message } from "../model/messagesModel.js";
import { User } from "../model/userModel.js";
import asyncWrapper from "../middleWares/asyncWrapper.js";
import { getIO, userSocketMap } from "../util/socket.js";


// ✅ get all users except logged-in user
export const getUsersForSidebar = asyncWrapper(async (req, res) => {
  const userId = req.user._id;

  const filteredUsers = await User.find({
    _id: { $ne: userId },
  }).select("-password");

  const unseenMessages = {};

  await Promise.all(
    filteredUsers.map(async (user) => {
      const count = await Message.countDocuments({
        sender: user._id,
        recipient: userId,
        seen: false,
      });

      if (count > 0) {
        unseenMessages[user._id] = count;
      }
    })
  );

  res.status(200).json({
    success: true,
    users: filteredUsers,
    unseenMessages,
  });
});


// ✅ get messages between two users
export const getMessages = asyncWrapper(async (req, res) => {
  const { id: selectedUserId } = req.params;
  const myId = req.user._id;

  const messages = await Message.find({
    $or: [
      { sender: myId, recipient: selectedUserId },
      { sender: selectedUserId, recipient: myId },
    ],
  }).sort({ createdAt: 1 }); // ✅ sorted messages

  // mark messages as seen
  await Message.updateMany(
    { sender: selectedUserId, recipient: myId },
    { seen: true }
  );

  res.status(200).json({
    success: true,
    messages,
  });
});


// ✅ mark single message as seen
export const markMessagesAsSeen = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  await Message.findByIdAndUpdate(id, { seen: true });

  res.status(200).json({
    success: true,
  });
});


// ✅ send message (FINAL CLEAN VERSION)
export const sendMessage = asyncWrapper(async (req, res) => {
  const { text, image } = req.body;
  const recipient = req.params.id;
  const sender = req.user._id;

  const newMessage = await Message.create({
    sender,
    recipient,
    text,
    image, // ✅ already a Cloudinary URL
  });

  const io = getIO();
  const receiverSocketId = userSocketMap[recipient];

  // send real-time message
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  res.status(200).json({
    success: true,
    newMessage,
  });
});