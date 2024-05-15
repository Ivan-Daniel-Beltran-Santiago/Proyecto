import { Router } from "express";
import calificacionControllers from "../controllers/calificacionControllers";
import validateToken from "./validateToken";

class CalificacionRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get("/:id", validateToken, calificacionControllers.list);
    this.router.get("/", validateToken, calificacionControllers.listAll);
    this.router.get(
      "/:idG/:id",
      validateToken,
      calificacionControllers.listOne
    );
    this.router.get(
      "/s/:id",
      validateToken,
      calificacionControllers.listOneFecha
    );
    this.router.delete(
      "/:id",
      validateToken,
      calificacionControllers.deleteCalificacion
    );
    this.router.post(
      "/",
      validateToken,
      calificacionControllers.addCalificacion
    );
    this.router.put(
      "/:id",
      validateToken,
      calificacionControllers.updateCalificacion
    );
  }
}

const calificacionRoutes = new CalificacionRoutes();
export default calificacionRoutes.router;
