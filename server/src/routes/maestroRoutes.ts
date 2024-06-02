import { Router } from "express";
import maestroController from "../controllers/maestroControllers";
import validateToken from "./validateToken";

class MaestroRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get("/", validateToken, maestroController.list);
    this.router.get("/:id", validateToken, maestroController.listOne);
    this.router.delete("/:id", validateToken, maestroController.delete);
    this.router.put("/:id", validateToken, maestroController.updateMaestro);
  }
}

const maestroRoutes = new MaestroRoutes();
export default maestroRoutes.router;
