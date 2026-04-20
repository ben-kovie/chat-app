import mongoose from "mongoose"


const connectDB = async ()=>{
    try{
     const DB = process.env.MONGO_URL
       await mongoose.connect(DB, {})
         console.log("mongoDB connnected")
    }
    catch(err){
         console.log("erro connecting to database")
         process.exit(1)
    }
}

export default connectDB