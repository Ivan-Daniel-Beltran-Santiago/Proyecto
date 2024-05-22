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
exports.claseController = void 0;
const database_1 = __importDefault(require("../database"));
class ClaseController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clase = yield database_1.default.query(`SELECT g.id_grupo, 
        MAX(c.id_clase) AS id_clase, 
        MAX(c.id_alumno) AS id_alumno, 
        MAX(c.fecha_inscripcion) AS fecha_inscripcion, 
        MAX(c.fecha_baja) AS fecha_baja,
        g.nombre_grupo, g.Idioma, g.categoria, g.id_maestro, g.id_maestro2, 
        g.fecha_inicio, g.fecha_revision, g.fecha_final
 FROM clase c
 JOIN grupo g ON c.id_grupo = g.id_grupo
 GROUP BY g.id_grupo, g.nombre_grupo, g.Idioma, g.categoria, g.id_maestro, g.id_maestro2, 
          g.fecha_inicio, g.fecha_revision, g.fecha_final;`);
                res.json(clase);
            }
            catch (error) {
                console.error("Error en la consulta:", error);
                res.status(400).json({
                    msg: "Error en la consulta",
                    error: error.message,
                });
            }
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const clase = yield database_1.default.query("SELECT * FROM clase WHERE id_clase=?", [id]);
            res.json(clase);
        });
    }
    addClase(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let alumnoId = req.body.id_alumno;
            let grupo = req.body.id_grupo;
            let alumnoArray = yield database_1.default.query("Select * from clase where id_alumno = ? AND id_grupo=? ", [alumnoId, grupo]);
            let alumno = JSON.parse(JSON.stringify(alumnoArray[0]));
            console.log(alumno[0]);
            try {
                if (alumno[0]) {
                    return res.status(400).json({
                        msg: "Alumno Inscrito ya en esta clase",
                    });
                }
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
            try {
                if (alumnoId == 0 || grupo == 0) {
                    return res.status(400).json({
                        msg: "Favor de llenar los campos",
                    });
                }
                else {
                    const clase = yield database_1.default.query("INSERT INTO clase SET ?", [req.body]);
                    res.json({ message: "Registros insertados correctamente" });
                }
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
    deleteClase(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const clase = yield database_1.default.query("Delete from clase where id_clase = ?", id);
                res.json({ text: "Clase eliminada" });
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
    updateClase(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const datos = req.body;
            try {
                yield database_1.default.query("UPDATE clase SET ? WHERE id_clase = ?", [datos, id]);
                res.json({ message: "Clase updated" });
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
}
exports.claseController = new ClaseController();
exports.default = exports.claseController;
