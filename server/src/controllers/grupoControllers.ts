import { Request, Response } from "express";
import db from "../database";

class GrupoController {
  public async list(req: Request, res: Response): Promise<void> {
    const clase = await db.query("SELECT * FROM grupo");
    res.json(clase);
  }

  public async listOne(req: Request, res: Response) {
    const { id } = req.params;
    const clase = await db.query("SELECT * FROM grupo WHERE id_grupo=?", [id]);
    res.json(clase);
  }

  public async addGrupo(req: Request, res: Response) {
    let maestro = req.body.id_maestro;
    let maestro2 = req.body.id_maestro2;

    console.log(maestro);
    console.log(maestro2);

    try {
      if (maestro2 == 0) {
        req.body.id_maestro2 = req.body.id_maestro;
      }
      if (maestro == 0) {
        return res.status(400).json({
          msg: "Favor de llenar los campos",
        });
      } else {
        const grupo = await db.query("INSERT INTO grupo SET ?", [req.body]);

        res.json({ message: "Grupo agregado correctamente" });
      }
    } catch (error) {
      console.error("Error al ejecutar la consulta MySQL:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  public async updateGrupo(req: Request, res: Response) {
    const id = req.params.id;
    const datos = req.body;
    await db.query("UPDATE grupo SET ? WHERE id_grupo = ?", [datos, id]);
    res.json({ message: "Grupo actualizado" });
  }

  public async deleteGrupo(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      await db.query("DELETE FROM calificaciones WHERE id_grupo = ?", [id]);

      await db.query("DELETE FROM horarios WHERE id_grupo = ?", [id]);

      await db.query("DELETE FROM clase WHERE id_grupo = ?", [id]);

      await db.query("DELETE FROM grupo WHERE id_grupo = ?", [id]);

      res.json({ message: "Grupo eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el grupo:", error);
      res.status(500).send("Error interno del servidor");
    }
  }
}

export const grupoController = new GrupoController();
export default grupoController;
