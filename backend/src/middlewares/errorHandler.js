import AppError from "../utils/errors.js";
import { ZodError } from "Zod";

export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  if (err instanceof ZodError) {
    return res.status(400).json({ error: "Validation échouée.", details: err.issues.map(({message, path}) => ({
      message,
      path: path.join('.')
    })) });
  }

  console.error(err);
  res.status(500).json({ error: "Erreur serveur interne." });
}
