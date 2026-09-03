# PRD: Calculadoras Culinárias (calculadorasculinarias.com.br)

| Campo | Valor |
|-------|-------|
| **Autor** | Gabriel Baptista (gerado com Claude Code) |
| **Data** | 2026-09-03 |
| **Versão** | 1.0 |
| **Status** | Draft |

---

## 1. Visão Geral

Site gratuito de calculadoras de cozinha (calculadorasculinarias.com.br) que transforma as proporções dos principais livros de referência culinária em ferramentas interativas, precisas e em gramas. Diferencial central: **toda proporção e faixa exibida tem citação bibliográfica completa** (livro, autor, página/capítulo), e as divergências entre fontes viram conteúdo educativo em vez de serem escondidas. Lançamento incremental em pt-BR + EN, começando pela calculadora de pães, seguida de picles/fermentação e massa fresca; a calculadora de gelato existente será migrada para dentro do site em fase posterior.

## 2. Problema

### Estado Atual
- Receitas de pão, picles e massa fresca em livros e blogs usam quantidades fixas; adaptar para outra quantidade de farinha, outro pote ou outro número de pessoas exige regra de três manual e conhecimento das proporções corretas.
- As calculadoras existentes em pt-BR são rasas, anônimas, sem fontes e limitadas a pão/pizza; **não existe nenhuma calculadora de salmoura/lactofermentação nativa em pt-BR** e a de massa fresca é inexistente nos dois idiomas (ver `docs/research/concorrentes.md`).
- Nenhuma ferramenta do mercado (exceto uma, em EN, só de salmoura) cita as fontes dos números que usa — o usuário não tem como confiar nem aprender.
- As próprias fontes divergem entre si (ex.: hidratação de pão branco de 50% a 70%; % de sal sobre a água vs sobre o peso total), e o usuário não tem onde ver essas divergências explicadas.

### Estado Desejado
Um site rápido, bonito (paleta pastel) e bilíngue onde qualquer pessoa — do iniciante ao entusiasta — escolhe um preparo, informa a quantidade que tem (farinha, pote, pessoas) e recebe a receita completa em gramas, com faixas seguras sinalizadas, explicação de como o cálculo funciona e as referências bibliográficas de cada número. Uso efêmero, sem login; salvar/compartilhar/imprimir resolvem a persistência.

### Impacto de Não Fazer
A lacuna de mercado em pt-BR (salmoura, massa fresca, porcentagem de padeiro com fontes) continua aberta para outro player ocupar; o aprendizado do projeto da calculadora de gelato fica isolado num produto de nicho.

## 3. Objetivos

Projeto pessoal sem metas rígidas de negócio. KPIs leves apenas para acompanhamento:

| # | Objetivo | Resultado-chave | Alvo |
|---|----------|-----------------|------|
| O1 | Publicar valor cedo | Calculadora de pães no ar em produção | Marco M1 |
| O2 | Cobrir o escopo v1 | 3 calculadoras (pães, picles, massas) publicadas em pt-BR e EN | Marco M3 |
| O3 | Ser encontrado | Páginas indexadas e crescimento orgânico observável no analytics | Acompanhamento, sem meta numérica |
| O4 | Ser usado de verdade | Eventos de "cálculo concluído" e "compartilhar" registrados | Acompanhamento, sem meta numérica |

### Anti-Objetivos (fora de escopo explícito)
- Não é um site de receitas nem um blog editorial — o conteúdo educativo existe para servir as calculadoras.
- Não é ferramenta profissional de produção/custos (a precificação já ficou fora até da calculadora de gelato).
- Não haverá login, conta ou armazenamento server-side nesta versão.
- Não haverá conversão para xícaras/colheres: **tudo em gramas** (filosofia herdada da calculadora de gelato).

## 4. Público-Alvo

### Persona Primária: Cozinheiro(a) doméstico(a) curioso(a)
- **Quem é:** cozinha em casa, tem balança (ou está disposto a usar), quer acertar pão/picles/massa sem entender toda a teoria antes.
- **Objetivos:** receita confiável na quantidade exata que precisa; entender o básico do porquê.
- **Frustrações:** receitas que não escalam; termos técnicos sem explicação; medo de errar fermentação (segurança).
- **Proficiência técnica:** iniciante/intermediária em cozinha; qualquer nível em tecnologia.

