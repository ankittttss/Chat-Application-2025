import TryCatch from "../config/TryCatch.js";
import { isAuth, type AuthenticatedRequest } from "../middleware/isAuth.js";
import { Chat } from "../model/Chat.js";

export const createChat = TryCatch(async (req: AuthenticatedRequest, res) => {
  const userId = req.user?._id;
  const { receiverId } = req.body;

  console.log(userId,"User Id")

  if (!receiverId) {
    return res.status(400).json({ message: "Receiver ID is required" });
  }

  const existingChat = await Chat.findOne({
    users: { $all: [userId, receiverId], $size: 2 },
  });

  if (existingChat) {
    return res
      .status(200)
      .json({ message: "Chat already exists", chatId: existingChat._id });
  }
  const newChat = new Chat({
    users: [userId, receiverId],
    latestMessage: { text: "", sender: "" },
  });

  console.log(newChat);

  await newChat.save();
  return res.status(201).json(newChat);
});

export const fetchAll = TryCatch(async (req: AuthenticatedRequest, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized - User not authenticated"
    });
  }

 
  const allChats = await Chat.find({
    users: userId
  })


  if (!allChats || allChats.length === 0) {
    return res.status(200).json({
      message: "No chats found",
      chats: []
    });
  }

  return res.status(200).json({
    message: "Chats fetched successfully",
    count: allChats.length,
    chats: allChats
  });
});
