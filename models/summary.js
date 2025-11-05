import mongoose from "mongoose";

const summarySchema = new mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true},

    message: [{
        text: {type: String, required: true}
    }]
})

export default mongoose.model("messageSummary", summarySchema)