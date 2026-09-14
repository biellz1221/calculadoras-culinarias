# QA — Segunda fonte para a curva de altitude da geleia

**Data:** 2026-09-14
**Branch:** `feature/altitude-second-source`
**Escopo:** varredura do *Modernist Cuisine* vol. 1 e o que ela destravou na
calculadora de geleias.

Pesquisa em [`docs/research/geleias.md`](../research/geleias.md), Parte IV.

---

## Resultado da verificação

| Passo | Resultado |
| --- | --- |
| `pnpm verify` | **exit 0** |
| Vitest | **880 testes / 54 arquivos** (eram 864 / 53) |
| Playwright (geleias) | **17 passando** |
| `npx tsc --noEmit` com cache limpo | sem erro |

---

## O achado

A calculadora de geleias interpolava a tabela do NCHFP com um incômodo escrito
no próprio código desde a criação da página: **a tabela contraria a regra de
bolso impressa na mesma página do NCHFP** a partir dos 5.000 pés. Não havia como
saber se o errado era a tabela ou a regra.

O *Modernist Cuisine* vol. 1, p. 318, publica a mesma regra por outro caminho —
física de cozinha em vez de extensão agrícola — e a tabela americana fica a
**menos de meio grau** dela em todas as nove linhas, inclusive nas quatro em que
o NCHFP discorda do próprio resumo.

Duas obras independentes, mesma curva. A divergência interna do NCHFP é de
arredondamento, não de física, e interpolar a tabela continua sendo o certo —
agora com respaldo, não por decisão nossa.

---

## Apontamentos

### 1. MÉDIO — a extrapolação acima da tabela nunca tinha sido conferida

A tabela do NCHFP termina nos 8.000 pés. Acima disso o código estende a
inclinação do último trecho, e não havia nada que dissesse se isso ainda
significava alguma coisa.

O Modernist publica o cume do Everest: 29.029 pés, água fervendo a 69 °C. Mais
de três vezes o fim da tabela. **A extrapolação erra por menos de um grau.**

Não é prova de que a reta valha em todo lugar, e o teste diz isso. É o bastante
para que ela deixe de ser invenção. Travado em `setting-point.test.ts`.

### 2. BAIXO — duas afirmações minhas caíram nos próprios testes

Escrevi, antes de fazer a conta, que:

- `1 °C × 1,8 = 2 °F` exatamente. **Não é.** O livro escolheu pares de números
  redondos em cada sistema — 300 m são 984 pés, 1 °C é 1,8 °F —, com folga de
  10%. Aceitável numa regra de bolso, e é justamente por isso que a calculadora
  usa a tabela e não a regra. O teste agora afirma a folga, com o motivo.
- O ponto da geleia ficaria **abaixo** dos 103 °C da água do mar. **Fica
  acima:** 104,4 °C. Óbvio depois de pensar — geleia tem 65% de sólidos e água
  do mar tem 3,5% de sal. O teste corrigido trava a ordem dos três números, que
  é o que realmente confere a régua.

Nenhuma das duas chegou a sair do arquivo de teste.

### 3. BAIXO — a paginação do volume 1 é de página dupla

Cada página do PDF traz **duas** páginas impressas: é digitalização de página
dupla. O deslocamento cru não é constante (25, 65, 105, 145…), e parar aí teria
mandado a obra para `locator: 'chapter'` pela regra do LEARNINGS.

A conta certa é `impressa = 2 × PDF − 15`, exata em seis pontos. Mas ela mapeia
uma página de PDF para **duas** impressas, e a camada de texto não diz em qual
das duas cada frase está. A passagem foi localizada na imagem renderizada, com o
fólio "318" visível no rodapé esquerdo. Citação exata, e `locator: 'page'`
liberado.

---

## Segurança

Mudança de dados e de texto, sem superfície nova: nenhuma entrada de usuário,
nenhuma rede, nenhuma rota. As constantes novas são somente leitura e não
entram em nenhum caminho de parsing.

A curva de segurança da página — o tempo de banho-maria por altitude — **não foi
tocada**. Ela vem da tabela 2 do NCHFP e continua vindo. O que ganhou segunda
fonte é a temperatura do ponto, que é qualidade de produto, não segurança.

Sem apontamento.

---

## Pendências

- **Modernist Cuisine vol. 4** — segue sendo a compra de maior retorno
  (esferificação, gellan, metilcelulose). O volume 1 aponta para ele em cada
  menção de hidrocoloide.
- O volume 1 tem capítulo de microbiologia com material de pasteurização e
  atividade de água ainda não varrido. Candidato para a calculadora de cura.
