import mongoose from "mongoose";

const memorySchema = new mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true},
    
    message: [{
        sender: {type: String, enum: ["user", "bot"], required: true},
        text: {type: String, required: true}
    }]
})

export default mongoose.model("botMemory", memorySchema)