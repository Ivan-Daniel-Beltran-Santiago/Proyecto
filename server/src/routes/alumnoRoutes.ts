import { Router } from "express";
import alumnoController from "../controllers/alumnoControllers";
import validateToken from "./validateToken";

class AlumnoRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get("/", validateToken, alumnoController.list);
    this.router.get("/:id", validateToken, alumnoController.listOne);
    this.router.delete("/:id", validateToken, alumnoController.deleteAlumno);
    this.router.put("/:id", validateToken, alumnoController.updateAlumno);
  }
}

const alumnoRoutes = new AlumnoRoutes();
export default alumnoRoutes.router;
