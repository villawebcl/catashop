---
name: catashop-context
description: Use this skill when working on the Catashop repository to quickly load product context, current technical state, operating workflows, and safe continuation steps.
---

# Catashop Context Skill

## When to use
- Any task in this repo that needs fast understanding of business context, architecture, or current project status.
- Before proposing significant changes or continuing a previous sprint.

## Core workflow
1. Read `docs/APP_CONTEXT.md` for product/business and technical context.
2. Read `docs/WORK_CONTINUITY.md` for current status and immediate continuation points.
3. If executing operational changes, read `docs/OPERATIONS_RUNBOOK.md`.
4. If releasing, read `docs/RELEASE_CHECKLIST.md`.
5. Keep changes incremental and validate with CI/E2E workflows already defined.

## Repo conventions to respect
- Do not break existing flows (`carrito -> pedido -> WhatsApp` and admin operations).
- Prefer small commits with focused scope.
- For tests in CI, rely on deterministic smoke (`e2e/ci-smoke.spec.ts`).
- Use staging/production workflows for real-environment validation.
