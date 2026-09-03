# User Stories: Calculadoras Culinárias

| Campo | Valor |
|-------|-------|
| **PRD** | [prd-calculadoras-culinarias.md](./prd-calculadoras-culinarias.md) |
| **Data** | 2026-09-03 |
| **Versão** | 1.0 |

## Legenda de Prioridade (MoSCoW)
- **Must Have** — obrigatório para o marco correspondente.
- **Should Have** — importante, mas o marco pode sair sem.
- **Could Have** — desejável, entra se sobrar fôlego.
- **Won't Have** — explicitamente fora desta versão.

**Personas:** *Cozinheiro(a) doméstico(a)* (primária) e *Entusiasta avançado(a)* (secundária) — ver PRD §4.

---

## Épico 1: Fundação do site (M0)

> Projeto Next.js estático, bilíngue, com design system pastel, CI/CD e deploy no domínio. Tudo que as calculadoras vão herdar.
>
> **Referências no PRD:** FR-001, FR-002, NFR-001..007, TD-001, TD-005

### Story 1.1: Setup do projeto e deploy contínuo

**Como** desenvolvedor,
**quero** o repositório com Next.js (App Router, output estático), TypeScript strict, Tailwind v4, Vitest, Playwright e pipelines de CI/CD,
**para que** cada merge na main publique o site no domínio com qualidade garantida.

**Prioridade:** Must Have
**PRD:** TD-001, NFR-005, §5 Restrições

#### Critérios de Aceite

```gherkin
Cenário: CI em pull request
  Dado um pull request aberto no GitHub
  Quando a pipeline ci.yml roda
  Então testes, lint, typecheck e build são executados
  E o merge é bloqueado se qualquer etapa falhar

Cenário: Deploy automático
  Dado um merge na branch main
  Quando a Vercel detecta o push
  Então o build estático é publicado em calculadorasculinarias.com.br
  E nenhuma função server-side é gerada no build

Cenário: Guarda de arquitetura estática
  Dado o build de produção
  Quando inspeciono o output
  Então todas as rotas são estáticas (SSG) e não existem API routes
```

#### Notas
- `ci.yml` com trigger `pull_request`; deploy pela integração Git da Vercel (push na main), conforme convenção global do Gabriel.
- Nunca push direto na main.

---

### Story 1.2: Roteamento bilíngue (pt-BR raiz + /en)

**Como** visitante,
**quero** navegar o site em português (URLs na raiz, ex.: `/paes`) ou inglês (`/en/bread`),
**para que** eu use o site no meu idioma com URLs limpas.

**Prioridade:** Must Have
**PRD:** FR-002, TD-005, NFR-003

#### Critérios de Aceite

```gherkin
Cenário: Par de páginas com hreflang
  Dada qualquer página publicada em pt-BR
  Quando inspeciono o HTML
  Então existe a versão EN correspondente com slug traduzido
  E as duas se referenciam via hreflang recíproco (+ x-default)

Cenário: Seletor de idioma
  Dado que estou em /paes
  Quando troco o idioma para EN
  Então vou para /en/bread mantendo o contexto da página
  E minha escolha persiste na navegação seguinte

Cenário: Formatação por locale
  Dado um resultado de 32,5 g
  Quando visualizo em pt-BR e depois em EN
  Então vejo "32,5 g" em pt-BR e "32.5 g" em EN
```

---

### Story 1.3: Design system pastel e layout base

**Como** visitante,
**quero** uma identidade visual pastel consistente, agradável e legível em qualquer tela,
**para que** o site seja bonito e utilizável na cozinha, no celular.

**Prioridade:** Must Have
**PRD:** NFR-002, NFR-006, FR-046, §5

#### Critérios de Aceite

