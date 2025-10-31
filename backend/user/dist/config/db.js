import mongoose from "mongoose";
const ConnecttoDB = async () => {
    const url = process.env.MONGO_URL;
    if (!url) {
        throw new Error("MongoDB URL is not defined in environment variables");
    }
    try {
        await mongoose.connect(url, {
            dbName: "UserDB"
        });
        console.log("Connected to MongoDB");
    }
    catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};
export default ConnecttoDB;
//# sourceMappingURL=db.js.map