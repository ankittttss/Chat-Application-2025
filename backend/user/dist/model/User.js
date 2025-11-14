import mongoose, { Document, Schema } from "mongoose";
const schema = new Schema({
    id: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
}, {
    timestamps: true,
});
export const User = mongoose.model("User", schema);
//# sourceMappingURL=User.js.map