```gherkin
Cenário: Tokens centralizados
  Dado o design system implementado
  Quando um componente precisa de cor/espaçamento/tipografia
  Então ele consome tokens centralizados (paleta pastel, sem restrição a cores frias)

Cenário: Contraste acessível
  Dado qualquer texto sobre as cores pastel
  Quando medido o contraste
  Então é de no mínimo 4,5:1 (WCAG AA)

Cenário: Mobile-first
  Dado um viewport de 360 px
  Quando navego por qualquer página
  Então não há scroll horizontal e os alvos de toque têm tamanho adequado

Cenário: Regiões reservadas para anúncios
  Dado o layout das páginas de calculadora
  Quando o design é aplicado
  Então existem regiões previstas para anúncios futuros abaixo/entre o conteúdo educativo
  E nenhuma delas fica acima da calculadora
```

#### Notas
- Depende da Q2 do PRD (paleta definitiva). Usar a skill de frontend-design na implementação.

---

### Story 1.4: Home com catálogo de calculadoras

**Como** cozinheiro(a) doméstico(a),
**quero** ver na home quais calculadoras existem e o que cada uma faz,
**para que** eu chegue à ferramenta certa em um clique.

**Prioridade:** Must Have
**PRD:** FR-001

#### Critérios de Aceite

```gherkin
Cenário: Catálogo
  Dado que acesso a home
  Quando a página carrega
  Então vejo um card por calculadora com nome e descrição de uma linha
  E a proposta do site (proporções com fontes bibliográficas) está visível

Cenário: Calculadora futura
  Dado que a calculadora de gelato ainda não migrou
  Quando vejo o catálogo
  Então ela pode aparecer como "em breve", sem link clicável
```

---

## Épico 2: Calculadora de Pães (M1)

> A primeira calculadora no ar: presets, porcentagem de padeiro livre, conversor de fermento e escala de receitas. Puxa o SEO do site.
>
> **Referências no PRD:** FR-010..FR-014; dados em `docs/research/paes.md`

### Story 2.1: Receita por preset de pão

**Como** cozinheiro(a) doméstico(a),
**quero** escolher um tipo de pão e informar quanta farinha tenho (ou o peso/unidades que quero),
**para que** eu receba a receita completa em gramas sem fazer conta.

**Prioridade:** Must Have
**PRD:** FR-010

#### Critérios de Aceite

```gherkin
Cenário: Cálculo a partir da farinha
  Dado o preset "Pão francês"
  Quando informo 500 g de farinha
  Então vejo todos os ingredientes em gramas (1 casa decimal), a % de cada um e a hidratação total
  E os defaults respeitam a pesquisa (sal 2%, fermento instantâneo ≤ 1%)

Cenário: Cálculo a partir do peso final
  Dado o preset "Hambúrguer"
  Quando informo 12 unidades de 80 g
  Então a farinha e demais ingredientes são derivados do peso total de massa

Cenário: Três modos de entrada equivalentes
  Dado qualquer preset
  Quando alterno entre entrada por farinha, peso final e unidades
  Então o mesmo estado produz resultados consistentes entre os modos

Cenário: Validação de entrada
  Quando informo 0, valor negativo ou acima do limite razoável
  Então vejo mensagem de validação clara e nenhum resultado quebrado

Cenário: Fontes visíveis
  Dado um preset calculado
  Quando examino a receita
  Então cada preset exibe suas fontes (livro, autor, página/capítulo)
```

#### Notas
- Catálogo inicial de ~15 presets da pesquisa (`docs/research/paes.md`, seção 5).

---

### Story 2.2: Modo livre — porcentagem de padeiro

**Como** entusiasta avançado(a),
**quero** editar livremente as porcentagens (hidratação, sal, fermento, enriquecedores e pré-fermentos) com faixas sinalizadas,
**para que** eu crie/ajuste minha própria fórmula com segurança.

**Prioridade:** Must Have
**PRD:** FR-011, TD-003

#### Critérios de Aceite

