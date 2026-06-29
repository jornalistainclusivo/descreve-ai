---
jinc-prd-version: 1.0.0
project-name: descreve-ai
feature-name: AI Gateway (Plugin as a Service Integration)
status: approved
related-branch: main
product-context: backend
created-at: 2026-06-29
last-updated: 2026-06-29
authors: Antigravity
---

# Descreve AI - Product Requirements Document

## 1. Executive Summary

| Field | Value |
|---|---|
| **Vision** | Descreve AI atuando como o cérebro central (AI Gateway) para plugar a acessibilidade visual em todo o ecossistema JINC, começando pelo plugin WP Acessível JINC. |
| **Target Users** | Plugins e serviços JINC (integração machine-to-machine) e usuários finais da plataforma web. |

---

## 2. Problem and Opportunity

A aplicação web isolada exige que o usuário acesse o portal, faça o upload da imagem, copie e cole o alt-text gerado no WordPress. Esse fluxo manual reduz a adoção. Ao transformar o Descreve AI em um serviço consumível por API (PaaS), podemos plugar a inteligência artificial nativamente dentro do fluxo de upload de mídia do WordPress.

---

## 3. User Requirements

### Primary Personas

**Persona 1: Módulo Media Gatekeeper do WP Acessível JINC**

- **Situação:** Ao receber um upload de imagem no WordPress sem texto alternativo.
- **Necessidade:** Enviar o binário da imagem para um servidor capaz de abstrair os modelos de LLM (GPT-4o) e retornar uma descrição precisa em segundos, mantendo um histórico do que foi analisado.

---

## 4. Functional Requirements

### Must-Have (MVP)

| ID | Requirement | User Story |
|---|---|---|
| FR-001 | Endpoint de Análise Multipart | Como serviço externo, o backend deve expor a rota `/api/analyze` aceitando `multipart/form-data` contendo o binário da imagem. |
| FR-002 | Validação e Buffer Seguro | Como servidor Node.js, devo utilizar buffer em memória para o upload (multer) de forma a não estourar o disco com arquivos temporários no lab. |
| FR-003 | Persistência do Histórico | Como gateway de dados, após analisar a imagem na OpenAI, o serviço deve salvar um log no banco de dados Postgres via Prisma para auditoria futura. |

---

## 5. Accessibility Requirements

**MANDATORY — JINC standard: WCAG 2.2 AAA**

O modelo LLM subjacente deve ser instruído através de system prompts (via biblioteca de IA do JINC) para fornecer textos descritivos concisos que sigam as melhores práticas de Leitores de Tela (screen readers).

---

## Downstream Pipeline

This PRD is the input for:

- **SDD (Architecture):** Integração com `multer`, `prisma` e Express Routes.
- **Spec (Technical Spec):** Endpoint definition and multipart handlers.

PRD Status: approved
Ready for SDD: yes
