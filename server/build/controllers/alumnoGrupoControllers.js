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
exports.alumnoGrupoController = void 0;
const database_1 = __importDefault(require("../database"));
class AlumnoGrupoController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const clase = yield database_1.default.query("SELECT id_user,first_nameU,last_nameU,last_nameU2,c.id_grupo from users u JOIN clase c ON u.id_user = c.id_alumno WHERE c.id_grupo =? AND c.fecha_baja IS  NULL;", id);
                res.json(clase);
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
    listBaja(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clase = yield database_1.default.query("SELECT id_user,first_nameU,last_nameU,last_nameU2,g.id_grupo,g.nombre_grupo,c.fecha_baja from users u JOIN clase c ON u.id_user = c.id_alumno JOIN grupo g ON c.id_grupo = g.id_grupo WHERE c.fecha_baja IS NOT NULL;");
                res.json(clase);
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
                const clase = yield database_1.default.query("SELECT c.id_clase, g.id_grupo, g.nombre_grupo FROM clase c JOIN grupo g ON c.id_grupo = g.id_grupo WHERE c.id_alumno=? GROUP BY c.id_clase, g.id_grupo, g.nombre_grupo;", id);
                res.json(clase);
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { idG } = req.params;
            const { fecha } = req.params;
            try {
                const clase = yield database_1.default.query("UPDATE clase SET fecha_baja = ? WHERE id_alumno =? AND id_grupo=?;", [fecha, id, idG]);
                res.json("Alumno deleted");
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
    reinscribir(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fecha = req.params.fecha;
            const id_Alumno = req.params.id_Alumno;
            const id_Grupo = req.params.id_Grupo;
            try {
                const clase = yield database_1.default.query("UPDATE clase SET fecha_inscripcion=?, fecha_baja = NULL WHERE id_alumno =? AND id_grupo=?;", [fecha, id_Alumno, id_Grupo]);
                res.json("Alumno Reinscrito");
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
}
exports.alumnoGrupoController = new AlumnoGrupoController();
exports.default = exports.alumnoGrupoController;