### Persona Secundária: Entusiasta avançado(a)
- **Quem é:** já faz pão/fermentados com regularidade, pensa em porcentagem de padeiro, quer precisão e controle.
- **Objetivos:** modo livre para ajustar %; conversões (fermentos, levain); confiar nos números por causa das fontes.
- **Frustrações:** calculadoras rasas sem faixas nem fontes; ferramentas que impõem um único método.
- **Proficiência técnica:** intermediária/avançada.

**Tom do produto:** linguagem acessível para a persona primária, sem sacrificar a densidade técnica que a secundária precisa (progressive disclosure: o cálculo primeiro, a teoria expandível depois).

## 5. Escopo

### Dentro do escopo (v1)
- Calculadora de **Pães**: presets por tipo de pão, modo livre (porcentagem de padeiro), conversor de fermento, escala de receita existente.
- Calculadora de **Picles/Fermentação**: salmoura de lactofermentação, salga direta, picles de vinagre (quick pickles), com camada de segurança alimentar.
- Calculadora de **Massa fresca**: por porções, presets de tipos de massa, guia de formatos/espessura.
- Página de conteúdo educativo completa por calculadora (como funciona, metodologia, divergências entre fontes, glossário).
- Sistema de citações bibliográficas com links de afiliados dos livros.
- Transversais: salvar no navegador, compartilhar (texto + link com estado na URL), imprimir, PWA/offline.
- i18n pt-BR (raiz) + EN (`/en`) desde o lançamento.
- Analytics leve sem cookies; layout preparado para anúncios futuros (sem anúncios ativos).

### Fora do escopo (futuro)
- Migração da calculadora de gelato para o site (fase 2, quando o Gabriel passar os detalhes; até lá o produto atual segue à parte).
- Login/contas via Supabase (possibilidade futura registrada; nada no v1 pode inviabilizar).
- Anúncios ativos (AdSense) — apenas espaços reservados no layout.
- Outras calculadoras habilitadas pelo Ratio (ver ideias em `docs/research/ratio-ruhlman.md`, seção 4).
- Conversões de volume (xícaras/colheres), apps nativos, modo profissional de custos.

### Premissas
- Os dados extraídos dos livros em `docs/research/*.md` são a fonte de verdade numérica; qualquer correção é feita lá primeiro e propagada para o código.
- Vercel free tier e domínio já existente cobrem a infraestrutura por completo.
- O autor faz a revisão editorial das duas línguas (conteúdo EN não é tradução automática publicada sem revisão).

### Restrições
- Sem backend: tudo roda no navegador; build estático.
- Orçamento zero de infraestrutura (Vercel free, sem serviços pagos).
- A foto de quadro branco (`references/bread/`) é **apenas validação cruzada** — nunca aparece como fonte citada no site.
- Repositório: `git@github.com:biellz1221/calculadoras-culinarias.git`; nunca push direto na main; CI roda testes/lint em PR; deploy automático no merge na main.

## 6. Requisitos Funcionais

> Os valores numéricos citados abaixo são resumos; a fonte de verdade com citações completas está em `docs/research/paes.md`, `picles-fermentacao.md`, `massas.md` e `ratio-ruhlman.md`.

### Plataforma e conteúdo

### FR-001: Home com catálogo de calculadoras
- **Descrição:** Página inicial lista as calculadoras disponíveis (card por calculadora com nome, descrição de uma linha e status) e apresenta a proposta do site (proporções com fontes).
- **Regras de negócio:** calculadoras futuras (ex.: gelato) podem aparecer como "em breve" sem link; ordem editorial fixa.
- **Prioridade:** Must Have

### FR-002: Internacionalização pt-BR + EN
- **Descrição:** Todo o site existe em pt-BR (raiz, ex.: `/paes`) e EN (prefixo `/en`, ex.: `/en/bread`), com slugs traduzidos, seletor de idioma persistente e `hreflang` correto entre pares de página.
- **Regras de negócio:** pt-BR é o idioma canônico do domínio; nenhuma página publica em um idioma sem o par no outro; números formatados por locale (vírgula decimal em pt-BR).
- **Casos extremos:** rota EN inexistente → 404 localizada; conteúdo salvo/compartilhado carrega no idioma da URL de destino.
- **Prioridade:** Must Have

