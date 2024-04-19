import { Router } from "express";
import horarioController from "../controllers/horarioController";
import validateToken from "./validateToken";

class HorarioRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post("/", validateToken, horarioController.createHorario);
    this.router.get("/", validateToken, horarioController.list);
    this.router.get("/:id", validateToken, horarioController.listOne);
    this.router.delete("/:id", validateToken, horarioController.deleteHorario);
    this.router.put("/:id", validateToken, horarioController.updateHorario);
  }
}

const horarioRoutes = new HorarioRoutes();
export default horarioRoutes.router;
