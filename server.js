import OpenAI from "openai"
import "dotenv/config"
import express from "express"
import cors from 'cors'
import path from "path"
import bcrypt from 'bcrypt'
import mongoose from "mongoose"
import Account from "./models/UserData.js"

const _dirname = path.resolve(); 
console.log(_dirname)
const app = express()

app.use(cors())
app.use(express.static(path.join(_dirname, "public")))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

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
app.get('/BotResponse', async (req, res) => {
    const query = req.query.q || null
    
    const response = await client.chat.completions.create({
    model: "tngtech/deepseek-r1t2-chimera:free",
    messages: [
        {
            role: "user",
            content: query,
         }
    ]
    })

    res.json({message: `${response.choices[0].message.content}`})
    console.log(response.choices[0])
})

app.post('/SignIn', async (req, res) => {
    try {
        const {userEmail: email , userPassword: password } = req.body;
        
        const user = await Account.findOne({email}).lean()
        
        if(!user) {
            return res.status(404).json({error: "User not found"})
        }

        bcrypt.compare(password, user.hash, function(err, result) {
            if(result) {
                return res.json({result: "success"})
            } else {
                res.json({result: "failed"})
                console.log(err)
            }
        })

        
    } catch (err) {
        console.error(err)
        req.json({error: "Internal server error"})
    }
})
app.post('/SignUp', async (req, res) => {
    try {
        const {FirstName: firstName, LastName: lastName,
             userEmail: email, userPassword: password} = req.body;

        if(!email || !password) return res.status(400).json({error: "email or Password required"})

        //if(users[email]) return res.status(409).json({error: "user already exists"})

        const saltRound = 10;
        bcrypt.hash(password, saltRound, async function(err, hash) {
            const newUser = new Account({
                name: {firstName, lastName},
                email,
                hash,
            })

            await newUser.save()
            console.log("data saved in database")
        })

        res.json({ok: true, message: "user created"})

    } catch (err) {
        console.error(err);
        res.status(500).json({error: "internal server error"});
    }
   // res.redirect('/Account.html?mode=signup')
})



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("connected to port:", port)
})