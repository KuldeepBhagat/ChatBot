import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    sessionID: { type: String,required: true },
    sessionName: { type: String, default: "New Chat" },

    message: [{
        sender: { type: String, enum: ["user", "bot"], required: true },
        text: { type: String, required: true },
        Timestamp: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

export default mongoose.model("ChatHistory", chatSchema)