```gherkin
Cenário: Faixas sinalizadas
  Dado o modo livre partindo do preset "Boule"
  Quando ajusto a hidratação para 75%
  Então o campo sinaliza "acima da faixa" (60–70%) sem bloquear
  E uma nota explica a consequência, com citação da fonte

Cenário: Pré-fermento com recálculo de hidratação
  Dado uma fórmula com levain líquido a 30% da farinha (100% de hidratação)
  Quando o levain entra na fórmula
  Então a hidratação efetiva da massa é recalculada e exibida
  E poolish (1:1) e massa fermentada (15–30%) também são suportados

Cenário: Líquidos múltiplos
  Dado uma fórmula com água, leite e ovos
  Quando visualizo a hidratação
  Então a contribuição líquida de cada um é explicitada no total

Cenário: Divergência entre fontes
  Dado um campo cujo default tem fontes divergentes (ex.: hidratação do pão branco)
  Quando abro o tooltip da faixa
  Então vejo os valores de cada fonte citados e a justificativa do default editorial
```

---

### Story 2.3: Conversor de fermento

**Como** cozinheiro(a) doméstico(a),
**quero** converter entre fermento fresco, seco ativo, instantâneo e levain,
**para que** eu use o fermento que tenho em qualquer receita.

**Prioridade:** Must Have
**PRD:** FR-012

#### Critérios de Aceite

```gherkin
Cenário: Fresco para instantâneo
  Dado 15 g de fermento fresco
  Quando converto para seco instantâneo
  Então recebo 5 g (fator ÷3), com a fonte citada

Cenário: Fresco para seco ativo
  Dado 15 g de fermento fresco
  Quando converto para seco ativo
  Então recebo 7,5 g (fator ÷2), com a fonte citada

Cenário: Conversão para levain com ajuste de massa
  Dado uma receita com 5 g de fermento seco e 500 g de farinha
  Quando converto para levain 100% de hidratação
  Então recebo a quantidade de levain sugerida (dentro de 20–50% da farinha)
  E os descontos de farinha e água da massa são exibidos

Cenário: Orientação de tempo
  Dado qualquer conversão
  Quando o resultado aparece
  Então vejo a nota orientativa da relação fermento×tempo (metade do fermento ≈ dobro do tempo)
```

---

### Story 2.4: Escalar receita existente

**Como** cozinheiro(a) doméstico(a),
**quero** colar os ingredientes de uma receita que já tenho e escolher um novo alvo,
**para que** tudo seja reescalado proporcionalmente sem regra de três manual.

**Prioridade:** Should Have
**PRD:** FR-013

#### Critérios de Aceite

```gherkin
Cenário: Escala proporcional
  Dada uma receita inserida (ingredientes + gramas) para 1 kg de farinha
  Quando defino o alvo em 600 g de farinha
  Então todos os ingredientes escalam na mesma proporção

Cenário: Análise de porcentagem
  Dada uma receita onde farinha, água e sal são identificáveis
  Quando a escala é calculada
  Então as porcentagens de padeiro resultantes aparecem com faixas sinalizadas

Cenário: Receita sem farinha identificável
  Dada uma receita sem ingrediente marcado como farinha
  Quando escalo por peso total
  Então a escala proporcional simples funciona e a análise de % fica oculta
```

---

### Story 2.5: Orientação fermento × tempo × temperatura

**Como** entusiasta avançado(a),
**quero** estimativas de tempo de fermentação pelo % de fermento e a conta da temperatura de base,
**para que** eu planeje fermentações longas.

**Prioridade:** Could Have
**PRD:** FR-014

#### Critérios de Aceite

```gherkin
Cenário: Estimativa de tempo
  Dado 0,04% de fermento numa massa de pizza napoletana
  Quando consulto a orientação
  Então vejo a estimativa de 5–8 h com a fonte citada

Cenário: Temperatura de base
  Dado que informo a temperatura ambiente e a da farinha
  Quando aplico a regra dos 54–56 °C
  Então recebo a temperatura da água recomendada
```

---

## Épico 3: Citações, conteúdo educativo e glossário

> O diferencial do site: todo número tem fonte, e as divergências viram aprendizado. Nasce no M1 (pães) e é reutilizado por todas as calculadoras.
>
> **Referências no PRD:** FR-003, FR-004, FR-045, TD-003, TD-004