### FR-003: Sistema de citações bibliográficas
- **Descrição:** Componente reutilizável de citação: toda proporção, faixa e regra exibida nas calculadoras referencia sua fonte (livro, autor, página para PDF/físico ou capítulo/seção para epub). Cada calculadora tem uma seção "Fontes" listando as obras usadas, com link de afiliado para compra.
- **Regras de negócio:** citações parafraseiam, nunca reproduzem trechos extensos das obras; fontes oficiais de segurança (NCHFP/USDA) aparecem rotuladas como "fonte oficial complementar" (TD-004); links de afiliados com `rel="sponsored"` e aviso de afiliado visível.
- **Prioridade:** Must Have

### FR-004: Página educativa por calculadora
- **Descrição:** Cada calculadora vive numa página com: a ferramenta no topo; abaixo, seções "Como funciona o cálculo", "Metodologia e faixas", "Quando as fontes divergem" (tabela comparativa com a decisão editorial e o porquê — TD-003) e glossário dos termos daquele tema.
- **Regras de negócio:** conteúdo pré-renderizado (SEO); termos do glossário linkáveis por âncora e usados em tooltips dentro da calculadora.
- **Prioridade:** Must Have

### Calculadora de Pães

### FR-010: Presets por tipo de pão
- **Descrição:** Usuário escolhe o tipo de pão (catálogo inicial de ~15 presets extraídos das fontes: boule, baguete, pão francês, integral, centeio, focaccia, ciabatta com poolish, pizza napoletana, pizza caseira, pão de forma, hambúrguer, hot-dog, pão de leite, brioche, broa) e informa **ou** a farinha disponível **ou** o peso final desejado **ou** o número de unidades — a calculadora devolve a receita completa em gramas.
- **Regras de negócio:** presets definidos em porcentagem de padeiro (farinha = 100%); defaults conforme pesquisa (ex.: sal 2%, fermento seco instantâneo ≤ 1%, hidratação do pão branco 65% dentro da faixa 60–70%); cada preset exibe suas fontes.
- **Input:** tipo de pão + (g de farinha | g de massa final | nº de unidades × peso da unidade).
- **Output:** tabela de ingredientes em gramas (1 casa decimal), % de cada um, hidratação total, peso final.
- **Casos extremos:** quantidades ≤ 0 ou absurdas (ex.: > 25 kg de farinha) → validação com mensagem; arredondamento nunca quebra a soma exibida.
- **Prioridade:** Must Have

### FR-011: Modo livre (porcentagem de padeiro)
- **Descrição:** Usuário edita livremente as porcentagens (hidratação, sal, fermento, açúcar, gordura, ovos, leite, pré-fermento) partindo de um preset ou do zero; cada campo mostra a faixa recomendada e sinaliza abaixo/na faixa/acima (mesmo padrão visual da calculadora de gelato).
- **Regras de negócio:** faixas por ingrediente vêm da pesquisa consolidada; sair da faixa não bloqueia — sinaliza e explica a consequência (ex.: "acima de 2,2% de sal a fermentação desacelera"); pré-fermentos suportados: levain líquido (20–50% da farinha, 100% hidratação, com recálculo da hidratação efetiva da massa), poolish 1:1 e massa fermentada 15–30%.
- **Casos extremos:** hidratação efetiva recalculada ao mudar o pré-fermento; soma de líquidos de fontes múltiplas (leite + ovos + água) explicitada.
- **Prioridade:** Must Have

### FR-012: Conversor de fermento
- **Descrição:** Converte quantidades entre fermento fresco ↔ seco ativo ↔ seco instantâneo ↔ levain, nas duas direções.
- **Regras de negócio:** fatores da pesquisa: fresco→seco ativo ÷2; fresco→instantâneo ÷3 (a divergência aparente entre Kayser e Camargo é documentada na página educativa); conversão para levain inclui o ajuste de farinha/água da massa (levain 100% hidratação); exibe a relação fermento×tempo como orientação (metade do fermento ≈ dobro do tempo).
- **Input:** tipo de origem, quantidade em g, tipo de destino.
- **Output:** quantidade equivalente em g + ajustes de farinha/água quando levain + nota de tempo de fermentação.
- **Prioridade:** Must Have

