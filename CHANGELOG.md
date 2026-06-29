# Changelog

## [v0.5.0-main] - 2026-06-29

### Adicionado

- **Plugin as a Service (PaaS):** O backend agora funciona nativamente como um AI Gateway para o plugin WP Acessível JINC.
- **Robust Image Processing:** Rota `/api/analyze` aprimorada para suportar upload direto de imagens (`multipart/form-data`) via `multer`.
- **Database Integration:** Resultados da análise agora são persistidos no banco de dados via Prisma, com tracking do status (`Success`).
- **Memory Optimization:** Buffer em memória implementado para evitar vazamento de disco durante uploads temporários de imagens pelo WordPress.

## v0.2.0-pre-alpha (Reclassificação)

- **Ciclo de Vida:** Projeto movido para estágio Pre-alpha para refletir o desenvolvimento contínuo de funcionalidades.
- **Nota:** A versão foi ajustada de 1.1.0 para 0.2.0 para aderir ao Semantic Versioning (0.x.x = Instável/Dev).

## v1.1.0 (2025-11-30)

- **Infraestrutura:** Migração completa da camada de banco de dados para **Prisma ORM**.
- **Backend:** Abstração de queries SQL para suportar múltiplos bancos (Postgres/MySQL).
- **Segurança:** Correção de variáveis de ambiente no Docker.

## [v1.0.0] - 2025-11-27

### Adicionado

- Polimento de UI (remoção de cabeçalhos redundantes).
- Componente Footer com créditos.
- Botão de "Baixar Relatório (.txt)" na visualização de resultados.
- Release oficial da versão 1.0.0.

## [v0.3.0] - 2025-11-27

### Adicionado

- Implementação de Abas (Tabs) para organização dos resultados.
- Ícones Lucide para melhor experiência visual.
- Modo JSON estruturado no backend para respostas mais precisas.

## [v0.2.0] - 2025-11-26

### Adicionado

- Integração do Backend com Google Gemini API.
- Banco de Dados PostgreSQL para salvar descrições.

## [v0.1.0] - 2025-11-26

### Adicionado

- Setup inicial do Monorepo.
- Configuração do Docker e Infraestrutura Híbrida.
