import {Router} from "express";
import grupoController from "../controllers/grupoControllers";
import validateToken from "./validateToken";

class GrupoRoutes{
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.post("/",validateToken,grupoController.addGrupo);
        this.router.get("/", validateToken,grupoController.list);
        this.router.get("/:id", validateToken,grupoController.listOne);
        this.router.delete("/:id",validateToken,grupoController.deleteGrupo);
        this.router.put("/:id",validateToken,grupoController.updateGrupo);
        
        
    }
}

const grupoRoutes = new GrupoRoutes();
export default grupoRoutes.router;