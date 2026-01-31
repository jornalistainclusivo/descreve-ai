# DescreveAI: Imagens em Texto (v0.2.0-pre-alpha)

> **🚧 PRE-ALPHA:** Este software está em desenvolvimento ativo.
> Funcionalidades podem mudar sem aviso prévio. Não recomendado para uso em
> produção crítica.

![Status](https://img.shields.io/badge/Status-Pre--Alpha-orange)
![Version](https://img.shields.io/badge/Version-0.2.0--pre--alpha-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

**DescreveAI** é uma aplicação Fullstack que utiliza a **API da OpenAI (GPT-4o-mini)**
para gerar descrições acessíveis, SEO e conteúdo social a partir de imagens.

Desenvolvido para auxiliar criadores de conteúdo e desenvolvedores a
tornarem a web mais inclusiva (WCAG).

---

## ✨ Funcionalidades

- 🖼️ **Análise Visual com IA:** Gera descrições detalhadas com modelo **OpenAI GPT-4o-mini**.
- ♿ **Foco em Acessibilidade:** Gera Alt Text otimizado para leitores de tela.
- 📊 **SEO & Social:** Extrai palavras-chave e cria legendas para Instagram/LinkedIn.
- 📂 **Histórico Local:** Salva todas as análises em banco de dados PostgreSQL (via Prisma ORM).
- 📥 **Exportação:** Permite baixar o relatório completo em `.txt`.
- 📱 **Responsivo:** Interface adaptada para Desktop e Mobile.

---

## 🛠️ Stack Tecnológica

O projeto segue uma arquitetura **Monorepo**:

- **Frontend (`/web`):** React, Vite, TailwindCSS, Lucide React.
- **Backend (`/server`):** Node.js, Express, OpenAI SDK.
- **Banco de Dados:** PostgreSQL (gerenciado via Prisma ORM).
- **Infraestrutura:** Docker Compose.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js (v18 ou superior)
- Docker & Docker Compose (para o Banco de Dados)
- Chave de API da OpenAI (GPT-4o-mini) ([Obter aqui](https://platform.openai.com/account/api-keys))

### 1. Configuração do Ambiente

Clone o repositório:

```bash
git clone https://github.com/jornalistainclusivo/descreve-ai.git
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

> **Nota sobre a Infraestrutura:**
> Este comando subirá dois containers definidos no `docker-compose.yml`:
>
> - **PostgreSQL:** Banco de dados (Porta 5432).
> - **Adminer:** Interface visual para gerenciar o banco (Acessível em `http://localhost:8080`).

<details><summary>📄 Ver arquivo docker-compose.yml de referência</summary>

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    restart: always
    container_name: jinc_postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - jinc_network

  adminer:
    image: adminer
    restart: always
    container_name: jinc_adminer
    ports:
      - "8080:8080"
    networks:
      - jinc_network

volumes:
  postgres_data:

networks:
  jinc_network:
    external: true
```

</details>

### 3\. Variáveis de Ambiente (.env)

Edite o arquivo `.env` dentro da pasta `/server`.
**Importante:** Este projeto usa Prisma, então a conexão é via URL única.

```ini
PORT=3000

# Conexão com Banco de Dados (PostgreSQL)
# Formato: postgresql://USUARIO:SENHA@HOST:PORTA/BANCO?schema=public
DATABASE_URL="postgresql://jinc_user:SuaSenhaAqui@localhost:5432/descreveai_db?schema=public"

# Chave da IA
OPENAI_API_KEY=sk-...
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

Este projeto é mantido pela **JINC.com.br / @JornalistaInclusivo / @CriaCorpo / Dando Flor**.
Sinta-se à vontade para abrir Issues ou Pull Requests.

---

© 2025 JINC.com.br
