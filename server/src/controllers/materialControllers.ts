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

        const fileType = files[i].mimetype;

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

      try {
        await db.query("DELETE FROM archivos WHERE nombre = ?", [filename]);

        await db.query(
          "DELETE FROM Asignacion_Etiquetas WHERE archivo_id = (SELECT id FROM archivos WHERE nombre = ?)",
          [filename]
        );
        res
          .status(200)
          .json({ message: "Archivo y etiquetas eliminadas correctamente." });
      } catch (error) {
        console.error("Error al eliminar el archivo y las etiquetas:", error);
        res
          .status(500)
          .json({ error: "Error al eliminar el archivo y las etiquetas." });
      }
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

  deleteEtiqueta = async (req: Request, res: Response) => {
    try {
      const { filename, etiqueta } = req.params;

      const tipoEtiqueta = await db.query(
        "SELECT tipo FROM Etiquetas WHERE nombre = ?",
        [etiqueta]
      );

      if (tipoEtiqueta[0][0].tipo === "Curso") {
        await db.query(
          "DELETE FROM Asignacion_Etiquetas WHERE archivo_id = (SELECT id FROM archivos WHERE nombre = ?)",
          [filename]
        );
      } else {
        if (tipoEtiqueta[0][0].tipo === "Módulo") {
          await db.query(
            "DELETE FROM Asignacion_Etiquetas WHERE archivo_id IN (SELECT id FROM archivos WHERE nombre = ?) AND etiqueta_id IN (SELECT id FROM Etiquetas WHERE tipo = 'Submódulo' AND padre_id = (SELECT id FROM Etiquetas WHERE nombre = ?))",
            [filename, etiqueta]
          );
        }
        await db.query(
          "DELETE FROM Asignacion_Etiquetas WHERE archivo_id = (SELECT id FROM archivos WHERE nombre = ?) AND etiqueta_id = (SELECT id FROM Etiquetas WHERE nombre = ?)",
          [filename, etiqueta]
        );
      }

      res.status(200).json({ message: "Etiqueta eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la etiqueta:", error);
      res.status(500).json({ error: "Error al eliminar la etiqueta" });
    }
  };

  getCourseTags = async (req: Request, res: Response) => {
    try {
      const courseTags = await db.query(
        "SELECT * FROM Etiquetas WHERE tipo = 'Curso'"
      );
      res.json(courseTags[0]);
    } catch (error) {
      console.error("Error al obtener las etiquetas de curso:", error);
      res
        .status(500)
        .json({ error: "Error al obtener las etiquetas de curso." });
    }
  };

  getModuleTags = async (req: Request, res: Response) => {
    try {
      const moduleTags = await db.query(
        "SELECT * FROM Etiquetas WHERE tipo = 'Módulo'"
      );
      res.json(moduleTags[0]);
    } catch (error) {
      console.error("Error al obtener las etiquetas de módulo:", error);
      res
        .status(500)
        .json({ error: "Error al obtener las etiquetas de módulo." });
    }
  };

  getSubmoduleTags = async (req: Request, res: Response) => {
    try {
      const submoduleTags = await db.query(
        "SELECT * FROM Etiquetas WHERE tipo = 'Submódulo'"
      );
      res.json(submoduleTags[0]);
    } catch (error) {
      console.error("Error al obtener las etiquetas de submódulo:", error);
      res
        .status(500)
        .json({ error: "Error al obtener las etiquetas de submódulo." });
    }
  };

  getFilesByTag = async (req: Request, res: Response) => {
    try {
      const tag = req.params.tag;
      const files = await db.query(
        "SELECT archivos.id, archivos.nombre, archivos.tipo_archivo, GROUP_CONCAT(Etiquetas.nombre) AS etiquetas FROM archivos LEFT JOIN Asignacion_Etiquetas ON archivos.id = Asignacion_Etiquetas.archivo_id LEFT JOIN Etiquetas ON Asignacion_Etiquetas.etiqueta_id = Etiquetas.id WHERE Etiquetas.nombre = ? GROUP BY archivos.id",
        [tag]
      );
      res.json(files[0]);
    } catch (error) {
      console.error("Error al obtener los archivos por etiqueta:", error);
      res
        .status(500)
        .json({ error: "Error al obtener los archivos por etiqueta." });
    }
  };

  getGroups = async (req: Request, res: Response) => {
    try {
      const groups = await db.query("SELECT * FROM grupo");
      res.json(groups[0]);
    } catch (error) {
      console.error("Error al obtener los grupos:", error);
      res.status(500).json({ error: "Error al obtener los grupos." });
    }
  };
}
export const materialController = new MaterialController();
export default materialController;
