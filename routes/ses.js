import express from 'express'
import SessionData from '../models/session.js'
import { verifyToken } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/newSession', verifyToken, async (req, res) => {
    try {
        const userID = req.user.id;
        const id = crypto.randomUUID();

        const data = await SessionData.findOneAndUpdate(
            {userID},
            {
                $set: {active: id},
                $push: {sessions: id}
            },
            {
                new: true
            }
        )
        if(!data) {
            return res.status(404).json({error: "session not found", route: "newSession"})
        }
        await data.save();
        res.status(200).json({message: "session created"})
    } catch(err) {
        res.status(500).json({error: "Internal server error", route: "newSession"})
    }
})

router.post('/fetchSession', verifyToken, async (req, res) => {
    try {
        const userID = req.user.id;
        const session = await SessionData.findOne({userID}).lean()
        if(!session) {
            return res.status(404).json({error: "session not found", route: "fetchSession"})
        }

        res.status(200).json({
            active: session.active,
            sessions: session.sessions
        })

    } catch(err) {
        res.status(500).json({error: "Internal server error", route: "fetchSession"})
    }
})

router.post('/switchSession', verifyToken, async (req, res) => {
    try {
        const userID = req.user.id
        const id = req.body.id
        const data = await SessionData.findOneAndUpdate(
            {userID},
            {
                $set: {active: id},
            },
            {
                new: true
            }
        )
        if(!data) {
            return res.status(404).json({error: "session not found", route: "switchSession"})
        }
        await data.save();
        res.status(200).json({message: "session switched"})

    } catch(err) {
        res.status(500).json({error: "Internal server error", route: "switchSession"})
    }
})

router.post('/DeleteSession', verifyToken, async (req, res) => {
    try {
        const userID = req.user.id
        const id = req.body.id

        const sessionDoc = await SessionData.findOne({userID})

        if(!sessionDoc) return res.status(404).json({error: "session Document not found", route: "DeleteSession"})

        if(!sessionDoc.sessions.includes(id)) {
            return res.status(404).json({error: "session id not found in list", route: "DeleteSession"})
        }

        sessionDoc.sessions = sessionDoc.sessions.filter(s => s !== id)

        if(sessionDoc.active === id) {
            if(sessionDoc.sessions.length > 0) {
                sessionDoc.active = sessionDoc.sessions[0]
            } else {
                sessionDoc.active = null
            }
        }

        await sessionDoc.save()
        res.status(200).json({message: "success"})

    } catch(err) {
        res.status(500).json({error: "Internal server error", route: "DeleteSession"})
    }
})

export default router;