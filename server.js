import OpenAI from "openai"
import "dotenv/config"
import express from "express"
import cors from 'cors'
import path from "path"

const _dirname = path.resolve(); 
const app = express()

app.use(cors())
app.use(express.static(path.join(_dirname, "public")))
app.use(express.urlencoded({extended: true}))
app.use(express.json())


const client  = new OpenAI({
    apiKey: process.env.CHATBOT_KEY,
    baseURL: "https://openrouter.ai/api/v1",    
})

app.get('/', (req, res) => {
    res.sendFile(path.join(_dirname, "public", "index.html"))
})
app.get('/test', async (req, res) => {
    const query = req.query.q || null
    
    const response = await client.chat.completions.create({
    model: "deepseek/deepseek-chat-v3.1:free",
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

app.post('/SignIn', (req, res) => {
    const data = req.body
    console.log(data)
    res.redirect('/index.html')
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("connected to port:", port)
})