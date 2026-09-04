# Aprendizados recorrentes

Consultar antes de começar tarefa neste projeto. Cada item nasceu de um erro que
já custou tempo aqui; a ideia é não pagar duas vezes.

## Next 16 com `output: 'export'`

- **Route handler sem `export const dynamic = 'force-static'` quebra o build.**
  A mensagem fala de `revalidate` e não diz qual arquivo. Vale para
  `/llms.txt`, para as imagens de OG, para `robots.ts` e `sitemap.ts`.
- **A convenção `opengraph-image` grava arquivo sem extensão.** Servidor de
  arquivo estático decide `Content-Type` pela extensão, então o card chega ao
  Facebook como binário genérico e não aparece. A saída foi gerar a imagem por
  route handler num caminho que termina em `.png` de verdade.
- **`openGraph` não se funde entre layout e página.** Quem declarar por último
  substitui o bloco inteiro. Uma página que declarasse só `openGraph.title`
  perderia `siteName` e `locale` sem aviso. Por isso existe `pageMetadata`.
- **O Next normaliza o `canonical` da raiz para sem barra final**, mesmo com URL
  absoluta. Como é o campo que não dá para mudar, ele dita a grafia do resto:
  sitemap, `og:url` e JSON-LD seguem `absoluteUrl`.
- **`NODE_ENV=development` exportado no shell** derruba o `next build` com erro
  de `useContext`. O script já força `production`.

## Fontes e tipografia

- **Satori não lê WOFF2**, que é o que o `next/font` entrega. Para gerar imagem
  no build é preciso TTF ou OTF em `assets/fonts/`.
- **Google Fonts serve formato pelo `User-Agent`.** Com UA de MSIE vem EOT, e o
  erro que aparece é `Unsupported OpenType signature`. Sem UA (ou com
  `Mozilla/5.0` puro) vem TTF.
- **Eixo de fonte variável que ninguém usa é peso puro.** A Fraunces vinha com o
  eixo `SOFT` declarado e nenhum `font-variation-settings` no CSS: 25,5 KB a
  mais no caminho crítico, para renderizar o valor padrão.

## Dados e conteúdo

- **Nome de instituição não tem sobrenome.** Cortar a última palavra
  transformava "University of Georgia" em "Georgia". Autor institucional declara
  `authorKind: 'organization'`.
- **Calculadora nova precisa entrar em todo lugar que fala do catálogo.** O
  gelato ficou publicado por semanas fora do título e da descrição da home. O
  registro `PUBLISHED_ROUTES` acende o link e o sitemap, mas texto de marketing
  não se atualiza sozinho.
- **Descrição de página tem teto de 160 caracteres.** O que passa disso é
  cortado, e o corte come justamente o fim da frase, onde costuma estar o
  argumento. Há teste que falha por isso.

## Estado que sai do componente

- **Estado espalhado em `useState` soltos não tem como ser lido por inteiro.**
  Funciona enquanto só a tela precisa dele; salvar, compartilhar e imprimir
  precisam do conjunto, e aí não há de onde puxar. No picles o estado morava
  dentro dos painéis, com o preset trocado por remontagem via `key` — o pior
  caso, porque a troca de preset era um efeito colateral do React, não uma
  transição declarada. Calculadora nova já nasce com `src/lib/<calc>/state.ts`
  puro e um `parse…State`.
- **Efeito que reage a mudança de estado roda antes de o estado restaurado
  chegar.** Restaurar num efeito e, noutro efeito, comparar `state` com o que
  foi restaurado dá `diferente` no mesmo commit: o `setState` ainda não
  renderizou. Precisa de uma trava que só arme depois de ver o estado aplicado.
- **Tudo o que vem de URL ou de localStorage é entrada não confiável.** Valide
  faixa numérica (senão `Infinity` vira `NaN` na tela inteira), existência de
  preset e de ingrediente, coerência entre campos e unicidade de id. Recuse o
  estado inteiro: meia receita na tela é pior que nenhuma.
- **Union de chaves valida melhor como `Record<Chave, true>` que como lista.** O
  registro é conferido na compilação e não deixa esquecer um valor novo; a
  lista aceita a omissão calada.
- **`dicionario[chave]` com chave de fora não devolve `undefined` para
  `'__proto__'`: devolve o `Object.prototype`.** É comportamento legado do
  JavaScript em qualquer objeto comum. Num rótulo, o resultado deixa de ser
  texto e vira objeto, e o React derruba a página inteira ao receber isso como
  filho — ou seja, um link que quebra a página de quem abre. Duas travas:
  validar a chave contra o catálogo no `parse` **e** ler o dicionário por
  `labelFor()`, que usa `Object.hasOwn`. `as keyof typeof` não protege de nada
  aqui: é asserção de tipo, não checagem em tempo de execução.
- **Validação nova precisa nascer nas quatro calculadoras ao mesmo tempo.** O
  furo acima existia só no gelato, porque as outras três já conferiam o preset
  contra o catálogo e ele não. Teste com `it.each` sobre as quatro pega isso;
  teste escrito para uma só, não.

## Interface

- **`sr-only` dentro de `overflow-x-auto` alarga a página.** Ele é
  `position: absolute` e se ancora fora do container de rolagem. Para rótulo de
  campo em tabela rolável, use `aria-label` no input.
