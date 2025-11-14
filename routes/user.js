import express from 'express'
import { verifyToken } from '../middleware/AuthMiddleware.js'

const router = express.Router()

router.post('/userData', verifyToken, async (req, res) => {
    try {
       const user = req.user;
        res.status(200).json({firstName: user.name.FirstName,
                               lastName: user.name.LastName,
                               email: user.email
                            })
    } catch(err) {
        res.status(500).json({error: "Internal server error", route: "userData"})
    }
})

export default router