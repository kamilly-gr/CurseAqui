import express from 'express'
import instrutorRouter from './routes/instrutorRouter'
import cursoRouter from './routes/cursoRouter'

const app = express()

app.use(express.json())
app.use("/instrutores", instrutorRouter)
app.use("/cursos", cursoRouter)

app.listen(3000, () => {
  console.log('Servidor está rodando na porta 3000')
})