import mongoose, { Document } from "mongoose";
const schema = new mongoose.Schema({
    users: [{ type: String, sender: String, ref: "User" }],
    latestMessage: {
        text: { type: String },
        sender: { type: String, ref: "User" }
    }
}, { timestamps: true });
export const Chat = mongoose.model("Chat", schema);
//# sourceMappingURL=Chat.js.map