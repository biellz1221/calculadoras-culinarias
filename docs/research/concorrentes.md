# Pesquisa de Concorrentes — Calculadoras Culinárias

**Projeto:** calculadorasculinarias.com.br — calculadoras de pães (porcentagem de padeiro), picles/fermentação (salmoura) e massa fresca, em pt-BR e EN, gratuito, sem login.

**Data da pesquisa:** setembro/2026
**Método:** WebSearch + visita direta (WebFetch) aos sites. Sites marcados com (*) bloquearam acesso automatizado (HTTP 403) — dados obtidos via resultados de busca e páginas de terceiros que os descrevem.

---

## 1. Panorama geral

O mercado em inglês é **saturado em calculadoras de pão/pizza** (dezenas de sites, de hobby a SaaS) e **moderadamente servido em salmoura/lactofermentação**. Massa fresca é um nicho quase vazio mesmo em inglês (só sites de "farm de calculadoras" como Miss Vickie e Handy Chefdom cobrem o tema, sem profundidade).

Em **pt-BR o cenário é fraco**: existem calculadoras isoladas e simples (uma de hidratação de pão, duas de pizza acopladas a lojas/blogs, uma de levain em loja de acessórios), nenhuma com o pacote completo (pão + salmoura + massa fresca), nenhuma com referências bibliográficas, e **nenhuma calculadora de salmoura para fermentação em pt-BR foi encontrada** — os resultados em português apontam para ferramentas em inglês (Acre Tools, Miss Vickie) ou artigos de blog sem calculadora.

O diferencial planejado (citar fontes/referências) é raro até em inglês: dos ~15 sites analisados, **apenas 2 citam fontes formais** (Fermentcalc: NCHFP/FDA/USDA/Sandor Katz/Noma Guide; The Sourdough Journey: dados experimentais próprios). Omni Calculator usa revisão por especialistas com credenciais (PhD), mas sem bibliografia.

---

## 2. Concorrentes — Pão / Porcentagem de padeiro