### Story 3.1: Componente de citação bibliográfica

**Como** visitante,
**quero** ver de onde vem cada proporção (livro, autor, página/capítulo),
**para que** eu confie nos números e possa me aprofundar.

**Prioridade:** Must Have
**PRD:** FR-003

#### Critérios de Aceite

```gherkin
Cenário: Citação inline
  Dado um valor calculado com fonte (ex.: sal 2%)
  Quando abro a referência
  Então vejo obra, autor e página (PDF/físico) ou capítulo/seção (epub)

Cenário: Seção de fontes
  Dada uma página de calculadora
  Quando rolo até "Fontes"
  Então vejo todas as obras usadas naquela calculadora listadas uma única vez

Cenário: Fonte oficial complementar
  Dada uma regra de segurança baseada em NCHFP/USDA
  Quando vejo a citação
  Então ela está rotulada como "fonte oficial complementar", distinta dos livros
```

---

### Story 3.2: Página educativa por calculadora

**Como** cozinheiro(a) doméstico(a),
**quero** entender como o cálculo funciona e por que os defaults foram escolhidos,
**para que** eu aprenda enquanto uso — inclusive quando os livros discordam.

**Prioridade:** Must Have
**PRD:** FR-004, TD-003

#### Critérios de Aceite

```gherkin
Cenário: Estrutura da página
  Dada a página de uma calculadora
  Quando a percorro
  Então a ferramenta está no topo e abaixo vêm "Como funciona", "Metodologia e faixas", "Quando as fontes divergem" e o glossário do tema

Cenário: Divergências como conteúdo
  Dada a seção "Quando as fontes divergem" de pães
  Quando a leio
  Então vejo a tabela comparativa (ex.: hidratação 50/60/70%) com citações e o racional do default

Cenário: Conteúdo indexável
  Dado o build de produção
  Quando inspeciono o HTML servido
  Então todo o conteúdo educativo está pré-renderizado (sem depender de JS para existir)
```

#### Notas
- Uma instância desta story por calculadora (pães no M1, picles no M2, massas no M3), reutilizando a mesma estrutura.

---

### Story 3.3: Glossário com tooltips

**Como** cozinheiro(a) doméstico(a),
**quero** ver a definição de termos técnicos (autólise, levain, poolish, farinha 00, lactofermentação…) onde eles aparecem,
**para que** eu não precise sair da calculadora para entender.

**Prioridade:** Should Have
**PRD:** FR-004

#### Critérios de Aceite

```gherkin
Cenário: Tooltip no termo
  Dado um termo do glossário exibido na calculadora
  Quando aciono o termo (clique/toque/foco)
  Então vejo a definição curta com citação da fonte

Cenário: Âncora direta
  Dado o glossário da página
  Quando acesso a URL com âncora do termo
  Então a página abre posicionada na definição
```

---

### Story 3.4: Links de afiliados dos livros

**Como** dono do site,
**quero** que as fontes citadas linkem para a compra dos livros com meu código de afiliado,
**para que** o site gere alguma receita sem anúncios.

**Prioridade:** Should Have
**PRD:** FR-045

#### Critérios de Aceite

```gherkin
Cenário: Link com disclosure
  Dada uma fonte listada na seção "Fontes"
  Quando vejo o link de compra
  Então ele usa rel="sponsored" e há aviso de afiliado visível na seção

Cenário: Sem conta de afiliado
  Dado que a conta Amazon Associados ainda não existe
  Quando a página é publicada
  Então os links funcionam como links simples, sem quebrar (fallback)
```

---

## Épico 4: Calculadora de Picles/Fermentação (M2)

> Salmoura, salga direta e quick pickles — a maior lacuna do mercado pt-BR — com segurança alimentar como cidadã de primeira classe.
>
> **Referências no PRD:** FR-020..FR-023, TD-002, TD-004; dados em `docs/research/picles-fermentacao.md`

### Story 4.1: Salmoura de lactofermentação

