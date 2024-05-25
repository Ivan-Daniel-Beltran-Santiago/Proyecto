import { Router } from "express";
import { materialController } from "../controllers/materialControllers";

const router = Router();

router.post('/', materialController.handleFileUpload);
router.get("/", materialController.getFiles);
router.delete("/:filename", materialController.deleteFile);

router.delete("/:filename/etiqueta/:etiqueta", materialController.deleteEtiqueta);

router.get("/course-tags", materialController.getCourseTags);
router.get("/module-tags", materialController.getModuleTags);
router.get("/submodule-tags", materialController.getSubmoduleTags);

router.get("/tag/:tag", materialController.getFilesByTag);

router.get("/groups", materialController.getGroups);

export default router;