### FR-013: Escalar receita existente
- **Descrição:** Usuário insere os ingredientes de uma receita própria (nome livre + gramas) e um alvo (nova farinha, novo peso total ou nº de unidades); a calculadora reescala tudo proporcionalmente e, se identificar farinha/água/sal, exibe as porcentagens de padeiro resultantes com as faixas sinalizadas.
- **Casos extremos:** receita sem farinha identificável → escala proporcional simples, sem análise de %; valores em ml aceitos como g para líquidos aquosos (nota explicativa).
- **Prioridade:** Should Have

### FR-014: Orientação fermento × tempo × temperatura
- **Descrição:** Dado o % de fermento, exibir estimativa orientativa de tempo de fermentação (ex.: 0,04% ≈ 5–8 h na napoletana) e a regra de temperatura de base (54–56 °C) para calcular a temperatura da água.
- **Prioridade:** Could Have

### Calculadora de Picles/Fermentação

### FR-020: Salmoura para lactofermentação
- **Descrição:** Usuário informa **ou** o peso total (vegetais + água) **ou** o volume do pote (com estimativa de proporção vegetal/água) e o % de sal desejado; devolve gramas de sal e, quando aplicável, gramas de água.
- **Regras de negócio:** default **2% sobre o peso total** (método Noma/Fermentação à Brasileira — TD-002); toggle "% sobre a água" (método Katz, ex.: pepinos 5%, malossol 3,5%) com explicação da diferença e citações; faixas seguras por preparo vêm da pesquisa; slider limitado a faixas seguras com aviso ao se aproximar do limite inferior.
- **Input:** modo (peso total | volume do pote), quantidades, % de sal (com default por preset de vegetal).
- **Output:** g de sal (0,1 g), g/ml de água, % efetivo nos dois métodos de cálculo (transparência), tempo/temperatura sugeridos.
- **Casos extremos:** % de sal abaixo do mínimo seguro do preparo → aviso destacado de segurança, não apenas sinalização de faixa.
- **Prioridade:** Must Have

### FR-021: Salga direta (chucrute/kimchi)
- **Descrição:** % de sal sobre o peso do vegetal para fermentações sem salmoura adicionada (default 2%, faixa 1,5–2%).
- **Input:** peso do vegetal em g, % de sal. **Output:** g de sal.
- **Prioridade:** Must Have

### FR-022: Picles de vinagre (quick pickles)
- **Descrição:** Calcula a solução de conserva a partir do volume do pote ou do peso de vegetais: proporção vinagre:água (default 1:1 com vinagre de acidez 5%, conforme Noma), sal e açúcar.
- **Regras de negócio:** validação de acidez mínima de equilíbrio com base em NCHFP/USDA (TD-004), rotulada como fonte oficial complementar; alerta claro distinguindo conserva de geladeira vs conserva de prateleira (banho-maria) — o site só calcula a de geladeira e explica o porquê.
- **Casos extremos:** usuário informa vinagre com acidez < 5% → recálculo da proporção mínima ou aviso de que a combinação não atinge acidez segura.
- **Prioridade:** Must Have

### FR-023: Camada de segurança alimentar
- **Descrição:** Seção fixa na página de picles: pH alvo (< 4,6), sinais de problema (mofos vs levedura Kahm), temperatura de fermentação em dois modos (rápido ~28 °C estilo Noma; lento 10–21 °C estilo Katz/BWF) e casos de risco real de botulismo (conservas não fermentadas), tudo citado.
- **Regras de negócio:** avisos de segurança nunca ficam atrás de interação (sempre visíveis no fluxo de resultado).
- **Prioridade:** Must Have

### Calculadora de Massa Fresca

### FR-030: Massa por número de porções
- **Descrição:** Usuário informa nº de pessoas e o contexto (prato principal ~100 g/pessoa | entrada ~85 g; faixa consolidada 85–115 g) — devolve farinha, ovos (unidades + gramas, com regra de ajuste para ovos fora do padrão ~60 g) e rendimento total.
- **Regras de negócio:** proporção base 100 g de farinha 00 por ovo (Zielonka, corroborada pela regra do Ratio de farinha = 1,5× o peso dos ovos); nº de ovos arredondado para inteiro com compensação em farinha; divergência com Hazan (volume + "teste do polegar") vira conteúdo educativo.
- **Casos extremos:** porções que resultam em frações de ovo → a calculadora sugere a combinação inteira mais próxima e mostra o ajuste de farinha.
- **Prioridade:** Must Have

