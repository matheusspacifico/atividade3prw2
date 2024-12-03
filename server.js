import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(express.json())

const usuarios = []

const alunos = [
    {
        id: 1,
        nome: "Filme do Coringa",
        ra: "11111",
        nota1: 9.0,
        nota2: 4.3
    },
    {
        id: 2,
        nome: "Literalmente meu primo",
        ra: "22222",
        nota1: 6.0,
        nota2: 6.0
    },
    {
        id: 3,
        nome: "Fulano de Tal",
        ra: "33333",
        nota1: 8.5,
        nota2: 7.4
    }
]

app.post("/register", async (req, res) => {
    const {username, password} = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    usuarios.push({username, password: hashedPassword})

    res.status(201).json({message: "Usuário registrado com sucesso."})
})

app.post("/login", async (req, res) => {
    const {username, password} = req.body

    const usuario = usuarios.find(u => u.username === username)
    if (!usuario) {
        return res.status(401).json({message: "Login incorreto."})
    }

    const isPasswordCorrect = await bcrypt.compare(password, usuario.password)
    if (!isPasswordCorrect) {
        return res.status(401).json({message: "Login incorreto."})
    }

    const token = jwt.sign(
        {username: usuario.username},
        process.env.JWT_SECRET,
        {expiresIn: "1h", algorithm: "HS256"}
    )

    res.json({
        message: `Login efetuado pelo usuário ${usuario.username}`,
        jwt: token
    })
})

const authenticateJWT = (req, res, next) => {
    const authHeader = req.header("Authorization")
    console.log("Authorization " + authHeader)

    let token
    if (authHeader) {
        const parts = authHeader.split(" ")
        if (parts.length === 2){
            token = parts[1]
        }
    }

    if (!token) {
        return res.status(401).send("Acesso negado. Token não fornecido.")
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).send('Acesso negado. Token expirado.')

            } else if (err.name === 'JsonWebTokenError') {
                return res.status(403).send('Acesso negado. Token inválido.')

            } else {
                return res.status(403).send('Acesso negado. Erro na verificação do token.')
            }
        }

        req.user = user

        const issuedAtISO = new Date(user.iat * 1000).toISOString()
        const expiresAtISO = new Date(user.exp * 1000).toISOString()

        console.log(`Token validado para usuário: ${user.username}
            Emitido em: ${issuedAtISO}
            Expira em: ${expiresAtISO}
        `)

        next()
    })
}

app.use("/alunos", authenticateJWT);

app.get("/alunos", (req, res) => {
    res.json(alunos)
})

app.get("/alunos/:id", (req, res) => {
    const aluno = alunos.find(a => a.id === parseInt(req.params.id))
    if (!aluno) {
        return res.status(404).json({message: "Aluno não encontrado!"})
    }
    res.json(aluno)
})

function calcularMedia(n1, n2) {
    return parseFloat(((n1 + n2) / 2).toFixed(2))
}

app.get("/alunos/medias", (req, res) => {
    const medias = alunos.map(a => ({
        nome: a.nome,
        media: calcularMedia(a.nota1, a.nota2)
    }))
    res.json(medias)
})

app.get("/alunos/aprovados", (req, res) => {
    const aprovacao = alunos.map(a => ({
        nome: a.nome,
        status: calcularMedia(a.nota1, a.nota2) >= 6 ? "aprovado" :  "reprovado"
    }))
    res.json(aprovacao)
})

app.post("/alunos", (req, res) => {
    const { id, nome, ra, nota1, nota2 } = req.body;
    if (!id || !nome || !ra || nota1 === undefined || nota2 === undefined) {
        return res.status(400).json({ message: "Todos os campos devem ser preenchidos." });
    }

    const novoAluno = { id, nome, ra, nota1, nota2 };
    alunos.push(novoAluno)
    res.status(201).json({message: "Aluno registrado com sucesso."})
})

app.put("/alunos/:id", (req, res) => {
    const alunoIdx = alunos.findIndex(a => a.id === parseInt(req.params.id))
    if (alunoIdx === -1) {
        return res.status(404).json({message: "Aluno não encontrado."})
    }

    alunos[alunoIdx] = {
        ...alunos[alunoIdx],
        ...req.body
    }

    res.json({message: "Aluno atualizado com sucesso."})
})

app.delete("/alunos/:id", (req, res) => {
    const alunoIdx = alunos.findIndex(a => a.id === parseInt(req.params.id))
    if (alunoIdx === -1) {
        return res.status(404).json({message: "Aluno não encontrado."})
    }

    alunos.splice(alunoIdx, 1)
    res.json({message: "Aluno deletado com sucesso."})
})

app.listen(3000, () => {
    console.log("Servidor ativo.")
})