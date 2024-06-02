import { Request, Response } from "express";
import db from "../database";
class AdminController {
  public async list(req: Request, res: Response): Promise<void> {
    try {
      const admin = await db.query(
        "SELECT * from users WHERE id_rol=3 AND status='Activo'"
      );
      res.json(admin);
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send("Error interno del servidor");
    }
  }
  public async listOne(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const admin = await db.query(
        "SELECT * FROM users WHERE id_user=? AND id_rol=3 AND status='Activo'",
        [id]
      );
      res.json(admin);
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await db.query("DELETE FROM users WHERE id_user = ? AND id_rol=3", [id]);
      res.json({ text: "Administrador deleted" });
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  public async updateAdmin(req: Request, res: Response) {
    const { id } = req.params;
    const datos = req.body;
    try {
      await db.query(
        "UPDATE users SET ? WHERE id_user = ? AND id_rol = 3 AND status='Activo'",
        [datos, id]
      );
      res.json({ message: "Admin updated" });
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send("Error interno del servidor");
    }
  }
}

export const adminController = new AdminController();
export default adminController;
