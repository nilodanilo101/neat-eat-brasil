export const CURRENT_VERSION = '3.0.0';

export const RELEASE_NOTES = [
  {
    version: '3.0.0',
    date: '02/11/2026',
    title: 'NeatEat Brasil 3.0 — Nova Central de Entrada de Pratos, Planejador Otimizado & Extração Fiel de Receitas',
    summary:
      'O lançamento oficial da versão 3.0 eleva o NeatEat Brasil ao mais alto padrão gastronômico e de usabilidade! Apresentamos a Central Inteligente de Entrada de Pratos com cálculo nutricional laboratorial automatizado via TACO/TBCA, calibração dinâmica de custos por insumo, atalhos de despensa brasileira, novo layout do planejador semanal livre de ruído com 3 modos de visualização e extração web com 100% de etapas e fotografias reais!',
    items: [
      '🍳 Central Inteligente de Entrada de Pratos: criação e edição de fichas técnicas com cálculo nutricional automático oficial (TACO/Unicamp e TBCA/USP), calibração instantânea de custos por insumo com base no mercado e atalhos rápidos da cesta básica brasileira.',
      '👨‍🍳 Padrão Gastronômico Sem Passos Genéricos: substituição definitiva de passos resumidos por descrições completas e operacionais do chef em todas as receitas, sugestões diárias e importações via web.',
      '🌐 Extração Fiel de Receitas Web: novo motor de raspagem semântica estruturada (JSON-LD Schema.org e DOM inteligente) que captura todas as etapas originais (ex: 13 passos na Carne Louca) com fotos reais de alta definição.',
      '📅 Redesenho Completo do Planejador Semanal: redução drástica de carga cognitiva e eliminação de saturação de botões repetidos com Progressive Disclosure (menu de contexto discreto), títulos sem truncamento e 3 modos de visualização (Semana Completa, Matriz por Refeição e Visão Diária Detalhada).',
      '💵 Barra de Controle Semanal Balanceada: separação intuitiva entre Parâmetros da Casa (pessoas, preferências e orçamento) e Resumo Financeiro Consolidado com saldo restante em tempo real.',
      '🔒 Camada Reforçada de Segurança e Isolamento: proteção anti-SSRF com validação estrita de IP privado/loopback, cabeçalhos de segurança contra clique indevido e auditoria de integridade de dados.'
    ]
  },
  {
    version: '2.1.0',
    date: '02/11/2026',
    title: 'NeatEat Brasil 2.1 — 4 APIs Inteligentes, Perfil de Paladar & Match com a Geladeira',
    summary:
      'Uma grande atualização com inteligência artificial multimodal, banco aberto de alimentos com código de barras, fotos gastronômicas de estúdio e cálculo nutricional laboratorial brasileiro!',
    items: [
      '✨ Google Gemini 2.0 Flash: extração com IA de qualquer link de receita diretamente para ficha técnica completa, com tempos, porcionamento e passos.',
      '📦 Open Food Facts Brasil: consulta de marcas nacionais e códigos de barras (EAN-13), trazendo pesos líquidos reais, fotos de embalagens, Nutri-Score e grau de processamento (Classificação NOVA).',
      '📸 Unsplash Food API: fotografias gastronômicas profissionais em alta definição com iluminação de estúdio para pratos e etapas.',
      '🔬 Base Nutricional TACO (UNICAMP) & TBCA (USP): cálculo científico oficial de calorias, proteínas, carboidratos, gorduras e fibras para mais de 100 ingredientes e cortes brasileiros.',
      '🧊 Match Inteligente com a Geladeira: cálculo em tempo real da economia financeira ao usar o estoque de casa e quais insumos faltam comprar.',
      '⭐ Perfil de Paladar Ativo: aprendizado de padrões de aceitação e descarte, calculando a afinidade exata com seu estilo culinário.',
      '⚖️ Inteligência de Preços de Mercado: calibrador com multiplicadores de embalagem (ex: pacotes de 5kg, bandejas de 30 ovos) e conversor gastronômico de porções.'
    ]
  },
  {
    version: '2.0.0',
    date: '01/11/2026',
    title: 'NeatEat Brasil 2.0 — Modo Cozinha com Fotos, "Anote aí..." & Apple Liquid Glass',
    summary:
      'Uma grande revolução no NeatEat Brasil! Apresentamos a versão 2.0 com Modo Cozinha com fotos de marcos visuais (padrão Receiteria), bloco "Anote aí..." com dicas de ouro e conservação, ingredientes e passos organizados em seções, gaveta de ingredientes durante o preparo, nova arquitetura leve de memória em WebP e o novíssimo ícone nativo squircle para macOS.',
    items: [
      '📸 100% dos Pratos com Passo a Passo Ilustrado: Todas as 15 receitas cadastradas contam agora com fotos de alta definição em cada etapa do preparo (58 etapas ilustradas), com padrão estendido a qualquer nova receita cadastrada ou importada.',
      '📸 Modo Cozinha com Fotos Reais dos Passos: fotos em alta definição dos momentos culinários essenciais (ponto do refogado, textura do molho, montagem em camadas e gratinado) com suporte a zoom em tela cheia.',
      '📝 Seção "Anote aí...": dicas do Chef de variações, conservação e congelamento inteligente (❄️) para evitar desperdício, e segredos do ponto exato (🔥).',
      '🍳 Ingredientes e Passos Modularizados por Seção: receitas divididas em etapas lógicas (ex: refogado, molho, montagem e forno) facilitando o acompanhamento.',
      '📋 Gaveta Rápida de Ingredientes: consulte e marque insumos a qualquer momento dentro do Modo Cozinhar sem perder o passo nem pausar o cronômetro.',
      '⚡ Arquitetura Leve de Memória (WebP + LRU): fotos convertidas em WebP ultraleve com descarte de texturas na GPU/RAM e cache rotativo estrito de 30 MB.',
      '🥘 Nova Receita Oficial de Referência: Arroz de Forno com Carne Moída completa, com 20 ingredientes e 12 passos ilustrados.',
      '🖥️ Novo Ícone Nativo macOS: ícone squircle verde e dourado com transparência perfeita no Dock e no Finder.',
      '🔁 Repetir Refeição / Marmita no Planejador e Modo Mercado na Lista de Compras.',
      '🔒 Screen Wake Lock e Atalhos de Teclado no preparo (Espaço para timer, setas para passos, Esc para fechar).'
    ]
  },
  {
    version: '1.0.10',
    date: '01/11/2026',
    title: 'Visual Apple Liquid Glass',
    summary:
      'Novo layout inspirado no estilo visual Apple Liquid Glass, com superfícies translúcidas refrativas, bordas especulares iluminadas e barra de navegação em cápsula flutuante.',
    items: [
      '✨ Efeito Apple Liquid Glass: cartões, painéis, cabeçalho e modais com vidro líquido translúcido, desfoque profundo (backdrop blur) e reflexos especulares nas bordas.',
      '💊 Navegação em Cápsula Estilo Apple: abas redesenhadas em pílula flutuante de vidro líquido, adaptadas tanto para o Modo Claro quanto para o Modo Escuro.'
    ]
  },
  {
    version: '1.0.9',
    date: '01/11/2026',
    title: 'Novidades da Versão — Modo Cozinhar Guiado (Play) & Emojis de Ingredientes',
    summary:
      'Agora você pode clicar em "Cozinhar" (▶ Play) em qualquer receita para abrir o acompanhamento passo a passo com cronômetro inteligente, além de contar com emojis automáticos para os ingredientes em todo o app.',
    items: [
      '▶️ Novo Modo Cozinhar Passo a Passo: acompanhe desde o Mise en Place (com ajuste dinâmico de porções e checklist de insumos) até cada etapa do preparo e empratamento final.',
      '⏱️ Cronômetro Inteligente Integrado: detecta automaticamente os tempos citados em cada passo da receita e emite alerta sonoro ao finalizar.',
      '🥕 Emojis de Ingredientes: identificação visual rápida de carnes, hortifruti, grãos, laticínios e temperos na Lista de Compras, Geladeira, Catálogo, Descoberta de Pratos e Ficha Técnica.'
    ]
  }
];
