---
name: fechar-tarefa
description: Ritual de encerramento de qualquer tarefa que mudou código — verificação, e2e, relatório de QA, LEARNINGS, commit, merge e publicação. Use quando o trabalho estiver "pronto", antes de qualquer commit final, quando o pedido for "pode subir", "bota no ar", "fecha essa tarefa", ou ao fim de qualquer feature/bugfix — mesmo que o usuário não peça QA explicitamente, porque o processo do projeto exige.
---

# Fechar tarefa

Toda tarefa deste projeto fecha do mesmo jeito, e o ritual tem passos que nada
automatiza: o `pnpm verify` não roda e2e, o typecheck mente com cache velho, e o
relatório de QA é obrigação de processo que não aparece em nenhum teste. Esta é
a sequência que as últimas dezenas de tarefas seguiram, na ordem que evita
retrabalho.

## 1. Verificação — na árvore que vai ser publicada

```bash
rm -f tsconfig.tsbuildinfo   # cache velho já escondeu erro de tipo
pnpm verify                  # lint + typecheck + testes + build
pnpm test:e2e                # verify NÃO inclui e2e
```

Se um e2e de imagem OG falhar isolado, **rode a suíte de novo antes de
investigar**: as imagens disputam o dev server e falham por tempo. Só é
regressão se repetir.

Se a tarefa foi mesclada na `main`, a verificação roda **na main já mesclada**
— não só na branch. É o resultado do merge que vai ao ar.

## 2. Relatório de QA — `docs/quality/AAAA-MM-DD-<slug>.md`

Estrutura observada nos relatórios existentes (copie o mais recente como base):

- Data, branch, escopo em uma frase, link para a pesquisa se houver.
- Tabela de verificação: verify, contagem de testes (antes → depois), e2e.
- **Apontamentos numerados por severidade** (CRÍTICO/ALTO/MÉDIO/BAIXO), cada um
  com: o que era, como foi achado, o que foi feito. Inclua os **seus próprios
  erros** pegos pelos testes — são os apontamentos mais úteis do arquivo.
- Seção de segurança: superfície nova? entrada de usuário? guardas? Se a
  resposta é "nada mudou", diga isso e por quê.
- Pendências que a tarefa abre ou deixa.

## 3. LEARNINGS — só o que é recorrível

Erro novo de **classe nova** vira entrada em `docs/quality/LEARNINGS.md`, na
seção certa, escrita como regra acionável ("faça X porque Y aconteceu"), não
como diário. Erro de classe já catalogada não ganha entrada — releia a que
existe e siga em frente.

## 4. Commit e publicação

```bash
git status --short   # OBRIGATÓRIO ler antes do add: nada de references/,
                     # calculadora gelato/, *.png de screenshot, .env*
git checkout -b feature/<slug>
git add -A && git commit   # Conventional Commit em inglês, corpo com o porquê
git checkout main && git merge feature/<slug> --no-ff -m "Merge: <resumo pt>"
# ... verificação do passo 1 na main mesclada ...
git push origin main       # SÓ com autorização do Gabriel para publicar
```

Merge na `main` **publica em produção** (Vercel). A autorização de push é por
lote de trabalho, não permanente: se o Gabriel disse "pode botar no ar quando
terminar", vale para a sequência em curso; na dúvida, pergunte antes do push.

Relatório de QA e LEARNINGS entram **no mesmo commit** da tarefa — fazem parte
do versionamento dela.

## 5. Memória e rastros

- Se a tarefa mudou o estado da bibliografia (fonte nova lida, pendência
  resolvida), atualize a memória `bibliografia-a-atualizar`.
- Se havia card de Trello como referência da tarefa, atualize-o.
- Apague screenshots e specs temporários (`e2e/__shot.spec.ts`, `*.png` na
  raiz) — já vazaram para staging uma vez.

## Checagens antes de declarar encerrado

- `pnpm verify` e `pnpm test:e2e` verdes na árvore publicada (não na branch).
- `docs/quality/AAAA-MM-DD-<slug>.md` existe e está commitado junto.
- `git log --oneline -3` mostra o merge; `git status` limpo.
- Nada de `references/` no histórico novo: `git show --stat HEAD | grep -i references` vazio.

## Modos de falha conhecidos

- **Dar por pronto com `pnpm test` verde** — não checa tipos nem e2e.
- **Relatório de QA escrito mas não commitado** — ele versiona junto da tarefa.
- **Pular o relatório porque "a tarefa era pequena"** — só leitura/config
  pessoal dispensa; mudança de código nunca.
- **Push imediato após merge sem re-rodar e2e na main** — o merge pode compor
  duas branches que passavam sozinhas e quebram juntas.
