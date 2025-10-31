import express from "express";
import { LoginUser } from "../controllers/user.js";
const router = express.Router();
router.post('/login', LoginUser);
export default router;
//# sourceMappingURL=user.js.map