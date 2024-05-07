import multer from "multer";
import path from "path";
import fs from "fs";
import { Request, Response } from "express";
import JSZip from "jszip";
import db from "../database";

class MaterialController {
  storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads");
    },
    filename(req, file, cb) {
      cb(null, file.originalname);
    },
  });

  upload = multer({
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
      const extname = path.extname(file.originalname).toLowerCase();
      if (allowedFileTypes.includes(extname)) {
        cb(null, true);
      } else {
        cb(new Error("Tipo de archivo no válido"));
      }
    },
  }).array("files", 10);

  handleFileUpload = (req: Request, res: Response) => {
    this.upload(req, res, async (err: any) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ msg: "Error en la carga de archivos" });
      }

      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        console.log("No se han subido archivos.");
        return res.status(400).json({ msg: "No se han subido archivos" });
      }

      const files = req.files as Express.Multer.File[];
      const paths: string[] = [];

      for (let i = 0; i < files.length; i++) {
        console.log("Archivo subido con éxito:", files[i].path);
        paths.push(files[i].filename);
        // Obtener el tipo de archivo
        const fileType = files[i].mimetype; // Esto te dará el tipo MIME del archivo

        // Aquí puedes guardar el nombre y el tipo del archivo en la base de datos
        await db.query(
          "INSERT INTO archivos (nombre, tipo_archivo) VALUES (?, ?)",
          [files[i].filename, fileType]
        );
      }

      res.status(200).json({ paths: paths });
    });
  };

  uploadsDirectory = path.join(__dirname, "../../uploads");

  getFiles = async (req: Request, res: Response) => {
    try {
      const files = await db.query(
        "SELECT archivos.id, archivos.nombre, archivos.tipo_archivo, GROUP_CONCAT(Etiquetas.nombre) AS etiquetas FROM archivos LEFT JOIN Asignacion_Etiquetas ON archivos.id = Asignacion_Etiquetas.archivo_id LEFT JOIN Etiquetas ON Asignacion_Etiquetas.etiqueta_id = Etiquetas.id GROUP BY archivos.id"
      );
      res.json(files[0]);
    } catch (error) {
      console.error("Error al obtener la lista de archivos:", error);
      res.status(500).send("Error al obtener la lista de archivos.");
    }
  };

  deleteFile = async (req: Request, res: Response) => {
    const filename = req.params.filename;
    const filePath = path.join(this.uploadsDirectory, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "El archivo no existe." });
    }

    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Error al intentar borrar el archivo." });
      }
      await db.query("DELETE FROM archivos WHERE nombre = ?", [filename]);
      res.status(200).json({ message: "Archivo eliminado correctamente." });
    });
  };

  downloadAllFiles = (req: Request, res: Response) => {
    const zip = new JSZip();

    fs.readdir(this.uploadsDirectory, (err, files) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Error al leer el directorio de archivos." });
      }

      files.forEach((file) => {
        const filePath = path.join(this.uploadsDirectory, file);
        if (fs.existsSync(filePath)) {
          zip.file(file, fs.readFileSync(filePath));
        }
      });

      zip
        .generateAsync({ type: "nodebuffer" })
        .then((content) => {
          res.set("Content-Type", "application/zip");
          res.set(
            "Content-Disposition",
            'attachment; filename="todos_los_archivos.zip"'
          );
          res.send(content);
        })
        .catch((error) => {
          console.error("Error al generar el archivo ZIP:", error);
          res.status(500).json({ error: "Error al generar el archivo ZIP." });
        });
    });
  };
}
export const materialController = new MaterialController();
export default materialController;
