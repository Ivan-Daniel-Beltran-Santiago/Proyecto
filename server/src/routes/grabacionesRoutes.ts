import { Router } from "express";
import grabacionController from "../controllers/grabacionControllers";
import validateToken from "./validateToken";

class GrabacionRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get("/", validateToken, grabacionController.list);
    this.router.get("/:id", validateToken, grabacionController.listOne);
    this.router.get(
      "/:id/:fecha",
      validateToken,
      grabacionController.listRecording
    );
    this.router.post("/", validateToken, grabacionController.addGrabacion);
    this.router.put("/:id", validateToken, grabacionController.updateG);
    this.router.delete("/:id", validateToken, grabacionController.deleteG);
  }
}

const grabacionesRoutes = new GrabacionRoutes();
export default grabacionesRoutes.router;
