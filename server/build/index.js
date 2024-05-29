"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const alumnoRoutes_1 = __importDefault(require("./routes/alumnoRoutes"));
const maestroRoutes_1 = __importDefault(require("./routes/maestroRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const horarioRoutes_1 = __importDefault(require("./routes/horarioRoutes"));
const calificacionRoutes_1 = __importDefault(require("./routes/calificacionRoutes"));
const claseRoutes_1 = __importDefault(require("./routes/claseRoutes"));
const grupoRoutes_1 = __importDefault(require("./routes/grupoRoutes"));
const clasesHorariosRoutes_1 = __importDefault(require("./routes/clasesHorariosRoutes"));
const alumnosGruposRoutes_1 = __importDefault(require("./routes/alumnosGruposRoutes"));
const grabacionesRoutes_1 = __importDefault(require("./routes/grabacionesRoutes"));
const horarioMaestrosRoutes_1 = __importDefault(require("./routes/horarioMaestrosRoutes"));
const reporteRoutes_1 = __importDefault(require("./routes/reporteRoutes"));
const materialRoutes_1 = __importDefault(require("./routes/materialRoutes"));
const tagRoutes_1 = __importDefault(require("./routes/tagRoutes"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    config() {
        this.app.set("port", process.env.PORT || 3000);
        this.app.use((0, morgan_1.default)("dev"));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: false }));
        this.app.use(body_parser_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    routes() {
        this.app.use("/", indexRoutes_1.default);
        this.app.use("/user", userRoutes_1.default);
        this.app.use("/alumno", alumnoRoutes_1.default);
        this.app.use("/maestro", maestroRoutes_1.default);
        this.app.use("/admin", adminRoutes_1.default);
        this.app.use("/horario", horarioRoutes_1.default);
        this.app.use("/calificacion", calificacionRoutes_1.default);
        this.app.use("/clase", claseRoutes_1.default);
        this.app.use("/grupo", grupoRoutes_1.default);
        this.app.use("/claseHorario", clasesHorariosRoutes_1.default);
        this.app.use("/alumnoGrupo", alumnosGruposRoutes_1.default);
        this.app.use("/grabacion", grabacionesRoutes_1.default);
        this.app.use("/horarioMaestro", horarioMaestrosRoutes_1.default);
        this.app.use("/reporte", reporteRoutes_1.default);
        this.app.use("/file", materialRoutes_1.default);
        const uploadsDirectory = path_1.default.join(__dirname, "./../uploads");
        this.app.use("/uploads", express_1.default.static(uploadsDirectory));
        this.app.use("/tags", tagRoutes_1.default);
    }
    start() {
        this.app.listen(this.app.get("port"), () => {
            console.log("Server on port", this.app.get("port"));
        });
    }
}
const server = new Server();
server.start();
