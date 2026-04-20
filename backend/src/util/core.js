import cors from "cors"

const corsOptions = {
   origin:  "http://localhost:5173" , // vite dev server
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
 allowedHeaders: ["Content-Type", "Authorization", "token"],
}

export default cors(corsOptions)
