import { Router } from "express";
import alumnoGrupoController from "../controllers/alumnoGrupoControllers";
import validateToken from "./validateToken";

class AlumnoGrupoRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get("/:id", validateToken, alumnoGrupoController.list);
    this.router.get("/", validateToken, alumnoGrupoController.listBaja);
    this.router.get("/s/:id", validateToken, alumnoGrupoController.listOne);
    this.router.put("/:id/:idG/:fecha", alumnoGrupoController.delete);
    this.router.put(
      "/s/:fecha/:id_Alumno/:id_Grupo",
      alumnoGrupoController.reinscribir
    );
  }
}

const alumnoGrupoRoutes = new AlumnoGrupoRoutes();
export default alumnoGrupoRoutes.router;
