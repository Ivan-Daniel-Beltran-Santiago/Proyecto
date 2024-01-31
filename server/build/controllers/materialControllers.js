"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.materialController = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
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
        this.upload = (0, multer_1.default)({ storage: this.storage }).single("file");
        this.handleFileUpload = (req, res) => {
            this.upload(req, res, (err) => {
                if (err) {
                    console.log(err);
                    res.status(400).json({ msg: "Error en la carga de archivo" });
                }
                if (!req.file) {
                    console.log("No se ha subido ningún archivo.");
                    res.status(400).json({ msg: "No se ha subido ningun archivo" });
                }
                console.log("Archivo subido con éxito:", req.file.path);
                res.status(200).json({
                    path: req.file.filename,
                });
            });
        };
        this.uploadsDirectory = path_1.default.join(__dirname, '../../uploads');
        this.getFiles = (req, res) => {
            // Lee el contenido del directorio de uploads
            fs_1.default.readdir(this.uploadsDirectory, (err, files) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error al obtener la lista de archivos.');
                }
                else {
                    // Filtra los archivos para incluir solo los PDF
                    const pdfFiles = files.filter(file => file.endsWith('.pdf'));
                    res.json(pdfFiles);
                }
            });
        };
    }
}
exports.materialController = new MaterialController();
exports.default = exports.materialController;
