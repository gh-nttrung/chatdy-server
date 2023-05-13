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
import { UserModel } from "../models/user.model";
import { fail, succeed } from "../utils/respone.util";

const router = express.Router();

//Add user routes here
router.post("/user/create", handleCreateUser);
router.get("/user/get_all", handleGetAllUsers);
router.get("/user/get_by_id/:id", handleGetUserById);
router.get("/user/get_by_username/:user_name", handleGetUserByUsername);
router.get("/user/get_by_email/:email", handleGetUserByEmail);
router.post("/user/update/:id", handleUpdateUser);
router.post("/user/delete/:id", handleDeleteUser);


router.post("/user/deleteAll", async (req, res) => {
  try {
    const result = await UserModel.deleteMany();
    return succeed(res, undefined, result);
  } catch (error) {
    return fail(res, 500, "error");
  }
});



export default router;