### 2.1 FoodGeek Bread Calculator (*)
- **URL:** https://foodgeek.io/en/bread-calculator/
- **O que calcula:** receita completa de pão por porcentagem de padeiro; escala por peso total ou peso de farinha; ajuste de hidratação em tempo real; conversão fermento biológico ↔ levain; calculadora separada de alimentação de starter (https://foodgeek.io/en/starter-calculator/).
- **Pontos fortes:** referência da categoria; salvar e **compartilhar receitas via URL permanente**; artigo educacional acoplado explicando baker's math (https://foodgeek.io/en/bakers-math-explained/); marca forte (canal YouTube do Sune Trudslev).
- **Pontos fracos:** bloqueia bots/fetch (403) — irrelevante para usuário final, mas indica infra restritiva; conteúdo educacional autorreferente.
- **Fontes/referências:** não cita bibliografia formal; autoridade baseada na persona do criador.
- **Idiomas:** inglês (estrutura de URL `/en/` sugere preparo para i18n).
- **Monetização:** ecossistema YouTube/afiliados do criador; sem paywall na calculadora.

### 2.2 Flourwise
- **URL:** https://flourwise.com/calculator/
- **O que calcula:** pão, pizza e sourdough por porcentagem de padeiro; hidratação central; conversores acoplados (temperatura, fermento, xícaras→gramas); tabelas de hidratação como conteúdo SEO (https://flourwise.com/pt/tabela-hidratacao-pao/).
- **Pontos fortes:** 6 presets prontos (sourdough 72%, ciabatta 80%, brioche 55%, pizza 62%, bagel 55%, focaccia 80%); botão "Share Recipe"; unidades g/kg/oz/lb; **6 idiomas incluindo português** — já disputa SEO pt com páginas `/pt/` de tabelas de hidratação.
- **Pontos fracos:** salvar receita só no app Android (fricção); português parece tradução (não localização BR de verdade); sem bibliografia.
- **Fontes/referências:** não — cita "metodologias Flourwise" genéricas.
- **Idiomas:** EN, PL, DE, IT, FR, PT.
- **Monetização:** app gratuito (Android; iOS em waitlist); web sem ads visíveis.
- **Observação estratégica:** é o concorrente mais próximo do nosso posicionamento em pt. Vale monitorar.

### 2.3 BreadHydration.com
- **URL:** https://breadhydration.com/
- **O que calcula:** 14 calculadoras — hidratação, sourdough, pizza (presets Napolitana/NY/Detroit), baguete, bagel (NY/Montreal), croissant, conversor volume/peso, tempo de fermentação.
- **Pontos fortes:** links compartilháveis; roda 100% no navegador com histórico em localStorage (**sem login** — mesmo modelo que planejamos); presets por estilo; 6 idiomas com português.
- **Pontos fracos:** diretrizes sem atribuição ("65–70% is the sweet spot") ; profundidade educacional rasa; design utilitário.
- **Fontes/referências:** não.
- **Idiomas:** EN, DE, ES, FR, PT, JA.
- **Monetização:** afiliado Amazon (banneton) + Ko-fi.

### 2.4 The Sourdough Journey (Tools)
- **URL:** https://thesourdoughjourney.com/tools/
- **O que calcula/oferece:** não são calculadoras web — são **PDFs**: Bulk-O-Matic, tabelas de fermentação em bloco (20 pontos de dados entre 16–22 °C), guia de leitura de miolo, worksheets.
- **Pontos fortes:** único do nicho com **dados experimentais próprios** (tempo de bulk × temperatura da massa × % de starter); enorme autoridade na comunidade sourdough; gratuito.
- **Pontos fracos:** nada interativo — tudo PDF para imprimir; inglês apenas; UX de 2010.
- **Fontes/referências:** sim, artigos e experimentos próprios documentados.
- **Idiomas:** inglês.
- **Monetização:** doações voluntárias.
- **Observação estratégica:** transformar as tabelas dele em calculadora interativa (tempo de bulk por temperatura) é oportunidade clara — ninguém fez isso bem, nem em inglês.

### 2.5 King Arthur Baking
- **URL:** https://www.kingarthurbaking.com/videos/bread-school/what-is-bakers-percentage e blog "What is baker's math"
- **O que calcula:** **não tem calculadora interativa de baker's %** — oferece conteúdo educacional (vídeos, blog, guia de porcentagem) de altíssima qualidade.
- **Pontos fortes:** autoridade máxima de marca; conteúdo didático excelente (bom benchmark de texto explicativo).
- **Pontos fracos:** a ausência de ferramenta interativa é justamente a lacuna que sites menores (FoodGeek etc.) ocupam.
- **Fontes/referências:** equipe própria de padeiros profissionais (autoridade institucional, sem bibliografia).
- **Idiomas:** inglês. **Monetização:** e-commerce de farinhas/utensílios.

### 2.6 Breadtopia
- **URL:** https://breadtopia.com/faq/bakers-percentage/
- **O que calcula:** também **sem calculadora oficial** — FAQ explicando baker's %; no fórum há apps de terceiros divulgados.
- **Pontos fortes:** comunidade ativa (fórum). **Pontos fracos:** ferramenta inexistente.
- **Fontes/referências:** não. **Idiomas:** inglês. **Monetização:** e-commerce (grãos, equipamento).

### 2.7 Omni Calculator (Baker's Percentage / Bread)
- **URL:** https://www.omnicalculator.com/food/bakers-percentage
- **O que calcula:** porcentagem de padeiro genérica, bidirecional.
- **Pontos fortes:** UX consistente e testada em escala; cálculo bidirecional (qualquer campo pode ser entrada); autores com credenciais e revisores nomeados.
- **Pontos fracos:** genérico, sem alma de nicho; não guia o usuário por estilo de pão; parte de uma "farm" de milhares de calculadoras.
- **Fontes/referências:** revisão por especialistas nomeados (PhDs), sem bibliografia formal na maioria das páginas.
- **Idiomas:** inglês + versões indexadas em vários idiomas (qualidade de tradução variável).
- **Monetização:** ads/ecossistema Omni.

---

## 3. Concorrentes — Pizza

### 3.1 Stadler Made / pizzacalculator.com
- **URL:** https://www.stadlermade.com/pizza-calculator/
- **O que calcula:** massa de pizza em 6 estilos (Napolitana, NY, Napolitana forno caseiro, Canotto, Tonda Romana, sem glúten), considerando **tempo de fermentação e temperatura ambiente/geladeira**.
- **Pontos fortes:** melhor UX do segmento (visual, passo a passo); controle de fermentação por temperatura; salvar/compartilhar cálculos com a comunidade; documentação educacional interna (água, sal, fermento, farinha); **tem versão em português** (https://www.stadlermade.com/pt/calculadora-de-fermento/).
- **Pontos fracos:** recursos avançados viraram **assinatura paga** (Plus €3,99/mês) — fermentação completa atrás de paywall; traduções por IA assumidamente imprecisas ("AI Translations, may not be 100% accurate").
- **Fontes/referências:** só artigos próprios, sem bibliografia.
- **Idiomas:** vários, via tradução automática (inclui pt).
- **Monetização:** venda de fornos/panelas + assinatura Plus.

### 3.2 PizzaMaking.com Dough Tools (*)
- **URL:** https://www.pizzamaking.com/dough-tools.html
- **O que calcula:** família de calculadoras clássicas (Lehmann NY-style, deep dish, expandida com % de padeiro, gramas/onças, thickness factor).
- **Pontos fortes:** rigor técnico histórico (método Lehmann); comunidade/fórum gigante; calculadora expandida muito completa.
- **Pontos fracos:** interface antiga (ex-Flash, reconstruída); curva de aprendizado alta; inglês só; bloqueia fetch automatizado.
- **Fontes/referências:** metodologia atribuída a Tom Lehmann ("The Dough Doctor"), o mais próximo de "fonte citada" no nicho pizza.
- **Idiomas:** inglês. **Monetização:** fórum com ads discretos.

### 3.3 Fermentando Caos (BR)
- **URL:** https://fermentandocaos.com.br/calculadora-de-pizza/
- **O que calcula:** a partir da farinha (g): água, sal, fermento, nº de pizzas; permite dividir farinha branca/integral; lembrete de autólise.
- **Pontos fortes:** em pt-BR nativo; toque de UX simpático (lembrete de autólise); integrado a blog de fermentação.
- **Pontos fracos:** campo único de entrada (não calcula por nº de bolinhas/peso da bolinha); sem presets de estilo, sem unidades alternativas, sem compartilhamento, sem fontes.
- **Fontes/referências:** não. **Idiomas:** pt-BR. **Monetização:** nenhuma visível (newsletter).

### 3.4 Catarina Spices (BR)
- **URL:** https://catarinaspices.com.br/calculadora-de-massa-de-pizza/
- **O que calcula:** nº de pizzas, peso por pizza, hidratação, tipo de fermento (seco/fresco).
- **Pontos fortes:** entrada por nº de pizzas (modelo mental correto do usuário); ícones de ajuda contextual.
- **Pontos fracos:** utilitário raso, sem metodologia documentada, sem estilos, sem compartilhamento; existe para puxar tráfego para a loja de pimentas.
- **Fontes/referências:** não. **Idiomas:** pt-BR. **Monetização:** e-commerce próprio (kits R$ 14,90–119,90).

---

## 4. Concorrentes — Salmoura / Lactofermentação

### 4.1 Fermentcalc
- **URL:** https://fermentcalc.com/
- **O que calcula:** sal por peso de vegetal, salmoura por volume, referência de % de sal, ajuste de tempo por temperatura; 31 vegetais × 8 estilos de fermentação.
- **Pontos fortes:** **cita fontes explicitamente (NCHFP, FDA, USDA, Sandor Katz, Noma Guide, Joy of Pickling), com "última verificação" por página** — é o modelo do nosso diferencial já em prática; presets de peso (500g–4,5kg) e de % (1,8–3%); conversão automática entre tipos de sal (g ↔ colheres); promessa "sem anúncios até terminar o cálculo".
- **Pontos fracos:** inglês apenas; sem compartilhamento de resultado.
- **Idiomas:** inglês. **Monetização:** afiliados Amazon, discretos.
- **Observação estratégica:** é o benchmark nº 1 a estudar antes de construir nossa calculadora de salmoura.

### 4.2 My Fermented Foods — Brine Calculator
- **URL:** https://myfermentedfoods.com/tools/brine-calculator/
- **O que calcula:** sal necessário a partir de volume de água + % desejado (slider).
- **Pontos fortes:** simples e direto; unidades imperiais e métricas; tabela de % recomendado por vegetal (pepino 3,5–5%, azeitona 10%).
- **Pontos fracos:** só calcula na direção água→sal; sem método por peso total (vegetal + água), que é o correto para fermentação em pedaços; autora admite que recomendações vêm de "experiência pessoal".
- **Fontes/referências:** não. **Idiomas:** inglês. **Monetização:** afiliados Amazon.

### 4.3 Genuine Ideas — Salt Brine Calculator
- **URL:** https://genuineideas.com/ArticlesIndex/saltbrinecalculator.html
- **O que calcula:** 3 ferramentas — equilibrium brining (0,25–10%), gradient brining, estimador de tempo de cura por espessura/forma (foco em carnes, mas o método de equilíbrio é o mesmo da lactofermentação).
- **Pontos fortes:** rigor científico raro (criador: Greg Blonder, físico); **seleção de marca de sal** (6 opções — Morton's kosher, sal de mesa etc.) corrigindo densidade; explica o "porquê" de cada faixa de %.
- **Pontos fracos:** visual datado; foco em carne, não vegetais; sem bibliografia formal apesar do rigor.
- **Fontes/referências:** expertise do autor, sem citações formais. **Idiomas:** inglês. **Monetização:** nenhuma.

### 4.4 Omni Calculator — Brine Calculator
- **URL:** https://www.omnicalculator.com/food/brine
- **O que calcula:** concentração, sal ou volume de água (bidirecional) para fermentação de vegetais.
- **Pontos fortes:** presets por vegetal (repolho, couve-flor, pepino, pimenta...); modo custom; autoria com credenciais (PhD) + revisor nomeado.
- **Pontos fracos:** genérico; sem profundidade educacional de nicho; sem bibliografia visível.
- **Idiomas:** inglês + traduções do ecossistema. **Monetização:** modelo Omni (cross-links/ads).

### 4.5 MakeSauerkraut
- **URL:** https://www.makesauerkraut.com/weigh-your-cabbage-to-guarantee-a-perfect-ferment/
- **O que calcula:** **não tem calculadora interativa** — ensina o cálculo manual de 2% por pesagem, com exemplos (800 g repolho → 16 g sal).
- **Pontos fortes:** excelente conteúdo didático sobre o porquê do sal; autoridade no nicho chucrute.
- **Pontos fracos:** obriga o leitor a calcular na mão — lacuna evidente.
- **Fontes/referências:** experiência própria, sem citações. **Idiomas:** inglês. **Monetização:** pesada — afiliados Amazon (balanças), curso pago, livro, captura de e-mail.

*(FermentaHolics: a calculadora de salinidade não apareceu de forma proeminente nas buscas de 2026 — aparentemente perdeu relevância ou foi despriorizada; o espaço é hoje ocupado por Fermentcalc, brinecalculators.com, HakkoBako e Acre Tools.)*

---

## 5. Concorrentes — Massa fresca (pasta)

### 5.1 Miss Vickie — Pasta Dough Calculator
- **URL:** https://missvickie.com/pasta-dough-serving-calculator/ (+ variantes: pasta-flour-calculator, pasta-ingredient-calculator, fresh-pasta-flour-calculator)
- **O que calcula:** farinha, ovos, sal e azeite por nº de porções; tipo de massa (ovo, sêmola, integral, espinafre, tinta de lula); espessura (fina/grossa/recheada); métrico/imperial; botão de impressão.
- **Pontos fortes:** único player com calculadoras de pasta razoavelmente completas; presets de ocasião ("casal", "família").
- **Pontos fracos:** site é uma "farm" de calculadoras genéricas (tem 4 URLs quase idênticas competindo entre si); zero fontes; sem compartilhamento; monetização por afiliados dilui confiança.
- **Fontes/referências:** não (só tradição: "100 g de farinha : 1 ovo"). **Idiomas:** inglês. **Monetização:** Amazon Associates.

### 5.2 Handy Chefdom — Pasta Dough Calculator
- **URL:** https://handychefdom.com/pasta-dough-ratio-calculator/
- **O que calcula:** ingredientes por porções ou peso total; proporções farinha/ovo/água.
- **Pontos fortes/fracos:** similar à Miss Vickie, ainda mais raso; mesma categoria "farm".
- **Fontes:** não. **Idiomas:** inglês. **Monetização:** ads/afiliados.

**Em pt-BR não existe nenhuma calculadora de massa fresca** — as buscas retornam só receitas (TudoGostoso, blogs) repetindo a regra "1 ovo : 100 g de farinha" e reportagens sobre gramatura por pessoa. Nicho 100% vazio.

---

## 6. Cenário pt-BR — demais achados

### 6.1 Calculadora de Pão (BR)
- **URL:** https://www.calculadoradepao.com.br/
- **O que calcula:** hidratação final de pão de fermentação natural (farinha + água + levain).
- **Pontos fortes:** domínio exato de busca; explicações educativas decentes; receita completa (creditada a Emmanuel Hadjiandreou — rara atribuição de fonte no cenário BR).
- **Pontos fracos:** calcula **só hidratação** (não gera a receita a partir de %); sem presets, sem compartilhamento, sem unidades alternativas; projeto anônimo, aparentemente parado.
- **Idiomas:** pt-BR. **Monetização:** nenhuma.

### 6.2 Rustic BakerShop — Calculadora de Levain (BR)
- **URL:** https://www.rusticbakershop.com.br/pagina/calculadora-levain.html
- **O que calcula:** alimentação do levain — quantidade necessária, isca, proporções 1:1:1, 1:2:2, 1:2:3 ou custom.
- **Pontos fortes:** única calculadora de alimentação de levain em pt-BR encontrada; presets de proporção.
- **Pontos fracos:** escondida dentro de e-commerce de acessórios; UX básica; sem fontes.
- **Idiomas:** pt-BR. **Monetização:** loja (bannetons etc.).

### 6.3 Outros pontos do ecossistema pt-BR
- **Blogs educacionais sem ferramenta:** Massa Madre Blog (conversão de receita em %), Madre Pães Artesanais (fórmula de padeiro, alimentação de levain), Pão na Panela, Amo Pão Caseiro, 3 Talheres (proporções de levain), ABIP. Todos explicam o cálculo **manualmente** — público claramente existe e ninguém entrega a ferramenta.
- **Calculadoras de pizza acopladas a marcas de forno:** Casa Salvioni (https://casasalvioni.com.br/calculadora/), Fatto Academy (https://academy.fattoforno.com.br/calculadora) — utilitárias, a serviço da venda de fornos.
- **Stadler Made em pt:** presença traduzida por IA, sem localização real (vírgula decimal, farinhas brasileiras, fermento fresco em tablete etc.).
- **calcular.info:** página genérica de fórmula de hidratação de pizza, qualidade baixa.

---

## 7. Análise final

### (a) Lacunas de mercado que podemos ocupar

1. **Salmoura/lactofermentação em pt-BR: lacuna total.** Nenhuma calculadora nativa encontrada. Conteúdo pt existente (Substack Cebola na Manteiga, blogs de chucrute) prova demanda sem ferramenta. Ser o primeiro = dono do termo.
2. **Massa fresca: lacuna quase total nos dois idiomas.** Em pt-BR não existe nada; em EN só "farms" rasas. Uma calculadora séria (tipo de farinha 00/sêmola, ovo vs. água, porções por formato, perda no corte) seria inédita.
3. **Hub unificado:** ninguém junta pão + fermentação + pasta num site só com identidade própria. Concorrentes ou são mono-tema (FoodGeek, Fermentcalc) ou farms genéricas (Omni, Miss Vickie).
4. **Referências bibliográficas como diferencial validado:** só Fermentcalc faz isso (e só em salmoura, só em EN). Em pt-BR, ninguém. Citar NCHFP/USDA, Modernist Bread, Hamelman, McGee, Noma Guide, e fontes BR (ABIP, literatura técnica) nos dá autoridade E-E-A-T que nenhum concorrente pt tem.
5. **Localização real BR:** fermento fresco em tablete (muito usado no Brasil), farinhas nacionais e suas absorções, temperatura ambiente de clima quente (fermentação a 28–32 °C — os benchmarks gringos param em 22–25 °C), vírgula decimal, colheres brasileiras. Stadler/Flourwise traduzem, não localizam.
6. **Tabelas de bulk por temperatura interativas:** The Sourdough Journey tem os dados, mas em PDF. Ninguém oferece isso como calculadora — oportunidade nos dois idiomas.

### (b) Padrões de UX que valem copiar

- **Compartilhar receita por URL permanente** (FoodGeek, Stadler, BreadHydration) — substitui login e gera backlinks. Encaixa perfeitamente no nosso "sem login".
- **Estado no localStorage** (BreadHydration) — histórico e últimas receitas sem conta.
- **Presets nomeados por estilo/objetivo** (Stadler: 6 estilos de pizza; Flourwise: 6 receitas; Fermentcalc: botões de peso e %) — o usuário começa de algo pronto e ajusta.
- **Cálculo bidirecional** (Omni, Genuine Ideas): qualquer campo pode ser a entrada (quero X pães de Y g → ingredientes; tenho X g de farinha → rendimento).
- **Entrada pelo modelo mental do usuário** (Catarina Spices/Stadler): "quantas pizzas, de que peso" — não "quanta farinha".
- **Correção por tipo/marca de sal** (Genuine Ideas, Fermentcalc): densidades diferentes, conversão g ↔ colher.
- **Ajuste por temperatura e tempo de fermentação** (Stadler, Fermentcalc) — é o que separa calculadora "de nota" de ferramenta que devolve um plano.
- **Ícones de ajuda contextual + artigo educacional acoplado a cada calculadora** (FoodGeek, Stadler, calculadoradepao) — o par ferramenta + conteúdo é o motor de SEO de todos os líderes.
- **Slider para %** com faixa segura destacada (My Fermented Foods) e **tabela de % por vegetal** (Omni, My Fermented Foods).

### (c) Erros comuns a evitar

- **Ferramenta atrás de paywall** (Stadler Plus): mata o boca a boca; monetizar por conteúdo/afiliados discretos, nunca pela calculadora.
- **Tradução automática sem localização** (Stadler "AI translations"): pior que não ter o idioma — parecer gringo em pt afasta.
- **Salvar só no app** (Flourwise): fricção desnecessária; web-first.
- **PDF em vez de interativo** (The Sourdough Journey, MakeSauerkraut): autoridade sem produto.
- **Calculadora de direção única** (My Fermented Foods: só água→sal; Fermentando Caos: só farinha→resto).
- **Múltiplas URLs quase iguais canibalizando SEO** (Miss Vickie com 4 calculadoras de pasta): uma URL canônica por calculadora.
- **Utilitário raso sem metodologia** (Catarina Spices, calcular.info): sem explicar o cálculo, não gera confiança nem ranqueia.
- **Anonimato** (calculadoradepao.com.br): sem autor visível não há E-E-A-T; página "quem somos" e autoria importam.
- **Excesso de afiliados/captura de e-mail** (MakeSauerkraut): dilui credibilidade.
- **Interface datada/complexa demais** (PizzaMaking): rigor não pode custar usabilidade.

### (d) Oportunidades de SEO em pt-BR

Termos com demanda comprovada (blogs respondem a eles) e oferta de ferramenta fraca ou nula:

| Termo / cluster | Oferta atual | Oportunidade |
|---|---|---|
| calculadora salmoura / salmoura 2% / lactofermentação sal | **Nenhuma ferramenta pt-BR** | Máxima — primeiro a chegar |
| calculadora conserva / picles / chucrute / kimchi | Nenhuma | Máxima |
| calculadora massa fresca / massa caseira / quantidade de macarrão por pessoa | Nenhuma (só receitas) | Máxima |
| porcentagem de padeiro / fórmula de padeiro | Só artigos (Massa Madre, Madre Pães) | Alta — ferramenta + artigo |
| calculadora levain / alimentar levain / proporção 1:2:2 | 1 concorrente fraco (Rustic BakerShop) | Alta |
| hidratação de pão / calculadora de hidratação | calculadoradepao.com.br (fraco), Flourwise `/pt/` | Alta |
| conversão fermento biológico seco ↔ fresco ↔ levain | Stadler pt (tradução IA) | Alta — muito buscado no BR (fermento em tablete) |
| calculadora massa de pizza / pizza napolitana | Fermentando Caos, Catarina, Casa Salvioni (todos rasos) | Média-alta — vencível com presets por estilo + fermentação por temperatura |
| tempo de fermentação por temperatura (bulk) | Só PDFs em inglês | Alta, nos dois idiomas |
| Long-tails de receita reversa: "quanto de fermento para 500g de farinha", "quanto sal por litro de água conserva", "quantos ovos para 300g de farinha macarrão" | Respostas fragmentadas em blogs | Alta — cada calculadora deve ter seção de FAQ respondendo essas perguntas literalmente |

**Táticas:** uma URL canônica por calculadora + artigo educacional acoplado citando as fontes (E-E-A-T); URLs compartilháveis de receita (backlinks orgânicos em fóruns/grupos de Facebook/WhatsApp de panificação, que são enormes no BR); versão EN aproveita a lacuna de pasta e de bulk-por-temperatura; schema.org (FAQPage, HowTo) nas páginas.

---

## 8. Tabela-resumo

| # | Site | Tema | Interativo? | Fontes citadas? | pt? | Monetização |
|---|------|------|-------------|-----------------|-----|-------------|
| 1 | FoodGeek | Pão/levain | Sim | Não | Não | Ecossistema criador |
| 2 | Flourwise | Pão/pizza | Sim | Não | Sim (tradução) | App gratuito |
| 3 | BreadHydration | Pão/pizza | Sim | Não | Sim (tradução) | Afiliados + Ko-fi |
| 4 | The Sourdough Journey | Sourdough | Não (PDF) | Sim (dados próprios) | Não | Doações |
| 5 | King Arthur | Pão (educação) | Não | Autoridade própria | Não | E-commerce |
| 6 | Omni Calculator | Pão + salmoura | Sim | Revisores PhD | Parcial | Ads |
| 7 | Stadler Made | Pizza | Sim | Não | Sim (IA) | Fornos + assinatura |
| 8 | PizzaMaking.com | Pizza | Sim | Método Lehmann | Não | Ads fórum |
| 9 | Fermentando Caos | Pizza | Sim | Não | pt-BR nativo | Nenhuma |
| 10 | Catarina Spices | Pizza | Sim | Não | pt-BR nativo | Loja própria |
| 11 | Fermentcalc | Salmoura | Sim | **Sim (NCHFP/FDA/USDA/Katz)** | Não | Afiliados |
| 12 | My Fermented Foods | Salmoura | Sim | Não | Não | Afiliados |
| 13 | Genuine Ideas | Salmoura/cura | Sim | Rigor sem bibliografia | Não | Nenhuma |
| 14 | MakeSauerkraut | Fermentação | Não | Não | Não | Afiliados + curso |
| 15 | Miss Vickie / Handy Chefdom | Pasta | Sim | Não | Não | Afiliados |
| 16 | calculadoradepao.com.br | Pão | Sim | Parcial (1 autor) | pt-BR nativo | Nenhuma |
| 17 | Rustic BakerShop | Levain | Sim | Não | pt-BR nativo | Loja própria |

---

## Fontes da pesquisa

- https://foodgeek.io/en/bread-calculator/ · https://foodgeek.io/en/bakers-math-explained/ · https://foodgeek.io/en/starter-calculator/
- https://flourwise.com/calculator/ · https://flourwise.com/pt/tabela-hidratacao-pao/
- https://breadhydration.com/
- https://thesourdoughjourney.com/tools/
- https://www.kingarthurbaking.com/blog/2022/04/28/what-is-bakers-math-and-how-can-i-use-it-in-my-everyday-bread-baking
- https://breadtopia.com/faq/bakers-percentage/
- https://www.omnicalculator.com/food/bakers-percentage · https://www.omnicalculator.com/food/brine
- https://www.stadlermade.com/pizza-calculator/ · https://www.stadlermade.com/pt/calculadora-de-fermento/
- https://www.pizzamaking.com/dough-tools.html · https://www.pizzamaking.com/expanded-calculator.html
- https://fermentandocaos.com.br/calculadora-de-pizza/
- https://catarinaspices.com.br/calculadora-de-massa-de-pizza/
- https://fermentcalc.com/
- https://myfermentedfoods.com/tools/brine-calculator/
- https://genuineideas.com/ArticlesIndex/saltbrinecalculator.html
- https://www.makesauerkraut.com/weigh-your-cabbage-to-guarantee-a-perfect-ferment/
- https://missvickie.com/pasta-dough-serving-calculator/ · https://handychefdom.com/pasta-dough-ratio-calculator/
- https://www.calculadoradepao.com.br/
- https://www.rusticbakershop.com.br/pagina/calculadora-levain.html
- https://massamadreblog.com.br/know-how/info-tecnicas/conversao-de-medidas-culinarias-como-transformar-uma-receita-em-porcentagem/
- https://www.madrepaesartesanais.com.br/formula-de-padeiro/
- https://3talheres.com.br/calcular-proporcoes-de-levain/
- https://casasalvioni.com.br/calculadora/ · https://academy.fattoforno.com.br/calculadora
- https://cebolanamanteiga.substack.com/p/como-fermentar-tudo-na-salmoura
- https://hakkobako.com/fermentation-brine-calculator/ · https://acretools.com/fermentation-brine-calculator · https://brinecalculators.com/