**Como** cozinheiro(a) doméstico(a),
**quero** informar meu pote (ou pesos) e receber quanto sal usar,
**para que** minha fermentação seja segura e reproduzível.

**Prioridade:** Must Have
**PRD:** FR-020, TD-002

#### Critérios de Aceite

```gherkin
Cenário: Default por peso total
  Dado o preset "Cenoura" com 400 g de vegetais e 600 g de água
  Quando calculo com o default de 2% sobre o peso total
  Então recebo 20 g de sal (precisão de 0,1 g)
  E vejo o % efetivo também expresso no método alternativo

Cenário: Modo pote
  Dado que só sei o volume do pote (1 L)
  Quando escolho o modo por volume
  Então a calculadora estima a proporção vegetais/água e explicita a estimativa

Cenário: Toggle método Katz
  Dado o preset "Pepinos"
  Quando ativo "% sobre a água"
  Então o cálculo muda para 5% sobre a água, com explicação da diferença e citações

Cenário: Piso de segurança
  Dado qualquer preparo
  Quando tento um % de sal abaixo do mínimo seguro do preset
  Então vejo aviso de segurança destacado (diferente da sinalização comum de faixa)
```

---

### Story 4.2: Salga direta (chucrute/kimchi)

**Como** cozinheiro(a) doméstico(a),
**quero** calcular o sal sobre o peso do vegetal para fermentações sem salmoura,
**para que** eu faça chucrute e kimchi na proporção certa.

**Prioridade:** Must Have
**PRD:** FR-021

#### Critérios de Aceite

```gherkin
Cenário: Chucrute a 2%
  Dado 1,2 kg de repolho
  Quando calculo com o default de 2%
  Então recebo 24 g de sal, com faixa 1,5–2% sinalizada e fontes citadas
```

---

### Story 4.3: Picles de vinagre (quick pickles)

**Como** cozinheiro(a) doméstico(a),
**quero** calcular a solução de vinagre para conserva de geladeira,
**para que** o picles fique saboroso e com acidez segura.

**Prioridade:** Must Have
**PRD:** FR-022, TD-004

#### Critérios de Aceite

```gherkin
Cenário: Proporção default
  Dado um pote de 500 ml
  Quando calculo com o default
  Então recebo a solução 1:1 (vinagre 5% : água) com sal e açúcar em gramas, fontes citadas

Cenário: Vinagre fraco
  Dado que informo um vinagre com acidez de 4%
  Quando calculo
  Então a proporção é recalculada para manter a acidez mínima (NCHFP/USDA)
  Ou vejo aviso claro de que a combinação não atinge acidez segura

Cenário: Geladeira vs prateleira
  Dado o resultado de um quick pickle
  Quando leio o resultado
  Então está claro que é conserva de geladeira, com explicação de por que conserva de prateleira está fora do escopo
```

---

### Story 4.4: Camada de segurança alimentar

**Como** cozinheiro(a) doméstico(a),
**quero** avisos claros sobre pH, mofo, temperatura e riscos reais,
**para que** eu fermente sem medo e sem imprudência.

**Prioridade:** Must Have
**PRD:** FR-023

#### Critérios de Aceite

```gherkin
Cenário: Segurança sempre visível
  Dado qualquer resultado calculado na página de picles
  Quando visualizo ou imprimo o resultado
  Então os avisos de segurança essenciais acompanham o resultado (não escondidos atrás de interação)

Cenário: Dois modos de temperatura
  Dada a orientação de fermentação
  Quando escolho entre modo rápido (~28 °C, Noma) e lento (10–21 °C, Katz/BWF)
  Então tempos estimados e trade-offs de cada modo aparecem com citações

Cenário: Riscos nomeados
  Dada a seção de segurança
  Quando a leio
  Então pH alvo (< 4,6), Kahm vs mofo e os casos reais de risco de botulismo estão explicados com fontes
```

---

## Épico 5: Calculadora de Massa Fresca (M3)

> Porções → receita, presets de massas e guia de formatos. Nicho vazio nos dois idiomas.
>
> **Referências no PRD:** FR-030..FR-032; dados em `docs/research/massas.md`

