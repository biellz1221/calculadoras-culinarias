# QA — escalar receita colada e PWA offline

**Data:** 2026-09-04 · **Branch:** `feature/scale-and-pwa`
**Base:** `feature/save-share-print` (o Épico 6 precisa entrar antes)

## O que entrou

| Story | Card | Situação |
| --- | --- | --- |
| 2.4 · Escalar receita existente (Should) | `[M4] 2.4` | Entregue |
| 6.4 · PWA e offline (Should) | `[M4] 6.4` | Entregue |

## Verificação

```
pnpm verify   → lint · typecheck · 469 testes · build   ✅
pnpm test:e2e → 184 testes (desktop + mobile)           ✅
```

56 testes novos de unidade e 5 e2e — estes últimos contra o **build de
produção**, não contra o `next dev`.

## 2.4 · Escalar receita colada

O motor (`src/lib/bread/scale.ts`) é o único do projeto sem citação, e é
deliberado: os números são os que a pessoa trouxe do caderno dela. O que a
ferramenta acrescenta é regra de três e, quando identifica farinha, a leitura em
porcentagem de padeiro — essa sim com as faixas de `data/bread/ranges.ts`.

### Apontamentos, todos corrigidos

| # | Severidade | Achado | Correção |
| --- | --- | --- | --- |
| 1 | **Alta** | "Leite integral" era classificado como **farinha**: `integral` estava na lista de palavras de farinha. Uma receita com leite passaria a ter a hidratação calculada sobre farinha que não existe. | Só palavras que sozinhas já significam farinha. `integral`, `trigo` e `wheat` saíram — são adjetivos, e o substantivo que importa já está na lista. |
| 2 | **Alta** | "Deixe descansar por 30 minutos" virava um ingrediente de 30 g, e entrava calado na conta. | Três travas: unidade de tempo/temperatura depois do número, nome com mais de seis palavras, e lista de verbos de preparo. |
| 3 | **Alta** | "Farinha de trigo tipo 1 — 1000 g" era lida como **1 g**: o parser pegava o primeiro número da linha. | Quantidade com unidade de massa ganha da sem unidade, e entre elas vale a última. |
| 4 | Média | Escrevi um teste que **documentava** o bug do item 2 em vez de corrigi-lo: o nome dizia "descarta" e a asserção aceitava os três casos. | Teste reescrito para exigir o comportamento certo, e o código ajustado até passar. |

### Decisão que vale registrar

O parser **vai errar**, e a interface assume isso: antes de escalar, mostra a
tabela do que entendeu, com o papel de cada linha editável e um botão de apagar.
É o que transforma erro de leitura em um clique em vez de uma surpresa. Sem esse
passo, a alternativa honesta seria não ter a ferramenta.

Levain e outros pré-fermentos ficam como "Outro". A hidratação lida é a
**declarada**, igual à da calculadora principal — contar a água de dentro do
levain exigiria saber a hidratação dele, que a receita colada não declara.
Marcá-lo como líquido ou farinha é escolha de quem colou, e está a um clique.

## 6.4 · PWA e offline

### Decisões

- **Cache de uso, não pré-carga.** Pré-carregar o HTML das calculadoras seria
  pior que inútil: os pacotes de JavaScript têm hash e mudam a cada build, então
  a página abriria offline e **nunca hidrataria** — apareceria inteira e não
  calcularia nada. Guardando o que foi de fato visitado, HTML e JavaScript
  entram no cache combinando. É também exatamente o que o critério pede.
- **Service worker como route handler**, não arquivo em `public/`: o navegador
  só troca de worker quando o arquivo muda byte a byte. Com arquivo fixo, um
  deploy novo nunca seria detectado e a pessoa seguiria na versão de ontem sem
  aviso. O SHA do commit entra no texto do worker.
- **A versão nova espera.** `skipWaiting` automático troca o worker embaixo de
  uma página aberta, e o JavaScript já carregado passa a pedir pacotes de outra
  versão — a página quebra no meio de um cálculo. Aviso discreto, e quem decide
  a hora é o visitante.
- **Dois manifestos**, um por idioma. Um manifesto carrega um nome e um
  `start_url`; instalado pelo inglês, o aplicativo precisa abrir em `/en`.

### Apontamentos

