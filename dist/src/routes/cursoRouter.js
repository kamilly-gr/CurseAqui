"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prismaClient_1 = __importDefault(require("../prismaClient"));
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    const { titulo, descricao, instrutor_id } = req.body;
    const instrutorId = Number(instrutor_id);
    if (typeof titulo !== "string" || !titulo.trim() || typeof descricao !== "string" || !descricao.trim() || !Number.isInteger(instrutorId) || instrutorId < 1) {
        return res.status(400).json({ erro: "Título, descrição e instrutor_id são obrigatórios" });
    }
    try {
        const instrutor = await prismaClient_1.default.instrutor.findUnique({ where: { id: instrutorId } });
        if (!instrutor)
            return res.status(404).json({ erro: "Instrutor não encontrado" });
        const curso = await prismaClient_1.default.curso.create({
            data: { titulo: titulo.trim(), descricao: descricao.trim(), instrutorId },
            include: { instrutor: true },
        });
        return res.status(201).json(curso);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ erro: "Não foi possível cadastrar o curso" });
    }
});
router.get("/", async (_req, res) => {
    try {
        const cursos = await prismaClient_1.default.curso.findMany({ include: { instrutor: true } });
        return res.json(cursos);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ erro: "Não foi possível listar os cursos" });
    }
});
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1)
        return res.status(400).json({ erro: "ID inválido" });
    try {
        const curso = await prismaClient_1.default.curso.findUnique({ where: { id }, include: { instrutor: true } });
        if (!curso)
            return res.status(404).json({ erro: "Curso não encontrado" });
        return res.json(curso);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ erro: "Não foi possível buscar o curso" });
    }
});
router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { titulo, descricao, instrutor_id } = req.body;
    const instrutorId = Number(instrutor_id);
    if (!Number.isInteger(id) || id < 1)
        return res.status(400).json({ erro: "ID inválido" });
    if (typeof titulo !== "string" || !titulo.trim() || typeof descricao !== "string" || !descricao.trim() || !Number.isInteger(instrutorId) || instrutorId < 1) {
        return res.status(400).json({ erro: "Título, descrição e instrutor_id são obrigatórios" });
    }
    try {
        const instrutor = await prismaClient_1.default.instrutor.findUnique({ where: { id: instrutorId } });
        if (!instrutor)
            return res.status(404).json({ erro: "Instrutor não encontrado" });
        const curso = await prismaClient_1.default.curso.update({
            where: { id },
            data: { titulo: titulo.trim(), descricao: descricao.trim(), instrutorId },
            include: { instrutor: true },
        });
        return res.json(curso);
    }
    catch (error) {
        console.error(error);
        return res.status(404).json({ erro: "Curso não encontrado" });
    }
});
router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1)
        return res.status(400).json({ erro: "ID inválido" });
    try {
        await prismaClient_1.default.curso.delete({ where: { id } });
        return res.status(204).send();
    }
    catch (error) {
        console.error(error);
        return res.status(404).json({ erro: "Curso não encontrado" });
    }
});
exports.default = router;
