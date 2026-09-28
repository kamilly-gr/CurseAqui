"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prismaClient_1 = __importDefault(require("../prismaClient"));
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    const { nome, email } = req.body;
    if (typeof nome !== "string" || !nome.trim() || typeof email !== "string" || !email.trim()) {
        return res.status(400).json({ erro: "Nome e email são obrigatórios" });
    }
    try {
        const instrutor = await prismaClient_1.default.instrutor.create({
            data: { nome: nome.trim(), email: email.trim() },
        });
        return res.status(201).json(instrutor);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ erro: "Não foi possível cadastrar o instrutor" });
    }
});
router.get("/", async (_req, res) => {
    try {
        const instrutores = await prismaClient_1.default.instrutor.findMany({ include: { cursos: true } });
        return res.json(instrutores);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ erro: "Não foi possível listar os instrutores" });
    }
});
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1)
        return res.status(400).json({ erro: "ID inválido" });
    try {
        const instrutor = await prismaClient_1.default.instrutor.findUnique({
            where: { id },
            include: { cursos: true },
        });
        if (!instrutor)
            return res.status(404).json({ erro: "Instrutor não encontrado" });
        return res.json(instrutor);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ erro: "Não foi possível buscar o instrutor" });
    }
});
router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { nome, email } = req.body;
    if (!Number.isInteger(id) || id < 1)
        return res.status(400).json({ erro: "ID inválido" });
    if (typeof nome !== "string" || !nome.trim() || typeof email !== "string" || !email.trim()) {
        return res.status(400).json({ erro: "Nome e email são obrigatórios" });
    }
    try {
        const instrutor = await prismaClient_1.default.instrutor.update({
            where: { id },
            data: { nome: nome.trim(), email: email.trim() },
        });
        return res.json(instrutor);
    }
    catch (error) {
        console.error(error);
        return res.status(404).json({ erro: "Instrutor não encontrado ou email já cadastrado" });
    }
});
router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1)
        return res.status(400).json({ erro: "ID inválido" });
    try {
        await prismaClient_1.default.instrutor.delete({ where: { id } });
        return res.status(204).send();
    }
    catch (error) {
        console.error(error);
        return res.status(404).json({ erro: "Instrutor não encontrado" });
    }
});
exports.default = router;
