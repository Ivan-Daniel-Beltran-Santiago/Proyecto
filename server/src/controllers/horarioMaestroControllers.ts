import { Request, Response } from "express";
import db from "../database";

class MaestroHorarioController {
  public async list(req: Request, res: Response): Promise<void> {
    const horario = await db.query(
      "SELECT * FROM horarios ORDER BY Hora_inicio ASC"
    );

    res.json(horario);
  }
  public async listOne(req: Request, res: Response) {
    const { id } = req.params;
    const horario = await db.query(
      "select * from horarios h JOIN grupo g ON h.id_grupo = g.id_grupo WHERE g.id_maestro=? OR g.id_maestro2=?;",
      [id, id]
    );
    res.json(horario);
  }
}

export const maestrohorarioController = new MaestroHorarioController();
export default maestrohorarioController;
