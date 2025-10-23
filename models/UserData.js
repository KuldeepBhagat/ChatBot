import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true}
    },
    email: {type: String, required: true, unique: true},
    hash: {type: String, required: true},
    
    },
    {collection: "UserData"}
)

export default mongoose.model("UserData", userSchema);