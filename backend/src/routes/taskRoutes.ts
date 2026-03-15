import { Response, Router } from "express";
import { Task } from "../models/Task";
import {
  authMiddleware,
  adminOnly,
  AuthRequest,
} from "../middlewares/authMiddleware";

export const taskRoutes = Router();

// GET /tasks — toutes les tâches de l'utilisateur connecté
taskRoutes.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.find({ userID: req.user!.id }).sort({
      createdAt: -1,
    });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Erreur interne via le serveur" });
  }
});

// GET /tasks/all — toutes les tâches de tous les users (admin uniquement)
taskRoutes.get(
  "/all",
  authMiddleware,
  adminOnly,
  async (req: AuthRequest, res: Response) => {
    try {
      const tasks = await Task.find().sort({ createdAt: -1 });
      res.json({ tasks });
    } catch (error) {
      res.status(500).json({ message: "Erreur interne via le serveur" });
    }
  },
);

// GET /tasks/:id — une tâche par ID
taskRoutes.get(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ message: "Tâche introuvable" });
      if (task.userID !== req.user!.id && req.user!.role !== "ADMIN") {
        return res.status(403).json({ message: "Accès refusé" });
      }
      res.json({ task });
    } catch (error) {
      res.status(500).json({ message: "Erreur interne via le serveur" });
    }
  },
);

// POST /tasks — créer une tâche
taskRoutes.post(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const { title, description, priority, status, dueDate } = req.body;
    try {
      const task = await Task.create({
        title,
        description,
        priority,
        status: status ?? "to do",
        dueDate,
        userID: req.user!.id,
      });
      res.status(201).json({ message: "Tâche créée", task });
    } catch (error) {
      res.status(500).json({ message: "Erreur interne via le serveur" });
    }
  },
);

// PUT /tasks/:id — modifier une tâche
taskRoutes.put(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ message: "Tâche introuvable" });
      if (task.userID !== req.user!.id && req.user!.role !== "ADMIN") {
        return res.status(403).json({ message: "Accès refusé" });
      }
      const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json({ message: "Tâche mise à jour", task: updated });
    } catch (error) {
      res.status(500).json({ message: "Erreur interne via le serveur" });
    }
  },
);

// DELETE /tasks/:id — supprimer une tâche
taskRoutes.delete(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ message: "Tâche introuvable" });
      if (task.userID !== req.user!.id && req.user!.role !== "ADMIN") {
        return res.status(403).json({ message: "Accès refusé" });
      }
      await Task.findByIdAndDelete(req.params.id);
      res.json({ message: "Tâche supprimée" });
    } catch (error) {
      res.status(500).json({ message: "Erreur interne via le serveur" });
    }
  },
);
