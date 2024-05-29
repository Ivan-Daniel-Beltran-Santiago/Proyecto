import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const headerToken = req.headers["authorization"];

  if (headerToken !== undefined && headerToken.startsWith("Bearer")) {
    try {
      const bearerToken = headerToken.slice(7);

      jwt.verify(bearerToken, process.env.SECRET_KEY || "pGZLwuX!rt9");
      next();
    } catch (error) {
      res.status(401).json({
        msg: "Invalid bearer token",
      });
    }
  } else {
    res.status(401).json({
      msg: "Acceso Denegado",
    });
  }
};

export default validateToken;
