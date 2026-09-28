"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const instrutorRouter_1 = __importDefault(require("./routes/instrutorRouter"));
const cursoRouter_1 = __importDefault(require("./routes/cursoRouter"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/instrutores", instrutorRouter_1.default);
app.use("/cursos", cursoRouter_1.default);
app.listen(3000, () => {
    console.log('Servidor está rodando na porta 3000');
});
