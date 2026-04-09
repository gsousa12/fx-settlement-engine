Ótima escolha de vaga — é um processo seletivo técnico e competitivo, então o projeto precisa ser cirúrgico. Aqui está a ideia:

---

## FX Settlement Engine

Um sistema de pagamentos e câmbio end-to-end, construído em TypeScript/Node.js, que simula o core de uma fintech como a Lumx.

Aqui está a arquitetura do que você construiria:---

### O que o projeto cobre (e por quê impressiona)

**Core do negócio — FX + pagamentos**
Você implementa um fluxo completo: cliente solicita conversão BRL→USD → o sistema faz um quote com rate-lock por N segundos (simula integração com um FX provider) → executa o pay-in via PIX simulado → executa o pay-out → faz settlement. Esse fluxo toca exatamente o que a Lumx faz no dia a dia.

**Saga com Temporal.io**
Esse é o diferencial técnico mais visível. O fluxo de pagamento FX é uma saga com compensações: se o pay-out falha após o pay-in ter sido confirmado, o sistema reverte automaticamente com um estorno. Temporal.io gerencia durabilidade, retries e state machine sem você precisar implementar tudo na mão.

**Idempotency, retries e DLQ**
Toda operação de pay-in e pay-out recebe uma `idempotency_key`. Chamadas duplicadas retornam o resultado da operação original. Failures vão para uma Dead Letter Queue com backoff exponencial e alertas.

**Ledger e reconciliation**
O banco de dados usa double-entry bookkeeping — cada movimentação gera dois lançamentos (debit + credit). Um job periódico valida que o saldo total do sistema está zerado. Isso mostra que você entende modelagem de dinheiro corretamente.

**Observabilidade**
OpenTelemetry com distributed tracing: você consegue ver o span completo de uma transação atravessando todos os serviços. Logs estruturados (JSON) com correlation IDs.

---

### Stack sugerida

TypeScript + Node.js · Fastify · Temporal.io · PostgreSQL + Prisma · BullMQ (simula SQS) · OpenTelemetry · Vitest com testes de integração · Docker Compose para subir tudo localmente

---

### O que escrever no README

Um ADR (Architecture Decision Record) explicando por que Temporal.io em vez de uma state machine caseira, um runbook descrevendo como investigar uma transação stuck, e exemplos de curl mostrando o fluxo completo. Isso demonstra exatamente a maturidade que eles pedem em "Document & mentor".

Quer que eu detalhe algum componente específico — como o schema do ledger, a implementação da saga, ou a estrutura de pastas do projeto?