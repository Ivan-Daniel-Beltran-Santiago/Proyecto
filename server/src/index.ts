import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import indexRoutes from "./routes/indexRoutes";
import userRoutes from "./routes/userRoutes";
import alumnoRoutes from "./routes/alumnoRoutes";
import maestroRoutes from "./routes/maestroRoutes";
import adminRoutes from "./routes/adminRoutes";
import horarioRoutes from "./routes/horarioRoutes";
import calificacionRoutes from "./routes/calificacionRoutes";
import claseRoutes from "./routes/claseRoutes";
import grupoRoutes from "./routes/grupoRoutes";
import claseHorarioRoutes from "./routes/clasesHorariosRoutes";
import alumnoGrupoRoutes from "./routes/alumnosGruposRoutes";
import grabacionesRoutes from "./routes/grabacionesRoutes";
import horarioMaestrosRoutes from "./routes/horarioMaestrosRoutes";
import reporteRoutes from "./routes/reporteRoutes";
import materialRoutes from "./routes/materialRoutes";
import tagRoutes from "./routes/tagRoutes";

class Server {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }
  config(): void {
    this.app.set("port", process.env.PORT || 3000);
    this.app.use(morgan("dev"));
    this.app.use(cors());
    this.app.use(express.json());

    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  routes(): void {
    this.app.use("/", indexRoutes);
    this.app.use("/user", userRoutes);
    this.app.use("/alumno", alumnoRoutes);
    this.app.use("/maestro", maestroRoutes);
    this.app.use("/admin", adminRoutes);
    this.app.use("/horario", horarioRoutes);
    this.app.use("/calificacion", calificacionRoutes);
    this.app.use("/clase", claseRoutes);
    this.app.use("/grupo", grupoRoutes);
    this.app.use("/claseHorario", claseHorarioRoutes);
    this.app.use("/alumnoGrupo", alumnoGrupoRoutes);
    this.app.use("/grabacion", grabacionesRoutes);
    this.app.use("/horarioMaestro", horarioMaestrosRoutes);
    this.app.use("/reporte", reporteRoutes);
    this.app.use("/file", materialRoutes);
    const uploadsDirectory = path.join(__dirname, "./../uploads");
    this.app.use("/uploads", express.static(uploadsDirectory));
    this.app.use("/tags", tagRoutes);
  }

  start(): void {
    this.app.listen(this.app.get("port"), () => {
      console.log("Server on port", this.app.get("port"));
    });
  }
}

const server = new Server();
server.start();
