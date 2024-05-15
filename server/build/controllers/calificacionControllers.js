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
exports.calificacionController = void 0;
const database_1 = __importDefault(require("../database"));
class CalificacionController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const calificacion = yield database_1.default.query("SELECT * FROM calificaciones WHERE id_grupo = ?", id);
                res.json(calificacion);
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
    listAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const calificacion = yield database_1.default.query("SELECT * FROM calificaciones");
                res.json(calificacion);
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const idG = req.params.idG;
            try {
                const calificacion = yield database_1.default.query("SELECT * FROM calificaciones c JOIN grupo g ON c.id_grupo = g.id_grupo WHERE c.id_alumno=? AND c.id_grupo=? ORDER BY c.fecha_calif ASC;", [id, idG]);
                res.json(calificacion);
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
    listOneFecha(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const calificacion = yield database_1.default.query("SELECT * FROM calificaciones WHERE id_calificacion=?", id);
                res.json(calificacion);
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
    addCalificacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let calif = req.body.calificacion;
            let fecha = req.body.fecha_calif;
            let grupo = req.body.id_grupo;
            try {
                let calificacion = yield database_1.default.query("Select * from calificaciones where id_alumno = ? AND fecha_calif = ? AND id_grupo=?", [req.body.id_alumno, req.body.fecha_calif, grupo]);
                let fechas_grupo = yield database_1.default.query("SELECT fecha_inicio,fecha_final FROM grupo where id_grupo=?", grupo);
                let fechas = JSON.parse(JSON.stringify(fechas_grupo[0]));
                console.log(fechas[0]);
                const fecha_inicio = fechas[0].fecha_inicio;
                const fecha_final = fechas[0].fecha_final;
                if (fecha > fecha_final.substring(10, 0) ||
                    fecha < fecha_inicio.substring(10, 0)) {
                    res.status(400).json({
                        msg: "Fecha fuera del rango de clases",
                    });
                }
                else {
                    let numero = "";
                    let num = 0; //numero para saber si hay calificacion repetido al mismo alumno en la misma fecha
                    for (numero in calificacion[0]) {
                        num = parseInt(numero) + 1;
                    }
                    if (num > 0) {
                        res.status(400).json({
                            msg: "Calificacion existente con esta fecha , favor de actualizar calificacion",
                        });
                        console.log(num);
                        console.log(req.body);
                    }
                    else {
                        if (calif < 0 || calif > 100 || calif === "" || fecha == "") {
                            res
                                .status(400)
                                .json({ msg: "Error en las calificaciones o fecha" });
                            //console.log(req.body);
                        }
                        else {
                            try {
                                yield database_1.default.query("INSERT INTO calificaciones SET ?", [req.body]);
                                res.json({ text: "Grade added" });
                                //console.log(req.body);
                            }
                            catch (error) {
                                console.error("Error al ejecutar la consulta MySQL:", error);
                                res.status(500).send("Error al insertar calificacion");
                            }
                        }
                    }
                }
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
    deleteCalificacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield database_1.default.query("DELETE FROM calificaciones WHERE id_calificacion=?", [
                    id,
                ]);
                res.json({ text: "Grade deleted" });
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
    updateCalificacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const datos = req.body;
            let fecha = req.body.fecha_calif;
            let grupo = req.body.id_grupo;
            let calif = req.body.calificacion;
            try {
                let fechas_grupo = yield database_1.default.query("SELECT fecha_inicio,fecha_final FROM grupo where id_grupo=?", grupo);
                let fechas = JSON.parse(JSON.stringify(fechas_grupo[0]));
                console.log(fechas[0]);
                const fecha_inicio = fechas[0].fecha_inicio;
                const fecha_final = fechas[0].fecha_final;
                if (fecha > fecha_final || fecha < fecha_inicio) {
                    res.status(400).json({
                        msg: "Fecha fuera del rango de clases",
                    });
                }
                else {
                    if (calif < 0 || calif > 100 || calif === "" || fecha == "") {
                        res.status(400).json({ msg: "Error en las calificaciones o fecha" });
                    }
                    else {
                        try {
                            yield database_1.default.query("UPDATE calificaciones SET ? WHERE id_calificacion = ?", [datos, id]);
                            res.json({ message: "Grade updated" });
                        }
                        catch (error) {
                            console.error("Error al ejecutar la consulta MySQL:", error);
                            res.status(500).send("Error interno del servidor");
                        }
                    }
                }
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
}
exports.calificacionController = new CalificacionController();
exports.default = exports.calificacionController;
