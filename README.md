# DescreveAI: Imagens em Texto (v1.0.0)

![Status](https://img.shields.io/badge/Status-Stable-green) ![Version](https://img.shields.io/badge/Version-1.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

**DescreveAI** é uma aplicação Fullstack que utiliza a API do Google Gemini para gerar descrições acessíveis, SEO e conteúdo social a partir de imagens.

Desenvolvido para auxiliar criadores de conteúdo e desenvolvedores a tornarem a web mais inclusiva (WCAG).

---

## ✨ Funcionalidades

- 🖼️ **Análise Visual com IA:** Gera descrições detalhadas usando Gemini 1.5 Flash.
- ♿ **Foco em Acessibilidade:** Gera Alt Text otimizado para leitores de tela.
- 📊 **SEO & Social:** Extrai palavras-chave e cria legendas para Instagram/LinkedIn.
- 📂 **Histórico Local:** Salva todas as análises em banco de dados PostgreSQL.
- 📥 **Exportação:** Permite baixar o relatório completo em `.txt`.
- 📱 **Responsivo:** Interface adaptada para Desktop e Mobile.

---

## 🛠️ Stack Tecnológica

O projeto segue uma arquitetura **Monorepo**:

* **Frontend (`/web`):** React, Vite, TailwindCSS, Lucide React.
* **Backend (`/server`):** Node.js, Express, Google Generative AI SDK.
* **Banco de Dados:** PostgreSQL (via Docker).
* **Infraestrutura:** Docker Compose (Rede Bridge).

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
* Node.js (v18+)
* Docker & Docker Compose (para o Banco de Dados)
* Chave de API do Google Gemini ([Obter aqui](https://aistudio.google.com/))

### 1. Configuração do Ambiente

Clone o repositório:
```bash
git clone [https://github.com/jornalistainclusivo/descreve-ai.git](https://github.com/jornalistainclusivo/descreve-ai.git)
cd descreve-ai
````

Instale todas as dependências (Front e Back):

```bash
npm run install-all
```

### 2\. Configuração do Banco de Dados (Docker)

Suba o container do PostgreSQL:

```bash
# Certifique-se de que o Docker está rodando
docker-compose up -d
```

### 3\. Variáveis de Ambiente (.env)

Crie um arquivo `.env` dentro da pasta `/server` com as suas credenciais:

```ini
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=jinc_user
DB_PASS=SuaSenhaAqui
DB_NAME=descreveai_db
GEMINI_API_KEY=Sua_Chave_Google_Aqui
```

### 4\. Executar

Inicie o Frontend e o Backend simultaneamente:

```bash
npm run dev
```

Acesse: `http://localhost:5173`

-----

## 🤝 Contribuição

Este projeto é mantido pela **InclusiveAI / Jornalista Inclusivo**.
Sinta-se à vontade para abrir Issues ou Pull Requests.

-----

© 2025 JINC.com.br