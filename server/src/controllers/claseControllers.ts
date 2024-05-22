import { Request, Response } from "express";
import db from "../database";

class ClaseController {
  public async list(req: Request, res: Response): Promise<void> {
    try {
      const clase = await db.query(
        `SELECT g.id_grupo, 
        MAX(c.id_clase) AS id_clase, 
        MAX(c.id_alumno) AS id_alumno, 
        MAX(c.fecha_inscripcion) AS fecha_inscripcion, 
        MAX(c.fecha_baja) AS fecha_baja,
        g.nombre_grupo, g.Idioma, g.categoria, g.id_maestro, g.id_maestro2, 
        g.fecha_inicio, g.fecha_revision, g.fecha_final
 FROM clase c
 JOIN grupo g ON c.id_grupo = g.id_grupo
 GROUP BY g.id_grupo, g.nombre_grupo, g.Idioma, g.categoria, g.id_maestro, g.id_maestro2, 
          g.fecha_inicio, g.fecha_revision, g.fecha_final;`
      );
      res.json(clase);
    } catch (error) {
      console.error("Error en la consulta:", error);
      res.status(400).json({
        msg: "Error en la consulta",
        error: error.message,
      });
    }
  }

  public async listOne(req: Request, res: Response) {
    const { id } = req.params;
    const clase = await db.query("SELECT * FROM clase WHERE id_clase=?", [id]);
    res.json(clase);
  }

  public async addClase(req: Request, res: Response) {
    let alumnoId = req.body.id_alumno;

    let grupo = req.body.id_grupo;

    let alumnoArray = await db.query(
      "Select * from clase where id_alumno = ? AND id_grupo=? ",
      [alumnoId, grupo]
    );

    let alumno = JSON.parse(JSON.stringify(alumnoArray[0]));
    console.log(alumno[0]);

    try {
      if (alumno[0]) {
        return res.status(400).json({
          msg: "Alumno Inscrito ya en esta clase",
        });
      }
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send("Error interno del servidor");
    }

    try {
      if (alumnoId == 0 || grupo == 0) {
        return res.status(400).json({
          msg: "Favor de llenar los campos",
        });
      } else {
        const clase = await db.query("INSERT INTO clase SET ?", [req.body]);

        res.json({ message: "Registros insertados correctamente" });
      }
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  public async deleteClase(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const clase = await db.query("Delete from clase where id_clase = ?", id);
      res.json({ text: "Clase eliminada" });
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  public async updateClase(req: Request, res: Response) {
    const id = req.params.id;
    const datos = req.body;
    try {
      await db.query("UPDATE clase SET ? WHERE id_clase = ?", [datos, id]);
      res.json({ message: "Clase updated" });
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send("Error interno del servidor");
    }
  }
}

export const claseController = new ClaseController();
export default claseController;
