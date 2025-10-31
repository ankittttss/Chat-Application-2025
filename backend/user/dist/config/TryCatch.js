const TryCatch = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        }
        catch (error) {
            res.status(500).json({ message: "Something went wrong", error });
            console.error("Error in TryCatch wrapper:", error);
        }
    };
};
export default TryCatch;
//# sourceMappingURL=TryCatch.js.map