import { Router } from "express";
import maestrohorarioController from "../controllers/horarioMaestroControllers";
import validateToken from "./validateToken";

class HorarioRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get("/:id", validateToken, maestrohorarioController.listOne);
  }
}

const horarioRoutes = new HorarioRoutes();
export default horarioRoutes.router;