### Story 5.1: Massa por número de porções

**Como** cozinheiro(a) doméstico(a),
**quero** dizer para quantas pessoas vou cozinhar,
**para que** eu saiba quanta farinha e quantos ovos usar.

**Prioridade:** Must Have
**PRD:** FR-030

#### Critérios de Aceite

```gherkin
Cenário: Prato principal para 4
  Dado 4 pessoas em modo prato principal (100 g/pessoa)
  Quando calculo
  Então recebo 400 g de farinha 00 + 4 ovos (~240 g) com o rendimento total

Cenário: Fração de ovo
  Dado 3 pessoas em modo entrada (85 g/pessoa)
  Quando o cálculo resultaria em fração de ovo
  Então a calculadora sugere a combinação com ovos inteiros mais próxima
  E mostra o ajuste de farinha correspondente (regra 100 g/ovo, com fonte)

Cenário: Ovos fora do padrão
  Dado que meus ovos pesam 70 g em vez de ~60 g
  Quando informo o peso real
  Então a farinha é ajustada (farinha ≈ 1,5× o peso dos ovos, com fonte)
```

---

### Story 5.2: Presets de tipos de massa

**Como** entusiasta avançado(a),
**quero** escolher entre massa de ovo, sêmola+água, coloridas e rica em gemas,
**para que** as proporções e a hidratação se ajustem ao estilo.

**Prioridade:** Must Have
**PRD:** FR-031

#### Critérios de Aceite

```gherkin
Cenário: Massa de sêmola
  Dado o preset "Sêmola e água"
  Quando calculo para 4 pessoas
  Então a proporção usa ~46% de hidratação (280 g : 130 g), com fonte citada

Cenário: Massa colorida
  Dado o preset "Espinafre"
  Quando o seleciono
  Então líquidos e farinha se ajustam conforme os valores quantificados na pesquisa
  E a divergência editorial (Hazan aceita só espinafre) aparece no conteúdo educativo
```

---

### Story 5.3: Guia de formatos e espessuras

**Como** cozinheiro(a) doméstico(a),
**quero** saber a espessura de abertura e o uso de cada formato,
**para que** eu abra a massa certa para o prato que quero.

**Prioridade:** Should Have
**PRD:** FR-032

#### Critérios de Aceite

```gherkin
Cenário: Consulta por formato
  Dado o guia de formatos
  Quando seleciono "Ravioli"
  Então vejo o setting de máquina recomendado, espessura aproximada e observações, com fontes
  E divergências entre fontes (ex.: lasanha "mais fina possível" vs setting 7) aparecem citadas

Cenário: Ligação com presets
  Dado um formato selecionado
  Quando escolho "usar esta massa"
  Então vou para o preset adequado já configurado
```

---

## Épico 6: Funcionalidades transversais

> Persistência efêmera, compartilhamento, impressão, PWA e telemetria — herdadas por todas as calculadoras. Core no M1, polimento no M4.
>
> **Referências no PRD:** FR-040..FR-044, FR-046

### Story 6.1: Salvar receitas no navegador

**Como** cozinheiro(a) doméstico(a),
**quero** salvar meus cálculos com nome,
**para que** eu os reabra depois sem criar conta.

**Prioridade:** Must Have
**PRD:** FR-040

#### Critérios de Aceite

```gherkin
Cenário: Salvar e recarregar
  Dado um cálculo concluído
  Quando salvo como "Pão de sábado"
  Então ele aparece na lista de salvos da calculadora e recarrega o estado completo ao clicar

Cenário: Limite e substituição
  Dado que já tenho 20 salvos naquela calculadora
  Quando salvo um novo com nome inédito
  Então sou avisado do limite
  E salvar com nome existente substitui o anterior

Cenário: localStorage indisponível
  Dado um navegador com armazenamento bloqueado
  Quando abro a calculadora
  Então o recurso de salvar fica oculto com aviso discreto e nada quebra
```

---

### Story 6.2: Compartilhar por link e texto

