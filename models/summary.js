import mongoose from "mongoose";

const summarySchema = new mongoose.Schema({
    sessionID: { type: String,required: true },

    message: [{
        text: {type: String, required: true}
    }]
})

export default mongoose.model("messageSummary", summarySchema)