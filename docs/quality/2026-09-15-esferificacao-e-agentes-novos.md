# QA — Esferificação, cinco agentes novos e a saída da fonte única

**Data:** 2026-09-15
**Branch:** `feature/spherification`
**Escopo:** o material de curso do Scoolinary que o Gabriel trouxe, e o que ele
destravou na calculadora de gelificantes.

Pesquisa em [`docs/research/gelificantes.md`](../research/gelificantes.md),
Partes II a IV.

---

## Resultado da verificação

| Passo | Resultado |
| --- | --- |
| `pnpm verify` | **exit 0** |
| Vitest | **901 testes / 54 arquivos** (eram 880) |
| Playwright | **366 passando** (eram 358) |
| `npx tsc --noEmit` com cache limpo | sem erro |

---

## O que entrou

- **Esferificação, direta e reversa** — a lacuna que a página declarava desde
  que foi ao ar. Dose do produto e dose do banho, separadas.
- **Cinco agentes**: gelana, metilcelulose, pectina, e faixas de verdade para
  iota e kappa (antes só existia o ponto da panna cotta do Modernist).
- **Duas texturas** na escada: gel macio de colher e gel duro de cortar.
- **Segunda fonte para ágar e xantana** — a página deixa de ser de fonte única
  nos dois agentes que mais usa.

---

## Apontamentos

### 1. ALTO — a fonte tem dois erros de composição, e um deles é de ordem de grandeza

Material de curso não passa por revisão técnica de editora, e apareceu.

**O slide 55 escreve "2%, 2 gramas por litro" para a metilcelulose.** 2% de um
litro são **20 g**. Erro de 10×.

Que é erro e não outra convenção, o próprio curso prova: ele acerta a mesma
conversão na kappa ("0.1 and 1%, between 1 and 10 grams per liter") e na gelana
("0.7 and 2%, between 7 and 20 grams per kilo"). Só a metilcelulose escorrega.

**Corrigido:** usamos a porcentagem e descartamos o parêntese. Travado em teste
com a conversão certa escrita ao lado, e declarado na tela — é o tipo de erro
que estraga uma receita em silêncio.

**O slide 8 imprime "0-0.3% xanthan + 0-0.3% xanthan"** na mesma linha.
Conferido na imagem: a duplicação está no original. Lido como xantana 0–0,3% +
citrato 0,1–0,2% + alginato 0,5–1%.

### 2. MÉDIO — faixas que variam entre slides do mesmo curso

| Agente | Slide dedicado | Slides de textura |
| --- | --- | --- |
| Gelana | 0,7–2% | 0,6–2% |
| Iota | 0,2–1,5% | 0,1–0,6% |
| Ágar | 0,3–2% | macio 0,25–0,3% |

**Regra editorial adotada e escrita na pesquisa:** a dose vem do slide dedicado
ao agente, que é o que o curso apresenta como "Dosages and limitations"; os
slides de textura entram como corroboração. A divergência fica registrada em
vez de escolhida em silêncio.

### 3. MÉDIO — um teste e2e que afirmava o contrário do que a página diz agora

O e2e `a esferificação aparece como lacuna declarada, não some` protegia a
declaração de que a técnica ficava de fora por falta de fonte. A lacuna fechou.

**Virado, não apagado:** agora ele garante que a esferificação está na tela com
dose, e que o texto antigo sumiu. Mesmo movimento feito com o e2e do glossário
sem fonte quando os dois últimos verbetes órfãos ganharam fonte.

### 4. MÉDIO — dicionário sem interface

Adicionei `irreversible` e `gelsWhenHot` aos dois dicionários e **não
renderizei nenhum dos dois**. A gelana e a metilcelulose entraram na tabela
parecendo agentes comuns — justamente as duas cujo comportamento é o argumento
de existirem.

Pego pelo e2e novo, que afirmava que a gelana mostra "Não derrete depois de
pronto". Corrigido: as duas linhas ganham uma marca própria, em cor de acento,
acima das características comuns.

### 5. BAIXO — rótulo ambíguo entre as duas partes da página

Com a esferificação na mesma página, `getByLabel('Líquido')` passou a casar com
dois campos — "Líquido" e "Líquido a esferificar" — e dois e2e antigos
quebraram por *strict mode*.

Resolvido com `{ exact: true }`. Os rótulos ficam como estão: "Líquido a
esferificar" é mais claro para quem lê a tela do que qualquer desambiguação
artificial.

### 6. BAIXO — "30 min · 30°" sem contexto

A revisão visual mostrou uma linha com dois números soltos no fim dos limites da
esferificação direta. Os dois já apareciam na prosa acima. Removida.

---

## Segurança

- **Nenhuma rede, nenhuma rota de API, nenhum `dangerouslySetInnerHTML`.**
- **Guardas de valor externo** ampliadas: `isSpherificationId` entrou ao lado de
  `isTextureId` e `isGradeId`, todas sobre registros `Record<…, true>` com
  `Object.hasOwn`.
- **Bases diferentes não se somam.** A dose do produto é sobre o líquido a
  esferificar; a do banho, sobre a água do banho. O motor devolve as duas
  separadas e a tela as mostra em colunas distintas, com teste travando que
  500 g de base e 1.000 g de banho dão números diferentes. Somá-las seria o
  mesmo erro que a calculadora de picles existe para não cometer com sal sobre
  água contra sal sobre peso total.
- **Os limites da técnica direta ficam junto do resultado**, não em rodapé —
  gordura, laticínio, ácido e álcool acima de 30°. Não é segurança alimentar; é
  que dose certa numa base impossível não faz esfera nenhuma, e quem só lê o
  número perde a viagem.

Sem apontamento.

---

## Sobre citar material de curso

Entrou com `kind: 'course'`, como o curso de gelato do Lulo Fouet, sob a regra
que o projeto escreveu quando aquele entrou: **material de curso não é
bibliografia e não deve se disfarçar de uma.**

A página tem uma seção que diz isso em voz alta — que não tem paginação de
livro, que não tem bibliografia própria, que não se abre de graça, e quais são
os dois erros de composição encontrados. Citamos por documento e número de
slide.

O que publicamos são **proporções com atribuição**, que é citação; não
reproduzimos receita, texto nem imagem do curso.

---

## Pendências

- **Segunda fonte para a esferificação, a gelana e a metilcelulose.** Hoje são
  Scoolinary sozinho. Manual da Texturas (Adrià) ou Modernist vol. 4.
- A pectina do curso (1–2% da receita) **não foi cruzada** com a faixa da
  Embrapa usada nas geleias (0,5–1,5% sobre o açúcar): as bases são diferentes,
  e juntá-las seria somar grandezas distintas.
