# QA — Geleia fresca e fruta nativa brasileira

Data: 2026-09-14 · Branch: `feature/fresh-jams-native-fruit`
Pesquisa: `docs/research/geleias.md`, Parte III

## Escopo

O receituário de biodiversidade do Ministério do Meio Ambiente publica geleia
**pesada em grama** de fruta que nenhum livro de conserva da estante cobre. Sete
entraram; cinco delas são frutas que a calculadora não tinha de forma nenhuma —
umbu, maracujá-do-cerrado, maracujá-do-mato, pera-do-cerrado e a jabuticaba sem
caroço da compota.

**E elas não são conserva.** É isso que domina o desenho.

## Verificação

| Etapa | Resultado |
|---|---|
| `pnpm lint` | limpo |
| `pnpm typecheck` | limpo |
| `pnpm test` | 757 testes (eram 725 na `main`) |
| `pnpm build` | limpo |
| `playwright test` | todos passando |

## Apontamentos

### 1. Uma fonte boa para um produto diferente — **alta** — tratada por desenho

O modo de preparo cozinha a **65–70 °C**, que é onde a pectina se dissolve. O
ponto de gelificação fica trinta e cinco graus acima. Não há concentração, pote,
banho-maria nem validade declarada, em nenhuma das vinte receitas do livro.

Tratar isso como receita de conserva seria o erro mais perigoso desta leva: o
aviso de açúcar baixo desta calculadora existe para dizer "isso não é conserva
de prateleira", e aqui **nenhuma proporção** torna o produto de prateleira.

O que foi feito:

- `fresh` entrou como **terceira base de referência**, ao lado de `recipe` e
  `norm`, com texto de aviso próprio;
- o aviso de uso imediato aparece **na escolha da fruta**, acima do resultado,
  não escondido num rodapé — é sobre o que o produto é, não sobre um número;
- abaixo da receita fresca o aviso fala de **textura e doçura**, e diz que
  prateleira não há; a faixa vermelha de perigo (`beyondHardLimit`) **não**
  dispara, porque ali ela mentiria sobre a natureza do risco;
- rendimento e validade continuam ausentes para essas frutas.

### 2. Precedência entre as três bases — **média** — travada por teste

Pitanga e caju existem nos dois lugares: Tabela 1 da Embrapa e receituário. As
nove do Blue Chair não têm receita fresca, mas nada no tipo impede. A ordem é
**conserva > fresca > norma**, e há teste afirmando que toda fruta com receita de
conserva reporta base `recipe`. Se alguém inverter, cai.

### 3. Duas frutas recusadas — **baixa** — documentado

- **Araçá**: a Tabela 1 diz "araçá (roxo)" e o MMA não diz variedade. Mesma
  decisão já tomada para a uva Concord na Parte I — aproximar seria inventar.
- **Bacuri**: a receita é melado com açúcar mascavo. Outro produto.

E a **jabuticaba sem caroço** entrou como fruta separada das quatro linhas de
jabuticaba da Embrapa: "sem caroço" não é "sem casca", e a Tabela 1 distingue as
duas coisas na pectina e na acidez.

### 4. A densidade que eu fui buscar e não trouxe — **média** — verificada e recusada

As 368 receitas trazem grama **e** medida caseira, e o livro padroniza a medida
caseira num quadro próprio. Parecia fechar o **peso do sal brasileiro**, que a
pesquisa de salmoura carrega como pendência desde setembro.

Agreguei 136 entradas de sal, 100 de água, 95 de farinha. As medianas caem onde
a física manda — água 1,00, farinha 0,50, açúcar 0,83 — mas **a água, cuja
densidade é exatamente 1,00, espalha de 0,00 a 1,50 nos dados do próprio livro**.

Causa, achada entrada por entrada: a maioria converte exato pelo quadro, e uma
minoria arredonda para número redondo (500 g para 2 xícaras, quando seriam 480).
O livro converte por uma densidade que nunca declara e afrouxa no arredondamento.

Uma densidade tirada daí seria estatística minha, não número dele. **Recusada.**
Entrou só o quadro de medidas caseiras, que é publicado explicitamente, e entrou
como registro — o estado da calculadora continua sendo sempre grama.

### 5. Terceira corroboração da faixa de pectina — **sem apontamento**

As quatro doses do receituário (1,33%, 1,33%, 1,00%, 0,50% sobre o açúcar) caem
todas dentro do 0,5% a 1,5% do Embrapa Doc 138. Viraram teste.

São três instituições e três tipos de publicação dizendo o mesmo: manual
industrial, manual de bancada com onze formulações, e receituário de chef.

### 6. A divergência ficou completa — **sem apontamento**

| | Açúcar sobre a fruta |
|---|---|
| Receituário do MMA (prato) | 0,33 a 0,77 |
| Blue Chair (conserva) | 0,42 a 1,00 |
| Legislação brasileira (rótulo) | 1,00 a 1,86 |

As sete geleias do MMA ficam **todas** abaixo do mínimo legal, e há teste
garantindo. Um livro do Ministério do Meio Ambiente publica como geleia o que a
norma de rótulo do mesmo país não deixaria chamar assim — e nenhum dos dois está
errado.

## Segurança

Revisão à mão. Nada aberto.

- **Entrada não confiável:** `fresh` entrou no registro de níveis validados com
  `Object.hasOwn`, e `sugarLevelsFor` continua recusando combinação impossível
  vinda de link — pedir `fresh` numa fruta sem receita fresca é recusado inteiro.
- **`levelForFruit`** passou a cair no primeiro nível **daquela fruta** em vez de
  sempre em `extra`: fruta nativa que perde o nível cai na receita dela, que é a
  proporção publicada, e não numa régua genérica.
- **Chave de fora:** `FRESH_RECIPES[id]` é indexado só por id do próprio
  catálogo, nunca por entrada.
- **ReDoS:** sem expressão regular no caminho.

## O que ficou pendente

- **Rendimento e validade** de toda fruta brasileira. O MMA declara rendimento do
  prato inteiro, não da geleia.
- **Classificação de pectina e acidez das cinco nativas novas.** Não estão na
  Tabela 1 e o MMA não classifica.
- **Densidade de ingrediente brasileiro**, pelo motivo do apontamento 4.
- **Araçá e bacuri.**
