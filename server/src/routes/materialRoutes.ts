import { Router } from "express";
import { materialController } from "../controllers/materialControllers";

const router = Router();

router.post('/', materialController.handleFileUpload);
router.get("/", materialController.getFiles);
router.delete("/:filename", materialController.deleteFile);

router.delete("/:filename/etiqueta/:etiqueta", materialController.deleteEtiqueta);

router.get("/course-tags", materialController.getCourseTags);

export default router;
