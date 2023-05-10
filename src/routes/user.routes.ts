import express from "express";
import {
  handleGetUserByEmail,
  handleGetUserById,
  handleGetUserByUsername,
  handleGetUsers,
  handleRegisterUser,
} from "../controllers/user.controller";

const router = express.Router();

//Add user routes here
router.post("/user/register", handleRegisterUser);
router.get("/user/get_all_users", handleGetUsers);
router.get("/user/:id", handleGetUserById);
router.get("/user/get_by_username", handleGetUserByUsername);
router.get("/user/get_by_email", handleGetUserByEmail);

export default router;
