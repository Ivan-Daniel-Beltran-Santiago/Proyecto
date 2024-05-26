import { Router } from "express";
import userController from "../controllers/userController";
import validateToken from "./validateToken";
class UserRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get("/", validateToken, userController.list);
    this.router.get("/:id", validateToken, userController.getOne);
    this.router.post("/", validateToken, userController.createUser);
    this.router.delete("/:id", validateToken, userController.deleteUser);
    this.router.put("/:id", validateToken, userController.updateUser);
    this.router.post("/login", userController.loginUser);
  }
}

const userRoutes = new UserRoutes();
export default userRoutes.router;
