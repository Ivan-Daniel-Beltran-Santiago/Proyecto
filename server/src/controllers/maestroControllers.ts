import { Request, Response } from "express";
import db from "../database";
class MaestroController {
  public async list(req: Request, res: Response): Promise<void> {
    try {
      const maestro = await db.query(
        "SELECT * from users WHERE id_rol=2 AND status='Activo'"
      );
      res.json(maestro);
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send("Error interno del servidor");
    }
  }
  public async listOne(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const maestro = await db.query(
        "SELECT * FROM users where id_user = ? AND id_rol = 2 AND status='Activo'",
        [id]
      );
      res.json(maestro);
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).json({
        msg: "Error al consultar",
      });
    }
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await db.query("DELETE FROM users WHERE id_user = ? AND id_rol=2", [id]);
      res.json({ text: "Teacher deleted" });
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  public async updateMaestro(req: Request, res: Response) {
    const { id } = req.params;
    const datos = req.body;
    try {
      await db.query(
        "UPDATE users SET ? WHERE id_user = ? AND id_rol = 2 AND status='Activo'",
        [datos, id]
      );
      res.json({ message: "Maestro updated" });
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send("Error interno del servidor");
    }
  }
}

export const maestroController = new MaestroController();
export default maestroController;
