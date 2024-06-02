"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.maestroController = void 0;
const database_1 = __importDefault(require("../database"));
class MaestroController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const maestro = yield database_1.default.query("SELECT * from users WHERE id_rol=2 AND status='Activo'");
                res.json(maestro);
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const maestro = yield database_1.default.query("SELECT * FROM users where id_user = ? AND id_rol = 2 AND status='Activo'", [id]);
                res.json(maestro);
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).json({
                    msg: "Error al consultar",
                });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield database_1.default.query("DELETE FROM users WHERE id_user = ? AND id_rol=2", [id]);
                res.json({ text: "Teacher deleted" });
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
    updateMaestro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const datos = req.body;
            try {
                yield database_1.default.query("UPDATE users SET ? WHERE id_user = ? AND id_rol = 2 AND status='Activo'", [datos, id]);
                res.json({ message: "Maestro updated" });
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
}
exports.maestroController = new MaestroController();
exports.default = exports.maestroController;
