import  express  from "express";
import { createChat, fetchAll } from "../controllers/chat.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.post("/chat/new",isAuth,createChat);
router.get("/chat/all",isAuth,fetchAll);

export default router;
