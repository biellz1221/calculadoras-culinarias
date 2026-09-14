# QA — Calculadora de geleias

Data: 2026-09-13 · Branch: `feature/glossary-sources`
Pesquisa: `docs/research/geleias.md`

## Escopo

Sexta calculadora do site. Entrada: fruta, peso da fruta preparada e altitude.
Saída: açúcar e suco de limão da receita publicada para aquela fruta, gelatina
de maçã quando a fruta é do grupo III do NCHFP, ponto de gelificação e tempo de
banho-maria calculados para a altitude informada, rendimento em potes e água a
evaporar.

Fontes: Saunders (*The Blue Chair Jam Cookbook*, nove receitas pesadas), Ferber
(*Mes confitures*, proporção da casa e pectina de maçã), NCHFP (classificação
das frutas, temperatura por altitude, banho-maria, conservação) e McGee (*Keys
to Good Cooking*, o limiar de 300 m).

## Verificação

| Etapa | Resultado |
|---|---|
| `pnpm lint` | limpo |
| `pnpm typecheck` | limpo (com `tsconfig.tsbuildinfo` apagado antes) |
| `pnpm test` | 610 testes, todos passando |
| `pnpm build` | gera `/geleias`, `/en/jam` e os cards `og/jam-pt` e `og/jam-en` |
| `playwright test` | 244 testes, todos passando |

O teste do ponto de gelificação foi conferido por sabotagem: fixando a altitude
em zero dentro de `settingFahrenheit`, quatro testes falham. Sem essa conferência
o teste passaria mesmo com a altitude ignorada, que é justamente o bug que ele
existe para pegar.

## Apontamentos

### 1. Citação apontando para o livro errado — **alta** — corrigido

Achado ao montar a estante das geleias, mas o defeito é da calculadora de cura,
já publicada. Três citações usavam `cite('ruhlman', 'cap. "Salt, Smoke, and
Time"')`, e `ruhlman` na estante é o **`Ratio`** (Scribner). O conteúdo — a
composição do sal de cura a 6,25 % e o quadro sobre botulismo — é do
**`Charcuterie`**, de Ruhlman e Polcyn (W. W. Norton, 2005), que é outro livro.

Pior: conferido o sumário do `Charcuterie` no PDF da estante, **não existe
capítulo chamado "Salt, Smoke, and Time" em nenhum dos dois**. O localizador era
inventado, e estava numa página de segurança alimentar.

Correção: `ruhlman-charcuterie` entrou na estante, e as três citações apontam
agora para localizadores conferidos no texto — `cap. 2, "Salt" — sais de cura`
para a composição, e o quadro `"How Real Is the Danger of Botulism?"` para o
botulismo. A fonte da calculadora de cura em `CALCULATORS` também mudou.

Conferi de passagem o outro livro da mesma leva: `cap. "Curing and Nitrates"` do
Marianski **existe** no EPUB. A proporção de trabalho do Ruhlman também bate ao
pé da letra: "1 ounce/25 grams of pink salt is enough for 25 pounds/11.25
kilograms of meat", que dá os 139 ppm que a tabela de divergências cita.

### 2. Separador decimal escrito à mão na tabela por altitude — **média** — corrigido

A linha em °C da tabela usava `.toFixed(1).replace('.', ',')`. Funciona em
português e entrega "104,4" para quem abre `/en/jam`. A regra do projeto é que
formatação por idioma mora só em `src/i18n/format.ts`; passou a usar
`formatNumber(valor, locale, …)`.

### 3. Faixa colapsando onde a fonte declara faixa — **baixa** — corrigido

`formatRange` comparava as pontas por um limiar numérico em gramas. Para o
rendimento em potes isso apagava informação real: 5,2 a 5,6 potes tem diferença
de 0,4, abaixo do limiar, e sairia como "5" — enquanto o livro declara "five to
six". Agora a comparação é entre os textos já formatados: só colapsa quando as
duas pontas exibem a mesma coisa.

### 4. Dois títulos iguais na mesma página — **baixa** — corrigido

O bloco de resultado e a seção da tabela usavam ambos "O ponto, na sua
altitude". Além de o Playwright reclamar de ambiguidade, é ruim de ler: o bloco
de resultado virou "Onde parar de cozinhar".

## Segurança

Revisão feita à mão sobre a superfície nova. Nada aberto ao fim.

- **Entrada não confiável** (link compartilhado e receita guardada): `parseJamState`
  confere `fruitId` contra o catálogo, `sugarLevel` com `Object.hasOwn` sobre um
  registro, e os três números contra faixa fechada. Recusa o estado inteiro ao
  primeiro campo estranho. Teste cobre `__proto__` e `constructor` nos dois
  campos de texto, `Infinity`, `NaN`, negativos e campo faltando.
- **Rótulo por chave de fora**: a folha impressa e o texto compartilhado leem o
  nome da fruta por `labelFor`, com `Object.hasOwn`. É a segunda tranca, como
  nas outras cinco.
- **Teto de altitude**: 4.000 m, checado em três lugares — o `max` do campo, o
  `parse` e o `Math.max(0, …)` do motor. O ponto mais alto do Brasil tem 2.995 m.
- **Divisão por zero**: as três divisões do motor têm denominador constante e
  não nulo (`fruitOz` do catálogo, `FERBER_TARGET_SUGAR`).
- **ReDoS**: não há expressão regular no caminho da calculadora de geleias.

## O que ficou pendente

- **Fruta brasileira.** Goiaba, jabuticaba, maracujá, manga e caju não têm
  proporção pesada em nenhuma das três fontes. A goiaba ainda esbarra numa
  divergência: o NCHFP a põe no grupo III e McGee diz que ela é rica em pectina.
  É a maior lacuna desta calculadora, e está descrita em `geleias.md` §3 e §9.
- **Janela de pH da gelificação.** Nenhuma das três fontes publica. Os valores
  que circulam na bibliografia candidata não vieram de fonte lida, e por isso não
  estão na tela.
- **Jelly e marmalade** (suco coado e cítrico com casca) pedem outra entrada e
  ficaram de fora; as definições estão no glossário.
- **Manuais de fabricante de pectina** (CP Kelco, Herbstreith & Fox) continuam na
  lista de compras: sem eles não há dose citável de pectina em pó.
