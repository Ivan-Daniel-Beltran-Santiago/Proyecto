import { Request, Response } from "express";
import db from "../database";
class AlumnoController {
  public async list(req: Request, res: Response): Promise<void> {
    try {
      const alumno = await db.query(
        "SELECT * FROM users WHERE id_rol=1 AND status='Activo'"
      );
      res.json(alumno);
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send("Error interno del servidor");
    }
  }
  public async listOne(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const alumno = await db.query(
        "SELECT * FROM users WHERE id_user=? AND id_rol=1 AND status='Activo'",
        [id]
      );
      res.json(alumno);
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  public async deleteAlumno(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await db.query("DELETE FROM users WHERE id_user=? AND id_rol=1 ", [id]);
      res.json({ text: "Alumno deleted" });
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send(error);
    }
  }

  public async updateAlumno(req: Request, res: Response) {
    const { id } = req.params;
    const datos = req.body;

    try {
      await db.query(
        "UPDATE users SET ? WHERE id_user = ? AND id_rol=1 AND status='Activo'",
        [datos, id]
      );
      res.json({ message: "Alumno updated" });
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send("Error interno del servidor");
    }
  }
}

export const alumnoController = new AlumnoController();
export default alumnoController;
