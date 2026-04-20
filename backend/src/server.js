import dotenv from "dotenv"
import http from "http"
import app from "./app.js"
import connectDB from "./util/connectDB.js"
import { initSocket } from "./util/socket.js"

dotenv.config({ path: "./src/config/.env" })

const port = process.env.PORT || 5000

// create server
const server = http.createServer(app)

const startServer = async () => {
  try {
    await connectDB()
    console.log("✅ Database connected")

    // initialize socket
    initSocket(server)

    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`)
    })
  } catch (error) {
    console.error("❌ Server error:", error.message)
    process.exit(1)
  }
}

startServer()