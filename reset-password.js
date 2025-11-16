const fs = require('fs');
const bcrypt = require('bcrypt');

const saltRounds = 10;

// --- Dados de Configuração ---
const password = process.argv[2];
const secretQuestion = "Qual o melhor local da UNIFOR?";
const secretAnswer = "Mesinha";

if (!password) {
    console.error('Erro: Nenhuma senha inicial fornecida.');
    console.log('Uso: node reset-password.js "sua-senha-inicial"');
    process.exit(1);
}

console.log('Gerando hashes para a senha e para a resposta secreta...');

// Usamos Promise.all para lidar com os dois hashes em paralelo
Promise.all([
    bcrypt.hash(password, saltRounds),
    bcrypt.hash(secretAnswer, saltRounds)
]).then(([passwordHash, answerHash]) => {
    const configData = {
        adminPasswordHash: passwordHash,
        secretQuestion: secretQuestion,
        secretAnswerHash: answerHash
    };

    const configPath = 'config.json';

    fs.writeFile(configPath, JSON.stringify(configData, null, 4), 'utf8', (writeErr) => {
        if (writeErr) {
            console.error('Erro ao salvar o arquivo de configuração:', writeErr);
            process.exit(1);
        }
        console.log(`Arquivo de configuração (${configPath}) criado/atualizado com sucesso!`);
        console.log('Senha e pergunta secreta foram definidas.');
    });

}).catch(err => {
    console.error('Erro ao gerar os hashes:', err);
    process.exit(1);
});