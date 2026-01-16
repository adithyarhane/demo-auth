import express from "express";
import {
  isAuthenticated,
  login,
  logout,
  register,
} from "../controller/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.route("/register").post(register);
authRouter.route("/login").post(login);
authRouter.route("/logout").post(logout);
authRouter.route("/is-auth").get(userAuth, isAuthenticated);

export default authRouter;
