import { Request, Response } from "express";
import db from "../database";
class ClaseHorarioController {
  public async list(req: Request, res: Response): Promise<void> {
    try {
      const clase = await db.query(
        "SELECT * FROM clase c JOIN grupo g ON c.id_grupo = g.id_grupo WHERE c.fecha_baja IS NULL GROUP BY g.id_grupo, c.id_clase"
      );
      res.json(clase);
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  public async agregarNuevoGrupo(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    let nombre_grupo = req.body.nombre_grupo;
    let fecha_inicio = req.body.fecha_inicio;
    let fecha_revision = req.body.fecha_revision;
    let fecha_final = req.body.fecha_final;
    try {
      await db.query("START TRANSACTION;");
      await db.query(
        "INSERT INTO grupo (nombre_grupo,Idioma, categoria, id_maestro, id_maestro2,fecha_inicio,fecha_revision,fecha_final) SELECT ?, Idioma, categoria, id_maestro, id_maestro2,?,?,? FROM grupo WHERE id_grupo = ?;",
        [nombre_grupo,fecha_inicio,fecha_revision,fecha_final, id]
      );
      const result = await db.query(
        "SELECT LAST_INSERT_ID() as nuevo_id_grupo;"
      );
      const nuevo_id_grupo = JSON.parse(JSON.stringify(result[0]));
      console.log(nuevo_id_grupo[0].nuevo_id_grupo);
      const nuevo_grupo = nuevo_id_grupo[0].nuevo_id_grupo;
      const grupo = await db.query(
        "INSERT INTO clase (id_grupo, id_alumno) SELECT ?, id_alumno FROM clase WHERE id_grupo = ?;",
        [nuevo_grupo, id]
      );
      await db.query("COMMIT;");
      res.json(grupo);
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  public async listOne(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const clase = await db.query(
        "SELECT * FROM clase c JOIN grupo g ON c.id_grupo = g.id_grupo WHERE g.id_maestro =? OR g.id_maestro2=? GROUP BY g.id_grupo, Innova_English_School.c.id_clase;",
        [id, id]
      );
      res.json(clase);
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send("Error interno del servidor");
    }
  }
}

export const claseHorarioController = new ClaseHorarioController();
export default claseHorarioController;
