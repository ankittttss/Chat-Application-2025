import { publishToQueue } from "../config/Rabbitmq.js";
import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../index.js";
import { User } from "../model/User.js";
export const LoginUser = TryCatch(async (req, res) => {
    const { email } = req.body;
    const rateLimitKey = `otp:ratelimit:${email}`;
    const ratelimit = await redisClient.get(rateLimitKey);
    console.log("Rate limit value for", email, "is", ratelimit);
    if (ratelimit) {
        res
            .status(429)
            .json({ message: "Too many requests. Please try again later." });
        console.log("Rate limit exceeded for", email);
        return;
    }
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `otp:${email}`;
    await redisClient.set(otpKey, OTP, { EX: 300 });
    await redisClient.set(rateLimitKey, "1", { EX: 60 });
    const message = {
        to: email,
        subject: "Your OTP Code",
        body: `<h1>Your OTP Code is ${OTP}</h1><p>This code is valid for 5 minutes.</p>`,
    };
    await publishToQueue("send-otp", JSON.stringify(message));
    console.log(`OTP ${OTP} sent to email ${email}`);
    res.status(200).json({ message: "OTP sent to your email" });
});
export const VerifyUser = TryCatch(async (req, res) => {
    const { email, OTP } = req.body;
    if (!email || !OTP) {
        res.status(400).json({ message: "Email and OTP are required" });
        return;
    }
    const otpKey = `otp:${email}`;
    const storedOTP = await redisClient.get(otpKey);
    if (storedOTP === OTP) {
        await redisClient.del(otpKey);
        res.status(200).json({ message: "User verified successfully" });
        console.log("User with email", email, "verified successfully");
        let user = User.findOne({ email: email });
        if (!user) {
        }
        else {
        }
    }
    else {
        res.status(400).json({ message: "Invalid OTP" });
        console.log("Invalid OTP attempt for email", email);
    }
});
//# sourceMappingURL=user.js.map