### FR-031: Presets de tipos de massa
- **Descrição:** Presets com hidratações próprias: massa de ovo clássica, sêmola + água (~46%, vegana), massas coloridas (espinafre, beterraba, tinta de lula — com os ajustes de líquido/farinha quantificados na pesquisa) e variação rica em gemas.
- **Prioridade:** Must Have

### FR-032: Guia de formatos e espessuras
- **Descrição:** Conteúdo de referência interativo: formato (tagliatelle, ravioli, lasanha, chitarra…) → espessura de abertura (setting de máquina + mm aproximado), uso recomendado e observações; ligado aos presets ("fazer tagliatelle com esta massa").
- **Prioridade:** Should Have

### Funcionalidades transversais

### FR-040: Salvar no navegador
- **Descrição:** Salvar cálculos nomeados em localStorage (por calculadora, limite de 20, substitui por nome), listados como chips/lista para recarregar — mesmo modelo da calculadora de gelato.
- **Casos extremos:** localStorage indisponível (navegação privada) → funcionalidade oculta com aviso discreto.
- **Prioridade:** Must Have

### FR-041: Compartilhar
- **Descrição:** Duas formas: (a) **link** com o estado completo da calculadora serializado na URL (query/hash), que abre a página já preenchida; (b) **texto** formatado da receita via Web Share API (fallback: copiar).
- **Regras de negócio:** URL de compartilhamento não cria rota nova (evita duplicação de SEO — canonical sempre na página limpa); estado versionado para compatibilidade futura; texto compartilhado inclui os valores em gramas com precisão de pesagem e o link da calculadora.
- **Prioridade:** Must Have

### FR-042: Imprimir
- **Descrição:** CSS de impressão que esconde controles e imprime a receita calculada + avisos de segurança (no caso de picles) em uma página limpa.
- **Prioridade:** Should Have

### FR-043: PWA/offline
- **Descrição:** Manifest + service worker: o site funciona offline após a primeira visita e pode ser instalado; cálculos são todos client-side, então offline = funcionalidade completa.
- **Casos extremos:** atualização de versão → SW atualiza em background e avisa discretamente.
- **Prioridade:** Should Have

### FR-044: Analytics leve com eventos
- **Descrição:** Analytics sem cookies (Vercel Analytics ou Umami) com pageviews e eventos mínimos: `calculo_concluido` (por calculadora/modo), `compartilhar`, `salvar`, `imprimir`.
- **Regras de negócio:** zero dados pessoais; sem banner de consentimento (validar que a ferramenta escolhida dispensa).
- **Prioridade:** Should Have

### FR-045: Links de afiliados dos livros
- **Descrição:** Cada fonte citada linka para compra do livro (Amazon Associados BR; na versão EN, loja equivalente), com disclosure de afiliado.
- **Prioridade:** Should Have

### FR-046: Layout preparado para anúncios futuros
- **Descrição:** O grid das páginas reserva regiões onde anúncios poderiam entrar (fim do conteúdo, entre seções educativas) sem deslocar a calculadora; nenhum anúncio é servido no v1.
- **Regras de negócio:** anúncios jamais ocuparão espaço acima da calculadora nem interromperão o fluxo de cálculo (decisão registrada para a fase futura).
- **Prioridade:** Could Have

### Fase 2 (registrado, não implementar no v1)

### FR-050: Migração da calculadora de gelato
- **Descrição:** Portar a calculadora de gelato existente (React/Vite estático) para dentro do site como mais uma calculadora, mantendo paridade de funcionalidades e adicionando o sistema de citações. Detalhes serão fornecidos pelo Gabriel na fase 2.
- **Prioridade:** Won't Have (nesta versão)

## 7. Requisitos Não-Funcionais

### NFR-001: Performance
- **Requisito:** Site 100% estático; Lighthouse Performance ≥ 90 mobile; LCP < 2,5 s e CLS < 0,1 em 4G; cálculo reativo instantâneo (< 16 ms por recomputação, sem chamadas de rede).
- **Medição:** Lighthouse CI / PageSpeed Insights por página publicada.
- **Prioridade:** Must Have

### NFR-002: Acessibilidade
- **Requisito:** WCAG 2.1 AA: paleta pastel com contraste validado (mínimo 4,5:1 em texto), navegação completa por teclado, labels em todos os inputs, resultados anunciados via `aria-live`, HTML semântico.
- **Medição:** axe/Lighthouse a11y ≥ 95 + teste manual de teclado por calculadora.
- **Prioridade:** Must Have

