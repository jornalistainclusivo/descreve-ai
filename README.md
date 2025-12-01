# DescreveAI: Imagens em Texto (v1.1.0)

![Status](https://img.shields.io/badge/Status-Stable-green) ![Version](https://img.shields.io/badge/Version-1.1.0-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

**DescreveAI** é uma aplicação Fullstack que utiliza a API do Google Gemini para gerar descrições acessíveis, SEO e conteúdo social a partir de imagens.

Desenvolvido para auxiliar criadores de conteúdo e desenvolvedores a tornarem a web mais inclusiva (WCAG).

---

## ✨ Funcionalidades

- 🖼️ **Análise Visual com IA:** Gera descrições detalhadas usando modelos Google Gemini Pro/Flash.
- ♿ **Foco em Acessibilidade:** Gera Alt Text otimizado para leitores de tela.
- 📊 **SEO & Social:** Extrai palavras-chave e cria legendas para Instagram/LinkedIn.
- 📂 **Histórico Local:** Salva todas as análises em banco de dados PostgreSQL (via Prisma ORM).
- 📥 **Exportação:** Permite baixar o relatório completo em `.txt`.
- 📱 **Responsivo:** Interface adaptada para Desktop e Mobile.

---

## 🛠️ Stack Tecnológica

O projeto segue uma arquitetura **Monorepo**:

- **Frontend (`/web`):** React, Vite, TailwindCSS, Lucide React.
- **Backend (`/server`):** Node.js, Express, Google Generative AI SDK.
- **Banco de Dados:** PostgreSQL (gerenciado via Prisma ORM).
- **Infraestrutura:** Docker Compose.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js (v18 ou superior)
- Docker & Docker Compose (para o Banco de Dados)
- Chave de API do Google Gemini ([Obter aqui](https://aistudio.google.com/))

### 1. Configuração do Ambiente

Clone o repositório:

```bash
git clone [https://github.com/jornalistainclusivo/descreve-ai.git](https://github.com/jornalistainclusivo/descreve-ai.git)
cd descreve-ai
````

Instale todas as dependências (Front, Back e Prisma):

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

Crie um arquivo `.env` dentro da pasta `/server`.
**Importante:** Este projeto usa Prisma, então a conexão é via URL única.

```ini
PORT=3000

# Conexão com Banco de Dados (PostgreSQL)
# Formato: postgresql://USUARIO:SENHA@HOST:PORTA/BANCO?schema=public
DATABASE_URL="postgresql://jinc_user:SuaSenhaAqui@localhost:5432/descreveai_db?schema=public"

# Chave da IA
GEMINI_API_KEY=Sua_Chave_Google_Aqui
```

### 4\. Inicializar o Banco

Sincronize o esquema do Prisma com o banco de dados:

```bash
cd server
npx prisma db push
cd ..
```

### 5\. Executar

Inicie o Frontend e o Backend simultaneamente:

```bash
npm run dev
```

Acesse: `http://localhost:5173`

---

## 🤝 Contribuição

Este projeto é mantido pela **InclusiveAI / Jornalista Inclusivo**.
Sinta-se à vontade para abrir Issues ou Pull Requests.

---

2025 JINC.com.br
