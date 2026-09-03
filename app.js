/* ============ IMPORTS ============ */
require("dotenv").config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const User = require('./models/User');

/* ============ SETUP ============ */
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (frontend) utilizando a pasta views
app.use(express.static(path.join(__dirname, 'public')));

// Armazenar secrets em variáveis para evitar múltiplas leituras
const SECRET = process.env.SECRET;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME || 'auth-db';
const PORT = process.env.PORT || 3000;

/* ============ MIDDLEWARE ============ */
function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "Acesso negado!" });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded; // Item 3: Anexa os dados decodificados do usuário na requisição
        next();
    } catch(err) {
        return res.status(401).json({ msg: "Token inválido ou expirado!" });
    }
}

/* ============ VALIDATIONS ============ */
function validateEmail(email) {
    return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    return password && password.length >= 6;
}

/* ============ ROUTES ============ */

// Open Route (alterado para /api para liberar a raiz "/" para o index.html da pasta public)
app.get('/api', (req, res) => {
    res.status(200).json({ msg: "Bem-vindo a nossa API" });
});

// Register User
app.post('/auth/register', async (req, res, next) => {
    try {
        const { name, email, password, confirmpassword } = req.body;

        // Validations
        if (!name) {
            return res.status(422).json({ msg: "O nome é obrigatório!" });
        }
        if (!validateEmail(email)) {
            return res.status(422).json({ msg: "Email inválido!" });
        }
        if (!validatePassword(password)) {
            return res.status(422).json({ msg: "A senha deve ter no mínimo 6 caracteres!" });
        }
        if (password !== confirmpassword) {
            return res.status(422).json({ msg: "As senhas não conferem!" });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(422).json({ msg: "Usuário com e-mail já cadastrado!" });
        }

        // Create password hash
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
            name,
            email,
            password: passwordHash
        });

        await user.save();
        res.status(201).json({ msg: "Usuário criado com sucesso!" });

    } catch(err) {
        next(err);
    }
});

// Login User
app.post('/auth/user', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validations
        if (!validateEmail(email)) {
            return res.status(422).json({ msg: "Email inválido!" });
        }
        if (!password) {
            return res.status(422).json({ msg: "A senha é obrigatória!" });
        }

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado!" });
        }

        // Check if password match
        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(422).json({ msg: "Senha inválida!" });
        }

        // Item 2: Define tempo de expiração do JWT (ex: 24 horas)
        const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1d' });

        res.status(200).json({ 
            msg: "Autenticação realizada com sucesso!", 
            token, 
            userId: user._id 
        });

    } catch(err) {
        next(err);
    }
});

// Private Route
app.get('/user/:id', checkToken, async (req, res, next) => {
    try {
        const { id } = req.params;

        // Item 1: Validação do formato do ObjectId do MongoDB
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ msg: "ID de usuário inválido!" });
        }

        // Check if user exists
        const user = await User.findById(id, '-password');

        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado!" });
        }

        res.status(200).json({ user });

    } catch(err) {
        next(err);
    }
});

/* ============ ERROR HANDLER ============ */
// Item 4: Middleware centralizado de tratamento de erros
app.use((err, req, res, next) => {
    console.error("Erro interno:", err);
    res.status(err.status || 500).json({
        msg: "Erro interno do servidor, tente novamente mais tarde!"
    });
});

/* ============ DATABASE & SERVER ============ */
// Codificar credenciais para URL (caracteres especiais)
const encodedPass = encodeURIComponent(DB_PASS);

mongoose
    .connect(
        `mongodb+srv://${DB_USER}:${encodedPass}@cluster0.tpq6zwn.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
    )
    .then(() => {
        const server = app.listen(PORT, () => {
            console.log("✓ Conectou ao BANCO DE DADOS");
            console.log(`✓ Servidor rodando na porta ${PORT}`);
        });

        // Tratamento de erro de porta já em uso
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`✗ Porta ${PORT} já está em uso!`);
                console.error("Execute: fuser -k " + PORT + "/tcp");
            } else {
                console.error("✗ Erro no servidor:", err.message);
            }
            process.exit(1);
        });
    })
    .catch((err) => {
        console.error("✗ Erro de conexão com o banco:", err.message);
        process.exit(1);
    });