### NFR-003: SEO técnico
- **Requisito:** Metadata por página e idioma, `hreflang` recíproco, sitemap, canonical (inclusive para URLs com estado compartilhado), JSON-LD (`WebApplication`/`FAQPage` onde couber), conteúdo educativo pré-renderizado.
- **Medição:** validação no Google Search Console após publicação; auditoria Lighthouse SEO ≥ 95.
- **Prioridade:** Must Have

### NFR-004: Privacidade
- **Requisito:** Nenhum cookie de rastreamento, nenhum dado pessoal coletado ou transmitido; receitas do usuário nunca saem do dispositivo (exceto quando ele compartilha ativamente); analytics agregado e sem fingerprinting.
- **Medição:** auditoria das requests de rede em produção.
- **Prioridade:** Must Have

### NFR-005: Qualidade de código e cálculo
- **Requisito:** TypeScript strict; motores de cálculo puros e isolados (`lib/`) com testes unitários cobrindo **todas** as fórmulas e faixas, usando as receitas dos livros como casos-verdade (mesmo padrão da calculadora de gelato, que valida contra a planilha); lint zero erros; CI em PR (testes + lint + typecheck + build) obrigatória antes de merge.
- **Medição:** `pnpm test && pnpm lint && pnpm typecheck && pnpm build` verdes na CI.
- **Prioridade:** Must Have

### NFR-006: Mobile-first
- **Requisito:** Todas as calculadoras totalmente utilizáveis em viewport de 360 px, com inputs numéricos adequados (`inputmode`), sem scroll horizontal; uso confortável com uma mão na cozinha.
- **Medição:** teste manual nos breakpoints + Playwright em viewport mobile.
- **Prioridade:** Must Have

### NFR-007: Precisão e arredondamento
- **Requisito:** Estado interno sempre em gramas (número puro); exibição com 1 casa decimal para ingredientes (0,1 g para sal em picles); regras de arredondamento centralizadas e testadas; nunca exibir soma que não bate com as parcelas mostradas.
- **Medição:** testes unitários de formatação/arredondamento.
- **Prioridade:** Must Have

## 8. Fluxos de Usuário

### Fluxo 1: Pão por preset (caminho feliz principal)
```
1. Usuário chega em /paes (via busca "calculadora de pão" ou home)
2. Escolhe preset "Pão francês" → campos aparecem com defaults
3. Informa "500 g de farinha" → receita completa aparece instantaneamente
   (água 325 g, sal 10 g, fermento 5 g…, hidratação 65%, fontes citadas)
4. Ajusta hidratação para 70% no modo livre → faixa sinaliza "no limite superior; massa mais úmida, típica de boule (Kayser, p. X)"
5. Compartilha o link no WhatsApp → destinatário abre a calculadora já preenchida
```

### Fluxo 2: Salmoura segura
```
1. Usuário em /picles seleciona "Salmoura (lactofermentação)" e o preset "Pepinos"
2. Informa pote de 1 L → calculadora estima água/vegetais e mostra o sal para 2% sobre o peso total
3. Ativa o toggle "% sobre a água (método Katz)" → valores recalculam, explicação da diferença aparece com citações
4. Tenta reduzir o sal abaixo do mínimo seguro → aviso de segurança destacado (não é só cor de faixa)
5. Imprime a receita com os avisos de segurança incluídos
```

### Fluxo 3: Massa para o jantar
```
1. Usuário em /en/pasta informa "4 pessoas, prato principal"
2. Recebe: 400 g farinha 00 + 4 ovos (~240 g), rendimento ~640 g (100 g/pessoa + massa perdida no corte)
3. Troca para "massa de espinafre" → líquidos e farinha se ajustam conforme o preset
4. Consulta o guia de formatos → tagliatelle, setting 7
5. Salva como "Jantar de sexta" no navegador
```

## 9. Considerações Técnicas

### Arquitetura
Next.js (App Router) com **build 100% estático** (TD-001): nenhuma API route, nenhum servidor. Todos os motores de cálculo são funções puras client-side em `lib/`, separadas por calculadora, com os dados (presets, faixas, fontes) em módulos TypeScript tipados — mesmo padrão validado na calculadora de gelato. Conteúdo educativo em MDX ou módulos de conteúdo por idioma, pré-renderizado.

