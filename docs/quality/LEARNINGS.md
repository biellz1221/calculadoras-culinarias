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
- **Dois títulos iguais na mesma página** quebram `getByRole('heading')` e são
  ruins de ler antes disso. Se o bloco de resultado e a seção falam do mesmo
  assunto, um dos dois precisa de outro nome.
- **Número formatado à mão vaza para o outro idioma.** `toFixed(1).replace('.',
  ',')` funciona em português e entrega "104,4" para quem abre `/en`. Formatação
  por idioma só em `src/i18n/format.ts`, inclusive dentro de tabela estática.

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

## Calculadora nova

- **`as const` no dicionário canônico quebra o outro idioma.** Congela cada
  string como tipo literal, e a tradução deixa de ser atribuível — 99 erros de
  uma vez. Os dicionários não levam `as const`.
- **`pnpm test` não checa tipo.** O Vitest transpila sem verificar, então erro
  de tipo passa batido até o `typecheck`. Rodar `pnpm verify`, não só `test`.
- **`tsconfig.tsbuildinfo` velho faz o typecheck mentir.** Um `Record` com chave
  faltando passou limpo até o cache ser apagado. Em dúvida, apague antes de
  acreditar.
- **Três listas de calculadora são escritas à mão** e não derivam de
  `CALCULATORS`: `ALL_KEYS` em `routes.test.ts`, `GLOSSARIES` em
  `glossary.test.ts` e `PAGES` em `e2e/seo.spec.ts`. Calculadora nova quebra as
  três, e a mensagem não diz o porquê.
- **Nome novo no catálogo tem de entrar na prosa também**: `homeTitle`,
  `description`, `lead` e `imageAlt`, nos dois idiomas. O registro de rotas
  acende o link, o texto de marketing não se atualiza sozinho. E `PALETTES` em
  `src/lib/palette.ts` é um `Record<RouteKey, …>`: rota nova sem cor ali quebra
  o typecheck, não o teste.
- **O `homeTitle` não comporta a lista de calculadoras para sempre.** Com seis,
  enumerar todas passou dos 60 caracteres que o buscador exibe. A saída foi um
  termo guarda-chuva ("conservas" cobre picles, geleia e cura), não cortar uma
  da lista.

## Citar

- **Norma tem prazo de validade, e ler no original não basta.** A calculadora de
  cura citava a RDC 272/2019 da ANVISA, lida no texto oficial e transcrita
  corretamente. Em 2023 a RDC 778 consolidou os aditivos e revogou 67 normas de
  uma vez, a 272 entre elas. O **número não mudou** — a IN 211/2023 repete os
  mesmos 150 mg/kg com a mesma redação —, mas o site apontava para texto morto
  numa página de segurança alimentar. Citação de norma precisa de **conferência
  de vigência**, não só de leitura. Procure o ato revogador antes de citar.
- **Livro do mesmo autor não é o mesmo livro.** `ruhlman` na estante é o
  `Ratio`; a composição do sal de cura é do `Charcuterie`, dele com Brian
  Polcyn. A citação passou no `assertCitation` porque a forma estava certa — id
  válido, seção preenchida — e o site anunciou a obra errada numa página de
  segurança alimentar. Nome de autor não identifica obra.
- **Localizador inventado passa por todas as travas.** O capítulo citado,
  `"Salt, Smoke, and Time"`, não existe em nenhum dos dois livros. Nada no
  código pode pegar isso: a única conferência possível é abrir o sumário da obra
  e procurar o texto. Faça isso ao criar a citação, não depois.
- **PDF sem paginação no texto se cita por capítulo.** Tentei mapear a página
  impressa do `Charcuterie` pelo deslocamento entre PDF e impresso: bateu exato
  onde o livro se referencia (pp. 177–178) e errou no fim do volume.
  Deslocamento que não é constante não é conversão, é chute — `locator: 'chapter'`.
- **Proporção entre massas não tem unidade.** As receitas do Blue Chair estão em
  libras e onças, e guardar `sugarOz / fruitOz` dispensou converter qualquer
  coisa: 40 ÷ 62 é o mesmo número em grama e em onça. Há teste garantindo isso, e
  ele quebra se algum fator de conversão se enfiar no caminho.
