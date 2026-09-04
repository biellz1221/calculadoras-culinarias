# QA — link curto e orientação de fermentação

**Data:** 2026-09-04 · **Branch:** `feature/glossary-sources`
**Base:** `feature/scale-and-pwa`

## O que entrou

| Story | Card | Situação |
| --- | --- | --- |
| 6.7 · Encurtar o link de compartilhamento | `[M4] 6.7` | Entregue |
| 2.5 · Fermento × tempo × temperatura (Could) | `[M4] 2.5` | Entregue |

```
pnpm verify   → lint · typecheck · 504 testes · build   ✅
pnpm test:e2e → 192 testes (desktop + mobile)           ✅
```

## 6.7 · O link que quebrava no WhatsApp

Bug de uso real: o link clicável terminava antes do `?r=`, e quem recebia abria
a calculadora no padrão. A causa era tamanho — o `?r=` levava o estado inteiro
em JSON com nome de campo por extenso.

Quase todo compartilhamento é de um preset com o alvo mexido, então a versão 2
do envelope manda **o preset e só o que difere dele**:

| Calculadora | Antes | Depois |
| --- | --- | --- |
| Pães | 507 | **140** |
| Massas | 212 | **99** |
| Picles | 639 | **100** |
| Gelato | 792 | **107** |

**Fica pendente:** receita de pão com a fórmula editada ainda custa 454, porque
a diferença é rasa e mexer numa porcentagem manda o objeto `formula` inteiro.
Vale aprofundar depois; o caso comum está resolvido.

Link da versão 1 continua abrindo — um link mandado por WhatsApp fica em
conversa por meses, e a versão no envelope existe exatamente para isso.

## 2.5 · Fermento, tempo e temperatura

O motor já existia em `lib/bread/yeast.ts` (`riseTimeFactor`, `waterTemperature`,
`BASE_TEMPERATURE`) e **nunca tinha chegado à tela**. A entrega foi expor, com os
pontos de calibração das fontes em `data/bread/fermentation.ts`.

### Decisões

- **A estimativa parte do ponto de calibração mais próximo**, não de uma curva.
  Extrapolar de 1% até 0,04% pela regra do dobro daria um número com cara de
  precisão e nenhuma. A receita de onde o ponto saiu aparece junto, citada.
- **Proximidade em escala logarítmica.** De 0,04% para 0,08% é o mesmo salto que
  de 1% para 2%; comparar diferença absoluta mandaria toda dose pequena para o
  mesmo ponto.
- **Primeira e segunda fermentação não se misturam.** A napoletana calibra a
  segunda; usá-la para estimar a primeira daria uma curva bonita e errada.
- **Água abaixo de zero vira aviso**, não número. Quando a cozinha está quente
  demais para a temperatura de base, dizer "−4 °C" e calar seria pior.

## Apontamentos

| # | Severidade | Achado | Correção |
| --- | --- | --- | --- |
| 1 | Média | Escrevi um teste que assumia a âncora errada: a 0,5% o ponto mais próximo é a ciabatta, não o pão francês. A asserção "metade do fermento, dobro do tempo" testava um caminho que o código não toma. | Teste refeito em 0,6% → 0,3%, onde a regra de fato se aplica, mais um caso que fixa a troca de âncora. |
| 2 | Baixa | `e2e/bread.spec.ts` dizia "o resultado é o único parágrafo com aria-live da página". O guia novo trouxe mais dois. | Locator escopado na seção do conversor. O comentário envelheceu junto com a página, e agora diz por quê. |
| 3 | Baixa | Quatro `parse*State` ficaram importados sem uso depois de a assinatura virar `shape`. | Removidos. |

## Pendente

- Aprofundar a diferença do link para a fórmula editada de pão (454 caracteres).
- **Conferir no WhatsApp de verdade**, com um link de cada calculadora. Foi assim
  que o bug apareceu, e é a única prova que vale.