### Stack
- Next.js 16 (App Router, output estático) + React 19 + TypeScript strict
- Tailwind CSS v4 (paleta pastel própria; tokens de design centralizados)
- i18n próprio, sem biblioteca: um root layout por idioma (route groups) mais um
  registro de rotas tipado. Decidido na implementação do M0 — as bibliotecas de
  i18n do Next resolvem idioma por middleware, que não existe em build estático;
  além disso os slugs são traduzidos por idioma, então o registro seria
  necessário de qualquer forma. Detalhes no README.
- Vitest (motores de cálculo) + Playwright (fluxos e2e principais + mobile)
- pnpm; Vercel (free) com deploy automático no push/merge na main; GitHub Actions `ci.yml` em PR (testes, lint, typecheck, build)
- PWA: manifest + service worker compatível com export estático

### Modelo de dados (client-side, sem banco)
- `Calculator` → `Preset[]` (valores em % ou proporção + `SourceRef[]`), `Range` por campo (min/max/default + `SourceRef[]` + nota de divergência quando houver)
- `SourceRef`: `{ obra, autor, edicao, localizador (página | capítulo/seção), tipoFonte: 'livro' | 'oficial', urlAfiliado? }`
- Estado compartilhável: serialização versionada e compacta na URL (`?s=v1...`)
- localStorage: `{ nome, calculadora, versaoEstado, payload, salvoEm }`

### Integrações
| Sistema | Tipo | Propósito | Direção |
|---------|------|-----------|---------|
| Vercel | Deploy/CDN | Hosting estático + deploy automático da main | Outbound |
| Vercel Analytics ou Umami | Script | Métricas sem cookies + eventos | Outbound |
| Amazon Associados | Links | Afiliados dos livros citados | Outbound |
| GitHub Actions | CI | Testes/lint/typecheck/build em PR | — |

### Estratégia de migração
Nada a migrar no v1 (site novo). A migração da calculadora de gelato (fase 2) reaproveitará os motores (`calc.ts`, `balance.ts`) e dados existentes, adaptando UI para o design system do site.

## 10. Decisões de Trade-off

### TD-001: Renderização — SSG puro
- **Contexto:** definir se o site precisa de servidor.
- **Decisão:** build estático puro, sem SSR nem API routes ("por enquanto", revisável se surgir caso de uso).
- **Alternativas:** híbrido com SSR/API routes.
- **Racional:** todo cálculo é client-side; custo zero, performance máxima, deploy trivial; futuro login via Supabase seria client-side de qualquer forma.

### TD-002: Sal na lactofermentação — % sobre peso total como default
- **Contexto:** Katz calcula sal sobre a água; Noma e Fermentação à Brasileira, sobre o peso total — divergência de método, não de valor.
- **Decisão:** default 2% sobre o peso total + toggle "% sobre a água (método Katz)".
- **Alternativas:** só peso total; só sobre a água.
- **Racional:** método mais reprodutível (BWF demonstra o erro do cálculo parcial, p. 199); o toggle mantém compatibilidade com as receitas do Katz e a diferença vira conteúdo educativo citado.

### TD-003: Divergência entre fontes — default único + faixa + conteúdo
- **Contexto:** fontes divergem em valores (ex.: hidratação do pão branco 50–70%).
- **Decisão:** cada campo tem um default editorial e uma faixa recomendada; a divergência é exibida em tooltip e na seção "Quando as fontes divergem", com todas as citações e o racional da escolha.
- **Alternativas:** seletor de "escola/fonte" por calculadora.
- **Racional:** UI simples para o público amplo; a divergência explicada é diferencial de conteúdo/SEO. Seletores só existem quando a divergência é de **método** (TD-002).

### TD-004: Fontes oficiais complementares para segurança
- **Contexto:** nenhum dos três livros fixa a acidez mínima segura de quick pickles.
- **Decisão:** usar NCHFP/USDA como fonte citada para regras de segurança, rotulada como "fonte oficial complementar".
- **Alternativas:** restringir-se aos livros.
- **Racional:** segurança alimentar não admite número sem fonte; é também o padrão do único concorrente que cita fontes.

### TD-005: i18n — pt-BR na raiz, EN em `/en`
- **Contexto:** site bilíngue em domínio .com.br.
- **Decisão:** pt-BR sem prefixo com slugs em português; EN sob `/en` com slugs em inglês.
- **Alternativas:** prefixo para ambos os idiomas.
- **Racional:** o público principal (e o sinal do domínio) é brasileiro; URLs limpas para ele, assimetria de roteamento é custo pequeno.

