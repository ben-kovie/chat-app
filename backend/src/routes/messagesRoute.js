import express from "express"
import auth from "../middleWares/authMiddleware.js"
import {getMessages, getUsersForSidebar,
     markMessagesAsSeen,
    sendMessage} from "../controllers/messagesController.js"

const router = express.Router()
router.use(auth)

router.get('/users', getUsersForSidebar)
router.get('/:id', getMessages)
router.put('mark/:id', markMessagesAsSeen)
router.post("/send/:id", sendMessage)

export default router