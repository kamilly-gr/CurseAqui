import { Router, Request, Response } from "express";
import prisma from "../prismaClient";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { nome, email } = req.body;
  if (typeof nome !== "string" || !nome.trim() || typeof email !== "string" || !email.trim()) {
    return res.status(400).json({ erro: "Nome e email são obrigatórios" });
  }

  try {
    const instrutor = await prisma.instrutor.create({
      data: { nome: nome.trim(), email: email.trim() },
    });
    return res.status(201).json(instrutor);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Não foi possível cadastrar o instrutor" });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const instrutores = await prisma.instrutor.findMany({ include: { cursos: true } });
    return res.json(instrutores);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Não foi possível listar os instrutores" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ erro: "ID inválido" });

  try {
    const instrutor = await prisma.instrutor.findUnique({
      where: { id },
      include: { cursos: true },
    });
    if (!instrutor) return res.status(404).json({ erro: "Instrutor não encontrado" });
    return res.json(instrutor);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Não foi possível buscar o instrutor" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { nome, email } = req.body;
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ erro: "ID inválido" });
  if (typeof nome !== "string" || !nome.trim() || typeof email !== "string" || !email.trim()) {
    return res.status(400).json({ erro: "Nome e email são obrigatórios" });
  }

  try {
    const instrutor = await prisma.instrutor.update({
      where: { id },
      data: { nome: nome.trim(), email: email.trim() },
    });
    return res.json(instrutor);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ erro: "Instrutor não encontrado ou email já cadastrado" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ erro: "ID inválido" });

  try {
    await prisma.instrutor.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(404).json({ erro: "Instrutor não encontrado" });
  }
});

export default router;