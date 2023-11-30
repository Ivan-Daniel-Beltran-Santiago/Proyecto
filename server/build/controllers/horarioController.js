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
            const horario = yield database_1.default.query("SELECT * FROM horarios ORDER BY Hora_inicio ASC");
            res.json(horario);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const horario = yield database_1.default.query("SELECT * FROM horarios WHERE id_horario=?", [id]);
            res.json(horario);
        });
    }
    createHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const hora_inicio = req.body.Hora_inicio;
            const hora_final = req.body.Hora_final;
            const momentTiempo1 = (0, moment_1.default)(hora_inicio, "HH:mm:ss");
            const momentTiempo2 = (0, moment_1.default)(hora_final, "HH:mm:ss");
            const dia = req.body.dia;
            const grupo = req.body.id_grupo;
            try {
                let horario = yield database_1.default.query("SELECT * FROM horarios where Hora_inicio=? AND id_grupo=? AND dia = ? AND idioma =?", [hora_inicio, grupo, dia, req.body.idioma]);
                let numero = "";
                let num = 0; //numero para saber si hay horario repetido
                let numero2 = "";
                let num2 = 0; //numero para saber si
                for (numero in horario[0]) {
                    num = parseInt(numero) + 1;
                }
                const diferenciaHoras = momentTiempo2.diff(momentTiempo1, "hours");
                const diferenciaMinutos = momentTiempo2.diff(momentTiempo1, "minutes");
                if (diferenciaHoras == 1 &&
                    diferenciaMinutos == 60 &&
                    dia == "Monday-Thursday" &&
                    num == 0) {
                    yield database_1.default.query("INSERT INTO horarios SET ?", [req.body]);
                    res.json({ text: "Horario Created" });
                }
                else if (diferenciaHoras == 4 &&
                    diferenciaMinutos == 240 &&
                    dia == "Saturday" &&
                    num == 0) {
                    yield database_1.default.query("INSERT INTO horarios SET ?", [req.body]);
                    res.json({ text: "Horario Created" });
                }
                else {
                    res.json({ text: "Error en la cantidad de horas o horario empalmado" });
                }
                console.log(`La diferencia es: ${diferenciaHoras} horas y ${diferenciaMinutos} minutos`);
                console.log(num);
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
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
            try {
                yield database_1.default.query("UPDATE horarios SET ? WHERE id_horario = ?", [datos, id]);
                res.json({ message: "Horario updated" });
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
}
exports.horarioController = new HorarioController();
exports.default = exports.horarioController;
