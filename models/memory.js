import mongoose from "mongoose";

const memorySchema = new mongoose.Schema({
    sessionID: { type: String,required: true },
    
    message: [{
        sender: {type: String, enum: ["user", "bot"], required: true},
        text: {type: String, required: true}
    }]
})

export default mongoose.model("botMemory", memorySchema)