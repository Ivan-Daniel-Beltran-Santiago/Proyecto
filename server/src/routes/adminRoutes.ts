import { Router } from "express";
import adminController from "../controllers/adminControllers";
import validateToken from "./validateToken";

class AdminRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get("/", validateToken, adminController.list);
    this.router.get("/:id", validateToken, adminController.listOne);
    this.router.delete("/:id", validateToken, adminController.delete);
    this.router.put("/:id", validateToken, adminController.updateAdmin);
  }
}

const adminRoutes = new AdminRoutes();
export default adminRoutes.router;
