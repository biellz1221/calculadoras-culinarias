---
name: fonte-nova
description: Protocolo de triagem e extração quando chega obra nova em references/ — PDF, EPUB ou material de curso. Use quando o pedido for "adicionei livros", "olha essa fonte", "dá pra aproveitar esse material?", "extrair receitas de", ou antes de citar qualquer obra que ainda não está em src/data/books.ts. Também quando um número novo vai entrar em src/data/ vindo de obra já conhecida mas seção nunca lida.
---

# Fonte nova

Extrair número de fonte é onde este projeto mais errou e mais aprendeu. Este
protocolo existe porque três PDFs do acervo eram OCR disfarçado (um deles
alimentou uma calculadora publicada por semanas antes de alguém conferir), uma
tabela estava a três páginas do título errado, e 270 g de manteiga quase
entraram numa massa em que só laminam. Cada passo abaixo pagou seu ingresso.

## 1. Triagem — antes de ler qualquer conteúdo

```bash
pdfinfo  "arquivo.pdf" | grep -E "Creator|Producer|Pages"
pdffonts "arquivo.pdf" | head -6
```

- `Creator: ABBYY FineReader` ou similar → **scan com OCR**.
- Fonte única `GlyphLessFont` → **camada de OCR do Tesseract**.
- Fontes embutidas variadas (subset `ABCDEF+Nome`) → texto digital de verdade.

OCR acerta nome e **destrói número** (`S00` por `500`, `l` por `1`, `½` por
`%`). Obra OCR não é descartada — mas todo número dela sai da **imagem
renderizada** (`pdftoppm -f N -l N -r 130 -png`), lida com os olhos, nunca da
camada de texto. EPUB: descompactar com `unzip` e limpar as tags; não tem
paginação física, então `locator: 'chapter'` sempre.

## 2. As duas perguntas, medidas por obra

"Tem texto?" e "**pesa?**" são perguntas diferentes. Meça as duas antes de
planejar qualquer extração:

```bash
grep -oE "[0-9]+ ?(g|grams?)\b" obra.txt | wc -l   # pesagens
grep -oiE "[0-9]+ ?g[) ].{0,30}(salt|sal)" obra.txt | head   # pesa O SAL?
```

Livro que pesa farinha mas dá sal em colher rende **meia fórmula** — não vira
preset (caso Helou: 311 receitas, zero utilizáveis). Registre o veredito por
obra na pesquisa, inclusive as recusadas e o porquê.

## 3. Paginação — só para PDF que vai ser citado por página

Conferir deslocamento PDF↔impresso em **três ou mais pontos distantes** (fólio
visível, sumário, marca de composição). Deslocamento constante → `locator:
'page'`. Crescente → teste a razão 2:1 antes de desistir: pode ser digitalização
de página dupla (`impressa = 2×PDF − k`, caso do Modernist vol. 1 — e aí a
camada de texto mistura duas páginas: só a imagem diz em qual delas a frase
está). Nada constante → `locator: 'chapter'`, sem heroísmo.

## 4. Extração — com caso-verdade ou nada

Todo número extraído precisa de uma conferência que **a própria fonte oferece**:

- **Rendimento declarado**: somar ingredientes contra "makes X g of dough".
  Divergência grande é ingrediente que não entra na massa (manteiga de
  laminação) ou que faltou (segunda água). É teste de graça — use sempre.
- **Regra × receita da mesma obra**: a proporção enunciada reproduz a receita
  impressa? (0,8% × 530 g ≈ 4,3 g). Fonte que se obedece valida a transcrição.
- **Tabela redundante**: obra que publica razão E porcentagem se confere sozinha.
- **Valor conhecido**: se a extração produz densidades/conversões, teste contra
  algo que você já sabe (água = 1,00 g/mL). Se espalha, a extração não presta.

Cuidado com proximidade: **em livro ilustrado, a tabela mais próxima do título
nem sempre é a do título** — confirme pelo sumário do capítulo.

## 5. Julgamento — o que entra e o que espera

- Ponto fora da curva **dentro** da mesma obra (4% de sal onde o autor usa
  1,5–3% em todo o resto) = suspeita de erro de edição → **reter até segunda
  fonte**, mesmo que internamente coerente.
- Divergência **entre** obras = conteúdo: as duas citações na tela, com a
  escolha justificada por escrito.
- Coluna de escala impressa vem arredondada: guarde os **pesos publicados** e
  derive a proporção deles.
- Material de curso entra com `kind: 'course'` em `books.ts` e a página declara
  que não é bibliografia. Curso pago ou obra sob direito autoral: publicamos
  **proporção com atribuição** (citação), nunca receita, texto ou imagem.

## 6. Registrar

Pesquisa em `docs/research/<tema>.md` **antes** do código: triagem por obra,
vereditos com motivo, casos-verdade rodados, defeitos da fonte achados
(erro de composição, conversão errada — com slide/página). Entrada em
`src/data/books.ts` com comentário dizendo como a paginação foi conferida.

## Checagens antes de dar por pronto

- Nenhum número em `src/data/` sem linha correspondente na pesquisa.
- Todo número de obra OCR conferido em imagem (diga isso na pesquisa).
- `npx vitest run src/data` verde (citações resolvem, locators corretos).
- `references/` fora do `git status`.
