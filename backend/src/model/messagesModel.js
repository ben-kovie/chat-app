import mongoose from "mongoose"

const chatDB = mongoose.connection.useDb("chatDB")
const MessagesSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
    },
   image: {
    type: String,
   },
   video: {
    type: String,
   },
   seen:{
    type: Boolean,
    default: false
   }
}, { timestamps: true })

export const Message = chatDB.model("Message", MessagesSchema)