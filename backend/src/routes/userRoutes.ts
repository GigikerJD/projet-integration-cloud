import { Response, Router } from "express";
import { Users } from "../models/User";
import {
  authMiddleware,
  adminOnly,
  AuthRequest,
} from "../middlewares/authMiddleware";

export const userRoutes = Router();

// GET /users — liste tous les users (admin uniquement, sans mot de passe)
userRoutes.get(
  "/",
  authMiddleware,
  adminOnly,
  async (req: AuthRequest, res: Response) => {
    try {
      const allUsers = await Users.find().select("-password");
      res.json({ users: allUsers });
    } catch (error) {
      return res.status(500).json({ message: "Erreur interne via le serveur" });
    }
  },
);

// GET /users/:id — récupère un user par ID (connecté)
userRoutes.get(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const user = await Users.findById(req.params.id).select("-password");
      if (!user)
        return res.status(404).json({ message: "Utilisateur introuvable" });
      res.json({ user });
    } catch (error) {
      return res.status(500).json({ message: "Erreur interne via le serveur" });
    }
  },
);
