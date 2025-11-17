import express from "express"
import { verifyToken } from "../middleware/AuthMiddleware.js"
import chatHistory from "../models/ChatHistory.js"

const router = express.Router();

router.post("/StoreChat", verifyToken, async (req, res) => {
    try {
        const message = req.body.message;
        const sessionID = req.body.sessionID
        const SavedChat = await chatHistory.findOne({sessionID})
        if(!SavedChat) {
            const Chat = new chatHistory({
            sessionID,
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
        const sessionID = req.body.sessionID;
        const fetchChat = await chatHistory.findOne({sessionID}).select("message -_id").lean()
        if(!fetchChat) return res.status(404).json({error: "no chat found", route: "FetchChat"})
        res.status(200).json({chat: fetchChat.message})
    } catch(err) {
        console.error(err)
        res.status(500).json({error: "internal server error", route: "FetchChat"})    
    }
    
})

router.post("/DeleteChat", verifyToken, async (req, res) => {
    try {
        const sessionID = req.body.sessionID;
        const del = await chatHistory.deleteOne({sessionID})
        if(del.deletedCount === 0) {
           return res.status(200).json({message: "no document found"})
        }
        res.status(200).json({message: "success"})
    } catch(err) {
        console.error(err)
        res.status(500).json({error: "internal server error", route: "DeleteChat"})    
    }
    
})

export default router;