import express from "express"
import { verifyToken } from "../middleware/AuthMiddleware.js"
import chatHistory from "../models/ChatHistory.js"

const router = express.Router();

router.post("/StoreChat", verifyToken, async (req, res) => {
    try {
        const message = req.body.message;
        const userID = req.user.id;
        const SavedChat = await chatHistory.findOne({userID})
        if(!SavedChat) {
            const Chat = new chatHistory({
            userID,
            message,

        })
        await Chat.save();
        return res.status(200).json({message: "new chat histroy created", time: Date()})
        }

        SavedChat.message.push(...message)
        await SavedChat.save()

        res.status(200).json({message: "chat history saved", time: Date()})
    } catch (err) {
        console.error(err)
        res.status(500).json({error: "interanl server error", route: "StoreChat"})
    }
})

router.post("/FetchChat", verifyToken, async (req, res) => {
    try {
        const userID = req.user.id;
        const fetchChat = await chatHistory.findOne({userID}).select("message -_id").lean()
        if(!fetchChat) return res.status(404).json({error: "no chat found", route: "FetchChat"})
        res.status(200).json({chat: fetchChat.message})
    } catch(err) {
        console.error(err)
        res.status(500).json({error: "internal server error", route: "FetchChat"})    
    }
    
})

export default router;