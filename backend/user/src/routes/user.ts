import express  from "express";
import { getAllUsers, getUsersbyIds, LoginUser, myProfile, updateName, VerifyUser } from "../controllers/user.js";
import { isAuth } from "../middleware/isAuth.js";
const router=express.Router();

router.post('/login',LoginUser);
router.post('/verify',VerifyUser);
router.get('/myProfile',isAuth,myProfile);
router.get('/user/getAll',isAuth,getAllUsers);
router.get('/user/:id',isAuth,getUsersbyIds);
router.patch('/user/updateUser',isAuth,updateName)

export default router;