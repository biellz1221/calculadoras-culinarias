# QA — A soma do nitrato na cura, e a segunda régua de pH no picles

Data: 2026-09-14 · Branch: `feature/curing-nitrate-sum`
Pesquisa: `docs/research/cura-carnes.md` §4.1 · `docs/research/picles-fermentacao.md` Parte II

## Escopo

Os dois pendentes que a varredura de órgãos públicos brasileiros tinha deixado
documentados e não implementados.

**1. Cura.** A página dizia que o limite brasileiro conta nitrito e nitrato
somados, sem mostrar como a soma se faz. O Ofício Circular DIPOA 15/2009 publica
a conversão: nitrato ÷ 1,231 + nitrito, expresso como nitrito de sódio. Com o
sal nº 2 isso muda o retrato — no alvo padrão de 150 ppm, a soma dá 228.

**2. Picles.** Duas publicações da Embrapa tocam dois números da calculadora.
Uma corrobora a faixa de salga sem mexer nela; a outra **diverge** no limiar de
pH, e a divergência virou linha na tabela.

## Verificação

| Etapa | Resultado |
|---|---|
| `pnpm lint` | limpo |
| `pnpm typecheck` | limpo |
| `pnpm test` | 736 testes, todos passando (eram 725 na `main`) |
| `pnpm build` | limpo |
| `playwright test` | 312 testes, todos passando |

## Apontamentos

### 1. A soma é entrada; o teto é resíduo — **alta** — tratada por desenho

Este é o risco central da tarefa, e é de leitura, não de aritmética. A própria
seção do ofício se chama "**Cálculo do nitrito residual**". Pôr a soma de
entrada lado a lado com os 150 ppm brasileiros e um selo de aprovado seria
cometer exatamente o erro que a §4 da pesquisa de cura existe para não cometer —
o mesmo erro que a bibliografia do projeto já tinha cometido uma vez, comparando
"EUA 156 ppm contra ANVISA 150 mg/kg".

O que foi feito:

- a soma aparece **sem `RangeBadge`**, sem cor de estado, sem comparação;
- o `status` do resultado continua vindo do alvo de entrada contra o teto
  americano, e **há teste travando isso**: um produto com soma de 228 ppm, bem
  acima dos 150 brasileiros, continua com status `ok`;
- a linha carrega a conta que a produziu (`150 + 96 ÷ 1,231`), para que o número
  não pareça um veredito;
- a prosa da seção de limites diz, com todas as letras, que a comparação só se
  faz com análise do produto pronto.

### 2. O ofício não fecha com a própria química, e o site não corrige — **média** — documentado

O documento publica as massas molares na linha seguinte aos fatores, o que
deixa conferi-lo contra ele mesmo:

| Fator | Pela massa molar do ofício | Publicado |
|---|---|---|
| Nitrato de sódio | 84,99 ÷ 69,00 = 1,23174 | 1,231 — **truncado**, não arredondado |
| Nitrato de potássio | 101,10 ÷ 69,00 = 1,46522 | 1,4637 — **0,104% fora** |

O site usa **o publicado**. Citar norma é reproduzir o que ela manda fazer;
corrigir a aritmética dela seria assinar uma régua que não é a dela. Os dois
desvios caem para o lado restritivo — divisor menor dá equivalente em nitrito
maior —, e há teste registrando os dois em vez de deixá-los virar descuido.

### 3. Prosa que não batia com o padrão da tela — **baixa** — corrigida

Escrevi o texto explicativo com "a 156 ppm de nitrito… a soma passa de 230 ppm",
que é verdade mas não é o que a pessoa vê: o alvo padrão da calculadora é 150, e
a tela mostra 228. Quem denunciou foi o e2e, que eu tinha escrito com 237.
Corrigido nos dois idiomas para o caso que está na tela.

É a segunda vez nesta leva que um número escrito em prosa não bate com o que o
código produz — a primeira foi "sete das nove receitas" nas geleias. Já está no
`LEARNINGS.md`.

### 4. Um teto que a pesquisa não tinha — **sem apontamento**

O mesmo ofício lista **três** limites residuais, não um: 150 ppm para nitrito
sozinho, 150 ppm para a combinação, e **300 ppm para nitrato sozinho**. O
terceiro entrou como conteúdo e como constante testada.

Ele também nomeia a **IN nº 51/2006 do MAPA** como a norma de limite residual
que invoca — a peça que a §6 da pesquisa listava como inacessível. Ainda não foi
lida no original; o que o site cita é o ofício, que é o que temos em mãos.

### 5. Picles: a divergência é mais interessante que a corroboração — **sem apontamento**

Eu tinha registrado o achado como "segunda fonte para o pH 4,5". Ao ler os
documentos, o pH **não** é corroboração: o NCHFP traça a fronteira em 4,6 e a
Embrapa em 4,5. Um décimo, e a brasileira é a mais restritiva.

**A calculadora não trocou de régua**, e há teste travando isso. Mexer no número
que decide segurança alimentar pediria a norma legal brasileira; o que temos é
manual técnico de extensão. Os dois números vão para a tabela de divergências,
com a consequência prática escrita: quem mira 4,5 satisfaz as duas réguas.

A corroboração real ficou na **faixa de salga**: 1,5% a 2%, que o Katz dá como
padrão comercial da salga seca e o manual brasileiro dá pela conserva enlatada.
Mesma faixa, rotas diferentes, e ela sustenta um aviso de segurança.

### 6. Defeito de impressão na fonte — **baixa** — registrado

A lista de acidez da Embrapa traz "alimentos muito ácidos: pH < 4,5", que
contradiz a linha anterior ("ácidos: pH entre 4,0 e 4,5") — deveria ser 4,0. O
site usa só as duas primeiras faixas, e o comentário no código diz por quê.

Terceira fonte desta leva com defeito tipográfico, depois do bloco quebrado do
Doc 138 da Embrapa nas geleias. Conferir a integridade da página virou parte da
extração.

## Segurança

Revisão à mão sobre a superfície nova. Nada aberto.

- **Nenhuma entrada nova não confiável.** Nem a cura nem o picles ganharam campo
  ou estado; `combinedAsNitritePpm` é derivado do que já era validado.
- **Divisão por zero:** `combinedAsSodiumNitrite` só divide por constante
  (1,231). `ingoingPpm` e `cureGramsFor` já guardavam contra peso zero.
- **A trava de segurança alimentar é o teste**, não o desenho: se alguém
  apontar o `status` para a soma, ou `TARGET_PH` para 4,5, dois testes caem com
  o motivo escrito no comentário.
- **ReDoS:** sem expressão regular no caminho.

## O que ficou pendente

- **IN nº 51/2006 do MAPA**, nomeada pelo ofício, ainda não lida no original.
- **A norma legal brasileira de conserva vegetal.** Se o limiar de 4,5 estiver
  em RDC ou IN, é ela que teria peso para mudar a régua do picles.
- **O tempo de 15 min de fervura** que a Embrapa dá para produto abaixo de 4,5
  ficou de fora de propósito: é tratamento térmico de enlatado, não de picles
  fermentado de geladeira.
