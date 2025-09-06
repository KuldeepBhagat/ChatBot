import OpenAI from "openai"
import "dotenv/config"
import express from "express"
import cors from 'cors'

const app = express()
const port = 3000
app.use(cors())

const client  = new OpenAI({
    apiKey: process.env.CHATBOT_KEY,
    baseURL: "https://openrouter.ai/api/v1",    
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
})

app.listen(port, () => {
    console.log("connected to port:", port)
})