- **Parser de receita erra, e erra calado.** O extrator automático leu quatro das
  nove receitas errado — somou só o primeiro dos dois lotes de fruta, perdeu o
  "plus ¾ pound" do açúcar, tomou o peso de compra pelo peso preparado. Serve
  para achar candidata; não serve para produzir número. Toda linha que virou
  código foi conferida à mão contra a página.
- **A nossa própria bibliografia é fonte terciária, e já errou duas vezes.** Ela
  dizia que Modernist e Food Lab divergiam em "0,5 % contra 0,85 %" na salmoura;
  lidas as obras, são 0,6 % e 0,625 % — eles concordam, e divergem sobre a água.
  Antes disso, a mesma seção comparava entrada com resíduo na cura. Levantamento
  não é extração: **releia a obra antes de transformar linha de bibliografia em
  número de tela.**
- **Coluna de tabela vem arredondada.** O "SCALING" do Modernist imprime 1,3 %
  onde a receita tem 10 g em 750 g, que são 1,333 %. Guarde os **pesos
  publicados** e derive a proporção deles; a porcentagem impressa erra a receita
  por um quarto de grama.
- **Duas fontes concordando é notícia.** Quase todo o site é feito de
  divergência, e por isso a convergência passa despercebida. Quando duas obras
  independentes chegam ao mesmo número, isso vale ser dito na página — é a
  informação mais forte que se pode dar.
- **Tabela publicada duas vezes é o melhor caso-verdade que existe.** O Wybauw
  imprime as proporções de ganache em razão e em porcentagem, e foi essa
  redundância — não a minha atenção — que validou uma transcrição feita a partir
  de um PDF que troca "TOO" por "100" e "IO%" por "10%". Quando a fonte se
  confere sozinha, o teste confere as duas formas.
- **Porcentagem publicada pode não ser o arredondamento da razão.** As do Wybauw
  foram ajustadas para somar 100: 40,8 vira 40 e 49,0 vira 50, na mesma linha.
  Tolerância frouxa num teste só se justifica com o motivo escrito ao lado.
- **PDF em imagem não é fonte, e o bônus pode ser melhor que o planejado.** O
  Greweling, previsto como fonte da ganache, é digitalização sem texto. O
  Wybauw, que entrou na estante fora da lista, trouxe a tabela **e** dados de
  atividade de água que nenhuma outra obra tem. Antes de dar um tema por
  bloqueado, confira a camada de texto de tudo que chegou.
- **`pdfinfo` denuncia o OCR antes de `pdffonts`.** `Creator: ABBYY FineReader`
  é a confissão direta; fonte única `GlyphLessFont` é a do Tesseract. Rode os
  dois **em toda obra da estante, não só nas novas** — o *Modernist Cuisine at
  Home* alimentava a calculadora de salmoura havia semanas antes de alguém
  perguntar de onde vinha o PDF. As quatro receitas estavam certas; a
  conferência é que estava faltando.
- **Fonte que se confere sozinha substitui a segunda fonte — até certo ponto.**
  O *Modernist at Home* publica a fórmula de Bloom e depois publica três
  substituições que saem dela; publica a regra de 0,8% e depois uma receita que
  a obedece. Isso valida a transcrição, não o número: se o livro estiver errado,
  ele estará coerentemente errado. Vale como trava de extração, não como
  corroboração científica — e a página tem de dizer que é fonte única.
- **Escreva o teste depois da conta, não antes.** Afirmei que 0,8% de 530 g
  "devolve as 4,3 g impressas". Devolve 4,24 g. O teste caiu e estava certo: o
  livro arredonda a própria receita. A afirmação forte foi parar na pesquisa e
  nos dois dicionários antes de alguém multiplicar — e o que restou, mais fraco,
  é o que era verdade desde o começo.
- **Fonte oficial pode discordar de si mesma.** O NCHFP resume a temperatura por
  altitude como "subtract 2 degrees F" por mil pés, e a tabela da mesma página
  não segue a regra a partir de 5.000 pés. A tabela é o dado, a regra é a
  aproximação — e a divergência vira conteúdo, não escolha silenciosa.
- **O rendimento declarado é um caso-verdade de graça.** Quase toda receita do
  Scheft publica o peso da massa pronta ("900 grams of dough"). Somar a lista de
  ingredientes e comparar com esse número pegou dois erros de transcrição que
  nenhuma outra conferência pegaria: 270 g de manteiga que laminam e não entram
  na massa, e 100 g de água de segunda adição que ficaram para trás. Procure o
  rendimento antes de transcrever a receita, e depois confira contra ele.
