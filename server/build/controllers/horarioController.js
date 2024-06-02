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
exports.horarioController = void 0;
const database_1 = __importDefault(require("../database"));
const moment_1 = __importDefault(require("moment"));
class HorarioController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const horario = yield database_1.default.query("SELECT * FROM horarios ORDER BY Hora_inicio ASC");
                res.json(horario);
            }
            catch (error) {
                res.status(400).send("Error al ejecutar la consulta MySQL:");
            }
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const horario = yield database_1.default.query("select * from horarios WHERE id_horario=?;", [id]);
                res.json(horario);
            }
            catch (error) {
                res.status(400).send("Error al ejecutar la consulta MySQL:");
            }
        });
    }
    createHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const hora_inicio = req.body.Hora_inicio;
            const hora_final = req.body.Hora_final;
            const momentTiempo1 = (0, moment_1.default)(hora_inicio, "HH:mm:ss");
            const momentTiempo2 = (0, moment_1.default)(hora_final, "HH:mm:ss");
            const grupo = req.body.id_grupo;
            try {
                let c_grupo = yield database_1.default.query("SELECT categoria FROM grupo WHERE id_grupo =? ", grupo);
                let cat = JSON.parse(JSON.stringify(c_grupo[0]));
                console.log(cat[0].categoria);
                let categ = cat[0].categoria;
                req.body.dia = categ;
                const diferenciaHoras = momentTiempo2.diff(momentTiempo1, "hours");
                const diferenciaMinutos = momentTiempo2.diff(momentTiempo1, "minutes");
                if (diferenciaHoras == 1 &&
                    diferenciaMinutos == 60 &&
                    categ == "Monday-Thursday") {
                    req.body.Horas_Trab = 4;
                    req.body.semana = 1;
                    if (req.body.semana == null || req.body.semana == 0) {
                        res.status(400).send("Favor de Introducir la semana:");
                    }
                    else {
                        try {
                            yield database_1.default.query("INSERT INTO horarios SET ?", [req.body]);
                            res.json({ text: "Horario Created" });
                        }
                        catch (error) {
                            res.status(400).send("Error al ejecutar la consulta MySQL:");
                        }
                        req.body.semana = 2;
                        try {
                            yield database_1.default.query("INSERT INTO horarios SET ?", [req.body]);
                        }
                        catch (error) { }
                        req.body.semana = 3;
                        try {
                            yield database_1.default.query("INSERT INTO horarios SET ?", [req.body]);
                        }
                        catch (error) { }
                        req.body.semana = 4;
                        try {
                            yield database_1.default.query("INSERT INTO horarios SET ?", [req.body]);
                        }
                        catch (error) { }
                    }
                }
                else if (diferenciaHoras == 4 &&
                    diferenciaMinutos == 240 &&
                    categ == "Saturday"
                //num == 0
                ) {
                    req.body.semana = 1;
                    req.body.Horas_Trab = 4;
                    if (req.body.semana == null || req.body.semana == 0) {
                        console.log("asdas");
                        res.status(400).send("Favor de Introducir la semana:");
                    }
                    else {
                        try {
                            yield database_1.default.query("INSERT INTO horarios SET ?", [req.body]);
                            res.json({ text: "Horario Created" });
                        }
                        catch (error) {
                            res.status(400).send("Error al ejecutar la consulta MySQL:");
                        }
                        req.body.semana = 2;
                        try {
                            yield database_1.default.query("INSERT INTO horarios SET ?", [req.body]);
                        }
                        catch (error) { }
                        req.body.semana = 3;
                        try {
                            yield database_1.default.query("INSERT INTO horarios SET ?", [req.body]);
                        }
                        catch (error) { }
                        req.body.semana = 4;
                        try {
                            yield database_1.default.query("INSERT INTO horarios SET ?", [req.body]);
                        }
                        catch (error) { }
                    }
                }
                else {
                    res.status(400).json({
                        msg: "Error en la cantidad de horas o horario empalmado",
                    });
                }
                console.log(`La diferencia es: ${diferenciaHoras} horas y ${diferenciaMinutos} minutos`);
            }
            catch (error) {
                console.log("asdas" + error);
                res.status(400).send("Error al ejecutar la consulta MySQL:");
            }
        });
    }
    deleteHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield database_1.default.query("DELETE FROM horarios WHERE id_horario= ?", [id]);
                res.json({ text: "Horario deleted" });
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
    updateHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const datos = req.body;
            const hora_inicio = req.body.Hora_inicio;
            const hora_final = req.body.Hora_final;
            const momentTiempo1 = (0, moment_1.default)(hora_inicio, "HH:mm:ss");
            const momentTiempo2 = (0, moment_1.default)(hora_final, "HH:mm:ss");
            const dia = req.body.dia;
            const grupo = req.body.id_grupo;
            try {
                const diferenciaHoras = momentTiempo2.diff(momentTiempo1, "hours");
                const diferenciaMinutos = momentTiempo2.diff(momentTiempo1, "minutes");
                if (diferenciaHoras == 1 &&
                    diferenciaMinutos == 60 &&
                    dia == "Monday-Thursday") {
                    yield database_1.default.query("UPDATE horarios SET ? WHERE id_horario = ?", [
                        datos,
                        id,
                    ]);
                    res.json({ text: "Horario Created" });
                }
                else if (diferenciaHoras == 4 &&
                    diferenciaMinutos == 240 &&
                    dia == "Saturday") {
                    yield database_1.default.query("UPDATE horarios SET ? WHERE id_horario = ?", [
                        datos,
                        id,
                    ]);
                    res.json({ text: "Horario Created" });
                }
                else {
                    res.status(401).json({
                        msg: 'Error en la cantidad de horas o horario empalmado"',
                    });
                }
                console.log(`La diferencia es: ${diferenciaHoras} horas y ${diferenciaMinutos} minutos`);
            }
            catch (error) {
                res.status(500).json({
                    msg: "Error al realizar estar accion checar el servidor",
                });
            }
        });
    }
}
exports.horarioController = new HorarioController();
exports.default = exports.horarioController;
