import OpenAI from "openai"
import "dotenv/config"
import express from "express"
import cors from 'cors'
import path from "path"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import Account from "./models/UserData.js"
import AuthRoutes from "./routes/auth.js"
import MemoryRoutes from "./routes/mem.js"
import { logEvent } from "./utils/logger.js"

const _dirname = path.resolve(); 
console.log(_dirname)
const app = express()

app.use(cors())
app.use(express.static(path.join(_dirname, "public")))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use("/auth", AuthRoutes)
app.use("/mem", MemoryRoutes)

const MongoURI = process.env.MONGO_URI

mongoose.connect(MongoURI)
   .then(() => console.log("Connected to Database"))
   .catch(err => console.error("connection error", err))

const client  = new OpenAI({
    apiKey: process.env.CHATBOT_KEY,
    baseURL: "https://openrouter.ai/api/v1",    
})

app.get('/', (req, res) => {
    res.sendFile(path.join(_dirname, "public", "index.html"))
})
app.post('/BotResponse', async (req, res) => {
    try {
        const messages = req.body.message
    
        const response = await client.chat.completions.create({
        model: "tngtech/deepseek-r1t2-chimera:free",
        messages
        })
        res.json({message: `${response.choices[0].message.content}`})
    } catch (err) {
        logEvent("error", "bot response: failed", {source: "backend"})
        console.error(err)
    }
    })

app.post('/SignIn', async (req, res) => {
    try {
        const {userEmail: email , userPassword: password } = req.body;

        const user = await Account.findOne({email}).lean()
        
        if(!user) return res.status(404).json({error: "User not found"})

        const match = await bcrypt.compare(password, user.hash)

        if(!match) return res.status(401).json({error: "Wrong Password"})

        const token = jwt.sign(
            { 
              id: user._id,
              email: user.email,
              name: {
                FirstName: user.name.firstName,
                LastName: user.name.lastName
              }  
            },
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        )
        logEvent("status", "sign in: success", {source: "server.js"})
        res.status(200).json({message: "Login Successful", token})
        
    } catch (err) {
        logEvent("error", "sign in: failed", {source: "server.js"})
        req.status(500).json({error: "Internal server error"})
    }
})
app.post('/SignUp', async (req, res) => {
    try {
        const {FirstName: firstName, LastName: lastName,
             userEmail: email, userPassword: password} = req.body;

        const user = await Account.findOne({email});
        if(user) return res.status(409).json({error: "User Already exists!!"})

        const saltRound = 10;
        const hash = await bcrypt.hash(password, saltRound)

        const newUser = new Account({
                name: {firstName, lastName},
                email,
                hash,
        })
        await newUser.save();

        const NewUser = await Account.findOne({email}).lean();
        const token = jwt.sign(
            {
                id: NewUser._id,
                email: NewUser.email,
                "name": {
                    FirstName: NewUser.name.firstName,
                    LastName: NewUser.name.lastName
                    }
            },
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        )
        logEvent("status", "sign up: success", {source: "server.js"})
        res.status(200).json({message: "user created", token})

    } catch (err) {
        logEvent("status", "sign up: failed", {source: "server.js"})
        res.status(500).json({error: "internal server error"});
    }
})

app.post("/log", (req, res) => {
    const {type, message, meta} = req.body
    logEvent(type, message, {...(meta || {}), source: "main.js"})
    res.status(200).json({success: true})
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("connected to port:", port)
})