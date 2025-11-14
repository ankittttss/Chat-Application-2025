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
    to: "anmolsainiii23@gmail.com",
    subject: "Your OTP Code",
    body: `<h1>Your OTP Code is ${OTP}</h1><p>This code is valid for 5 minutes.</p>`,
  };
  await publishToQueue("send-otp", JSON.stringify(message));
  console.log(`OTP ${OTP} sent to email ${email}`);

  res.status(200).json({ message: "OTP sent to your email" });
});



export const VerifyUser = TryCatch(async (req, res) => {
  const { email, OTP } = req.body;
  console.log(email, OTP);

  if (!email || !OTP) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const otpKey = `otp:${email}`;
  const storedOTP = await redisClient.get(otpKey);

  if (storedOTP !== OTP) {
    console.log("Invalid OTP attempt for email", email);
    return res.status(400).json({ message: "Invalid OTP" });
  }

  await redisClient.del(otpKey);
  console.log("User with email", email, "verified successfully");

  let user = await User.findOne({ email }); 
  console.log(user)

  if (!user) {
    const name = email.split("@")[0];
    user = await User.create({ name, email }); 
    console.log("New user created with email", email);
  }

  const token = generateToken({name:user.name, email: user.email }); 
  console.log("Generated JWT token for", email,token);

  res.status(200).json({
    message: "User verified successfully",
    token,
  });
});




export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
   const User = req.user;
   res.status(200).json({ user: User , message: "User profile fetched successfully" });
});



export const updateName = TryCatch(async (req: AuthenticatedRequest, res) => {
   const user = await User.findById(req.user?.id);
   console.log(user);

   if(!user){
    return res.status(404).json({ message: "User not found" });
   }

    const { name } = req.body;
    user.name = name || user.name;
    const updatedUser = await user.save();

    generateToken({ name: updatedUser.name, email: updatedUser.email});
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