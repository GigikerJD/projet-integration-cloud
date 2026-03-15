import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Users } from "../models/User";

export const authRoutes = Router();

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "change_jwt_secret";

authRoutes.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ email });
    if (!user)
      return res.status(404).json({
        message: "Utilisateur inexistant",
      });
    const matches = await bcrypt.compare(password, user.password);
    if (!matches)
      return res.status(400).json({
        message: "Mot de passe incorrect",
      });
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    return res.json({
      message: "Vous êtes connecté",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur interne via le serveur",
    });
  }
});

authRoutes.post("/register", async (req: Request, res: Response) => {
  const { email, password, firstname, lastname, role, birthdate } = req.body;

  try {
    const existing = await Users.findOne({ email });
    if (existing)
      return res.status(409).json({
        message: `Un utilisateur avec l'email ${email} existe déjà`,
      });
    const hashPassword = await bcrypt.hash(password, 12);
    const user = await Users.create({
      email,
      password: hashPassword,
      firstname,
      lastname,
      role,
      birthdate,
    });
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    return res.status(201).json({
      message: "Vous êtes inscrit",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur interne via le serveur",
    });
  }
});
