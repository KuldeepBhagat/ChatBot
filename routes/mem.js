import express from 'express'
import { verifyToken } from "../middleware/AuthMiddleware.js"
import botMemory from '../models/memory.js'
import messageSummary from '../models/summary.js'

const router = express.Router()

router.post('/memorySave', verifyToken, async (req, res) => {
    try {
        const sessionID = req.body.sessionID
        const message = req.body.message

        const collection = await botMemory.findOne({sessionID})
        if(!collection) {
            const data = new botMemory({
                sessionID,
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
        const sessionID = req.body.sessionID
        const chat = await botMemory.findOne({sessionID}).select("message -_id").lean()
        if(!chat) return res.status(404).json({error: "no chat found", route: "memoryFetch"})
        res.status(200).json({chat: chat.message})
        
    } catch (err) {
        res.status(500).json({error: "internal server error", route: "memoryFetch"})
    }
})

router.post('/clearMemory', verifyToken, async (req, res) => {
    try {
        const sessionID = req.body.sessionID
        const memory = await botMemory.findOne({sessionID})
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
        const sessionID = req.body.sessionID

        const collection = await messageSummary.findOne({sessionID})
        if(!collection) {
            const data = new messageSummary({
                sessionID,
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
        const sessionID = req.body.sessionID
        const summary = await messageSummary.findOne({sessionID}).lean()
        if(!summary) return res.status(200).json({exists: false, message: null})
        res.status(200).json({exists: true, message: summary.message})
    } catch(err) {
        res.status(500).json({error: "Internal server error", route: "summaryFetch"})
    }
    
})

router.post("/DeleteMemory", verifyToken, async (req, res) => {
    try {
        const sessionID = req.body.sessionID;
        const del_one = await botMemory.deleteOne({sessionID})
        const del_two = await messageSummary.deleteOne({sessionID})

        if(del_two.deletedCount === 0 || del_one.deletedCount === 0) {
           return res.status(200).json({message: "no document found"})
        }
        res.status(200).json({message: "success"})
    } catch(err) {
        console.error(err)
        res.status(500).json({error: "internal server error", route: "DeleteMemory"})    
    }
    
})

export default router;