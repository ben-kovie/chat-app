import cors from "cors"

const corsOptions = {
   origin:  "https://chat-app-omega-nine-34.vercel.app" , 
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
 allowedHeaders: ["Content-Type", "Authorization", "token"],
}

export default cors(corsOptions)