**Como** cozinheiro(a) doméstico(a),
**quero** mandar minha receita calculada para alguém,
**para que** a pessoa abra a calculadora já preenchida ou receba o texto pronto.

**Prioridade:** Must Have
**PRD:** FR-041

#### Critérios de Aceite

```gherkin
Cenário: Link com estado
  Dado um cálculo concluído
  Quando gero o link de compartilhamento
  Então a URL contém o estado serializado e versionado
  E quem abre o link vê a calculadora preenchida idêntica

Cenário: SEO preservado
  Dada uma URL com estado compartilhado
  Quando inspeciono o HTML
  Então o canonical aponta para a página limpa da calculadora

Cenário: Texto via Web Share
  Dado um dispositivo com Web Share API
  Quando compartilho como texto
  Então o texto traz os ingredientes em gramas com precisão de pesagem e o link da calculadora
  E sem Web Share, o texto é copiado para a área de transferência com confirmação

Cenário: Estado de versão antiga
  Dado um link gerado numa versão anterior do serializador
  Quando ele é aberto
  Então o estado é migrado ou uma mensagem clara explica a incompatibilidade
```

---

### Story 6.3: Impressão limpa

**Como** cozinheiro(a) doméstico(a),
**quero** imprimir a receita calculada,
**para que** eu leve o papel para a bancada.

**Prioridade:** Should Have
**PRD:** FR-042

#### Critérios de Aceite

```gherkin
Cenário: CSS de impressão
  Dado um cálculo concluído
  Quando imprimo a página
  Então controles e navegação somem e a receita sai limpa em uma página
  E na calculadora de picles os avisos de segurança são impressos junto
```

---

### Story 6.4: PWA e offline

**Como** cozinheiro(a) doméstico(a),
**quero** instalar o site e usá-lo sem internet,
**para que** as calculadoras funcionem na cozinha mesmo sem sinal.

**Prioridade:** Should Have
**PRD:** FR-043

#### Critérios de Aceite

```gherkin
Cenário: Offline após primeira visita
  Dado que visitei o site uma vez
  Quando fico offline e reabro qualquer calculadora já visitada
  Então ela carrega e calcula normalmente

Cenário: Instalável
  Dado um navegador compatível
  Quando acesso o site
  Então o manifest permite instalação com ícone e nome corretos

Cenário: Atualização
  Dada uma nova versão publicada
  Quando o service worker a detecta
  Então a atualização ocorre em background com aviso discreto
```

---

### Story 6.5: Analytics de uso sem cookies

**Como** dono do site,
**quero** pageviews e eventos-chave sem rastrear pessoas,
**para que** eu acompanhe o uso sem banner de consentimento.

**Prioridade:** Should Have
**PRD:** FR-044, NFR-004

#### Critérios de Aceite

```gherkin
Cenário: Eventos mínimos
  Dado o analytics configurado (decisão Q1 do PRD)
  Quando um usuário conclui um cálculo, compartilha, salva ou imprime
  Então os eventos calculo_concluido, compartilhar, salvar e imprimir são registrados por calculadora

Cenário: Zero cookies
  Dado o site em produção
  Quando inspeciono cookies e requests
  Então não há cookie de rastreamento nem envio de dado pessoal
```

---

## Épico 7: Fase 2 — fora desta versão

### Story 7.1: Migração da calculadora de gelato

**Como** dono do site,
**quero** portar a calculadora de gelato para dentro do site com o sistema de citações,
**para que** todas as calculadoras vivam no mesmo produto.

**Prioridade:** Won't Have (v1 — aguarda detalhes do Gabriel na fase 2)
**PRD:** FR-050

---

## Stories Não-Funcionais

### Story NF.1: Qualidade dos motores de cálculo

**Como** desenvolvedor,
**quero** motores de cálculo puros com testes que usam as receitas dos livros como casos-verdade,
**para que** nenhum número publicado esteja errado.

**Prioridade:** Must Have
**PRD:** NFR-005, NFR-007

