# QA — calculadora de cura de carnes

**Data:** 2026-09-13 · **Branch:** `feature/glossary-sources`
**Story:** a primeira da Parte 2 da bibliografia candidata — "a mais forte da lista, e a mais perigosa".

```
pnpm verify   → lint · typecheck · 552 testes · build   ✅
pnpm test:e2e → 218 testes (desktop + mobile)           ✅
```

## O que mudou no desenho por causa da pesquisa

A pesquisa (`docs/research/cura-carnes.md`) encontrou que a divergência
registrada na nossa bibliografia comparava **entrada com resíduo**. Isso não é
detalhe: define o que a calculadora pode prometer.

**Ela calcula entrada e diz isso.** Resíduo se mede em laboratório, não se prevê
a partir do que se pesa. A página afirma, com todas as letras, que **não
certifica conformidade com a RDC 272** — e essa frase vai junto no texto
compartilhado e na folha impressa, não só na tela.

## Decisões

- **O aviso de perigo vem antes dos campos.** Nas outras calculadoras o aviso
  acompanha o resultado; aqui ele precede a entrada de dados, porque quem chega
  sem saber o que é nitrito precisa ler antes de digitar.
- **O piso é aviso, não faixa.** Abaixo de 120 ppm de entrada (política do FSIS,
  via Marianski) a cura não protege. Mesma lógica do `MIN_SAFE_SALINITY` no
  picles, com custo de erro maior.
- **Arredondamento vai para o lado restritivo.** ¼ oz por 100 lb dá 156,25 ppm
  exatos; o código guarda 156.
- **Teto de 1000 ppm na validação de link.** É a última barreira entre um
  endereço qualquer e uma dose tóxica na balança de alguém.
- **A seção de limites não é `educational`.** As outras seções explicativas
  somem na interface simplificada; esta não, porque é a razão de ser da página.

## Casos-verdade

O motor é validado contra **as próprias fontes**, não contra a minha álgebra:
a tabela de dose por quilo do Marianski (Cure #1 e Peklosol, quatro linhas
cada), os tetos do 9 CFR convertidos de onça por libra, e a proporção de
trabalho do Ruhlman (25 g para 11,25 kg = 138,9 ppm).

## Apontamentos

| # | Severidade | Achado | Correção |
| --- | --- | --- | --- |
| 1 | Média | O selo de faixa mostrava "dentro da faixa" com a seta para baixo e a cor de alerta: eu mapeava `ok` para `below`. Texto e sinal visual discordando é pior que não ter sinal. | Mapeamento correto de `ok` para `in`. |
| 2 | Média | `as const` no dicionário canônico congelou cada string como tipo literal, e o inglês não compilava — 99 erros. O `pnpm test` passava, porque o Vitest não checa tipo. | Removido dos dois. Reforça por que `pnpm verify` roda `typecheck` separado. |
| 3 | Baixa | `npx tsc --noEmit` passou com um `Record` faltando chave. Era `tsconfig.tsbuildinfo` velho, não furo de tipo. | Cache apagado. Registrado nos LEARNINGS: em dúvida, apagar o tsbuildinfo antes de acreditar num typecheck limpo. |
| 4 | Baixa | Título em pt-BR estourou 60 caracteres com o sufixo do site. | Encurtado para "Cura de carnes: nitrito em ppm". |
| 5 | Baixa | Três testes de infraestrutura tinham a lista de calculadoras escrita à mão (`ALL_KEYS`, `GLOSSARIES`, `PAGES` do e2e). | Atualizados. Vale considerar derivá-los de `CALCULATORS` para a próxima calculadora não repetir isto. |

## Pendente

- **Regulamento do MAPA** — `gov.br` devolveu 403 nas tentativas. Pode fixar
  limite por categoria de produto mais específico que o da ANVISA.
- **Bacon nos EUA** tem regra própria (120 ppm de entrada) em 9 CFR 424.**22**(b),
  não na 424.21. A calculadora ainda não distingue bacon.
- **Salmoura de imersão** ficou fora: envolve concentração da salmoura e taxa de
  injeção, e é mais parente da calculadora de salmoura do que desta.
