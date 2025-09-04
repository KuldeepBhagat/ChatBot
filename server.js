import OpenAI from "openai"
import "dotenv/config"
import  express from "express"

const client  = new OpenAI({
    apiKey: process.env.CHATBOT_KEY,
    baseURL: "https://openrouter.ai/api/v1",    
})

const response = await client.chat.completions.create({
    model: "deepseek/deepseek-chat-v3.1:free",
    messages: [
        {
            role: "user",
            content: "hello how are you",
         }
    ]
})

console.log(response.choices[0].message)