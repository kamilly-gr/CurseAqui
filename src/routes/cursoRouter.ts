import { Router, Request, Response } from "express";
import prisma from "../prismaClient";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { titulo, descricao, instrutor_id } = req.body;
  const instrutorId = Number(instrutor_id);
  if (typeof titulo !== "string" || !titulo.trim() || typeof descricao !== "string" || !descricao.trim() || !Number.isInteger(instrutorId) || instrutorId < 1) {
    return res.status(400).json({ erro: "Título, descrição e instrutor_id são obrigatórios" });
  }

  try {
    const instrutor = await prisma.instrutor.findUnique({ where: { id: instrutorId } });
    if (!instrutor) return res.status(404).json({ erro: "Instrutor não encontrado" });
    const curso = await prisma.curso.create({
      data: { titulo: titulo.trim(), descricao: descricao.trim(), instrutorId },
      include: { instrutor: true },
    });
    return res.status(201).json(curso);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Não foi possível cadastrar o curso" });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const cursos = await prisma.curso.findMany({ include: { instrutor: true } });
    return res.json(cursos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Não foi possível listar os cursos" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ erro: "ID inválido" });

  try {
    const curso = await prisma.curso.findUnique({ where: { id }, include: { instrutor: true } });
    if (!curso) return res.status(404).json({ erro: "Curso não encontrado" });
    return res.json(curso);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Não foi possível buscar o curso" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { titulo, descricao, instrutor_id } = req.body;
  const instrutorId = Number(instrutor_id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ erro: "ID inválido" });
  if (typeof titulo !== "string" || !titulo.trim() || typeof descricao !== "string" || !descricao.trim() || !Number.isInteger(instrutorId) || instrutorId < 1) {
    return res.status(400).json({ erro: "Título, descrição e instrutor_id são obrigatórios" });
  }

  try {
    const instrutor = await prisma.instrutor.findUnique({ where: { id: instrutorId } });
    if (!instrutor) return res.status(404).json({ erro: "Instrutor não encontrado" });
    const curso = await prisma.curso.update({
      where: { id },
      data: { titulo: titulo.trim(), descricao: descricao.trim(), instrutorId },
      include: { instrutor: true },
    });
    return res.json(curso);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ erro: "Curso não encontrado" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ erro: "ID inválido" });

  try {
    await prisma.curso.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(404).json({ erro: "Curso não encontrado" });
  }
});

export default router;