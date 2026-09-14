# QA — Fonte para o ar e para o peso de um litro, no gelato

Data: 2026-09-14 · Branch: `feature/gelato-sources`
Pesquisa: `docs/research/gelato.md` (nova)

## Escopo

Os **dois últimos números sem fonte do site** eram os dois do gelato: a faixa de
overrun, que tinha sido apagada da tela em 2026-09-13 por não ter de onde sair, e
a densidade da calda, que ficava declarada como "valor de trabalho, não número de
fonte".

Os dois livros que resolvem isso estavam em `references/gelato/` desde
**2026-09-12**, e ninguém tinha aberto: Clarke, *The Science of Ice Cream* (Royal
Society of Chemistry), e Corvitto, *Los secretos del helado*.

| O que entrou | De onde |
|---|---|
| Faixa de overrun do gelato: 30% a 40%, alvo 35% | Corvitto, p. 44 |
| Faixa industrial: 20% a 100%, teto técnico ~120% | Clarke, p. 153 e p. 73 |
| Teto do sorbetto: ~60% sem gordura e proteína | Clarke, p. 73 |
| Densidade da calda: 1,10 g/mL | Clarke, p. 81 |
| A régua de bancada: overrun por duas pesagens | Corvitto, p. 44 · Clarke, p. 80 |
| A ressalva dos 105% | Clarke, p. 81 |
| Divergência de densidade: 740 g contra 815 g por litro | as duas |

E uma capacidade nova, que é o que a régua destrava: **medir o overrun na
bancada** (dois pesos do mesmo copo) e o caminho inverso (a que peso um litro
deveria chegar para o overrun desejado).

## Verificação

| Etapa | Resultado |
|---|---|
| `pnpm lint` | limpo |
| `pnpm typecheck` | limpo |
| `pnpm test` | 739 testes, todos passando (eram 725) |
| `pnpm build` | limpo |
| `playwright test` | 318 testes, todos passando (eram 308) |

## Apontamentos

### 1. O palpite declarado estava certo — **sem apontamento**, e é o ponto

A densidade de 1,10 g/mL era valor de trabalho assumido. Clarke, p. 81: "one
litre of a typical ice cream mix weighs 1.1 kg". Bateu.

Vale registrar porque é o argumento de declarar estimativa em vez de escondê-la:
quando a fonte chega, ou ela confirma — e não se mexe em nada — ou ela corrige,
e aí se sabe exatamente o que corrigir.

### 2. A afirmação removida estava errada no piso — **média** — corrigida

O site dizia, antes de setembro, "gelato artesanal fica entre 20 e 35%".
Corvitto diz **30 a 40%**. Removê-la sem fonte foi certo, e agora entrou a certa.

### 3. Duas fontes, uma equação — **sem apontamento**, virou caso-verdade

Corvitto manda dividir o peso do mix pelo peso do gelato no mesmo recipiente;
Clarke escreve a mesma coisa pelas densidades. São a mesma equação — pesar o
mesmo copo duas vezes é medir densidade com o volume se cancelando.

O teste confere as duas formas uma contra a outra em quatro pares de valores. Um
livro da Royal Society e um gelatiere catalão, sem se citarem, escrevendo a
mesma conta: é o que autoriza publicar a fórmula sem hesitação.

### 4. A fonte se arredonda, e o teste diz isso — **baixa** — documentado

O exemplo de Corvitto arredonda dos dois lados: 1000 ÷ 1,35 dá 740,7 e ele
imprime 740; 1000 ÷ 740 dá 1,3514 e ele lê "35%" das duas casas decimais.

A tolerância do teste é de um grama **com o motivo escrito**, e há duas
asserções extras que explicitam o arredondamento. Tolerância frouxa sem
explicação seria teste fraco.

### 5. Dois campos com o mesmo nome acessível — **média** — corrigido

A régua de bancada precisa de uma densidade, e a primeira versão reusou o
rótulo "Densidade da calda" — que já existia no controle de lote. Dois campos
com nome acessível idêntico na mesma página é ambiguidade de verdade, não só de
teste: quem navega por rótulo não sabe qual está pegando.

Quem denunciou foi um teste antigo, que já tinha o comentário certo ("exato: a
âncora do verbete tem `aria-label` que contém o nome do campo"). O da bancada
virou "Densidade da sua calda", que além de desambiguar diz melhor o que é —
por oposição aos dois valores publicados logo abaixo.

### 6. O aviso de "sem fonte" ia ficar sem teste — **média** — corrigido

O e2e cobria a tela que **declara ausência de fonte** por acidente: bastava
abrir `#glossario-overrun`, que era um dos dois verbetes sem citação. Com os
dois resolvidos, a lista zerou e aquele ramo do componente ficaria sem teste
nenhum, esperando apodrecer.

"Vazio quer dizer vazio" é promessa de projeto, não detalhe de layout. Entrou
`src/components/glossary-no-source.test.tsx`, que injeta um registro falso com
um verbete sem citação e confere que a tela diz — e que não diz onde há fonte.

O teste de dados também mudou de forma: em vez de listar os dois ids
conhecidos, agora exige lista **vazia**, mas continua comparando listas para que
um verbete novo sem citação apareça pelo nome no erro.

## Segurança

Revisão à mão. Nada aberto.

- **Divisão por zero**: `overrunFromWeights` e `overrunFromDensities` devolvem 0
  quando o denominador é zero ou negativo. Testado.
- **Entrada não confiável**: a régua de bancada é estado local de componente, não
  entra em link nem em receita salva, e não há `parse…State` novo. Os campos de
  densidade usam `MIN_DENSITY`/`MAX_DENSITY`, os mesmos limites já validados
  para o lote.
- **Chave de fora**: nada novo — a seção não indexa dicionário por chave vinda de
  entrada.
- **ReDoS**: sem expressão regular no caminho.

## O que ficou pendente

- **Alvo de overrun para sorbetto.** Clarke dá o teto técnico (60% sem gordura e
  proteína) mas isso não é alvo de qualidade, e Corvitto não publica um separado.
  A página diz que não tem.
- **Correção do overrun pelo teor de gelo** (a ressalva dos 105%). Exigiria o
  teor de gelo na temperatura de serviço, que a planilha do curso não dá.
- **Composição da mistura de referência de cada autor.** Nenhum dos dois publica,
  e é o que decidiria a divergência de densidade. Enquanto isso, o campo é
  editável e a régua do copo é a saída: quem pesa não precisa acreditar em
  nenhum dos dois.
- **Migoya, _The Elements of Dessert_**, em `references/chocolate/`, ainda não
  lido. Pode trazer um terceiro valor de densidade.
