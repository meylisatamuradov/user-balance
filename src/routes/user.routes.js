import { Router } from "express";
import userController from "../controllers/user.controller";

const userRoutes = Router();
userRoutes.put("/user", userController.update);

export { userRoutes };