#### Critérios de Aceite

```gherkin
Cenário: Casos-verdade
  Dado o motor de cada calculadora
  Quando a suíte de testes roda
  Então cada fórmula e faixa é coberta por teste
  E ao menos uma receita real de cada fonte é reproduzida e conferida contra o valor do livro

Cenário: Arredondamento consistente
  Dado qualquer resultado exibido
  Quando comparo a soma das parcelas com o total
  Então elas batem na precisão exibida (regras centralizadas e testadas)
```

---

### Story NF.2: Performance de página

**Como** visitante,
**quero** páginas que abrem instantaneamente no celular,
**para que** eu use a calculadora na hora, na cozinha.

**Prioridade:** Must Have
**PRD:** NFR-001

#### Critérios de Aceite

```gherkin
Cenário: Auditoria por página
  Dada cada página publicada
  Quando rodo Lighthouse mobile
  Então Performance ≥ 90, LCP < 2,5 s e CLS < 0,1

Cenário: Cálculo instantâneo
  Dado qualquer mudança de input
  Quando o resultado recalcula
  Então não há chamada de rede e a atualização é imediata
```

---

### Story NF.3: Acessibilidade das calculadoras

**Como** usuário(a) de teclado/leitor de tela,
**quero** operar qualquer calculadora sem mouse e ouvir os resultados,
**para que** o site seja utilizável por todos.

**Prioridade:** Must Have
**PRD:** NFR-002

#### Critérios de Aceite

```gherkin
Cenário: Navegação por teclado
  Dada qualquer calculadora
  Quando navego só com teclado
  Então alcanço e opero todos os controles em ordem lógica, com foco visível

Cenário: Resultados anunciados
  Dado um leitor de tela ativo
  Quando um resultado recalcula
  Então a região de resultado é anunciada via aria-live sem spam de anúncios

Cenário: Auditoria
  Dada cada página publicada
  Quando rodo axe/Lighthouse
  Então a pontuação de acessibilidade é ≥ 95 e não há violações críticas
```

---

### Story NF.4: SEO técnico bilíngue

**Como** dono do site,
**quero** o pacote técnico de SEO completo em ambos os idiomas,
**para que** as páginas ranqueiem nas lacunas identificadas na pesquisa de concorrentes.

**Prioridade:** Must Have
**PRD:** NFR-003

#### Critérios de Aceite

```gherkin
Cenário: Metadados por página
  Dada cada página em cada idioma
  Quando inspeciono o HTML
  Então title/description únicos, hreflang recíproco, canonical e JSON-LD válidos estão presentes

Cenário: Sitemap
  Dado o build de produção
  Quando acesso /sitemap.xml
  Então todas as páginas dos dois idiomas estão listadas
```

---

## Resumo

| Métrica | Contagem |
|---------|----------|
| Épicos | 7 (+ NF) |
| Stories | 26 |
| Must Have | 16 |
| Should Have | 8 |
| Could Have | 1 |
| Won't Have | 1 |

## Mapa de Stories

| Épico | Must Have | Should Have | Could Have | Won't Have |
|-------|-----------|-------------|------------|------------|
| 1. Fundação (M0) | 1.1, 1.2, 1.3, 1.4 | — | — | — |
| 2. Pães (M1) | 2.1, 2.2, 2.3 | 2.4 | 2.5 | — |
| 3. Citações e conteúdo | 3.1, 3.2 | 3.3, 3.4 | — | — |
| 4. Picles (M2) | 4.1, 4.2, 4.3, 4.4 | — | — | — |
| 5. Massas (M3) | 5.1, 5.2 | 5.3 | — | — |
| 6. Transversais | 6.1, 6.2 | 6.3, 6.4, 6.5 | — | — |
| 7. Fase 2 | — | — | — | 7.1 |
| Não-funcionais | NF.1, NF.2, NF.3, NF.4 | — | — | — |

---

## Histórico de Revisões

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 2026-09-03 | Gabriel + Claude Code | Stories iniciais a partir do PRD v1.0 |
