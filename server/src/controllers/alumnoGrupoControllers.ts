import { Request, Response } from "express";
import db from "../database";
class AlumnoGrupoController {
  public async list(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const clase = await db.query(
        "SELECT id_user,first_nameU,last_nameU,last_nameU2,c.id_grupo from users u JOIN clase c ON u.id_user = c.id_alumno WHERE c.id_grupo =? AND c.fecha_baja IS  NULL;",
        id
      );
      res.json(clase);
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  public async listBaja(req: Request, res: Response): Promise<void> {
    try {
      const clase = await db.query(
        "SELECT id_user,first_nameU,last_nameU,last_nameU2,g.id_grupo,g.nombre_grupo,c.fecha_baja from users u JOIN clase c ON u.id_user = c.id_alumno JOIN grupo g ON c.id_grupo = g.id_grupo WHERE c.fecha_baja IS NOT NULL;"
      );
      res.json(clase);
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  public async listOne(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const clase = await db.query(
        "SELECT c.id_clase, g.id_grupo, g.nombre_grupo FROM clase c JOIN grupo g ON c.id_grupo = g.id_grupo WHERE c.id_alumno=? GROUP BY c.id_clase, g.id_grupo, g.nombre_grupo;",
        id
      );
      res.json(clase);
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { idG } = req.params;
    const { fecha } = req.params;
    try {
      const clase = await db.query(
        "UPDATE clase SET fecha_baja = ? WHERE id_alumno =? AND id_grupo=?;",
        [fecha, id, idG]
      );
      res.json("Alumno deleted");
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  public async reinscribir(req: Request, res: Response): Promise<void> {
    const fecha = req.params.fecha;
    const id_Alumno = req.params.id_Alumno;
    const id_Grupo = req.params.id_Grupo;

    try {
      const clase = await db.query(
        "UPDATE clase SET fecha_inscripcion=?, fecha_baja = NULL WHERE id_alumno =? AND id_grupo=?;",
        [fecha, id_Alumno, id_Grupo]
      );
      res.json("Alumno Reinscrito");
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send("Error interno del servidor");
    }
  }
}

export const alumnoGrupoController = new AlumnoGrupoController();
export default alumnoGrupoController;
