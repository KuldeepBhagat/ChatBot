import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import authRoutes from './routes/auth.js';

dotenv.config();
const app = express();
const port = 3000;
app.use(cors())
app.use(express.json())

app.use(bodyParser.json())


const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.CHATBOT_KEY
})
                                                     // Bot Response
app.get('/chatbot', async (req, res) => {
    try {
        const query = req.query.q;
        const result = await openai.chat.completions.create({
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [{role: "user", content: query}],
    });
    res.json(result.choices[0].message.content)
    console.log("data fetched")
    } catch(err) {
        const Error = err.name + ': ' + err.message
        console.error(Error)
        res.status(500).json({error: Error})
    }
})

                                                         // DataBase

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDb Connected'))
    .catch(err => console.error('DB Error: ', err));

app.use('/api', authRoutes);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});