| # | Severidade | Achado | Correção |
| --- | --- | --- | --- |
| 5 | Média | A guarda de ambiente (`NODE_ENV !== 'development'`) deixava o aviso de versão nova **sem teste possível**: o Vitest entrega `NODE_ENV === 'development'` ao código que transforma, então o componente saía cedo em todo teste. | Virou propriedade `enabled`, com o mesmo padrão. Seis testes cobrem o caminho inteiro, inclusive o silêncio na primeira instalação. |
| 6 | Baixa | `short_name` era o nome completo (23 caracteres); embaixo do ícone, vira reticências. | `site.shortName` nos dois dicionários, com teste de tamanho. |
| 7 | Baixa | `robots.txt`, `sitemap.xml` e `llms.txt` entravam no cache do worker. São arquivos que existem para ser lidos frescos por robô. | Lista de exceção no worker, com teste e2e conferindo que não estão no cache. |

### O teste que importa

`e2e/pwa.spec.ts` é o único que não roda contra o `next dev` — o worker não se
registra em desenvolvimento de propósito. Roda contra o `out/` servido por
`scripts/static-server.mjs` (sem dependência nova), fica offline de verdade e
confere que a calculadora **recalcula**, não só que a página aparece. Uma página
que abre offline e não responde ao campo não serve para nada na cozinha.

Conferido que o teste falha sem o service worker: desliguei o registro,
reconstruí e ele estourou por timeout.

## Auditoria de segurança

Num site sem servidor, o que sobra de superfície é **disponibilidade no
navegador** e **integridade do cache**. Foi onde apareceu o achado.

| # | Severidade | Achado | Correção |
| --- | --- | --- | --- |
| S1 | **Alta** | As expressões do parser juntavam quantificador aberto (`[\d.,]*`) com sufixo que pode falhar (a unidade). Contra uma linha só de dígitos sem unidade nenhuma, o motor volta atrás caractere a caractere a partir de cada posição — custo quadrático. **Medido: 200 mil caracteres = 62,9 segundos de aba travada.** Basta colar por engano um hash ou um número de rastreio. | Teto de vinte dígitos no quantificador. Mesma entrada: **14 ms**. Nenhuma quantidade de receita tem vinte dígitos. |
| S2 | Média | O custo acima era pago antes de qualquer checagem de tamanho, e nada limitava o texto colado. | Linha acima de 300 caracteres e texto além de 2 000 linhas são descartados antes de ler; `maxLength` no campo como camada extra. |
| S3 | Média | `safeJoin` do servidor de teste comparava **texto**, não caminho: um diretório irmão com o mesmo prefixo (`/tmp/outros` ao lado de `/tmp/out`) escapava da raiz. | Comparação com o separador junto. Não era explorável hoje — não existe pasta assim ao lado de `out/` —, mas o dia em que alguém criar um `out-antigo/` não deveria ser o dia em que isso vira bug. |
| S4 | Baixa | `GET /%` derrubava o **processo inteiro** do servidor de teste: `decodeURIComponent` lança e nada capturava. Uma requisição levava a suíte de PWA junto. | `try/catch` no handler, com 400. |
| S5 | Baixa | O servidor de teste escutava em todas as interfaces. | Só no laço local. |

Conferido na mão, depois da correção: irmão com mesmo prefixo → 404, traversal
comum → 404, `/%` → 400 **com o processo de pé**, e o socket em `127.0.0.1`.

Verificadas e **sem achado**: XSS pelo nome de ingrediente colado (tudo passa
por interpolação JSX; nenhum `dangerouslySetInnerHTML` no diff), `Infinity`/`NaN`
chegando ao cálculo (`toGrams` já rejeitava), interpolação no `sw.js` gerado (só
entra a versão do build, e via `JSON.stringify`), cache de resposta de outra
origem ou de erro (o worker filtra por origem e só grava `response.ok`),
`SKIP_WAITING` de origem alheia (o canal de um service worker não é alcançável
de outra origem, e o pior caso seria ativar mais cedo uma versão nossa) e
exposição pelo manifesto ou pelos ícones.

## Pendente

- **Nada bloqueando.** Este PR depende do anterior (`feature/save-share-print`)
  ter entrado na `main`.
- O job de e2e da CI passa a rodar `pnpm build` como parte de subir o segundo
  servidor. Nenhuma mudança em `.github/workflows/` foi necessária.