- **Em livro ilustrado, a tabela mais próxima do título não é necessariamente a
  tabela do título.** A lista de ingredientes que vem logo depois da variação do
  kubaneh é do *Light Brioche*, três páginas adiante. Extração por proximidade
  atribui receita ao pão errado sem errar nenhum número. Confira pelo sumário do
  capítulo, não pela ordem do texto extraído.
- **`pdffonts` responde antes de abrir o livro.** Fonte única chamada
  `GlyphLessFont` é camada de OCR do Tesseract sobre imagem: não é o que a
  editora compôs, é o que o reconhecedor achou. Em Kassis, `Makes 8-l0` e toda
  fração `½` virando `%`. Três dos nove livros de pão regional caíram nessa
  triagem em dois minutos, antes de qualquer leitura.
- **"Pesa" e "tem camada de texto" são perguntas diferentes, e as duas vêm antes
  da leitura.** *Flatbreads & Flavors* tem 484 páginas, 184 receitas, subtítulo
  "a baker's atlas" — e nove ocorrências da palavra "gram" no livro inteiro.
  Helou pesa farinha, água e gordura em 311 receitas e nunca pesa o sal nem o
  fermento. Meia fórmula não vira preset. Meça as duas coisas por obra antes de
  planejar o que dá para extrair.
- **Ponto fora da curva dentro de uma fonte não é divergência entre fontes.** O
  kubaneh do Scheft pede 4% de sal onde o mesmo autor usa 1,5% a 3% em todo o
  resto do livro — e a obra é internamente coerente no número (as colheres
  batem com as gramas). Coerência interna não valida um valor: é o padrão de um
  erro de edição. Divergência entre obras vira conteúdo; discrepância dentro de
  uma obra vira pendência de segunda fonte.

## Testes

- **"Nenhum preset estoura o limite duro" é um invariante que se paga sozinho.**
  Escrito para os pães novos, ele derrubou um preset antigo: a broa do Camargo
  leva 1,11% de fermento onde o próprio Camargo enuncia um teto de 1%. Quando um
  invariante desses cai, a saída **não** é afrouxar o teste — é decidir se a
  faixa está errada ou se o preset está, e escrever a exceção com nome e motivo
  quando a resposta é "nenhum dos dois".

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
- **Faixa que a fonte declara não pode colapsar no arredondamento.** Comparar as
  pontas por limiar numérico apagava o rendimento "5 a 6 potes" (5,2 e 5,6
  diferem por 0,4). Compare os textos **já formatados**: só colapsa quando as
  duas pontas exibem a mesma coisa.
- **`getByRole('term')` com `name` nunca casa.** `term` — o papel do `<dt>` — não
  recebe nome acessível a partir do conteúdo, então a busca não acha nada nunca,
  e uma asserção de ausência passa pelo motivo errado. Para escopar resultado,
  dê `aria-labelledby` à `<section>` e busque dentro dela: `<section>` sem nome
  não é landmark, então isso conserta o teste **e** a navegação por regiões.
- **Calculadora com uma fonte só quebra o teste da estante.** O cartão da home
  junta os títulos das obras com " · "; com uma fonte, o nó vira exatamente o
  título do livro e a busca global acha dois. Escope na estante.
- **Prove que o teste pega o bug.** Desfaça a correção, rode e veja falhar. Foi
  o que confirmou tanto a regressão do `__proto__` quanto o teste de offline —
  este passava alegremente com o service worker desligado até ser conferido.
- **`git checkout <arquivo>` descarta trabalho não commitado, e não avisa.** Ao
  provar que um teste novo pega a regressão, apaguei uma linha do dicionário,
  rodei o teste, vi falhar — e desfiz com `git checkout` no arquivo. Voltou para
  o `HEAD`, levando junto duas horas de tradução que ainda não estavam
  commitadas. Para desfazer um experimento, desfaça **com a mesma ferramenta que
  fez**: se a mudança foi um `sed`, o inverso é outro `sed`. Se for mesmo
  preciso restaurar do git, `git stash` primeiro. E o momento seguro de fazer
  esse teste é **depois** do commit.
- **Catálogo desenhado por duas superfícies precisa de rótulo para a união.**
  Duas linhas da tabela da Embrapa saíram do seletor (foram absorvidas por
  receitas) mas continuaram sendo linhas da tabela publicada na página — e
  ficaram em branco nos dois idiomas. Nenhum teste de contagem pega isso: a
  contagem estava certa. O teste que pega é `todo id de A **e** de B tem rótulo
  não vazio em todo idioma`.
