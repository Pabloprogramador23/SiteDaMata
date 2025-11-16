document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const loginSection = document.getElementById('login-section');
    const resetSection = document.getElementById('reset-section');
    const loginForm = document.getElementById('login-form');
    const resetForm = document.getElementById('reset-form');
    const messageArea = document.getElementById('message-area');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const cancelResetLink = document.getElementById('cancel-reset-link');
    const secretQuestionP = document.getElementById('secret-question');

    // --- Lógica de Login ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const result = await response.json();
            if (result.success) {
                window.location.href = '/admin.html';
            } else {
                showMessage(result.message || 'Senha incorreta.', 'error');
            }
        } catch (error) {
            showMessage('Erro ao conectar com o servidor.', 'error');
        }
    });

    // --- Lógica para Alternar Telas ---
    forgotPasswordLink.addEventListener('click', async () => {
        loginSection.style.display = 'none';
        resetSection.style.display = 'block';
        messageArea.style.display = 'none';
        
        // Busca a pergunta secreta no servidor
        try {
            const response = await fetch('/get-secret-question');
            const result = await response.json();
            if (result.success) {
                secretQuestionP.textContent = result.question;
            } else {
                secretQuestionP.textContent = 'Não foi possível carregar a pergunta.';
            }
        } catch {
            secretQuestionP.textContent = 'Erro de conexão ao buscar a pergunta.';
        }
    });

    cancelResetLink.addEventListener('click', () => {
        loginSection.style.display = 'block';
        resetSection.style.display = 'none';
        messageArea.style.display = 'none';
    });

    // --- Lógica de Redefinição de Senha ---
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const secretAnswer = document.getElementById('secret-answer').value;
        const newPassword = document.getElementById('new-password').value;

        try {
            const response = await fetch('/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secretAnswer, newPassword }),
            });
            const result = await response.json();
            if (result.success) {
                showMessage(result.message, 'success');
                resetForm.reset();
                setTimeout(() => {
                    cancelResetLink.click(); // Volta para a tela de login
                }, 2000);
            } else {
                showMessage(result.message || 'Não foi possível redefinir a senha.', 'error');
            }
        } catch (error) {
            showMessage('Erro ao conectar com o servidor para redefinir a senha.', 'error');
        }
    });

    // Função para exibir mensagens
    function showMessage(message, type = 'error') {
        messageArea.textContent = message;
        messageArea.style.color = type === 'success' ? '#28a745' : '#dc3545';
        messageArea.style.display = 'block';
    }
});
