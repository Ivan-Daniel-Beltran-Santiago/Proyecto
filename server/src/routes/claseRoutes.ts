import { Router } from "express";
import claseController from "../controllers/claseControllers";
import validateToken from "./validateToken";

class ClaseRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post("/", validateToken, claseController.addClase);
    this.router.get("/", validateToken, claseController.list);
    this.router.get("/:id", validateToken, claseController.listOne);
    this.router.delete("/:id", validateToken, claseController.deleteClase);
    this.router.put("/:id", validateToken, claseController.updateClase);
  }
}

const claseRoutes = new ClaseRoutes();
export default claseRoutes.router;
