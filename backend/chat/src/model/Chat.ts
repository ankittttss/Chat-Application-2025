import mongoose,{Document} from "mongoose";

export interface IChat extends Document {
    users: string[];
    latestMessage: {
        text:string,
        sender:string
    };
    updatedAt: Date;
    createdAt: Date;
}

const schema = new mongoose.Schema({
    users: [{ type: String, sender: String, ref: "User" }],
    latestMessage: {
        text: { type: String },
        sender: { type: String, ref: "User" }
    }
}, { timestamps: true });

export const Chat = mongoose.model<IChat>("Chat", schema);