- **Afirmação numérica em prosa é número sem fonte igual aos outros.** Escrevi
  "mais açúcar do que sete das nove receitas" em quatro lugares; eram oito e uma
  empatada. Não veio de extração errada — veio de contar de cabeça sobre dados
  que o código já tinha. Se a frase afirma uma contagem, escreva o teste **a
  partir da frase** e deixe o código responder.
- **Teste preso ao número de uma norma quebra junto com a norma.** O e2e de cura
  afirmava "conformidade com a RDC 272" e sobreviveu à troca para a IN 211 só
  porque a suíte completa não foi rodada no commit da correção. Asserção de
  texto deve mirar a **promessa** ("não certifica conformidade com a norma
  brasileira"), não o identificador que muda.
- **Fonte que se repete de dois jeitos é fonte conferível.** O Doc 138 publica
  uma regra de dose e onze formulações que a obedecem; o Wybauw publica a tabela
  de ganache em razão e em porcentagem. Nos dois casos a redundância virou
  `it.each` e é o que autoriza transcrever de PDF com ruído. Procure a segunda
  forma antes de transcrever a primeira.
- **Bloco tipograficamente quebrado na publicação não vira número.** Duas
  receitas do Doc 138 ficam num trecho em que a frase corta no meio e um título
  some — conferido na imagem da página, o defeito é do documento. Elas também
  eram as duas únicas fora da faixa que o documento publica. Coincidência que
  vale como sinal: número que destoa, confira a integridade da página antes de
  concluir que a fonte se contradiz.
- **Quando a lacuna fecha, o teste da lacuna precisa de casa nova.** O e2e que
  provava a tela "sem fonte na nossa bibliografia" só funcionava porque havia um
  verbete sem fonte. Ao dar fonte aos dois últimos, aquele ramo do componente
  ficaria sem teste nenhum — e ele é promessa de projeto, não detalhe de layout.
  A saída foi injetar um registro falso num teste de componente. Antes de
  comemorar o fim de uma pendência, veja o que ela estava sustentando.
- **Reusar um rótulo de campo em outra seção cria ambiguidade de verdade.** Dois
  `<label>` com o mesmo texto na mesma página deixam quem navega por rótulo sem
  saber qual pegou — e quebram `getByLabel` junto, que foi como isto apareceu. O
  segundo campo pediu nome próprio, e o nome próprio ("densidade da **sua**
  calda") acabou explicando melhor o que ele é.
- **Estimativa declarada é barata de corrigir; estimativa escondida não.** A
  densidade de 1,10 g/mL estava na tela dizendo "valor de trabalho, não número
  de fonte". Quando Clarke chegou, bateu — e não houve nada a mexer. Se o número
  tivesse entrado disfarçado de fonte, a conferência nunca teria acontecido.
- **PDF de 400 páginas com camada de texto pode ser OCR.** `pdffonts` entrega o
  jogo: fonte de corpo misturada com Courier New e MS Sans Serif é saída de
  motor de OCR, não livro diagramado. `pdfimages -list` confirma — página
  inteira como JPEG a 150 ppi por baixo. Não descarta a fonte, mas muda o que se
  pode tirar dela: nome de ingrediente o OCR acerta, número de tabela é onde ele
  erra, e este projeto já se queimou duas vezes aí.
- **Fonte boa para o produto errado é pior que fonte ausente.** O receituário do
  MMA publica geleia pesada de fruta nativa, com página e tudo — e cozinha a
  65–70 °C, sem pote e sem validade. Se entrasse como receita de conserva, o
  aviso de açúcar baixo da calculadora passaria a mentir sobre a natureza do
  risco. Antes de usar uma proporção, leia o **modo de preparo**: ele diz que
  produto é aquilo.
- **Quando um livro converte grama em medida caseira, ele não publica
  densidade.** Tentei extrair o peso do sal brasileiro de 136 receitas. As
  medianas caíam onde a física manda, mas a água — que é exatamente 1,00 g/mL —
  espalhou de 0,00 a 1,50 nos dados do próprio livro, porque parte das entradas
  arredonda para número redondo. Teste a extração contra um valor que você já
  conhece: se ele não fecha, o método não serve para os que você não conhece.

