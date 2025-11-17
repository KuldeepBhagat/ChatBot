import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true, unique: true},
    active: {type: String, default: null},
    sessions: {type: [String], default: []}
    },
    {collation: "Sessions"})

export default mongoose.model("SessionData", sessionSchema)
