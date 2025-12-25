const express = require('express');
// Carrega variáveis de ambiente do arquivo .env
require('dotenv').config();

const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;
const CONFIG_PATH = 'config.json';

// --- Configurações ---
const SESSION_SECRET = process.env.SESSION_SECRET;
let config = {};

// Carrega a configuração do arquivo
function loadConfig() {
    try {
        const configRaw = fs.readFileSync(CONFIG_PATH, 'utf8');
        config = JSON.parse(configRaw);
        if (!config.adminPasswordHash || !config.secretQuestion || !config.secretAnswerHash) {
            throw new Error('Arquivo de configuração inválido.');
        }
    } catch (error) {
        console.error(`ERRO FATAL: Não foi possível carregar o arquivo de configuração (${CONFIG_PATH}).`);
        console.error('Execute o script "node reset-password.js \'sua-senha\'" para criar ou corrigir o arquivo.');
        process.exit(1);
    }
}
loadConfig(); // Carrega na inicialização

// --- Middlewares ---
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 }
}));

// --- Configuração do Multer ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// --- Middleware de Autenticação ---
const checkAuth = (req, res, next) => {
    if (req.session.loggedIn) return next();
    const acceptsJson = req.headers.accept && req.headers.accept.includes('application/json');
    if (acceptsJson) return res.status(401).json({ success: false, message: 'Sessão expirada. Faça login novamente.' });
    return res.redirect('/login.html');
};

// --- Rotas Públicas ---
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));

app.post('/login', (req, res) => {
    const { password } = req.body;
    bcrypt.compare(password, config.adminPasswordHash, (err, result) => {
        if (result) {
            req.session.loggedIn = true;
            res.json({ success: true, message: 'Login bem-sucedido!' });
        } else {
            res.status(401).json({ success: false, message: 'Senha incorreta.' });
        }
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send('Não foi possível fazer logout.');
        res.redirect('/login.html');
    });
});

// Rotas de redefinição de senha
app.get('/get-secret-question', (req, res) => {
    res.json({ success: true, question: config.secretQuestion });
});

app.post('/reset-password', (req, res) => {
    const { secretAnswer, newPassword } = req.body;

    if (!secretAnswer || !newPassword) {
        return res.status(400).json({ success: false, message: 'Resposta e nova senha são obrigatórias.' });
    }

    bcrypt.compare(secretAnswer, config.secretAnswerHash, (err, result) => {
        if (!result) {
            return res.status(401).json({ success: false, message: 'Resposta secreta incorreta.' });
        }

        bcrypt.hash(newPassword, 10, (hashErr, newHash) => {
            if (hashErr) {
                return res.status(500).json({ success: false, message: 'Erro ao gerar nova senha.' });
            }

            const newConfig = { ...config, adminPasswordHash: newHash };
            fs.writeFile(CONFIG_PATH, JSON.stringify(newConfig, null, 4), 'utf8', (writeErr) => {
                if (writeErr) {
                    return res.status(500).json({ success: false, message: 'Erro ao salvar nova senha.' });
                }
                loadConfig(); // Recarrega a configuração no servidor
                res.json({ success: true, message: 'Senha redefinida com sucesso!' });
            });
        });
    });
});


// --- Rotas Protegidas ---
app.get('/admin.html', checkAuth, (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.post('/upload-images', checkAuth, upload.array('images', 10), (req, res) => {
    const filePaths = req.files.map(file => `/${file.path.replace(/\\/g, '/')}`);
    res.json({ success: true, urls: filePaths });
});
app.post('/save-portfolio', checkAuth, (req, res) => {
    const { data } = req.body;
    fs.writeFile('portfolio.json', JSON.stringify(data, null, 4), 'utf8', (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao salvar portfólio.' });
        res.json({ success: true, message: 'Portfólio atualizado com sucesso!' });
    });
});

// --- Inicia o Servidor ---
app.listen(port, () => {
    console.log(`--------------------------------------------------`);
    console.log(`🚀 Servidor da Da Mata Produtora no ar!`);
    console.log(`💻 Acessível em http://localhost:${port}`);
    console.log(`--------------------------------------------------`);
});
