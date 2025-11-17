import { json } from "express";
import { generateToken } from "../config/generateToken.js";
import { publishToQueue } from "../config/Rabbitmq.js";
import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../index.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import { User } from "../model/User.js";

export const LoginUser = TryCatch(async (req, res) => {
  const { email } = req.body;
  const rateLimitKey = `otp:ratelimit:${email}`;
  const ratelimit = await redisClient.get(rateLimitKey);

  if (ratelimit) {
    res
      .status(429)
      .json({ message: "Too many requests. Please try again later." });
    return;
  }

  const OTP = Math.floor(100000 + Math.random() * 900000).toString();
  const otpKey = `otp:${email}`;
  await redisClient.set(otpKey, OTP, { EX: 300 });
  await redisClient.set(rateLimitKey, "1", { EX: 60 });

 const message = {
  to: email,
  subject: "Your OTP Code",
  body: `
    <div style="
      max-width: 500px;
      margin: auto;
      background: #ffffff;
      padding: 20px;
      border-radius: 10px;
      font-family: Arial, sans-serif;
      border: 1px solid #e6e6e6;
    ">
      <div style="text-align: center; padding-bottom: 20px;">
        <h2 style="color: #4A90E2; margin: 0;">🔐 Verification Code</h2>
      </div>

      <p style="font-size: 16px; color: #333;">
        Hi there,  
        <br><br>
        Use the following One-Time Password (OTP) to complete your verification:
      </p>

      <div style="
        text-align: center;
        margin: 20px 0;
        padding: 15px;
        background: #f4f8ff;
        border-radius: 8px;
        border: 1px solid #d6e4ff;
      ">
        <span style="
          font-size: 32px;
          letter-spacing: 5px;
          font-weight: bold;
          color: #4A90E2;
        ">
          ${OTP}
        </span>
      </div>

      <p style="font-size: 15px; color: #444;">
        ✔ This OTP is valid for <strong>5 minutes</strong>.  
        <br>
        ✔ Do not share this code with anyone.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">

      <p style="font-size: 12px; color: #888; text-align: center;">
        If you did not request this code, please ignore this email.
      </p>
    </div>
  `,
};

  await publishToQueue("send-otp", JSON.stringify(message));
  res.status(200).json({ message: "OTP sent to your email" });
});



export const VerifyUser = TryCatch(async (req, res) => {
  try {
    const { email, OTP } = req.body;

    console.log(email,OTP);

    if (!email || !OTP) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const otpKey = `otp:${email}`;
    const storedOTP = await redisClient.get(otpKey);

    console.log(storedOTP);

    if (storedOTP !== OTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await redisClient.del(otpKey);

  
    let user = await User.findOne({ email });

    if (!user) {
      const name = email.split("@")[0];
      user = await User.create({ name, email });
    }

    
    const token = generateToken({
      _id: user._id as string,
      name: user.name,
      email: user.email,
    });

    return res.status(200).json({
      message: "User verified successfully",
      token,
    });
  } catch (error) {
    console.error("VerifyUser Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});





export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
   const User = req.user;
   res.status(200).json({ user: User , message: "User profile fetched successfully" });
});



export const updateName = TryCatch(async (req: AuthenticatedRequest, res) => {
   const user = await User.findById(req.user?.id);

   if(!user){
    return res.status(404).json({ message: "User not found" });
   }

    const { name } = req.body;
    user.name = name || user.name;
    const updatedUser = await user.save();

    generateToken({ _id:updatedUser._id as string ,name: updatedUser.name, email: updatedUser.email});
    res.status(200).json({ user: updatedUser , message: "User name updated successfully" });

});




export const getAllUsers = TryCatch(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});




export const getUsersbyIds = TryCatch(async (req, res) => {
  const ids  = req.params.id;;

  if(!ids){
      return res.status(400).json({ message: "User IDs are required" });
  }

  const users = await User.find({ _id: { $in: ids } });
  res.status(200).json({ users, message: "Users fetched successfully" }); 

}) 