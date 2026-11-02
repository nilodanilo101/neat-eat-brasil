// ============================================================================
// INTEGRAÇÃO COM A API DO GOOGLE GEMINI (GEMINI 2.0 FLASH / 1.5 FLASH)
// Extração multimodal e estruturada de Fichas Técnicas em JSON estrito
// ============================================================================

export async function parseRecipeWithGemini(pageHtml, recipeUrl, apiKey = process.env.GEMINI_API_KEY) {
  if (!apiKey || !apiKey.trim()) {
    return null; // Fallback para parser interno
  }

  // Preserva blocos JSON-LD de receita (Schema.org) que contêm HowToStep e ingredientes precisos
  const jsonLdBlocks = (pageHtml.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [])
    .slice(0, 3)
    .join('\n');

  // Limita o HTML aos primeiros 50.000 caracteres para economia de tokens
  const snippet = pageHtml
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 45000);

  const prompt = `Você é um chef executivo e nutricionista sênior brasileiro especialista em fichas técnicas gastronômicas.
Analise a página da receita abaixo (URL: ${recipeUrl}) e extraia uma Ficha Técnica Culinária Completa e Profissional.

ATENÇÃO MÁXIMA E OBRIGATÓRIA PARA OS PASSOS DA RECEITA:
- JAMAIS resuma, sintetize ou reduza o modo de preparo em 3 passos genéricos ("separar", "cozinhar", "servir").
- Extraia TODOS os passos individuais originais detalhados da receita do site (se a receita tiver 6, 8, 10, 13 ou mais etapas, extraia rigorosamente todas elas).
- Cada passo deve descrever a técnica culinária, o tempo, a temperatura, o ponto visual do insumo e o cuidado necessário.

Retorne OBRIGATORIAMENTE um JSON estrito conforme o schema:
{
  "title": "Nome convidativo e preciso do prato",
  "category": "Café da Manhã" | "Almoço" | "Jantar",
  "prepTime": número de minutos (ex: 25),
  "servings": número de porções (ex: 2),
  "portionWeight": "ex: 350g por porção",
  "calories": calorias por porção em kcal (número),
  "protein": proteínas por porção em g (número),
  "carbs": carboidratos por porção em g (número),
  "fat": gorduras por porção em g (número),
  "tags": ["ex: Alta Proteína", "Rápido", "Sem Glúten", "Econômico", etc],
  "platingInstructions": "Instruções profissionais de empratamento e montagem visual do prato",
  "specificInstructions": "Instruções de segurança alimentar, mise en place e conservação",
  "ingredients": [
    {
      "name": "Nome canônico do ingrediente no Brasil (ex: Peito de frango, Arroz branco)",
      "amount": número com a quantidade (ex: 300),
      "unit": "g" | "ml" | "un" | "colher de sopa" | "xícara",
      "aisle": "Açougue" | "Laticínios e Ovos" | "Hortifruti" | "Mercearia" | "Temperos" | "Padaria"
    }
  ],
  "steps": [
    "Instrução passo 1 detalhada com técnica e ponto...",
    "Instrução passo 2 com fogo, tempo e textura...",
    "Instrução passo 3..."
  ]
}

${jsonLdBlocks ? `DADOS ESTRUTURADOS (JSON-LD) ENCONTRADOS NA PÁGINA:\n${jsonLdBlocks.slice(0, 15000)}\n` : ''}

Conteúdo textual da página:
${snippet}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 14000);

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey.trim()}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.1,
        },
      }),
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const parsed = JSON.parse(rawText);
        if (parsed.title && Array.isArray(parsed.ingredients) && parsed.ingredients.length > 0) {
          return parsed;
        }
      }
    } else {
      const errText = await res.text();
      console.warn('Gemini API retornou erro status', res.status, errText);
    }
  } catch (err) {
    console.warn('Erro ao chamar Gemini API:', err.message);
  }

  return null;
}
