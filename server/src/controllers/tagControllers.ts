import { Request, Response } from "express";
import db from "../database";
import { RowDataPacket } from "mysql2";

class TagController {
  async createTag(req: Request, res: Response): Promise<void> {
    console.log("Recibida solicitud para crear etiqueta");
    try {
      const { name, type, parent_id } = req.body;
      await db.query(
        "INSERT INTO Etiquetas (nombre, tipo, padre_id) VALUES (?, ?, ?)",
        [name, type, parent_id]
      );
      res.status(201).json({ message: "Etiqueta creada exitosamente" });
    } catch (error) {
      console.error("Error al crear la etiqueta:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async checkTagExists(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;
      const result = await db.query<RowDataPacket[]>(
        "SELECT COUNT(*) as count FROM Etiquetas WHERE nombre = ?",
        [name]
      );
      const exists = result[0][0].count > 0; // Accede al primer elemento del primer array
      res.json({ exists });
    } catch (error) {
      console.error("Error al verificar la existencia de la etiqueta:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getParentTags(req: Request, res: Response): Promise<void> {
    try {
      const parentTags = await db.query<RowDataPacket[]>(
        "SELECT nombre FROM Etiquetas WHERE padre_id IS NULL"
      );
      const tags = parentTags[0].map((tag: RowDataPacket) => tag.nombre);
      res.json(tags);
    } catch (error) {
      console.error("Error al obtener las etiquetas principales:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getTagIdByName(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;
      let query = "SELECT id FROM Etiquetas WHERE nombre = ?";
      // Si el tipo es un curso o un módulo, agrega la condición del tipo
      if (req.query.type === "Curso" || req.query.type === "Módulo") {
        query += " AND tipo = ?";
        const result = await db.query<RowDataPacket[]>(query, [
          name,
          req.query.type,
        ]);

        if (result[0].length > 0) {
          res.json(result[0][0].id);
        } else {
          res.json(null); // Devuelve null si no se encuentra el curso o módulo
        }
      } else {
        const result = await db.query<RowDataPacket[]>(query, [name]);

        if (result[0].length > 0) {
          res.json(result[0][0].id);
        } else {
          res.json(null); // Devuelve null si no se encuentra el curso o módulo
        }
      }
    } catch (error) {
      console.error(
        "Error al obtener el ID del curso o módulo por nombre:",
        error
      );
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getModules(req, res) {
    try {
      const modules = await db.query(
        "SELECT id, nombre FROM Etiquetas WHERE tipo = 'Módulo'"
      );
      res.json(modules[0]);
    } catch (error) {
      console.error("Error al obtener los módulos:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getAllTags(req, res) {
    try {
      const result = await db.query("SELECT nombre FROM Etiquetas");

      if (Array.isArray(result[0])) {
        const tags = result[0].map((tag) => tag.nombre);
        res.json(tags);
      } else {
        res.status(500).json({ error: "Error interno del servidor" });
      }
    } catch (error) {
      console.error("Error al obtener las etiquetas:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async deleteTag(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;

      // Función recursiva para eliminar etiquetas hijo
      const deleteChildTags = async (tagId: number) => {
        // Buscar y eliminar las etiquetas hijo
        const childTagsToDelete = await db.query<RowDataPacket[]>(
          "SELECT id FROM Etiquetas WHERE padre_id = ?",
          [tagId]
        );
        for (const childTag of childTagsToDelete[0]) {
          await deleteChildTags(childTag.id);
          await db.query("DELETE FROM Etiquetas WHERE id = ?", [childTag.id]);
        }
      };

      // Buscar el ID de la etiqueta a eliminar
      const tagToDelete = await db.query<RowDataPacket[]>(
        "SELECT id FROM Etiquetas WHERE nombre = ?",
        [name]
      );
      const tagId = tagToDelete[0][0].id; // Accede al primer elemento del primer array

      // Llamar a la función recursiva para eliminar las etiquetas hijo
      await deleteChildTags(tagId);

      // Eliminar la etiqueta principal
      await db.query("DELETE FROM Etiquetas WHERE nombre = ?", [name]);

      res
        .status(200)
        .json({ message: "Etiqueta y etiquetas hijo eliminadas exitosamente" });
    } catch (error) {
      console.error("Error al eliminar la etiqueta y etiquetas hijo:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getCourses(req, res) {
    try {
      const courses = await db.query(
        "SELECT DISTINCT nombre FROM Etiquetas WHERE tipo = 'Curso'"
      );
      if (Array.isArray(courses[0])) {
        const courseNames = courses[0].map((course) => course.nombre);
        res.json(courseNames);
      } else {
        res.status(500).json({ error: "Error interno del servidor" });
      }
    } catch (error) {
      console.error("Error al obtener los cursos:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async updateTagName(req: Request, res: Response): Promise<void> {
    try {
      const { oldName } = req.params;
      const { newName } = req.body;

      await db.query("UPDATE Etiquetas SET nombre = ? WHERE nombre = ?", [
        newName,
        oldName,
      ]);

      res
        .status(200)
        .json({ message: "Nombre de etiqueta actualizado exitosamente" });
    } catch (error) {
      console.error("Error al actualizar el nombre de la etiqueta:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async updateTagTypeAndParentId(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;
      const { type, parentId } = req.body;

      // Función recursiva para eliminar etiquetas hijo
      const deleteChildTags = async (tagId: number) => {
        // Buscar y eliminar las etiquetas hijo
        const childTagsToDelete = await db.query<RowDataPacket[]>(
          "SELECT id FROM Etiquetas WHERE padre_id = ?",
          [tagId]
        );
        for (const childTag of childTagsToDelete[0]) {
          await deleteChildTags(childTag.id);
          await db.query("DELETE FROM Etiquetas WHERE id = ?", [childTag.id]);
        }
      };

      // Buscar el ID de la etiqueta a actualizar
      const tagToUpdate = await db.query<RowDataPacket[]>(
        "SELECT id FROM Etiquetas WHERE nombre = ?",
        [name]
      );
      const tagId = tagToUpdate[0][0].id; // Accede al primer elemento del primer array

      // Llamar a la función recursiva para eliminar las etiquetas hijo
      await deleteChildTags(tagId);

      // Actualizar el tipo de etiqueta y el padre_id
      let query = "UPDATE Etiquetas SET tipo = ?";
      const params = [type];

      if (parentId === null || parentId === undefined) {
        query += ", padre_id = NULL";
      } else {
        query += ", padre_id = ?";
        params.push(parentId);
      }

      query += " WHERE nombre = ?";
      params.push(name);

      await db.query(query, params);

      res.status(200).json({
        message: "Tipo y padre_id de etiqueta actualizados exitosamente",
      });
    } catch (error) {
      console.error(
        "Error al actualizar el tipo y padre_id de la etiqueta:",
        error
      );
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async assignTags(req: Request, res: Response): Promise<void> {
    try {
      const { tagId, fileIds } = req.body;
      // Itera sobre los IDs de archivos y realiza la asignación de etiquetas para cada uno
      for (const fileId of fileIds) {
        await db.query(
          "INSERT INTO Asignacion_Etiquetas (archivo_id, etiqueta_id) VALUES (?, ?)",
          [fileId, tagId]
        );
      }
      res.status(200).json({ message: "Etiquetas asignadas exitosamente" });
    } catch (error) {
      console.error("Error al asignar etiquetas:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

export default new TagController();
