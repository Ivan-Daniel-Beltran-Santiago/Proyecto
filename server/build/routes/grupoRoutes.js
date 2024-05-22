"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const grupoControllers_1 = __importDefault(require("../controllers/grupoControllers"));
const validateToken_1 = __importDefault(require("./validateToken"));
class GrupoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post("/", validateToken_1.default, grupoControllers_1.default.addGrupo);
        this.router.get("/", validateToken_1.default, grupoControllers_1.default.list);
        this.router.get("/:id", validateToken_1.default, grupoControllers_1.default.listOne);
        this.router.put("/:id", validateToken_1.default, grupoControllers_1.default.updateGrupo);
        this.router.delete("/:id", validateToken_1.default, grupoControllers_1.default.deleteGrupo);
    }
}
const grupoRoutes = new GrupoRoutes();
exports.default = grupoRoutes.router;
