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
        res.status(500).json({error: "internal server error", route: "memorySave"})
    }
})

router.post('/memoryFetch', verifyToken, async (req, res) => {
    try {
        const userID = req.user.id
        const chat = await botMemory.findOne({userID}).select("message -_id").lean()
        if(!chat) return res.status(404).json({error: "no chat found", route: "memoryFetch"})
        res.status(200).json({chat: chat.message})
        
    } catch (err) {
        res.status(500).json({error: "internal server error", route: "memoryFetch"})
    }
})

router.post('/clearMemory', verifyToken, async (req, res) => {
    try {
        const userID = req.user.id
        const memory = await botMemory.findOne({userID})
        if(!memory) return res.status(404).json({error: "no memory found to clear", route: "clearMemory"})

        memory.message = memory.message.slice(-1)
        await memory.save();
        res.status(200).json({message: "success"})
    } catch(err) {
        res.status(500).json({error: "Internal server error", route: "clearMemory"})
    }
})

router.post('/summarySave', verifyToken, async (req, res) => {
    try {
        const message = req.body.message
        const userID = req.user.id

        const collection = await messageSummary.findOne({userID})
        if(!collection) {
            const data = new messageSummary({
                userID,
                message
            })
            await data.save()
            return res.status(200).json({message: "new summary saved"})
        }

        collection.message.push(...message)
        await collection.save()

        res.status(200).json({message: "summary saved"})

    } catch (err) {
        res.status(500).json({error: "internal server error", route: "summarySave"})
    }
})

router.post('/summaryFetch', verifyToken, async (req, res) => {
    try{
        const userID = req.user.id;
        const summary = await messageSummary.findOne({userID}).lean()
        if(!summary) return res.status(200).json({exists: false, message: null})
        res.status(200).json({exists: true, message: summary.message})
    } catch(err) {
        res.status(500).json({error: "Internal server error", route: "summaryFetch"})
    }
    
})

export default router;