# QA — Fruta brasileira na calculadora de geleias

Data: 2026-09-14 · Branch: `feature/glossary-sources`
Pesquisa: `docs/research/geleias.md`, Parte II (§11 a §17)

## Escopo

A maior lacuna declarada da calculadora de geleias era não ter fruta de quintal
brasileiro. Duas publicações gratuitas da Embrapa fecharam essa e mais duas
lacunas que a §9 da pesquisa listava como pendência: dose de pectina em pó e
janela de pH.

**Não foi acréscimo de linha; foi mudança de modelo.** Goiaba não tem receita
pesada em nenhuma obra da estante, e nunca vai ter — o que existe para ela é
classificação e norma. Então a receita deixou de ser obrigatória, duas
classificações passaram a conviver, e o aviso de açúcar ganhou uma segunda
régua com texto próprio.

| O que entrou | De onde |
|---|---|
| 35 frutas novas no seletor, 44 no total | Tabela 1, Embrapa Doc 29 (Torrezan, 1998) |
| Classificação por pectina × acidez, dois eixos | a mesma tabela |
| Geleia comum (40:60) e extra (50:50) como níveis de açúcar | definição legal, transcrita no Doc 29 |
| Dose de pectina em pó, 0,5% a 1,5% **do açúcar** | Embrapa Doc 138 (Krolow, 2013) |
| Janela de pH: gel em torno de 3, nada acima de 3,4, alvo 3,0–3,2 | Doc 29 |
| Limiar da sinérese: acima de 1% de acidez total | Doc 29 |
| Segunda tabela de ponto por altitude, em metros e Celsius | Doc 138 |
| Três verbetes de glossário e três divergências novas | — |

## Verificação

| Etapa | Resultado |
|---|---|
| `pnpm lint` | limpo |
| `pnpm typecheck` | limpo (com `tsconfig.tsbuildinfo` apagado antes) |
| `pnpm test` | 725 testes, todos passando (eram 692) |
| `pnpm build` | gera `/geleias` e `/en/jam` com a seção nova |
| `playwright test` | 308 testes, todos passando (eram 296) |

## Apontamentos

### 1. Rótulo em branco na tabela, achado por teste — **média** — corrigido

`fig-ripe` e `peach-ripe` foram **absorvidos** pelas receitas de Saunders: o
figo e o pêssego do Blue Chair passaram a apontar para essas linhas em vez de
aparecerem duas vezes no seletor. Só que as duas continuam sendo linhas da
Tabela 1, que a página publica inteira — e ficaram **sem nome, em branco na
tabela**, nos dois idiomas.

Nenhum teste existente pegava: o e2e conta 39 linhas e a contagem estava certa.
O que pegou foi um teste escrito de propósito para isto — todo id de
`JAM_FRUITS` **e** de `EMBRAPA_TABLE` tem rótulo não vazio nos dois idiomas.
Desfiz a correção e vi o teste falhar antes de aceitar.

**A lição generalizável:** quando um catálogo é desenhado por duas superfícies
diferentes (o seletor e a tabela), o mapa de rótulos tem de cobrir a **união**,
não a maior das duas.

### 2. Afirmação em prosa que o teste desmentiu — **média** — corrigida

Escrevi, em quatro lugares, que a geleia extra da norma pede "mais açúcar do que
**sete** das nove receitas do Blue Chair". O teste, escrito a partir da própria
frase, falhou: são **oito** abaixo e uma empatada (a framboesa, que Saunders faz
um a um). Corrigido nos dois dicionários, na pesquisa e no teste.

Vale o registro porque o erro não estava num número extraído de fonte — estava
numa contagem **minha**, feita de cabeça sobre dados que o código já tinha. A
regra do projeto vale para prosa também.

### 3. Formulação da fonte que ficou de fora de propósito — **baixa** — documentado

As receitas de butiá e de uvaia do Doc 138 usam 16,7 g de pectina por quilo de
açúcar: 1,67%, acima da faixa de 0,5% a 1,5% que o **próprio documento**
publica. Fui conferir na página renderizada e o bloco está tipograficamente
quebrado na publicação: a frase do butiá corta no meio ("*acrescentar o 16,5*")
e o título da receita de uvaia desaparece, colado ao nome da formuladora.

O defeito é do documento, não da extração. Bloco com defeito não vira número na
tela. Registrado em `geleias.md` §14.

### 4. Extração de tabela de PDF — **alta** — mitigada por desenho

Trinta e oito linhas com duas marcas cada, num PDF de 1998 diagramado em duas
colunas. É exatamente onde este projeto já se queimou duas vezes.

