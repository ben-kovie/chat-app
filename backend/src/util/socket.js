import { Server } from "socket.io"

// store io instance
let io

// store online users → { userId: socketId }
export const userSocketMap = {}

// initialize socket
export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  })

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId

    console.log("✅ User connected:", userId, socket.id)

    // store user
    if (userId) {
      userSocketMap[userId] = socket.id
    }

    // send online users to everyone
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    // disconnect
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", userId)

      delete userSocketMap[userId]

      io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
  })
}

// get io anywhere
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized")
  }
  return io
}