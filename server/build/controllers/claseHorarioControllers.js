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
exports.claseHorarioController = void 0;
const database_1 = __importDefault(require("../database"));
class ClaseHorarioController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clase = yield database_1.default.query("SELECT * FROM clase c JOIN grupo g ON c.id_grupo = g.id_grupo WHERE c.fecha_baja IS NULL GROUP BY g.id_grupo, c.id_clase");
                res.json(clase);
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
    agregarNuevoGrupo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            let nombre_grupo = req.body.nombre_grupo;
            let fecha_inicio = req.body.fecha_inicio;
            let fecha_revision = req.body.fecha_revision;
            let fecha_final = req.body.fecha_final;
            try {
                yield database_1.default.query("START TRANSACTION;");
                yield database_1.default.query("INSERT INTO grupo (nombre_grupo,Idioma, categoria, id_maestro, id_maestro2,fecha_inicio,fecha_revision,fecha_final) SELECT ?, Idioma, categoria, id_maestro, id_maestro2,?,?,? FROM grupo WHERE id_grupo = ?;", [nombre_grupo, fecha_inicio, fecha_revision, fecha_final, id]);
                const result = yield database_1.default.query("SELECT LAST_INSERT_ID() as nuevo_id_grupo;");
                const nuevo_id_grupo = JSON.parse(JSON.stringify(result[0]));
                console.log(nuevo_id_grupo[0].nuevo_id_grupo);
                const nuevo_grupo = nuevo_id_grupo[0].nuevo_id_grupo;
                const grupo = yield database_1.default.query("INSERT INTO clase (id_grupo, id_alumno) SELECT ?, id_alumno FROM clase WHERE id_grupo = ?;", [nuevo_grupo, id]);
                yield database_1.default.query("COMMIT;");
                res.json(grupo);
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
                const clase = yield database_1.default.query("SELECT * FROM clase c JOIN grupo g ON c.id_grupo = g.id_grupo WHERE g.id_maestro =? OR g.id_maestro2=? GROUP BY g.id_grupo, Innova_English_School.c.id_clase;", [id, id]);
                res.json(clase);
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
}
exports.claseHorarioController = new ClaseHorarioController();
exports.default = exports.claseHorarioController;
