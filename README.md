# 🎬 Da Mata Produtora - Plataforma de Portfólio Digital

> **"Transformamos ideias em experiências visuais marcantes."**

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue)](https://expressjs.com/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)]()

Uma plataforma web robusta e imersiva desenvolvida para a **Da Mata Produtora**, fhcada em apresentar portfólio audiovisual de alta qualidade com uma experiência de usuário (UX) premium e um sistema de gerenciamento de conteúdo (CMS) integrado.

![Preview do Projeto](./screenshots/home_preview.png)
*(Imagem ilustrativa - Screenshots reais serão geradas)*

---

## 🚀 Sobre o Projeto

Este projeto não é apenas um site; é uma **ferramenta de conversão e branding**. Desenvolvido com uma arquitetura focada em performance e facilidade de manutenção, ele permite que a produtora gerencie seus vídeos, campanhas e documentários de forma autônoma, sem perder a elegância visual que o setor exige.

A aplicação combina um backend sólido em **Node.js/Express** com um frontend **Vanilla JS** altamente otimizado, garantindo carregamento rápido e animações fluidas que prendem a atenção do visitante.

## ✨ Principais Funcionalidades

### 🎨 Experiência do Usuário (Frontend)
- **Cinema em Casa**: Integração nativa com a API do YouTube para backgrounds de vídeo imersivos na Hero Section.
- **Portfólio Dinâmico**: Grid de projetos estilo "feed" com carrosséis de imagens e vídeos interativos.
- **Lightbox Personalizado**: Visualização de mídia em tela cheia sem sair da página, mantendo o usuário imerso.
- **Micro-interações**: Animações de scroll, transições suaves e feedback visual para cada ação.

### 🛠️ Painel Administrativo (CMS)
- **Gestão Total**: Adicione, edite e remova projetos do portfólio em tempo real.
- **Upload de Mídia**: Sistema de upload de imagens (via `multer`) com pré-visualização instantânea.
- **Segurança**: Autenticação baseada em sessão, hash de senhas com `bcrypt` e proteção de rotas.
- **Recuperação de Acesso**: Fluxo completo de "Esqueci minha senha" com perguntas de segurança configuráveis.

## 🛠️ Stack Tecnológica

- **Backend**: Node.js, Express.
- **Frontend**: HTML5, CSS3 Moderno (CSS Variables, Flexbox/Grid), JavaScript (ES6+).
- **Dados**: JSON Flat-file Database (rápido, portátil e eficiente para este escopo).
- **Segurança**: Helmet, CORS, Bcrypt.
- **Mídia**: Integração YouTube Data API.

## 📦 Instalação e Uso

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/sitedamata.git
   cd sitedamata
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o ambiente**
   Crie um arquivo `.env` na raiz (use `.env.example` como base):
   ```
   SESSION_SECRET=sua_chave_secreta_aqui
   ```
   
   Configure o `config.json` (será criado automaticamente ou use `config.example.json`).

4. **Inicie o servidor**
   ```bash
   npm start
   ```

5. **Acesse**
   - Site: `http://localhost:3000`
   - Admin: `http://localhost:3000/login.html`

## 🛡️ Segurança e Boas Práticas
O projeto segue práticas modernas de desenvolvimento, incluindo sanitização de dados, segregação de configuração via variáveis de ambiente e estruturação MVC.

---

Desenvolvido com 💙 por [Seu Nome/Portfólio]