O que foi feito: extração com `pdftotext -layout`, atribuição de cada marca à
coluna **por programa** a partir dos deslocamentos do cabeçalho, e conferência
contra a **página renderizada como imagem**, linha a linha. As duas leituras
batem nas 38.

Duas travas ficaram no teste: toda linha tem exatamente um nível de cada eixo —
se uma coluna tivesse escorregado, alguma linha teria duas marcas do mesmo lado
ou nenhuma — e as oito linhas sem asterisco estão nomeadas uma a uma.

### 5. Autoconferência da fonte como caso-verdade — **sem apontamento**

O Doc 138 publica onze formulações pesadas além da regra da pectina. Dez delas
obedecem à própria faixa, e a décima primeira erra por cinco centésimos de
ponto. As dez viraram `it.each` — se alguém trocar a base da dose de açúcar
para fruta, dez testes caem de uma vez.

É o mesmo padrão que salvou a transcrição do Wybauw: fonte que se repete de dois
jeitos é fonte conferível.

### 6. Seletor de 44 opções — **baixa** — resolvido com `<select>`

Botões deixaram de servir. Virou `<select>` com dois `<optgroup>`, e o
agrupamento carrega informação: "com receita pesada" contra "tabela da Embrapa,
sem receita" é o que decide a **forma** da resposta que a pessoa vai receber.

Os e2e que clicavam em botão de fruta passaram a usar `selectOption`.

### 7. Teste preso ao número de uma norma — **média** — corrigido

Herdado da tarefa anterior: o e2e de cura afirmava a frase "não certifica
conformidade com a **RDC 272**", e o texto tinha mudado para "com a norma
brasileira" quando a norma foi substituída pela IN 211/2023. Passou despercebido
no commit anterior porque o `playwright test` completo não foi rodado depois da
correção de texto.

Agora a asserção não nomeia a norma, e o comentário explica por quê: um teste
preso ao número de uma norma quebra junto com ela.

## Segurança

Revisão à mão sobre a superfície nova. Nada aberto.

- **Entrada não confiável (`parseJamState`)**: o id da fruta continua conferido
  contra o catálogo e o nível de açúcar contra o registro, com `Object.hasOwn`.
  A novidade é uma combinação impossível: `source` numa fruta sem receita. É
  **recusada**, e não consertada em silêncio — quem abre um link tem de ver o
  que o link diz ou nada. Teste cobre `__proto__`, `constructor`, `toString` e
  `comum` (a palavra da norma em português, que não é a chave).
- **Assimetria deliberada**: trocar de fruta na tela *coage* o nível para a
  geleia extra; um link com a mesma combinação é *recusado*. A troca na tela é
  ação visível de quem está ali; o link é uma afirmação de terceiro.
- **Rótulo por chave de fora**: `labelFor` com `Object.hasOwn` no seletor e na
  Tabela 1, agora com teste de cobertura total do catálogo.
- **Divisão por zero**: `legalSugarRatio` divide por `parts.fruit`, que é
  constante da norma (35, 40 ou 50); `scaleJars` só divide quando há receita;
  `pectinRange` só multiplica.
- **ReDoS**: sem expressão regular no caminho.
- **Impacto de adulteração de link**: trocar `guava` por `apricot` muda o açúcar
  por um fator de 2,4. Mesma classe de exposição de antes, e a tela sempre
  nomeia a fonte e mostra a proporção de referência ao lado.

## O que ficou pendente

- **Dose de ácido por fruta.** As onze formulações do Doc 138 variam de 0,05% a
  0,6% do açúcar em ácido cítrico, sem regra publicada. O que entra na tela é o
  alvo de pH e a regra de medir antes de acidificar.
- **Rendimento e validade da fruta brasileira.** A Embrapa não declara nenhum
  dos dois. A calculadora omite as duas linhas em vez de escalar de outra fruta.
- **JACKIX, Marta Hiromi**, *Doces, geléias e frutas em calda* (1988), fonte
  primária de 30 das 38 linhas. Enquanto não chegar, a citação é de terceira mão
  e a tabela declara isso, linha a linha.
- **CT 31, geleia de maracujá** — digitalização em imagem. Só entra depois de
  OCR conferido à mão.
- **Uva e ameixa não ganharam vínculo com a Tabela 1.** A uva de Saunders é
  Concord, que não está entre as variedades brasileiras listadas, e a ameixa do
  livro não tem cultivar declarada. Aproximar seria inventar.