## 11. Dependências e Riscos

### Dependências
| Dependência | Dono | Status | Impacto se atrasar |
|-------------|------|--------|--------------------|
| Pesquisas em `docs/research/` | Concluído | ✅ | — |
| Conta Amazon Associados | Gabriel | Pendente | FR-045 entra sem link de afiliado (link simples) |
| Definição visual da paleta pastel | Gabriel + design | Pendente | Bloqueia o design system (Epic 1) |
| Detalhes da migração do gelato | Gabriel | Fase 2 | Sem impacto no v1 |

### Riscos
| Risco | Prob. | Impacto | Mitigação |
|-------|-------|---------|-----------|
| Erro numérico em faixa de segurança (picles) | Baixa | Alto | Dupla checagem contra NCHFP; testes com receitas dos livros como casos-verdade; avisos conservadores |
| Conteúdo EN de baixa qualidade por falta de revisão | Média | Médio | Publicar EN junto, mas com revisão editorial obrigatória antes do deploy de cada página |
| Direitos autorais das obras citadas | Baixa | Médio | Citações curtas e parafraseadas, proporções são fatos não protegidos; nunca reproduzir receitas na íntegra com texto do livro |
| Escopo do v1 grande para dev solo | Média | Médio | Lançamento incremental (pães primeiro); MoSCoW rígido nas stories |
| Estado na URL quebrar com evolução das calculadoras | Média | Baixo | Serialização versionada desde o início |

## 12. Métricas de Sucesso

Projeto pessoal — acompanhamento leve, sem metas numéricas rígidas.

| Métrica | Baseline | Alvo | Medição |
|---------|----------|------|---------|
| Páginas indexadas (pt + en) | 0 | Todas as publicadas | Search Console |
| Visitas orgânicas/mês | 0 | Tendência de crescimento | Analytics |
| Eventos `calculo_concluido`/mês | 0 | Tendência de crescimento | Analytics |
| Taxa de compartilhamento (share ÷ cálculos) | — | Observar | Analytics |

### Critérios de sucesso do lançamento (M1)
- [ ] Calculadora de pães completa (FR-010, FR-011, FR-012) em pt-BR e EN em produção
- [ ] Sistema de citações funcionando com as fontes reais da pesquisa
- [ ] Salvar + compartilhar + página educativa publicados
- [ ] CI verde, Lighthouse ≥ 90/95/95 (perf/a11y/SEO), domínio apontado

## 13. Cronograma e Marcos

Sem datas rígidas (projeto pessoal, ritmo incremental). Ordem de entrega:

| Marco | Descrição |
|-------|-----------|
| M0 | Fundação: repositório, Next.js estático, i18n, design system pastel, CI/CD, deploy no domínio |
| M1 | **Calculadora de Pães** no ar (presets + modo livre + conversor de fermento) + transversais core (salvar, compartilhar, imprimir) + página educativa |
| M2 | **Calculadora de Picles** no ar (salmoura + salga direta + quick pickles + segurança) |
| M3 | **Calculadora de Massas** no ar (porções + presets + guia de formatos) |
| M4 | Polimento: PWA, analytics com eventos, escalar receita (FR-013), afiliados |
| Fase 2 | Migração da calculadora de gelato; avaliação de login (Supabase) e anúncios |

## 14. Questões em Aberto

| # | Questão | Dono | Prazo | Resolução |
|---|---------|------|-------|-----------|
| Q1 | Ferramenta de analytics: Vercel Analytics ou Umami self-host? | Gabriel | Antes do M1 | — |
| Q2 | Identidade visual: paleta pastel definitiva e nome de exibição ("Calculadoras Culinárias"?) | Gabriel | Antes do M0 | — |
| Q3 | Conta Amazon Associados (BR e US para a versão EN) | Gabriel | Antes do M4 | — |
| Q4 | Verificar na fonte NCHFP/USDA os valores exatos de acidez mínima para quick pickles antes de codificar FR-022 | Dev (com pesquisa) | Antes do M2 | — |

---

## Histórico de Revisões

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 2026-09-03 | Gabriel + Claude Code | Rascunho inicial a partir da entrevista, pesquisas (`docs/research/`) e trade-offs resolvidos |
