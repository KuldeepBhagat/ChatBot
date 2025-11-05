import express from 'express'
import { verifyToken } from "../middleware/AuthMiddleware.js"
import botMemory from '../models/memory.js'
import messageSummary from '../models/summary.js'

const router = express.Router()

router.post('/memorySave', verifyToken, async (req, res) => {
    try {
        const userID = req.user.id
        const message = req.body.message

        const collection = await botMemory.findOne({userID})
        if(!collection) {
            const data = new botMemory({
                userID,
                message
            })
            await data.save()
            return res.status(200).json({message: "new memory saved"})
        }

        collection.message.push(...message)
        await collection.save()
        res.status(200).json({message: "success"})
    } catch (err) {
        res.status(500).json({error: "internal server error", event: "memorySave"})
    }
})

router.post('/memoryFetch', verifyToken, async (req, res) => {
    try {
        const userID = req.user.id
        const chat = await botMemory.findOne({userID}).select("message -_id").lean()
        if(!chat) return res.status(404).json({error: "no chat found", route: "memoryFetch"})
        res.status(200).json({chat: chat.message})
        
    } catch (err) {
        res.status(500).json({error: "internal server error", event: "memory fetch"})
    }
})

export default router;