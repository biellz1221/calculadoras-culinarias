# QA — glossário com fonte, endereço e tooltip

**Data:** 2026-09-04 · **Branch:** `feature/glossary-sources`
**Base:** `feature/scale-and-pwa`

## O que entrou

Story **3.3 · Glossário com tooltips** (Should, FR-004), os dois critérios:
tooltip no termo com definição curta **+ fonte**, e âncora direta por verbete.

## Verificação

```
pnpm verify   → lint · typecheck · 493 testes · build   ✅
pnpm test:e2e → 192 testes (desktop + mobile)           ✅
```

## O que a tarefa encontrou

Dar fonte a cada verbete era o trabalho; o resultado foi achar **dois números
que já estavam na tela sem nenhuma**, num site cuja premissa inteira é que isso
não acontece.

| Onde | O que estava escrito | O que foi feito |
| --- | --- | --- |
| Glossário do gelato, "Overrun" | "Gelato artesanal fica entre 20 e 35%" | Número removido; o conceito ficou. |
| Densidade da calda | 1,10 g/mL como padrão | Fica, dito como **valor de trabalho declarado**, não número de fonte. O campo já era editável; agora está escrito por quê. |

Procurei os dois na planilha do curso — `overrun`, `aeração`, `litro`, `volume`,
`ml`, `densidade` — e não há nada. A temperatura de serviço, de que eu também
desconfiava, **está**: a célula C24 calcula `PAC/25` sob o rótulo "Temperatura
Média de Serviço", e passou a ser citada.

Precedente seguido: `JAR_GRAMS_PER_MILLILITER` no picles já era "estimativa
declarada, não número de fonte, e a interface diz isso na tela".

Registrado em `docs/research/bibliografia-candidata.md`, Parte 6, com a
observação de que Corvitto ou Migoya resolvem os dois.

## Apontamentos

| # | Severidade | Achado | Correção |
| --- | --- | --- | --- |
| 1 | Média | O glossário era **array**, então o tipo derivado não exigia paridade entre idiomas: uma tradução faltando seria só uma diferença de tamanho, silenciosa. | Virou objeto chaveado por id. O compilador passa a exigir os mesmos verbetes nos dois idiomas, e um teste confere contra o registro em `data`. |
| 2 | Baixa | Um alarme meu: o glossário em inglês parecia ter 9 verbetes contra 10. **Era artefato do meu grep** — `"Baker's percentage"` usa aspas duplas e dois verbetes estão em linha única. Os dez sempre estiveram lá. | Nada a corrigir. Registrado para não voltar a soar. |
| 3 | Baixa | O tooltip criou ambiguidade num e2e antigo: a âncora do verbete tem `aria-label` que **contém** o nome de um campo, e `getByLabel` casa por trecho. | Busca exata no teste da densidade. |
| 4 | Baixa | `e2e/recipes.spec.ts` piscou uma vez sob carga: oito navegações num teste só, com o padrão de 5 s do `expect`. | Timeout explícito de 15 s naquele laço. Não era regressão — passou no rerun sem alteração. |

## Decisões

- **Botão, não `title` do HTML.** O `title` nativo não abre no toque, não abre
  pelo teclado e não cabe uma citação. O critério pede os três caminhos.
- **Verbete sem fonte aparece e diz que não tem.** A alternativa seria escolher
  uma referência aproximada, e num site cuja promessa é a procedência isso é
  pior do que a lacuna. Um teste fixa a lista em exatamente dois, para um
  terceiro não entrar de fininho.
- **Tooltip onde o jargão mora**, não em toda ocorrência de toda palavra: as
  métricas do balanço do gelato (POD, PAC, SNGL, sólidos totais) e as do pão
  (hidratação e os três pré-fermentos). "Sal" e "açúcar" se explicam sozinhos, e
  virar botão seria ruído.

## Pendente

- O tooltip não foi ligado nos rótulos de picles e massas. Os termos de lá
  (salmoura, salga direta, al dente, sêmola) aparecem em prosa corrida, e
  marcá-los exigiria quebrar os textos do dicionário em pedaços — mudança de
  outra natureza, que vale discutir antes de fazer.
