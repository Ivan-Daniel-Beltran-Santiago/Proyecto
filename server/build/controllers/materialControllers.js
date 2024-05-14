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
exports.materialController = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const jszip_1 = __importDefault(require("jszip"));
const database_1 = __importDefault(require("../database"));
class MaterialController {
    constructor() {
        this.storage = multer_1.default.diskStorage({
            destination(req, file, cb) {
                cb(null, "uploads");
            },
            filename(req, file, cb) {
                cb(null, file.originalname);
            },
        });
        this.upload = (0, multer_1.default)({
            storage: this.storage,
            fileFilter: (req, file, cb) => {
                const allowedFileTypes = [
                    ".pdf",
                    ".mp3",
                    ".jpg",
                    ".png",
                    ".docx",
                    ".mp4",
                    ".mpeg",
                    ".pptx",
                ];
                const extname = path_1.default.extname(file.originalname).toLowerCase();
                if (allowedFileTypes.includes(extname)) {
                    cb(null, true);
                }
                else {
                    cb(new Error("Tipo de archivo no válido"));
                }
            },
        }).array("files", 10);
        this.handleFileUpload = (req, res) => {
            this.upload(req, res, (err) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.log(err);
                    return res.status(400).json({ msg: "Error en la carga de archivos" });
                }
                if (!req.files || req.files.length === 0) {
                    console.log("No se han subido archivos.");
                    return res.status(400).json({ msg: "No se han subido archivos" });
                }
                const files = req.files;
                const paths = [];
                for (let i = 0; i < files.length; i++) {
                    console.log("Archivo subido con éxito:", files[i].path);
                    paths.push(files[i].filename);
                    const fileType = files[i].mimetype;
                    yield database_1.default.query("INSERT INTO archivos (nombre, tipo_archivo) VALUES (?, ?)", [files[i].filename, fileType]);
                }
                res.status(200).json({ paths: paths });
            }));
        };
        this.uploadsDirectory = path_1.default.join(__dirname, "../../uploads");
        this.getFiles = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const files = yield database_1.default.query("SELECT archivos.id, archivos.nombre, archivos.tipo_archivo, GROUP_CONCAT(Etiquetas.nombre) AS etiquetas FROM archivos LEFT JOIN Asignacion_Etiquetas ON archivos.id = Asignacion_Etiquetas.archivo_id LEFT JOIN Etiquetas ON Asignacion_Etiquetas.etiqueta_id = Etiquetas.id GROUP BY archivos.id");
                res.json(files[0]);
            }
            catch (error) {
                console.error("Error al obtener la lista de archivos:", error);
                res.status(500).send("Error al obtener la lista de archivos.");
            }
        });
        this.deleteFile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const filename = req.params.filename;
            const filePath = path_1.default.join(this.uploadsDirectory, filename);
            if (!fs_1.default.existsSync(filePath)) {
                return res.status(404).json({ message: "El archivo no existe." });
            }
            fs_1.default.unlink(filePath, (err) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.error(err);
                    return res
                        .status(500)
                        .json({ message: "Error al intentar borrar el archivo." });
                }
                try {
                    yield database_1.default.query("DELETE FROM archivos WHERE nombre = ?", [filename]);
                    yield database_1.default.query("DELETE FROM Asignacion_Etiquetas WHERE archivo_id = (SELECT id FROM archivos WHERE nombre = ?)", [filename]);
                    res
                        .status(200)
                        .json({ message: "Archivo y etiquetas eliminadas correctamente." });
                }
                catch (error) {
                    console.error("Error al eliminar el archivo y las etiquetas:", error);
                    res
                        .status(500)
                        .json({ error: "Error al eliminar el archivo y las etiquetas." });
                }
            }));
        });
        this.downloadAllFiles = (req, res) => {
            const zip = new jszip_1.default();
            fs_1.default.readdir(this.uploadsDirectory, (err, files) => {
                if (err) {
                    console.error(err);
                    return res
                        .status(500)
                        .json({ error: "Error al leer el directorio de archivos." });
                }
                files.forEach((file) => {
                    const filePath = path_1.default.join(this.uploadsDirectory, file);
                    if (fs_1.default.existsSync(filePath)) {
                        zip.file(file, fs_1.default.readFileSync(filePath));
                    }
                });
                zip
                    .generateAsync({ type: "nodebuffer" })
                    .then((content) => {
                    res.set("Content-Type", "application/zip");
                    res.set("Content-Disposition", 'attachment; filename="todos_los_archivos.zip"');
                    res.send(content);
                })
                    .catch((error) => {
                    console.error("Error al generar el archivo ZIP:", error);
                    res.status(500).json({ error: "Error al generar el archivo ZIP." });
                });
            });
        };
        this.deleteEtiqueta = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { filename, etiqueta } = req.params;
                const tipoEtiqueta = yield database_1.default.query("SELECT tipo FROM Etiquetas WHERE nombre = ?", [etiqueta]);
                if (tipoEtiqueta[0][0].tipo === "Curso") {
                    yield database_1.default.query("DELETE FROM Asignacion_Etiquetas WHERE archivo_id = (SELECT id FROM archivos WHERE nombre = ?)", [filename]);
                }
                else {
                    if (tipoEtiqueta[0][0].tipo === "Módulo") {
                        yield database_1.default.query("DELETE FROM Asignacion_Etiquetas WHERE archivo_id IN (SELECT id FROM archivos WHERE nombre = ?) AND etiqueta_id IN (SELECT id FROM Etiquetas WHERE tipo = 'Submódulo' AND padre_id = (SELECT id FROM Etiquetas WHERE nombre = ?))", [filename, etiqueta]);
                    }
                    yield database_1.default.query("DELETE FROM Asignacion_Etiquetas WHERE archivo_id = (SELECT id FROM archivos WHERE nombre = ?) AND etiqueta_id = (SELECT id FROM Etiquetas WHERE nombre = ?)", [filename, etiqueta]);
                }
                res.status(200).json({ message: "Etiqueta eliminada correctamente" });
            }
            catch (error) {
                console.error("Error al eliminar la etiqueta:", error);
                res.status(500).json({ error: "Error al eliminar la etiqueta" });
            }
        });
        this.getCourseTags = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const courseTags = yield database_1.default.query("SELECT * FROM Etiquetas WHERE tipo = 'Curso'");
                res.json(courseTags[0]);
            }
            catch (error) {
                console.error("Error al obtener las etiquetas de curso:", error);
                res
                    .status(500)
                    .json({ error: "Error al obtener las etiquetas de curso." });
            }
        });
        this.getModuleTags = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const moduleTags = yield database_1.default.query("SELECT * FROM Etiquetas WHERE tipo = 'Módulo'");
                res.json(moduleTags[0]);
            }
            catch (error) {
                console.error("Error al obtener las etiquetas de módulo:", error);
                res
                    .status(500)
                    .json({ error: "Error al obtener las etiquetas de módulo." });
            }
        });
        this.getSubmoduleTags = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const submoduleTags = yield database_1.default.query("SELECT * FROM Etiquetas WHERE tipo = 'Submódulo'");
                res.json(submoduleTags[0]);
            }
            catch (error) {
                console.error("Error al obtener las etiquetas de submódulo:", error);
                res
                    .status(500)
                    .json({ error: "Error al obtener las etiquetas de submódulo." });
            }
        });
    }
}
exports.materialController = new MaterialController();
exports.default = exports.materialController;