- **Sufixo de unidade dentro do `<label>`** entra no nome acessível ("Peso da
  massa g") e quebra `getByLabel`. Fica fora, com `aria-hidden`.
- **Animação com deslocamento lateral alarga a página enquanto roda.** A casca
  do site usa `overflow-x-clip` por causa disso.

## Ler texto que a pessoa escreveu

- **Palavra genérica na lista de classificação contamina tudo.** `integral`
  estava entre as palavras de farinha, e "leite integral" virou farinha — com a
  hidratação calculada sobre farinha que não existe. Só entram palavras que
  sozinhas já significam a coisa; adjetivo fica de fora.
- **Compare palavra inteira, nunca trecho.** `sal` dentro de `salsa`
  transformaria salsinha em sal, e o sal é justamente o número que a faixa de
  segurança sinaliza.
- **O primeiro número da linha não é a quantidade.** "Farinha de trigo tipo 1 —
  1000 g" tem o `1` do tipo antes. Quantidade com unidade ganha da sem unidade,
  e entre elas vale a última.
- **Toda receita colada traz linha que não é ingrediente.** "Deixe descansar por
  30 minutos" entra calada como 30 g. Unidade de tempo depois do número, nome
  comprido e verbo de preparo são as três travas baratas.
- **Leitor de texto vai errar, então mostre o que entendeu antes de usar.** A
  tabela intermediária, com papel editável e botão de apagar, é o que transforma
  erro de leitura num clique. Sem ela, a alternativa honesta é não ter a
  ferramenta.
- **Quantificador aberto seguido de sufixo que pode falhar é custo quadrático.**
  `/(\d[\d.,]*)\s*(kg|g|ml)\b/g` contra uma linha só de dígitos: o motor volta
  atrás caractere a caractere a partir de cada posição. Medido aqui: 200 mil
  caracteres travavam a aba por **63 segundos**; com `{0,20}` no lugar do `*`,
  14 ms. Não precisa de quantificador aninhado para virar negação de serviço.
- **Teto de tamanho antes de processar, não depois.** As checagens de nome
  comprido e de verbo de preparo rodavam *depois* do `findAmount`, ou seja,
  depois de o custo já ter sido pago. Descarte a linha grande antes de olhar
  para ela.

## Service worker

- **Arquivo fixo em `public/` nunca atualiza.** O navegador só troca de worker
  quando o arquivo muda byte a byte; um deploy que mexeu só no conteúdo passaria
  despercebido. Gerar o worker por route handler, com a versão do build dentro,
  resolve.
- **Pré-carregar HTML sem os pacotes é pior que não pré-carregar.** Os nomes dos
  chunks têm hash e mudam a cada build: a página abre offline e nunca hidrata —
  aparece inteira e não calcula nada. Cache de uso guarda HTML e JavaScript
  combinando.
- **`skipWaiting` automático quebra a página aberta.** O JavaScript já carregado
  passa a pedir pacotes de outra versão. A versão nova espera e a pessoa decide
  a hora.
- **`controller` é o que distingue atualização de primeira instalação.** Sem
  essa checagem, todo visitante novo recebe um aviso de "versão nova" na
  primeira visita.

## Testes

- **Playwright em `127.0.0.1` não hidrata**: o dev server do Next bloqueia
  `/_next` de outra origem. A página carrega e todo teste de interação falha
  parecendo bug de estado. O `baseURL` usa `localhost`.
- **`fill()` em `input[type=number]` é sempre com ponto**, mesmo o site exibindo
  vírgula. Nos testes, `'0.8'`.
- **O navegador do teste precisa declarar `locale: 'pt-BR'`**, senão a
  autodetecção manda tudo para `/en`.
- **Conteúdo repetido no DOM quebra busca por texto em silêncio.** A folha de
  impressão duplica a receita, e de uma hora para outra oito testes antigos
  falharam com "found multiple elements" — por um motivo que não existe para
  quem usa o site. No Vitest, `configure({ defaultIgnore })` resolve, mas o
  seletor precisa incluir os descendentes (`.print-sheet, .print-sheet *`): o
  `ignore` casa só com o elemento do texto, não com os ancestrais. No
  Playwright não há equivalente global — asserção sobre a tela escopa em
  `page.locator('#conteudo')`.
- **`navigator.clipboard` só tem getter.** `Object.assign(navigator, …)` lança;
  o caminho é `Object.defineProperty`. E o `localStorage` do happy-dom é Proxy,
  que `vi.restoreAllMocks()` não desfaz — restaure o spy à mão.
- **O Vitest entrega `NODE_ENV === 'development'` ao código que transforma.**
  Qualquer guarda escrita como `if (process.env.NODE_ENV !== 'production')`
  fica sem teste possível: o componente sai cedo em todo caso. Se o
  comportamento importa, vire propriedade com o padrão vindo do ambiente.
- **Teste que documenta o bug em vez de exigir a correção não vale nada.**
  Aconteceu aqui: o nome dizia "descarta a linha de instrução" e a asserção
  aceitava as três linhas. Ao escrever a asserção, olhe o que ela *deveria*
  dizer, não o que o código devolve agora.
- **Prove que o teste pega o bug.** Desfaça a correção, rode e veja falhar. Foi
  o que confirmou tanto a regressão do `__proto__` quanto o teste de offline —
  este passava alegremente com o service worker desligado até ser conferido.
