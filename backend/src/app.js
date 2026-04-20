import express from "express"
import notFound from "./middleWares/notFound.js"
import generalErrorHandler from "./middleWares/generalErrorHandler.js"
import userRoute from "./routes/userRoute.js"
import messagesRoute from "./routes/messagesRoute.js"
import cors from "./util/core.js"

const app = express()

// connect to the frontend
app.use(cors)

// middleware
app.use(express.json())

// routes
app.use("/api/v1/app", userRoute)
app.use("/api/v1/app/messages", messagesRoute)

// not found
app.use(notFound)

// error handler
app.use(generalErrorHandler)

export default app  