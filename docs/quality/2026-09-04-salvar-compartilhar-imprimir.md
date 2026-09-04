# QA — salvar, compartilhar e imprimir (+ domínio em inglês)

**Data:** 2026-09-04 · **Branch:** `feature/save-share-print`
**Escopo:** Épico 6 do PRD (FR-040, FR-041, FR-042) nas quatro calculadoras, mais
o roteamento de `culinarycalculators.com` para o inglês.

## O que entrou

| Story | Card no Trello | Situação |
| --- | --- | --- |
| 6.1 · Salvar receitas no navegador (Must) | `[M1] 6.1` | Entregue |
| 6.2 · Compartilhar por link e texto (Must) | `[M1] 6.2` | Entregue |
| 6.3 · Impressão limpa (Should) | `[M1] 6.3` | Entregue |
| — · Domínio `.com` sempre em inglês | (não havia card) | Entregue, com um passo manual |

Uma consolidação estrutural veio junto, e não era opcional: o estado das
calculadoras de pão, massa e picles morava em `useState` soltos dentro dos
componentes — no picles, dentro dos próprios painéis, com o preset trocado por
remontagem via `key`. Nenhuma das três saídas novas tem como perguntar "qual é a
receita agora?" a sete variáveis locais. Cada calculadora passou a ter um módulo
`state.ts` puro (o gelato já tinha reducer) com `parse…State` para validar o que
vem de fora.

## Verificação

```
pnpm verify   → lint · typecheck · 407 testes · build   ✅ (exit 0)
pnpm test:e2e → 174 testes (desktop + mobile)           ✅
```

Cobertura nova: 60 testes de unidade (envelope do link, store de localStorage,
validação de estado das quatro calculadoras, texto de compartilhamento, folha de
impressão, ciclo salvar→carregar pela interface) e 5 e2e.

## Apontamentos e o que foi feito

### Corrigidos durante a tarefa

| # | Severidade | Achado | Correção |
| --- | --- | --- | --- |
| 1 | **Alta** | O efeito que limpa o `?r=` da barra rodava no mesmo commit da restauração — quando o estado ainda é o inicial e já difere do restaurado — e apagava o parâmetro **antes** de a receita compartilhada aparecer. Quem recebesse um link e recarregasse a página perdia a receita. | Trava `applied` em `use-recipe-sharing.ts`: a limpeza só passa a valer depois de o estado restaurado ter de fato chegado à calculadora. Coberto por teste. |
| 2 | Média | Sem teto de tamanho, um `?r=` de megabytes seria decodificado até o fim antes de qualquer validação. | `MAX_ENCODED_LENGTH` de 8 kB, conferido antes de decodificar. Coberto por teste. |
| 3 | Média | `parseBreadState` aceitava qualquer string como chave de ingrediente: a linha atravessaria até a tabela e sairia em branco, com um peso ao lado. | `isIngredientKey` em `data/bread/types.ts`, com registro `Record<IngredientKey, true>` — chave nova na união que não seja acrescentada ali não compila. |
| 4 | Média | Estado de picles podia declarar modo `brine` com preset de chucrute: renderiza a tela de um método com os números do outro, e aqui isso passa por cima de um aviso de segurança alimentar. | `parsePicklesState` confere a coerência entre `mode` e `preset.mode`. |
| 5 | Média | Números sem limite (`Infinity`, `1e308`, negativos) chegariam ao motor e a receita inteira sairia como `NaN`. | Faixa explícita em todo campo numérico das quatro validações. |
| 6 | Baixa | Duas linhas de ingrediente com o mesmo `id` quebrariam a chave de render e a remoção de linha. | Validação de `id` único em picles e gelato. |
| 7 | Baixa | `<p aria-live="polite">` das ações colidia com o do conversor de fermento — dois live regions indistinguíveis para leitor de tela e para o seletor do e2e. | Trocado por `role="status"`, que já implica `aria-live="polite"` + `aria-atomic` e é a semântica certa para confirmação curta. |

### Aceitos com justificativa

- **A folha de impressão duplica a receita no DOM.** É o preço de ela ser irmã
  da aplicação (portal no `body`), que é o que permite ao CSS de impressão
  esconder a página inteira de uma vez. A alternativa — montar a folha só no
  evento `beforeprint` — depende de `flushSync` chegar a tempo, e o modo de
  falha é papel em branco. DOM mais pesado é preferível a impressão vazia. O
  Vitest ignora a folha por configuração; no Playwright, asserção sobre a tela
  usa `page.locator('#conteudo')`.
- **Redirecionamento do `.com` é 307, não 308.** Um permanente fica gravado no
  navegador de quem visitou uma vez e amarraria uma decisão ainda em aberto (dar
  ao `.com` um build próprio, com canonical nele mesmo). Sem tráfego no domínio
  novo, não há autoridade a consolidar, e o canonical do destino já resolve a
  duplicidade para o buscador.

## Pendente

- **Passo manual:** acrescentar `culinarycalculators.com` e `www.` ao projeto na
  Vercel. Até lá o `vercel.json` fica inerte. Enquanto isso, `isEnglishHost`
  cobre o caso de o domínio ser só apontado para o mesmo deploy.
- **Trocar o redirecionamento para permanente** quando a decisão sobre o domínio
  estiver assentada.
- **Auditar em produção** que nada sai do navegador (a promessa do rodapé). O
  código não faz nenhuma chamada de rede nova; falta a confirmação na aba de
  rede do site publicado.
