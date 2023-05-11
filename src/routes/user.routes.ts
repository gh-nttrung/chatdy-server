import express from "express";
import {
  handleGetUserByEmail,
  handleGetUserById,
  handleGetUserByUsername,
  handleGetAllUsers,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
} from "../controllers/user.controller";

const router = express.Router();

//Add user routes here
router.post("/user/create", handleCreateUser);
router.get("/user/get_all", handleGetAllUsers);
router.get("/user/get_by_id/:id", handleGetUserById);
router.get("/user/get_by_username/:user_name", handleGetUserByUsername);
router.get("/user/get_by_email/:email", handleGetUserByEmail);
router.post("/user/update/:id", handleUpdateUser);
router.post("/user/delete/:id", handleDeleteUser);

export default router;
