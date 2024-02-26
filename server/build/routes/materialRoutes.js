"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const materialControllers_1 = require("../controllers/materialControllers");
const router = (0, express_1.Router)();
router.post('/', materialControllers_1.materialController.handleFileUpload);
router.get("/", materialControllers_1.materialController.getFiles);
router.delete("/:filename", materialControllers_1.materialController.deleteFile);
exports.default = router;
