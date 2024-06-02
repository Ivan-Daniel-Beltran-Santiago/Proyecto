import { Router } from "express";
import claseHorarioController from "../controllers/claseHorarioControllers";
import validateToken from "./validateToken";

class ClaseHorarioRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get("/", validateToken, claseHorarioController.list);
    this.router.get("/:id", validateToken, claseHorarioController.listOne);
    this.router.post(
      "/:id",
      validateToken,
      claseHorarioController.agregarNuevoGrupo
    );
  }
}

const claseHorarioRoutes = new ClaseHorarioRoutes();
export default claseHorarioRoutes.router;
