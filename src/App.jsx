import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  ShoppingCart,
  Refrigerator,
  BookOpen,
  Sparkles,
  Users,
  Wallet,
  Check,
  Plus,
  Clock,
  Flame,
  Search,
  Filter,
  Copy,
  UserCheck,
  ArrowRightLeft,
  X,
  Link2,
  CheckCircle2,
  AlertTriangle,
  Pencil,
  Trash2,
  Scale,
  Utensils,
  FileText,
  Image as ImageIcon,
  Upload,
  Heart,
  RotateCcw,
  Eye,
  Moon,
  Sun,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Timer,
} from 'lucide-react';

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const SLOTS = ['Café da Manhã', 'Almoço', 'Jantar'];
const AISLES = [
  'Açougue',
  'Hortifruti',
  'Laticínios e Ovos',
  'Mercearia',
  'Padaria',
  'Peixaria',
  'Temperos',
];
const DIETARY_OPTIONS = [
  'Todas',
  'Econômico',
  'Alta Proteína',
  'Vegetariano',
  'Low Carb',
  'Sem Glúten',
  'Sem Lactose',
  'Rápido',
];

const QUICK_FRIDGE_SUGGESTIONS = [
  { name: 'Ovo', category: 'Laticínios e Ovos' },
  { name: 'Arroz branco', category: 'Mercearia' },
  { name: 'Feijão carioca cozido', category: 'Mercearia' },
  { name: 'Peito de frango', category: 'Açougue' },
  { name: 'Alho', category: 'Hortifruti' },
  { name: 'Cebola', category: 'Hortifruti' },
  { name: 'Tomate', category: 'Hortifruti' },
  { name: 'Azeite de oliva', category: 'Mercearia' },
  { name: 'Batata inglesa', category: 'Hortifruti' },
  { name: 'Queijo muçarela', category: 'Laticínios e Ovos' },
  { name: 'Banana nanica', category: 'Hortifruti' },
  { name: 'Aveia em flocos', category: 'Mercearia' },
  { name: 'Goma de tapioca', category: 'Mercearia' },
  { name: 'Carne moída (patinho ou acém)', category: 'Açougue' },
];

function formatBRL(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function getIngredientEmoji(name = '', aisle = '') {
  const n = String(name).toLowerCase();
  if (n.includes('ovo')) return '🥚';
  if (n.includes('frango')) return '🍗';
  if (n.includes('linguiça') || n.includes('calabresa') || n.includes('bacon') || n.includes('fiambre')) return '🥓';
  if (n.includes('carne') || n.includes('patinho') || n.includes('acém') || n.includes('bife')) return '🥩';
  if (n.includes('tilápia') || n.includes('peixe') || n.includes('salmão') || n.includes('atum') || n.includes('camarão')) return '🐟';
  if (n.includes('queijo') || n.includes('muçarela') || n.includes('coalho') || n.includes('parmesão') || n.includes('requeijão') || n.includes('ricota')) return '🧀';
  if (n.includes('manteiga')) return '🧈';
  if (n.includes('coco')) return '🥥';
  if (n.includes('leite') || n.includes('iogurte') || n.includes('creme de leite')) return '🥛';
  if (n.includes('tomate') || n.includes('molho')) return '🍅';
  if (n.includes('cebola')) return '🧅';
  if (n.includes('alho-poró') || n.includes('alho poro')) return '🥬';
  if (n.includes('alho')) return '🧄';
  if (n.includes('batata-doce') || n.includes('batata doce')) return '🍠';
  if (n.includes('batata') || n.includes('mandioca') || n.includes('mandioquinha')) return '🥔';
  if (n.includes('cenoura')) return '🥕';
  if (n.includes('brócolis') || n.includes('brocolis')) return '🥦';
  if (n.includes('abobrinha') || n.includes('chuchu') || n.includes('pepino')) return '🥒';
  if (n.includes('abóbora') || n.includes('abobora') || n.includes('cabotiá')) return '🎃';
  if (n.includes('pimentão') || n.includes('pimenta')) return '🫑';
  if (
    n.includes('couve') ||
    n.includes('alface') ||
    n.includes('espinafre') ||
    n.includes('cheiro-verde') ||
    n.includes('coentro') ||
    n.includes('salsinha') ||
    n.includes('manjericão') ||
    n.includes('hortelã')
  )
    return '🥬';
  if (n.includes('abacate')) return '🥑';
  if (n.includes('banana')) return '🍌';
  if (n.includes('limão') || n.includes('limao')) return '🍋';
  if (n.includes('shitake') || n.includes('cogumelo') || n.includes('champignon')) return '🍄';
  if (n.includes('arroz')) return '🍚';
  if (n.includes('feijão') || n.includes('feijao') || n.includes('grão-de-bico') || n.includes('lentilha')) return '🫘';
  if (n.includes('macarrão') || n.includes('espaguete') || n.includes('penne') || n.includes('lasanha')) return '🍝';
  if (n.includes('wrap') || n.includes('pão folha')) return '🌯';
  if (n.includes('pão') || n.includes('torrada') || n.includes('crouton')) return '🍞';
  if (
    n.includes('aveia') ||
    n.includes('farinha') ||
    n.includes('polvilho') ||
    n.includes('tapioca') ||
    n.includes('flocão') ||
    n.includes('cuscuz')
  )
    return '🌾';
  if (n.includes('azeite') || n.includes('óleo')) return '🫒';
  if (n.includes('amendoim') || n.includes('castanha') || n.includes('nozes')) return '🥜';
  if (n.includes('cacau') || n.includes('chocolate')) return '🍫';
  if (n.includes('mel')) return '🍯';
  if (n.includes('gengibre')) return '🫚';
  if (
    n.includes('sal') ||
    n.includes('orégano') ||
    n.includes('canela') ||
    n.includes('açafrão') ||
    n.includes('cúrcuma') ||
    n.includes('shoyu') ||
    n.includes('tempero')
  )
    return '🧂';

  if (aisle === 'Açougue') return '🥩';
  if (aisle === 'Peixaria') return '🐟';
  if (aisle === 'Laticínios e Ovos') return '🧀';
  if (aisle === 'Hortifruti') return '🥗';
  if (aisle === 'Padaria') return '🥖';
  if (aisle === 'Temperos') return '🧂';
  return '🥣';
}

function extractStepSeconds(stepText = '') {
  const text = String(stepText).toLowerCase();
  const minMatch = text.match(/(\d+)\s*(?:minuto|minutos|min\b)/);
  const secMatch = text.match(/(\d+)\s*(?:segundo|segundos|seg\b|s\b)/);
  let total = 0;
  if (minMatch) total += Number(minMatch[1]) * 60;
  if (secMatch) total += Number(secMatch[1]);
  return total > 0 ? total : 0;
}

function formatTimerMMSS(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mins = String(Math.floor(s / 60)).padStart(2, '0');
  const secs = String(s % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

function playTimerChime() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.16);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.16 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.16);
      osc.stop(ctx.currentTime + idx * 0.16 + 0.36);
    });
  } catch {
    // Ignore audio errors
  }
}

function createEmptyFichaTecnica() {
  return {
    id: null,
    title: '',
    category: 'Almoço',
    prepTime: 25,
    servings: 2,
    calories: 450,
    protein: 32,
    carbs: 45,
    fat: 14,
    tags: ['Econômico'],
    image: '',
    source: 'Ficha Técnica de Restaurante',
    portionWeight: '380g por porção',
    platingInstructions:
      'Dispor a proteína principal às 6h do prato raso aquecido, guarnição às 10h e acompanhamento às 2h. Finalizar com ervas frescas picadas e fio de azeite.',
    specificInstructions:
      'Respeitar rigorosamente as gramaturas do mise en place. Manter insumos refrigerados a 4°C até o preparo.',
    ingredients: [
      { name: 'Peito de frango', amount: 300, unit: 'g', aisle: 'Açougue', basePrice: 6.90 },
      { name: 'Arroz branco', amount: 150, unit: 'g', aisle: 'Mercearia', basePrice: 1.20 },
    ],
    stepsText:
      'Realize o mise en place pesando e higienizando todos os insumos.\nTempere e grelhe o insumo principal até atingir 74°C no centro.\nPrepare os acompanhamentos e realize a montagem conforme padrão da ficha técnica.',
  };
}

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('planner');
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('neateat_theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      localStorage.setItem('neateat_theme', darkMode ? 'dark' : 'light');
    } catch {
      // Ignore storage error
    }
  }, [darkMode]);

  // Local UI controls
  const [budgetDraft, setBudgetDraft] = useState(250);
  const [selectedRecipeModal, setSelectedRecipeModal] = useState(null);
  const [swapSlotTarget, setSwapSlotTarget] = useState(null); // { day, slot }
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [changelogModalOpen, setChangelogModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Ficha Técnica Editor Modal state
  const [recipeFormModal, setRecipeFormModal] = useState(null);
  const [savingRecipe, setSavingRecipe] = useState(false);
  const [searchingPhotos, setSearchingPhotos] = useState(false);
  const [candidatePhotos, setCandidatePhotos] = useState([]);

  // Guided Step-by-Step Cooking Mode state (Botão Play)
  const [cookingSession, setCookingSession] = useState(null);

  useEffect(() => {
    if (!cookingSession?.timerRunning) return;
    const interval = setInterval(() => {
      setCookingSession((prev) => {
        if (!prev || !prev.timerRunning) return prev;
        if (prev.timerSeconds <= 1) {
          playTimerChime();
          return {
            ...prev,
            timerSeconds: 0,
            timerRunning: false,
            timerFinished: true,
          };
        }
        return {
          ...prev,
          timerSeconds: prev.timerSeconds - 1,
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cookingSession?.timerRunning]);

  function openCookingMode(recipe, e) {
    if (e) e.stopPropagation();
    if (!recipe) return;
    setSelectedRecipeModal(null);
    setCookingSession({
      recipe,
      stepIndex: 0, // 0 = Mise en Place (Ingredientes), 1..N = Etapas do preparo, N+1 = Montagem e Finalização
      checkedIngredients: {},
      completedSteps: {},
      scaleServings: recipe.servings || 2,
      timerSeconds: 0,
      timerRunning: false,
      timerFinished: false,
    });
  }

  // Recipe catalog filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [tagFilter, setTagFilter] = useState('Todas');
  const [maxPricePerServing, setMaxPricePerServing] = useState(35);

  // Suggestions (Descoberta de Pratos) tab state
  const [suggestionCatFilter, setSuggestionCatFilter] = useState('Todas');
  const [suggestionSearch, setSuggestionSearch] = useState('');
  const [swapSearch, setSwapSearch] = useState('');
  const [dragState, setDragState] = useState({
    isDragging: false,
    startX: 0,
    startY: 0,
    dx: 0,
    dy: 0,
  });
  const [swipeAnim, setSwipeAnim] = useState(null); // 'left' | 'right' | null
  const [swipeFeedback, setSwipeFeedback] = useState(null);

  // AI Import & Fridge state
  const [importInput, setImportInput] = useState('');
  const [importCategory, setImportCategory] = useState('Almoço');
  const [importing, setImporting] = useState(false);
  const [newFridgeItem, setNewFridgeItem] = useState('');

  // Auth form state
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authCode, setAuthCode] = useState('');

  async function fetchState() {
    try {
      const res = await fetch('/api/state');
      const json = await res.json();
      setData(json);
      setBudgetDraft(json.user.weekly_budget);
      setAuthName(json.user.name);
      setAuthEmail(json.user.email);
      setAuthCode(json.user.household_code);
      if (json.currentVersion && json.user.last_seen_version !== json.currentVersion) {
        setChangelogModalOpen(true);
      }
    } catch (err) {
      console.error('Erro ao carregar estado:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchState();
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setSelectedRecipeModal(null);
        setRecipeFormModal(null);
        setSwapSlotTarget(null);
        setAuthModalOpen(false);
        setCookingSession(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  async function updateProfile(patch) {
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const json = await res.json();
    setData(json);
  }

  async function handleGenerateSmartPlan() {
    setLoading(true);
    const res = await fetch('/api/plan/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        weekly_budget: Number(budgetDraft),
        dietary_filter: data.user.dietary_filter,
        household_size: data.user.household_size,
      }),
    });
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  async function handleSwapSlotRecipe(recipeId) {
    if (!swapSlotTarget) return;
    const res = await fetch('/api/plan/slot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        day: swapSlotTarget.day,
        slot: swapSlotTarget.slot,
        recipe_id: recipeId,
      }),
    });
    const json = await res.json();
    setData(json);
    setSwapSlotTarget(null);
  }

  async function handleToggleFridgeItem(name, category = 'Mercearia') {
    const res = await fetch('/api/fridge/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category }),
    });
    const json = await res.json();
    setData(json);
  }

  async function handleToggleShoppingCheck(itemKey) {
    const res = await fetch('/api/shopping/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemKey }),
    });
    const json = await res.json();
    setData(json);
  }

  async function handleImportRecipe(e) {
    e.preventDefault();
    if (!importInput.trim()) return;
    setImporting(true);
    try {
      const res = await fetch('/api/recipes/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: importInput, category: importCategory }),
      });
      const json = await res.json();
      setData(json);
      setImportInput('');
    } finally {
      setImporting(false);
    }
  }

  function openNewRecipeModal() {
    setCandidatePhotos([]);
    setRecipeFormModal(createEmptyFichaTecnica());
  }

  function openEditRecipeModal(recipe, e) {
    if (e) e.stopPropagation();
    setCandidatePhotos([]);
    setSelectedRecipeModal(null);
    setRecipeFormModal({
      id: recipe.id,
      title: recipe.title,
      category: recipe.category,
      prepTime: recipe.prepTime,
      servings: recipe.servings,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      tags: Array.isArray(recipe.tags) ? [...recipe.tags] : ['Econômico'],
      image: recipe.image || '',
      source: recipe.source || 'Ficha Técnica de Restaurante',
      portionWeight: recipe.portionWeight || '350g por porção',
      platingInstructions: recipe.platingInstructions || '',
      specificInstructions: recipe.specificInstructions || '',
      ingredients: recipe.ingredients.map((i) => ({ ...i })),
      stepsText: (recipe.steps || []).join('\n'),
    });
  }

  async function handleDeleteRecipe(recipe, e) {
    if (e) e.stopPropagation();
    const ok = window.confirm(
      `Tem certeza que deseja excluir a receita "${recipe.title}" do catálogo?`
    );
    if (!ok) return;
    const res = await fetch(`/api/recipes/${recipe.id}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    setData(json);
    if (selectedRecipeModal?.id === recipe.id) {
      setSelectedRecipeModal(null);
    }
  }

  async function handleSearchExactDishPhotos() {
    if (!recipeFormModal?.title?.trim()) return;
    setSearchingPhotos(true);
    try {
      const ingNames = (recipeFormModal.ingredients || [])
        .slice(0, 3)
        .map((i) => i.name)
        .join(' ');
      const q = `${recipeFormModal.title} ${ingNames}`.trim();
      const res = await fetch(`/api/recipes/search-image?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (json.images && json.images.length > 0) {
        setCandidatePhotos(json.images);
        setRecipeFormModal((prev) => ({ ...prev, image: json.images[0] }));
      }
    } finally {
      setSearchingPhotos(false);
    }
  }

  function handleUploadLocalImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setRecipeFormModal((prev) => ({ ...prev, image: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSaveFichaTecnica(e) {
    e.preventDefault();
    if (!recipeFormModal.title.trim()) return;
    setSavingRecipe(true);
    try {
      const payload = {
        title: recipeFormModal.title.trim(),
        category: recipeFormModal.category,
        prepTime: Number(recipeFormModal.prepTime) || 20,
        servings: Math.max(1, Number(recipeFormModal.servings) || 1),
        calories: Number(recipeFormModal.calories) || 0,
        protein: Number(recipeFormModal.protein) || 0,
        carbs: Number(recipeFormModal.carbs) || 0,
        fat: Number(recipeFormModal.fat) || 0,
        tags: recipeFormModal.tags,
        image: recipeFormModal.image.trim(),
        source: recipeFormModal.source || 'Ficha Técnica de Restaurante',
        portionWeight: recipeFormModal.portionWeight.trim(),
        platingInstructions: recipeFormModal.platingInstructions.trim(),
        specificInstructions: recipeFormModal.specificInstructions.trim(),
        ingredients: recipeFormModal.ingredients.filter((i) => i.name.trim()),
        steps: recipeFormModal.stepsText
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const isEdit = Boolean(recipeFormModal.id);
      const url = isEdit ? `/api/recipes/${recipeFormModal.id}` : '/api/recipes';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      setData(json);
      setRecipeFormModal(null);
    } finally {
      setSavingRecipe(false);
    }
  }

  async function handleSaveAccount(e) {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: authName,
        email: authEmail,
        household_code: authCode,
      }),
    });
    const json = await res.json();
    setData(json);
    setAuthModalOpen(false);
  }

  async function handleDismissChangelog() {
    setChangelogModalOpen(false);
    try {
      const res = await fetch('/api/changelog/seen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version: data?.currentVersion }),
      });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Erro ao salvar versão vista:', err);
    }
  }

  async function handleSwipeSuggestion(suggestion, direction) {
    if (!suggestion || swipeAnim) return;
    setSwipeAnim(direction);
    setDragState({ isDragging: false, startX: 0, startY: 0, dx: 0, dy: 0 });
    if (selectedRecipeModal?.id === suggestion.id) {
      setSelectedRecipeModal(null);
    }

    setTimeout(async () => {
      try {
        const res = await fetch('/api/suggestions/swipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ suggestion, direction }),
        });
        const json = await res.json();
        setData(json);
        setSwipeFeedback({
          direction,
          title: suggestion.title,
        });
        setTimeout(() => setSwipeFeedback(null), 3200);
      } finally {
        setSwipeAnim(null);
      }
    }, 240);
  }

  async function handleUndoLastSwipe() {
    const res = await fetch('/api/suggestions/undo', {
      method: 'POST',
    });
    const json = await res.json();
    setData(json);
    setSwipeFeedback({
      direction: 'undo',
      title: 'Última escolha desfeita!',
    });
    setTimeout(() => setSwipeFeedback(null), 2500);
  }

  async function handleResetDismissedSuggestions() {
    const res = await fetch('/api/suggestions/reset-dismissed', {
      method: 'POST',
    });
    const json = await res.json();
    setData(json);
  }

  const recipeMap = useMemo(() => {
    if (!data) return new Map();
    return new Map(data.recipes.map((r) => [r.id, r]));
  }, [data]);

  const fridgeMatches = useMemo(() => {
    if (!data) return [];
    const fridgeSet = new Set(data.fridgeItems.map((f) => f.name.toLowerCase().trim()));
    const scale = data.user.household_size;

    return data.recipes
      .map((r) => {
        const totalIngs = r.ingredients.length;
        const matchedIngs = r.ingredients.filter((ing) =>
          fridgeSet.has(ing.name.toLowerCase().trim())
        );
        const missingIngs = r.ingredients.filter(
          (ing) => !fridgeSet.has(ing.name.toLowerCase().trim())
        );
        const missingCost = missingIngs.reduce(
          (acc, ing) => acc + ing.basePrice * (scale / r.servings),
          0
        );
        const matchPct = totalIngs > 0 ? Math.round((matchedIngs.length / totalIngs) * 100) : 0;
        return {
          ...r,
          matchedCount: matchedIngs.length,
          totalIngs,
          matchPct,
          missingIngs,
          missingCost: Number(missingCost.toFixed(2)),
        };
      })
      .sort((a, b) => b.matchPct - a.matchPct || a.missingCost - b.missingCost);
  }, [data]);

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <img
            src="/menu-icon.png"
            alt="Menu NeatEat"
            className="w-14 h-14 rounded-2xl shadow-md animate-pulse"
          />
          <p className="text-slate-600 font-medium">Carregando NeatEat Brasil...</p>
        </div>
      </div>
    );
  }

  const {
    user,
    recipes,
    mealPlan,
    fridgeItems,
    shoppingList,
    totals,
    suggestions = [],
    dismissedSuggestionsCount = 0,
    lastSuggestionSwipe = null,
  } = data;
  const isOverBudget = totals.netToBuyTotal > user.weekly_budget;
  const budgetPct = Math.min(100, Math.round((totals.netToBuyTotal / Math.max(1, user.weekly_budget)) * 100));

  function getRecipeMealCost(recipe) {
    if (!recipe) return 0;
    return Number((recipe.costPerServing * user.household_size).toFixed(2));
  }

  function getRecipeServingCost(recipe) {
    if (!recipe) return 0;
    return Number(recipe.costPerServing.toFixed(2));
  }

  const filteredCatalog = recipes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ingredients.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = categoryFilter === 'Todas' || r.category === categoryFilter;
    const matchesTag = tagFilter === 'Todas' || r.tags.includes(tagFilter);
    const matchesPrice = getRecipeServingCost(r) <= maxPricePerServing;
    return matchesSearch && matchesCat && matchesTag && matchesPrice;
  });

  const filteredSuggestions = suggestions.filter((s) => {
    const matchesCat = suggestionCatFilter === 'Todas' || s.category === suggestionCatFilter;
    const matchesSearch =
      !suggestionSearch.trim() ||
      s.title.toLowerCase().includes(suggestionSearch.toLowerCase()) ||
      s.ingredients.some((i) => i.name.toLowerCase().includes(suggestionSearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });
  const activeSuggestion = filteredSuggestions[0] || null;
  const nextSuggestion = filteredSuggestions[1] || null;

  // Group shopping list by aisle
  const shoppingByAisle = shoppingList.reduce((acc, item) => {
    if (!acc[item.aisle]) acc[item.aisle] = [];
    acc[item.aisle].push(item);
    return acc;
  }, {});

  const latestRelease = data.releaseNotes?.[0];

  // Live cost calculation inside Ficha Técnica form
  const formTotalCost = recipeFormModal
    ? recipeFormModal.ingredients.reduce((sum, i) => sum + (Number(i.basePrice) || 0), 0)
    : 0;
  const formServingCost = recipeFormModal
    ? formTotalCost / Math.max(1, Number(recipeFormModal.servings) || 1)
    : 0;

  return (
    <div className="min-h-screen flex flex-col liquid-app-bg text-slate-900 relative overflow-x-hidden">
      {/* AMBIENT APPLE LIQUID GLASS REFRACTIVE ORBS */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="liquid-orb-1 absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="liquid-orb-2 absolute top-1/4 -right-28 w-[28rem] h-[28rem] rounded-full bg-sky-400/18 blur-3xl" />
        <div className="liquid-orb-1 absolute -bottom-32 left-1/3 w-[26rem] h-[26rem] rounded-full bg-teal-400/16 blur-3xl" />
      </div>

      {/* HEADER — APPLE LIQUID GLASS */}
      <header className="sticky top-0 z-30 liquid-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-2.5 flex flex-wrap items-center justify-between gap-4">
          {/* Brand with Menu Icon */}
          <div className="flex items-center gap-3.5">
            <div className="relative p-0.5 rounded-2xl bg-gradient-to-br from-white/80 to-white/20 shadow-md">
              <img
                src="/menu-icon.png"
                alt="Ícone Menu NeatEat"
                className="w-11 h-11 rounded-[14px] object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  n<span className="text-emerald-600">EAT</span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                  Brasil
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Planejador Semanal & Fichas Técnicas de Restaurante
              </p>
            </div>
          </div>

          {/* Live Budget Gauge Pill (Liquid Glass Capsule) */}
          <div className="flex items-center gap-4 bg-slate-100/90 px-4 py-2 rounded-2xl border border-slate-200/80">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Custo Médio da Lista:</span>
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span
                  className={`text-base font-extrabold ${
                    isOverBudget ? 'text-rose-600' : 'text-emerald-700'
                  }`}
                >
                  {formatBRL(totals.netToBuyTotal)}
                </span>
                <span className="text-xs text-slate-500">
                  / meta {formatBRL(user.weekly_budget)}
                </span>
              </div>
            </div>

            <div className="hidden md:block w-28">
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${budgetPct}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 text-right">
                {totals.fridgeSavings > 0
                  ? `Economizou ${formatBRL(totals.fridgeSavings)} da geladeira`
                  : `${budgetPct}% do orçamento`}
              </p>
            </div>
          </div>

          {/* Dark Mode Toggle, Household & Auth Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              title={darkMode ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span className="hidden sm:inline">Modo Escuro</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(user.household_code);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              title="Copiar código de convite da família"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-amber-600" />
              <span> Casa: {user.household_code}</span>
              {copiedCode && <span className="text-emerald-700 font-bold ml-1">Copiado!</span>}
            </button>

            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm border border-white/15 transition cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>{user.name}</span>
            </button>
          </div>
        </div>

        {/* Apple Liquid Glass Segmented Capsule Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-3 pt-1 flex justify-start sm:justify-center overflow-x-auto">
          <nav className="liquid-nav-capsule inline-flex items-center gap-1.5 p-1.5 rounded-full">
            {[
              { id: 'planner', label: 'Planejador Semanal', icon: Calendar },
              {
                id: 'shopping',
                label: `Lista de Compras (${shoppingList.filter((i) => !i.inFridge).length})`,
                icon: ShoppingCart,
              },
              {
                id: 'fridge',
                label: `Geladeira & IA (${fridgeItems.length})`,
                icon: Refrigerator,
              },
              {
                id: 'recipes',
                label: `Catálogo de Receitas (${recipes.length})`,
                icon: BookOpen,
              },
              {
                id: 'suggestions',
                label: `Sugestões (${suggestions.length})`,
                icon: Flame,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    active
                      ? 'liquid-nav-tab-active'
                      : 'border border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* TAB 1: PLANEJADOR SEMANAL */}
        {activeTab === 'planner' && (
          <div className="space-y-6">
            <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Budget Slider */}
                <div className="lg:col-span-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Wallet className="w-4 h-4 text-emerald-600" />
                      Orçamento Semanal (Preço Médio)
                    </label>
                    <span className="text-xl font-extrabold text-emerald-700">
                      {formatBRL(budgetDraft)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="800"
                    step="10"
                    value={budgetDraft}
                    onChange={(e) => setBudgetDraft(Number(e.target.value))}
                    onMouseUp={() => updateProfile({ weekly_budget: Number(budgetDraft) })}
                    onTouchEnd={() => updateProfile({ weekly_budget: Number(budgetDraft) })}
                    className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>R$ 100 (Ultra Econômico)</span>
                    <span>R$ 400 (Equilibrado)</span>
                    <span>R$ 800 (Família)</span>
                  </div>
                </div>

                {/* Household Size + Diet */}
                <div className="lg:col-span-4 grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 mb-1">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      Pessoas na Casa
                    </label>
                    <select
                      value={user.household_size}
                      onChange={(e) =>
                        updateProfile({ household_size: Number(e.target.value) })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold bg-slate-50 focus:outline-none focus:border-emerald-500"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'pessoa' : 'pessoas'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 mb-1">
                      <Filter className="w-3.5 h-3.5 text-emerald-600" />
                      Preferência
                    </label>
                    <select
                      value={user.dietary_filter}
                      onChange={(e) => updateProfile({ dietary_filter: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold bg-slate-50 focus:outline-none focus:border-emerald-500"
                    >
                      {DIETARY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Smart Generator */}
                <div className="lg:col-span-3">
                  <button
                    onClick={handleGenerateSmartPlan}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Recalcular para {formatBRL(budgetDraft)}</span>
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              <div
                className={`mt-5 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-medium ${
                  isOverBudget
                    ? 'bg-rose-50 text-rose-900 border border-rose-200'
                    : 'bg-emerald-50/80 text-emerald-950 border border-emerald-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isOverBudget ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  <span>
                    {isOverBudget
                      ? `Atenção: Seu cardápio atual passa ${formatBRL(
                          Math.abs(totals.budgetRemaining)
                        )} do orçamento de ${formatBRL(
                          user.weekly_budget
                        )}. Clique em "Recalcular" para ajustar automaticamente!`
                      : `Ótimo! Seu plano de 21 refeições para ${user.household_size} ${
                          user.household_size === 1 ? 'pessoa' : 'pessoas'
                        } pelo preço médio estimado deixa ${formatBRL(
                          totals.budgetRemaining
                        )} livres no orçamento semanal.`}
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('shopping')}
                  className="font-bold underline hover:opacity-80 cursor-pointer"
                >
                  Ver Lista de Compras Consolidada →
                </button>
              </div>
            </section>

            {/* 7-Day Weekly Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
              {DAYS.map((day) => {
                const daySlots = SLOTS.map((slot) => {
                  const found = mealPlan.find((m) => m.day === day && m.slot === slot);
                  const recipe = found ? recipeMap.get(found.recipe_id) : recipes[0];
                  return { slot, recipe };
                });

                const dayCost = daySlots.reduce(
                  (acc, s) => acc + getRecipeMealCost(s.recipe),
                  0
                );
                const dayCals = daySlots.reduce(
                  (acc, s) => acc + (s.recipe?.calories || 0),
                  0
                );

                return (
                  <div
                    key={day}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col overflow-hidden"
                  >
                    <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm">{day}</h3>
                        <p className="text-[11px] text-slate-300">{dayCals} kcal/pessoa</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-400/30">
                        {formatBRL(dayCost)}
                      </span>
                    </div>

                    <div className="p-2.5 space-y-2.5 flex-1 flex flex-col justify-between">
                      {daySlots.map(({ slot, recipe }) => {
                        if (!recipe) return null;
                        const mealCost = getRecipeMealCost(recipe);
                        return (
                          <div
                            key={slot}
                            className="group rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-emerald-200 hover:shadow-xs p-2.5 transition flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                <span>{slot}</span>
                                <span className="text-emerald-700 font-extrabold">
                                  {formatBRL(mealCost)}
                                </span>
                              </div>

                              <div
                                onClick={() => setSelectedRecipeModal(recipe)}
                                className="flex gap-2.5 items-start cursor-pointer"
                              >
                                <img
                                  src={recipe.image}
                                  alt={recipe.title}
                                  className="w-12 h-12 rounded-lg object-cover shrink-0 bg-slate-200"
                                />
                                <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 line-clamp-2 leading-snug">
                                  {recipe.title}
                                </h4>
                              </div>
                            </div>

                            <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {recipe.prepTime}m
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => openCookingMode(recipe, e)}
                                  title="Iniciar Modo Cozinhar (Passo a Passo)"
                                  className="px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 cursor-pointer transition"
                                >
                                  <Play className="w-2.5 h-2.5 fill-white" />
                                  <span>Cozinhar</span>
                                </button>
                                <button
                                  onClick={() => setSwapSlotTarget({ day, slot })}
                                  className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
                                >
                                  <ArrowRightLeft className="w-3 h-3" />
                                  Trocar
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </section>
          </div>
        )}

        {/* TAB 2: LISTA DE COMPRAS INTELIGENTE */}
        {activeTab === 'shopping' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-4">
                <h4 className="font-bold text-sm text-slate-300 uppercase tracking-wider">
                  Resumo Financeiro (Preço Médio)
                </h4>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Custo Bruto dos Insumos:</span>
                    <span className="font-semibold">{formatBRL(totals.grossTotal)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Já tenho em casa (Geladeira):</span>
                    <span className="font-bold">- {formatBRL(totals.fridgeSavings)}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex justify-between text-base font-extrabold">
                    <span>Total Estimado a Comprar:</span>
                    <span className="text-emerald-400">{formatBRL(totals.netToBuyTotal)}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 pt-2 border-t border-slate-800">
                  Valores calculados considerando o custo médio dos insumos nas fichas técnicas para{' '}
                  <strong>{user.household_size} pessoa(s)</strong>.
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">
                      Lista de Compras Inteligente
                    </h2>
                    <p className="text-xs text-slate-500">
                      Insumos repetidos entre as 21 refeições foram somados automaticamente para{' '}
                      <strong>{user.household_size} pessoas</strong>.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('fridge')}
                    className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl border border-emerald-200 transition cursor-pointer"
                  >
                    Gerenciar itens da geladeira ({fridgeItems.length})
                  </button>
                </div>

                <div className="space-y-6">
                  {Object.entries(shoppingByAisle).map(([aisle, items]) => (
                    <div key={aisle} className="space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                          {aisle}
                        </h3>
                        <span className="text-xs text-slate-400 font-medium">
                          {items.length} {items.length === 1 ? 'item' : 'itens'}
                        </span>
                      </div>

                      <div className="divide-y divide-slate-100">
                        {items.map((item) => (
                          <div
                            key={item.key}
                            onClick={() => handleToggleShoppingCheck(item.key)}
                            className={`py-2.5 px-3 rounded-xl flex items-center justify-between gap-3 transition cursor-pointer ${
                              item.checked
                                ? 'bg-slate-50 text-slate-400'
                                : 'hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-lg flex items-center justify-center border transition ${
                                  item.checked
                                    ? 'bg-emerald-600 border-emerald-600 text-white'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {item.checked && <Check className="w-3.5 h-3.5" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-base leading-none">
                                    {getIngredientEmoji(item.name, item.aisle)}
                                  </span>
                                  <span
                                    className={`text-sm font-bold ${
                                      item.checked ? 'line-through' : ''
                                    }`}
                                  >
                                    {item.name}
                                  </span>
                                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                                    {item.amount} {item.unit}
                                  </span>
                                  {item.inFridge && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                      Já tem na geladeira
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  Usado em {item.Occurrences} refeição(ões):{' '}
                                  {item.recipesUsed.slice(0, 2).join(', ')}
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span
                                className={`text-sm font-extrabold ${
                                  item.inFridge
                                    ? 'line-through text-emerald-600'
                                    : 'text-slate-900'
                                }`}
                              >
                                {formatBRL(item.estimatedPrice)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GELADEIRA & IA IMPORTADOR */}
        {activeTab === 'fridge' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Refrigerator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      O que tem na sua geladeira / despensa?
                    </h3>
                    <p className="text-xs text-slate-500">
                      Marque o que você já tem em casa para abater da lista de compras e descobrir receitas!
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newFridgeItem.trim()) return;
                    handleToggleFridgeItem(newFridgeItem);
                    setNewFridgeItem('');
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Ex: Batata inglesa, Tomate, Frango..."
                    value={newFridgeItem}
                    onChange={(e) => setNewFridgeItem(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Adicionar
                  </button>
                </form>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Toque rápido para marcar/desmarcar:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_FRIDGE_SUGGESTIONS.map((sug) => {
                      const active = fridgeItems.some(
                        (f) => f.name.toLowerCase() === sug.name.toLowerCase()
                      );
                      return (
                        <button
                          key={sug.name}
                          onClick={() => handleToggleFridgeItem(sug.name, sug.category)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
                            active
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {active && <Check className="w-3.5 h-3.5" />}
                          <span>{getIngredientEmoji(sug.name, sug.category)}</span>
                          <span>{sug.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* AI Social / URL Recipe Importer */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base">
                      Importador de Ficha Técnica com IA
                    </h3>
                    <p className="text-xs text-slate-300">
                      Cole um link ou digite o nome do prato: a IA gera os insumos, custos, porcionamento e busca a foto exata do prato!
                    </p>
                  </div>
                </div>

                <form onSubmit={handleImportRecipe} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      URL da Receita ou Nome do Prato
                    </label>
                    <div className="relative">
                      <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="Ex: Panqueca de frango com queijo ou https://tudogostoso.com.br/..."
                        value={importInput}
                        onChange={(e) => setImportInput(e.target.value)}
                        className="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={importCategory}
                      onChange={(e) => setImportCategory(e.target.value)}
                      className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5 text-sm font-semibold text-white focus:outline-none"
                    >
                      {SLOTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                    <button
                      type="submit"
                      disabled={importing}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{importing ? 'Gerando Ficha e Foto...' : 'Importar Ficha Técnica'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Sugestões da IA com o que você já tem em casa
                  </h2>
                  <p className="text-xs text-slate-500">
                    Receitas ordenadas pela maior compatibilidade com sua geladeira e menor custo médio adicional:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {fridgeMatches.slice(0, 8).map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => setSelectedRecipeModal(rec)}
                      className="rounded-2xl border border-slate-200 hover:border-emerald-400 p-3.5 flex flex-col justify-between gap-3 transition cursor-pointer bg-slate-50/50 hover:bg-white"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                              rec.matchPct >= 60
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {rec.matchPct}% na geladeira ({rec.matchedCount}/{rec.totalIngs})
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            {rec.category}
                          </span>
                        </div>

                        <div className="flex gap-3 items-center">
                          <img
                            src={rec.image}
                            alt={rec.title}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-200"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-slate-900 line-clamp-2">
                              {rec.title}
                            </h4>
                            <p className="text-xs text-emerald-700 font-bold mt-1">
                              Falta comprar: {formatBRL(rec.missingCost)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 border-t border-slate-200/70 pt-2 flex items-center justify-between gap-2">
                        <div>
                          {rec.missingIngs.length === 0 ? (
                            <span className="text-emerald-700 font-bold">
                              Você tem 100% dos ingredientes! Custo extra R$ 0,00!
                            </span>
                          ) : (
                            <span>
                              Faltam:{' '}
                              {rec.missingIngs
                                .map((i) => `${getIngredientEmoji(i.name, i.aisle)} ${i.name}`)
                                .slice(0, 3)
                                .join(', ')}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => openCookingMode(rec, e)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>Cozinhar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CATÁLOGO DE RECEITAS (FICHAS TÉCNICAS DE RESTAURANTE) */}
        {activeTab === 'recipes' && (
          <div className="space-y-6">
            {/* Header & Add New Ficha Técnica Button */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  Catálogo de Fichas Técnicas de Restaurante
                </h2>
                <p className="text-xs text-slate-500">
                  Cadastre, edite ou exclua receitas completas com custo unitário de insumos, gramatura de porção, montagem e foto exata do prato.
                </p>
              </div>
              <button
                onClick={openNewRecipeModal}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xs flex items-center gap-2 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Receita (Ficha Técnica)</span>
              </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500 block mb-1">
                  Buscar Prato ou Insumo
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Ex: frango, tapioca, mandioca..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500 block mb-1">
                  Refeição
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold bg-slate-50"
                >
                  <option value="Todas">Todas as Refeições</option>
                  {SLOTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500 block mb-1">
                  Restrição / Estilo
                </label>
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold bg-slate-50"
                >
                  {DIETARY_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold uppercase text-slate-500 mb-1">
                  <span>Custo Máx / Porção</span>
                  <span className="text-emerald-700">{formatBRL(maxPricePerServing)}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="50"
                  step="0.5"
                  value={maxPricePerServing}
                  onChange={(e) => setMaxPricePerServing(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Recipe Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCatalog.map((recipe) => {
                const servingPrice = getRecipeServingCost(recipe);
                return (
                  <div
                    key={recipe.id}
                    onClick={() => setSelectedRecipeModal(recipe)}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-300 transition flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="relative h-48 overflow-hidden bg-slate-200">
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur text-white text-xs font-bold">
                          {recipe.category}
                        </div>

                        {/* Play, Edit & Delete Quick Buttons on Card */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <button
                            onClick={(e) => openCookingMode(recipe, e)}
                            title="Iniciar Modo Cozinhar (Passo a Passo)"
                            className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-sm transition cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                          </button>
                          <button
                            onClick={(e) => openEditRecipeModal(recipe, e)}
                            title="Editar Ficha Técnica"
                            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 hover:text-emerald-700 flex items-center justify-center shadow-sm transition cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteRecipe(recipe, e)}
                            title="Excluir Receita"
                            className="w-8 h-8 rounded-full bg-white/90 hover:bg-rose-600 text-rose-600 hover:text-white flex items-center justify-center shadow-sm transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 text-white text-[11px] font-semibold flex items-center gap-1">
                          <Scale className="w-3 h-3 text-emerald-400" />
                          <span>{recipe.portionWeight || '350g/porção'}</span>
                        </div>

                        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-extrabold shadow">
                          {formatBRL(servingPrice)} / porção
                        </div>
                      </div>

                      <div className="p-4 space-y-2.5">
                        <div className="flex flex-wrap gap-1.5">
                          {recipe.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700">
                          {recipe.title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-2">
                          <strong className="text-slate-700">Montagem:</strong>{' '}
                          {recipe.platingInstructions}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {recipe.prepTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-500" /> {recipe.calories} kcal
                      </span>
                      <button
                        type="button"
                        onClick={(e) => openCookingMode(recipe, e)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Cozinhar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: SUGESTÕES (DESCOBERTA DE PRATOS) */}
        {activeTab === 'suggestions' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Top Bar: Instructions, Filters, Undo & Reset */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                      <Flame className="w-5 h-5 text-rose-500" />
                      Descoberta de Pratos
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      Atualizado 1x por dia {data.discoveryDate ? `(${data.discoveryDate.split('-').reverse().slice(0, 2).join('/')})` : ''}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Arraste o card para a <strong className="text-rose-600">esquerda (❌ Passar)</strong> ou para a{' '}
                    <strong className="text-emerald-600">direita (💚 Adicionar)</strong> para incluir a Ficha Técnica no seu Catálogo de Receitas!
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {lastSuggestionSwipe && (
                    <button
                      onClick={handleUndoLastSwipe}
                      className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                      title="Desfazer último swipe"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                      <span>Desfazer último swipe</span>
                    </button>
                  )}

                  {dismissedSuggestionsCount > 0 && (
                    <button
                      onClick={handleResetDismissedSuggestions}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Rever descartadas ({dismissedSuggestionsCount})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Pills & Search */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div className="flex flex-wrap gap-1.5">
                  {['Todas', ...SLOTS].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSuggestionCatFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        suggestionCatFilter === cat
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative flex-1 min-w-[200px] max-w-xs">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Filtrar por ingrediente ou prato..."
                    value={suggestionSearch}
                    onChange={(e) => setSuggestionSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Live Toast Feedback on Swipe */}
            {swipeFeedback && (
              <div
                className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between transition ${
                  swipeFeedback.direction === 'right'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : swipeFeedback.direction === 'left'
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {swipeFeedback.direction === 'right' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : swipeFeedback.direction === 'left' ? (
                    <X className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : (
                    <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span>
                    {swipeFeedback.direction === 'right'
                      ? `Adicionada ao Catálogo de Receitas: "${swipeFeedback.title}"!`
                      : swipeFeedback.direction === 'left'
                      ? `Você passou a receita "${swipeFeedback.title}".`
                      : swipeFeedback.title}
                  </span>
                </div>
                {swipeFeedback.direction === 'right' && (
                  <button
                    onClick={() => setActiveTab('recipes')}
                    className="underline font-extrabold hover:opacity-80 cursor-pointer"
                  >
                    Ver no Catálogo →
                  </button>
                )}
              </div>
            )}

            {/* TINDER DECK CONTAINER */}
            {activeSuggestion ? (
              <div className="flex flex-col items-center space-y-5">
                <div className="relative w-full max-w-xl min-h-[560px] flex items-center justify-center select-none">
                  {/* Background Next Card Preview */}
                  {nextSuggestion && (
                    <div
                      key={nextSuggestion.id}
                      className="absolute inset-x-4 top-4 bottom-0 bg-white rounded-3xl border border-slate-200 shadow-sm scale-[0.95] translate-y-3 opacity-60 pointer-events-none overflow-hidden"
                    >
                      <div className="h-64 bg-slate-200">
                        <img
                          src={nextSuggestion.image}
                          alt={nextSuggestion.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="font-extrabold text-lg text-slate-800">
                          {nextSuggestion.title}
                        </h3>
                      </div>
                    </div>
                  )}

                  {/* Active Foreground Swipeable Card */}
                  <div
                    key={activeSuggestion.id}
                    onPointerDown={(e) => {
                      if (e.target.closest('button')) return;
                      e.currentTarget.setPointerCapture(e.pointerId);
                      setDragState({
                        isDragging: true,
                        startX: e.clientX,
                        startY: e.clientY,
                        dx: 0,
                        dy: 0,
                      });
                    }}
                    onPointerMove={(e) => {
                      if (!dragState.isDragging) return;
                      setDragState((prev) => ({
                        ...prev,
                        dx: e.clientX - prev.startX,
                        dy: (e.clientY - prev.startY) * 0.25,
                      }));
                    }}
                    onPointerUp={() => {
                      if (!dragState.isDragging) return;
                      if (dragState.dx > 105) {
                        handleSwipeSuggestion(activeSuggestion, 'right');
                      } else if (dragState.dx < -105) {
                        handleSwipeSuggestion(activeSuggestion, 'left');
                      } else {
                        setDragState({
                          isDragging: false,
                          startX: 0,
                          startY: 0,
                          dx: 0,
                          dy: 0,
                        });
                      }
                    }}
                    onPointerCancel={() => {
                      setDragState({
                        isDragging: false,
                        startX: 0,
                        startY: 0,
                        dx: 0,
                        dy: 0,
                      });
                    }}
                    style={{
                      transform:
                        swipeAnim === 'right'
                          ? 'translateX(420px) rotate(18deg)'
                          : swipeAnim === 'left'
                          ? 'translateX(-420px) rotate(-18deg)'
                          : `translate(${dragState.dx}px, ${dragState.dy}px) rotate(${
                              dragState.dx * 0.045
                            }deg)`,
                      opacity: swipeAnim ? 0 : 1,
                      transition: dragState.isDragging
                        ? 'none'
                        : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.22s ease',
                    }}
                    className="relative z-10 w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden cursor-grab active:cursor-grabbing"
                  >
                    {/* Dynamic STAMPS ("ADICIONAR" vs "PASSAR") */}
                    {(dragState.dx > 35 || swipeAnim === 'right') && (
                      <div className="absolute top-6 left-6 z-20 px-4 py-1.5 rounded-xl border-4 border-emerald-500 bg-emerald-500/90 text-white font-black text-lg uppercase tracking-widest -rotate-12 shadow-lg">
                        💚 ADICIONAR
                      </div>
                    )}
                    {(dragState.dx < -35 || swipeAnim === 'left') && (
                      <div className="absolute top-6 right-6 z-20 px-4 py-1.5 rounded-xl border-4 border-rose-500 bg-rose-500/90 text-white font-black text-lg uppercase tracking-widest rotate-12 shadow-lg">
                        ❌ PASSAR
                      </div>
                    )}

                    {/* Dish Photo Header */}
                    <div className="relative h-72 bg-slate-200 overflow-hidden">
                      <img
                        src={activeSuggestion.image}
                        alt={activeSuggestion.title}
                        draggable={false}
                        onError={(e) => {
                          e.currentTarget.src = '/dishes/rec-5.jpg';
                        }}
                        className="w-full h-full object-cover select-none pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur text-white text-xs font-extrabold">
                          {activeSuggestion.category}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-white/90 text-slate-800 text-xs font-bold flex items-center gap-1 shadow-xs">
                          <Scale className="w-3.5 h-3.5 text-emerald-600" />
                          {activeSuggestion.portionWeight}
                        </span>
                      </div>

                      <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-2xl bg-emerald-600 text-white text-sm font-extrabold shadow-md">
                        {formatBRL(activeSuggestion.costPerServing)} / porção
                      </div>

                      <div className="absolute bottom-4 left-5 right-5 text-white">
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {activeSuggestion.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-300/40 text-emerald-100"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-2xl font-extrabold leading-tight drop-shadow-xs">
                          {activeSuggestion.title}
                        </h3>
                      </div>
                    </div>

                    {/* Visual Card Body (Time, Macros, Key Ingredients & Inspect Ficha Button) */}
                    <div className="p-5 space-y-4">
                      {/* Quick Nutrition & Time Row */}
                      <div className="grid grid-cols-5 gap-2 text-center">
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                          <div className="text-[10px] font-bold uppercase text-slate-400">
                            Preparo
                          </div>
                          <div className="text-xs font-extrabold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-emerald-600" />
                            {activeSuggestion.prepTime}m
                          </div>
                        </div>
                        <div className="p-2 rounded-xl bg-orange-50/70 border border-orange-200/70">
                          <div className="text-[10px] font-bold uppercase text-orange-600">
                            Calorias
                          </div>
                          <div className="text-xs font-extrabold text-orange-900 mt-0.5">
                            {activeSuggestion.calories} kcal
                          </div>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                          <div className="text-[10px] font-bold uppercase text-slate-400">
                            Proteína
                          </div>
                          <div className="text-xs font-extrabold text-slate-800 mt-0.5">
                            {activeSuggestion.protein}g
                          </div>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                          <div className="text-[10px] font-bold uppercase text-slate-400">
                            Carbo
                          </div>
                          <div className="text-xs font-extrabold text-slate-800 mt-0.5">
                            {activeSuggestion.carbs}g
                          </div>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                          <div className="text-[10px] font-bold uppercase text-slate-400">
                            Gordura
                          </div>
                          <div className="text-xs font-extrabold text-slate-800 mt-0.5">
                            {activeSuggestion.fat}g
                          </div>
                        </div>
                      </div>

                      {/* Key Ingredients Preview */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                          <span>Principais Insumos da Ficha Técnica:</span>
                          <span className="text-slate-700">
                            Custo Total da Receita ({activeSuggestion.servings}{' '}
                            {activeSuggestion.servings === 1 ? 'porção' : 'porções'}):{' '}
                            <strong className="text-emerald-700">
                              {formatBRL(activeSuggestion.baseCost)}
                            </strong>
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeSuggestion.ingredients.map((ing, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                            >
                              <span>{getIngredientEmoji(ing.name, ing.aisle)}</span>
                              <span>
                                {ing.name} ({ing.amount}
                                {ing.unit})
                              </span>
                              <span className="text-emerald-700 font-bold">
                                {formatBRL(ing.basePrice)}
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Montagem preview + Button to open full Ficha Técnica */}
                      <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs text-slate-600 flex-1 line-clamp-2">
                          <strong className="text-slate-800">Empratamento:</strong>{' '}
                          {activeSuggestion.platingInstructions}
                        </p>
                        <button
                          type="button"
                          onClick={() => setSelectedRecipeModal(activeSuggestion)}
                          className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-extrabold flex items-center gap-1.5 shadow-2xs transition cursor-pointer shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Abrir Ficha Técnica Completa</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TINDER ACTION BUTTONS (LEFT = PASSAR, CENTER = FICHA TÉCNICA, RIGHT = ADICIONAR) */}
                <div className="flex items-center justify-center gap-5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSwipeSuggestion(activeSuggestion, 'left')}
                    className="group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-600 border-2 border-rose-200 hover:border-rose-400 font-extrabold text-sm shadow-sm transition cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-100 group-hover:bg-rose-600 group-hover:text-white flex items-center justify-center transition">
                      <X className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div>Passar</div>
                      <div className="text-[10px] font-medium text-slate-400">
                        Jogar p/ Esquerda
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRecipeModal(activeSuggestion)}
                    className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Ver Ficha Completa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwipeSuggestion(activeSuggestion, 'right')}
                    className="group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-emerald-600 font-extrabold text-sm shadow-md transition cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <Heart className="w-5 h-5 fill-white" />
                    </div>
                    <div className="text-left">
                      <div>Adicionar ao Catálogo</div>
                      <div className="text-[10px] font-medium text-emerald-100">
                        Jogar p/ Direita
                      </div>
                    </div>
                  </button>
                </div>

                <p className="text-xs text-slate-400 font-medium">
                  Restam <strong>{filteredSuggestions.length}</strong> sugestões nesta fila • Você também pode arrastar o card com o mouse!
                </p>
              </div>
            ) : (
              /* Empty Deck State */
              <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Você avaliou todas as sugestões deste filtro!
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  As receitas que você jogou para a direita já estão salvas no seu{' '}
                  <strong>Catálogo de Receitas</strong> e disponíveis para o seu Cardápio Semanal.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {suggestionCatFilter !== 'Todas' && (
                    <button
                      onClick={() => setSuggestionCatFilter('Todas')}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
                    >
                      Ver Todas as Categorias
                    </button>
                  )}
                  {dismissedSuggestionsCount > 0 && (
                    <button
                      onClick={handleResetDismissedSuggestions}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Rever Receitas Descartadas ({dismissedSuggestionsCount})</span>
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('recipes')}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
                  >
                    Ir para meu Catálogo ({recipes.length})
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL 1: FICHA TÉCNICA DE RESTAURANTE COMPLETA (VIEW DETAILS) */}
      {selectedRecipeModal && (
        <div
          onClick={() => setSelectedRecipeModal(null)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-xl border border-slate-200"
          >
            <div className="relative h-64 bg-slate-200">
              <img
                src={selectedRecipeModal.image}
                alt={selectedRecipeModal.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={(e) => openCookingMode(selectedRecipeModal, e)}
                  className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Cozinhar Agora</span>
                </button>
                {recipeMap.has(selectedRecipeModal.id) ? (
                  <>
                    <button
                      onClick={(e) => openEditRecipeModal(selectedRecipeModal, e)}
                      className="px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Editar Ficha</span>
                    </button>
                    <button
                      onClick={(e) => handleDeleteRecipe(selectedRecipeModal, e)}
                      className="px-3 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleSwipeSuggestion(selectedRecipeModal, 'left')}
                      className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Passar (Esquerda)</span>
                    </button>
                    <button
                      onClick={() => handleSwipeSuggestion(selectedRecipeModal, 'right')}
                      className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>Adicionar ao Catálogo (Direita)</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedRecipeModal(null)}
                  className="w-9 h-9 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-900/85 text-white text-xs font-bold">
                  📋 Ficha Técnica Operacional • {selectedRecipeModal.category}
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-sm font-extrabold shadow">
                  Custo por Porção: {formatBRL(selectedRecipeModal.costPerServing)} (Total Receita:{' '}
                  {formatBRL(selectedRecipeModal.baseCost)})
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Header & Nutrition */}
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {selectedRecipeModal.title}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 mt-4">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-[10px] font-bold uppercase text-slate-400">
                      Tempo Preparo
                    </div>
                    <div className="text-sm font-extrabold text-slate-800">
                      {selectedRecipeModal.prepTime} min
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-[10px] font-bold uppercase text-slate-400">
                      Rendimento
                    </div>
                    <div className="text-sm font-extrabold text-slate-800">
                      {selectedRecipeModal.servings}{' '}
                      {selectedRecipeModal.servings === 1 ? 'porção' : 'porções'}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <div className="text-[10px] font-bold uppercase text-emerald-700">
                      Calorias
                    </div>
                    <div className="text-sm font-extrabold text-emerald-900">
                      {selectedRecipeModal.calories} kcal
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-[10px] font-bold uppercase text-slate-400">
                      Proteínas
                    </div>
                    <div className="text-sm font-extrabold text-slate-800">
                      {selectedRecipeModal.protein}g
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-[10px] font-bold uppercase text-slate-400">
                      Carboidratos
                    </div>
                    <div className="text-sm font-extrabold text-slate-800">
                      {selectedRecipeModal.carbs}g
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-[10px] font-bold uppercase text-slate-400">
                      Gorduras
                    </div>
                    <div className="text-sm font-extrabold text-slate-800">
                      {selectedRecipeModal.fat}g
                    </div>
                  </div>
                </div>
              </div>

              {/* Insumos Utilizados, Quantidade e Custo de cada Insumo */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Insumos Utilizados, Quantidades & Custo Unitário (Ficha base:{' '}
                    {selectedRecipeModal.servings} porção/porções)
                  </h3>
                  <span className="text-xs font-bold text-emerald-700">
                    Para {user.household_size} pessoa(s):{' '}
                    {formatBRL(getRecipeMealCost(selectedRecipeModal))}
                  </span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 font-bold uppercase">
                        <th className="py-2.5 px-3">Insumo / Ingrediente</th>
                        <th className="py-2.5 px-3">Setor</th>
                        <th className="py-2.5 px-3">Quantidade Ficha</th>
                        <th className="py-2.5 px-3 text-right">Custo do Insumo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedRecipeModal.ingredients.map((ing, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-800">
                            <span className="mr-1.5">
                              {getIngredientEmoji(ing.name, ing.aisle)}
                            </span>
                            {ing.name}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500">{ing.aisle}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-700">
                            {ing.amount} {ing.unit}
                          </td>
                          <td className="py-2.5 px-3 text-right font-extrabold text-emerald-700">
                            {formatBRL(ing.basePrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-emerald-50/80 font-extrabold text-slate-900 border-t border-emerald-200">
                        <td colSpan={3} className="py-2.5 px-3">
                          Custo Total da Ficha Técnica (CMV)
                        </td>
                        <td className="py-2.5 px-3 text-right text-emerald-700">
                          {formatBRL(selectedRecipeModal.baseCost)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Modo de Preparo */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2.5">
                  Modo de Preparo Operacional
                </h3>
                <ol className="space-y-2.5">
                  {selectedRecipeModal.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-slate-700">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Como a Porção Deve Ser Servida: Peso, Montagem e Finalização */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <Utensils className="w-4 h-4 text-emerald-600" />
                      Serviço da Porção: Peso, Montagem e Finalização
                    </h4>
                  </div>
                  <div className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-xs font-bold">
                    Peso Padrão: {selectedRecipeModal.portionWeight || '350g por porção'}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {selectedRecipeModal.platingInstructions}
                  </p>
                </div>

                {/* Outras Instruções Específicas */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-600" />
                    Outras Instruções Específicas (Conservação / Chef)
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {selectedRecipeModal.specificInstructions}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CRIAR / EDITAR RECEITA (MODELO FICHA TÉCNICA DE RESTAURANTE) */}
      {recipeFormModal && (
        <div
          onClick={() => setRecipeFormModal(null)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {recipeFormModal.id
                    ? 'Editar Ficha Técnica de Restaurante'
                    : 'Nova Receita — Ficha Técnica de Restaurante'}
                </h3>
                <p className="text-xs text-slate-500">
                  Preencha todos os requisitos operacionais, custos unitários de insumos, montagem da porção e foto exata do prato.
                </p>
              </div>
              <button
                onClick={() => setRecipeFormModal(null)}
                className="p-2 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFichaTecnica} className="space-y-6">
              {/* 1. Identificação do Prato e Tempos */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-6">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nome do Prato *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Filé de Frango à Parmegiana com Purê"
                    value={recipeFormModal.title}
                    onChange={(e) =>
                      setRecipeFormModal({ ...recipeFormModal, title: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Categoria
                  </label>
                  <select
                    value={recipeFormModal.category}
                    onChange={(e) =>
                      setRecipeFormModal({ ...recipeFormModal, category: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold bg-slate-50"
                  >
                    {SLOTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Preparo (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={recipeFormModal.prepTime}
                    onChange={(e) =>
                      setRecipeFormModal({ ...recipeFormModal, prepTime: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Rendimento (porções)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={recipeFormModal.servings}
                    onChange={(e) =>
                      setRecipeFormModal({ ...recipeFormModal, servings: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* 2. Imagem Ilustrativa Real ou IA Exata do Prato */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      Imagem Exata da Refeição (Nunca Genérica)
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Busque automaticamente fotos reais exatas do prato digitado, envie uma foto do seu Mac ou cole o link da imagem.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSearchExactDishPhotos}
                      disabled={searchingPhotos || !recipeFormModal.title.trim()}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {searchingPhotos
                          ? 'Buscando fotos do prato...'
                          : 'Buscar Foto Exata do Prato'}
                      </span>
                    </button>

                    <label className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Enviar Arquivo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadLocalImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  {recipeFormModal.image && (
                    <img
                      src={recipeFormModal.image}
                      alt="Preview do prato"
                      className="w-28 h-24 rounded-xl object-cover border border-slate-300 shrink-0 bg-white"
                    />
                  )}
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      placeholder="URL da foto do prato (se deixar em branco, o sistema buscará automaticamente a foto exata do prato ao salvar)"
                      value={recipeFormModal.image}
                      onChange={(e) =>
                        setRecipeFormModal({ ...recipeFormModal, image: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                    />

                    {candidatePhotos.length > 0 && (
                      <div>
                        <p className="text-[11px] font-bold text-slate-600 mb-1">
                          Clique em uma foto correspondente ao prato para selecionar:
                        </p>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {candidatePhotos.map((url, idx) => (
                            <img
                              key={idx}
                              src={url}
                              alt={`Opção ${idx + 1}`}
                              onClick={() =>
                                setRecipeFormModal({ ...recipeFormModal, image: url })
                              }
                              className={`w-16 h-16 rounded-lg object-cover cursor-pointer border-2 transition ${
                                recipeFormModal.image === url
                                  ? 'border-emerald-600 scale-105'
                                  : 'border-transparent opacity-80 hover:opacity-100'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Ingredientes Utilizados, Quantidade e Custo de Cada Insumo */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                      Ingredientes Utilizados, Quantidade & Custo de Cada Insumo
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Custo Total da Receita:{' '}
                      <strong className="text-emerald-700">{formatBRL(formTotalCost)}</strong> •
                      Custo Médio por Porção:{' '}
                      <strong className="text-emerald-700">{formatBRL(formServingCost)}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setRecipeFormModal({
                        ...recipeFormModal,
                        ingredients: [
                          ...recipeFormModal.ingredients,
                          {
                            name: '',
                            amount: 100,
                            unit: 'g',
                            aisle: 'Mercearia',
                            basePrice: 1.5,
                          },
                        ],
                      })
                    }
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Insumo
                  </button>
                </div>

                <div className="space-y-2">
                  {recipeFormModal.ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-200/80"
                    >
                      <div className="col-span-12 sm:col-span-4">
                        <input
                          type="text"
                          required
                          placeholder="Nome do insumo (ex: Filé de tilápia)"
                          value={ing.name}
                          onChange={(e) => {
                            const next = [...recipeFormModal.ingredients];
                            next[idx] = { ...next[idx], name: e.target.value };
                            setRecipeFormModal({ ...recipeFormModal, ingredients: next });
                          }}
                          className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <input
                          type="number"
                          step="any"
                          placeholder="Qtd"
                          value={ing.amount}
                          onChange={(e) => {
                            const next = [...recipeFormModal.ingredients];
                            next[idx] = { ...next[idx], amount: e.target.value };
                            setRecipeFormModal({ ...recipeFormModal, ingredients: next });
                          }}
                          className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs"
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-1">
                        <input
                          type="text"
                          placeholder="Un (g, ml, un)"
                          value={ing.unit}
                          onChange={(e) => {
                            const next = [...recipeFormModal.ingredients];
                            next[idx] = { ...next[idx], unit: e.target.value };
                            setRecipeFormModal({ ...recipeFormModal, ingredients: next });
                          }}
                          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs"
                        />
                      </div>
                      <div className="col-span-5 sm:col-span-2">
                        <select
                          value={ing.aisle}
                          onChange={(e) => {
                            const next = [...recipeFormModal.ingredients];
                            next[idx] = { ...next[idx], aisle: e.target.value };
                            setRecipeFormModal({ ...recipeFormModal, ingredients: next });
                          }}
                          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs"
                        >
                          {AISLES.map((a) => (
                            <option key={a} value={a}>
                              {a}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-10 sm:col-span-2">
                        <div className="relative">
                          <span className="text-[10px] font-bold text-slate-400 absolute left-2 top-2">
                            R$
                          </span>
                          <input
                            type="number"
                            step="0.05"
                            placeholder="Custo"
                            value={ing.basePrice}
                            onChange={(e) => {
                              const next = [...recipeFormModal.ingredients];
                              next[idx] = { ...next[idx], basePrice: e.target.value };
                              setRecipeFormModal({ ...recipeFormModal, ingredients: next });
                            }}
                            className="w-full rounded-lg border border-slate-200 bg-white pl-7 pr-2 py-1.5 text-xs font-bold text-emerald-700"
                          />
                        </div>
                      </div>
                      <div className="col-span-2 sm:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (recipeFormModal.ingredients.length <= 1) return;
                            const next = recipeFormModal.ingredients.filter((_, i) => i !== idx);
                            setRecipeFormModal({ ...recipeFormModal, ingredients: next });
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Modo de Preparo */}
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                  Modo de Preparo (1 etapa por linha) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={recipeFormModal.stepsText}
                  onChange={(e) =>
                    setRecipeFormModal({ ...recipeFormModal, stepsText: e.target.value })
                  }
                  placeholder="Descreva cada passo do preparo em uma linha..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs leading-relaxed"
                />
              </div>

              {/* 5. Como a Porção Deve Ser Servida: Peso, Montagem e Finalização + Instruções Específicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 block">
                    Como a Porção Deve Ser Servida (Peso, Montagem e Finalização) *
                  </label>
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">
                      Peso da Porção Servida:
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 380g por porção"
                      value={recipeFormModal.portionWeight}
                      onChange={(e) =>
                        setRecipeFormModal({
                          ...recipeFormModal,
                          portionWeight: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">
                      Montagem do Prato e Finalização:
                    </span>
                    <textarea
                      rows={3}
                      required
                      placeholder="Descreva o empratamento, disposição dos itens e finalização..."
                      value={recipeFormModal.platingInstructions}
                      onChange={(e) =>
                        setRecipeFormModal({
                          ...recipeFormModal,
                          platingInstructions: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2 p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-amber-900 block">
                    Outras Instruções Específicas (Conservação, Validade, Alergênicos)
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Ex: Temperatura de serviço, validade na geladeira/freezer, utensílios recomendados, ponto crítico de cocção..."
                    value={recipeFormModal.specificInstructions}
                    onChange={(e) =>
                      setRecipeFormModal({
                        ...recipeFormModal,
                        specificInstructions: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs"
                  />
                </div>
              </div>

              {/* 6. Informações Nutricionais & Tags */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Calorias (kcal/porção)
                  </label>
                  <input
                    type="number"
                    value={recipeFormModal.calories}
                    onChange={(e) =>
                      setRecipeFormModal({ ...recipeFormModal, calories: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Proteínas (g)
                  </label>
                  <input
                    type="number"
                    value={recipeFormModal.protein}
                    onChange={(e) =>
                      setRecipeFormModal({ ...recipeFormModal, protein: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Carboidratos (g)
                  </label>
                  <input
                    type="number"
                    value={recipeFormModal.carbs}
                    onChange={(e) =>
                      setRecipeFormModal({ ...recipeFormModal, carbs: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Gorduras (g)
                  </label>
                  <input
                    type="number"
                    value={recipeFormModal.fat}
                    onChange={(e) =>
                      setRecipeFormModal({ ...recipeFormModal, fat: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs"
                  />
                </div>
              </div>

              {/* Etiquetas / Classificação Dietética */}
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-2">
                  Classificação & Etiquetas da Ficha Técnica
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.filter((t) => t !== 'Todas').map((tag) => {
                    const selected = (recipeFormModal.tags || []).includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => {
                          const current = recipeFormModal.tags || [];
                          const next = selected
                            ? current.filter((t) => t !== tag)
                            : [...current, tag];
                          setRecipeFormModal({
                            ...recipeFormModal,
                            tags: next.length > 0 ? next : ['Econômico'],
                          });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          selected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setRecipeFormModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingRecipe}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  {savingRecipe ? 'Salvando Ficha Técnica...' : 'Salvar Ficha Técnica'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SWAP MEAL SLOT */}
      {swapSlotTarget && (
        <div
          onClick={() => setSwapSlotTarget(null)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  Trocar Refeição: {swapSlotTarget.day} ({swapSlotTarget.slot})
                </h3>
                <p className="text-xs text-slate-500">
                  Preço médio estimado para {user.household_size} pessoas
                </p>
              </div>
              <button
                onClick={() => setSwapSlotTarget(null)}
                className="p-2 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar receita para este horário..."
                value={swapSearch}
                onChange={(e) => setSwapSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2.5">
              {[...recipes]
                .filter(
                  (r) =>
                    !swapSearch.trim() ||
                    r.title.toLowerCase().includes(swapSearch.toLowerCase()) ||
                    r.category.toLowerCase().includes(swapSearch.toLowerCase())
                )
                .sort((a, b) => {
                  const aMatch = a.category === swapSlotTarget.slot ? 0 : 1;
                  const bMatch = b.category === swapSlotTarget.slot ? 0 : 1;
                  return aMatch - bMatch;
                })
                .map((r) => {
                  const cost = getRecipeMealCost(r);
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        handleSwapSlotRecipe(r.id);
                        setSwapSearch('');
                      }}
                      className="w-full p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 flex items-center justify-between gap-3 text-left transition cursor-pointer"
                    >
                    <div className="flex items-center gap-3">
                      <img
                        src={r.image}
                        alt={r.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-200"
                      />
                      <div>
                        <span className="text-[10px] font-bold uppercase text-emerald-700">
                          {r.category} • {r.portionWeight}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{r.title}</h4>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-sm text-emerald-700">
                        {formatBRL(cost)}
                      </span>
                      <p className="text-[10px] text-slate-400">{r.prepTime} min</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: AUTH & HOUSEHOLD SHARING */}
      {authModalOpen && (
        <div
          onClick={() => setAuthModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-slate-900">
                Conta & Compartilhamento Familiar
              </h3>
              <button
                onClick={() => setAuthModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Nome da Família / Perfil
                </label>
                <input
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Código de Convite da Casa (Compartilhe com a família)
                </label>
                <input
                  type="text"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-mono font-bold text-emerald-700 bg-emerald-50/50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm cursor-pointer mt-2"
              >
                Salvar Dados no SQLite
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: NOVIDADES DA VERSÃO (APARECE APENAS NA ABERTURA QUANDO ATUALIZADO) */}
      {changelogModalOpen && latestRelease && (
        <div
          onClick={handleDismissChangelog}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white relative">
              <button
                onClick={handleDismissChangelog}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Novidades da Versão v{latestRelease.version}</span>
              </div>
              <h3 className="text-xl font-extrabold">{latestRelease.title}</h3>
              <p className="text-xs text-emerald-50 mt-1 leading-relaxed">
                {latestRelease.summary}
              </p>
            </div>

            <div className="p-6 space-y-5">
              <div className="rounded-2xl p-4 bg-emerald-50/60 border border-emerald-200">
                <ul className="space-y-2">
                  {latestRelease.items.map((item, i) => (
                    <li key={i} className="text-sm text-slate-800 leading-relaxed flex gap-2">
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleDismissChangelog}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xs cursor-pointer transition"
                >
                  Entendi, vamos lá!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: MODO COZINHAR PASSO A PASSO (BOTÃO PLAY) */}
      {cookingSession && (() => {
        const rec = cookingSession.recipe;
        const steps = Array.isArray(rec.steps) ? rec.steps : [];
        const totalStages = steps.length + 2; // 0 = Mise en Place, 1..N = Passos, N+1 = Montagem e Finalização
        const currentIdx = cookingSession.stepIndex;
        const isMiseEnPlace = currentIdx === 0;
        const isFinalPlating = currentIdx === steps.length + 1;
        const currentStepText = !isMiseEnPlace && !isFinalPlating ? steps[currentIdx - 1] : '';
        const suggestedSeconds = currentStepText ? extractStepSeconds(currentStepText) : 0;
        const baseServings = rec.servings || 2;
        const scaleRatio = (cookingSession.scaleServings || baseServings) / baseServings;
        const progressPercent = Math.round(((currentIdx + 1) / totalStages) * 100);

        // Identify ingredients mentioned in the current step
        const stepIngredients = !isMiseEnPlace && !isFinalPlating
          ? (rec.ingredients || []).filter((ing) => {
              const words = String(ing.name || '')
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .split(/\s+/)
                .filter((w) => w.length >= 4);
              const stepNorm = String(currentStepText)
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
              return words.some((w) => stepNorm.includes(w));
            })
          : [];

        return (
          <div
            onClick={() => setCookingSession(null)}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* TOP HEADER */}
              <div className="bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 p-5 sm:p-6 text-white relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={resolveRecipeImage(rec.image)}
                      alt={rec.title}
                      onError={handleRecipeImgError}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-white/30 shadow-md shrink-0"
                    />
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-extrabold uppercase tracking-wider mb-1">
                        <Play className="w-3 h-3 fill-current" />
                        <span>Modo Cozinhar Guiado • Etapa {currentIdx + 1} de {totalStages}</span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-extrabold leading-tight">
                        {rec.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-50 mt-1">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {rec.prepTime} min total
                        </span>
                        <span>•</span>
                        <span>Rendimento ajustado: <strong>{cookingSession.scaleServings} porções</strong></span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setCookingSession(null)}
                    className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer shrink-0 transition"
                    title="Sair do Modo Cozinhar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* PROGRESS BAR & STEP PILLS */}
                <div className="mt-4">
                  <div className="w-full h-2 rounded-full bg-black/20 overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1">
                    <button
                      type="button"
                      onClick={() =>
                        setCookingSession((prev) => ({ ...prev, stepIndex: 0 }))
                      }
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap cursor-pointer transition ${
                        isMiseEnPlace
                          ? 'bg-white text-emerald-800 shadow-xs'
                          : 'bg-white/15 text-white hover:bg-white/25'
                      }`}
                    >
                      🥗 1. Mise en Place
                    </button>
                    {steps.map((_, idx) => {
                      const stepNum = idx + 1;
                      const isCurrent = currentIdx === stepNum;
                      const isDone = !!cookingSession.completedSteps[idx];
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            const nextSec = extractStepSeconds(steps[idx]);
                            setCookingSession((prev) => ({
                              ...prev,
                              stepIndex: stepNum,
                              timerSeconds: prev.timerRunning ? prev.timerSeconds : nextSec,
                              timerFinished: false,
                            }));
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap cursor-pointer transition flex items-center gap-1 ${
                            isCurrent
                              ? 'bg-white text-emerald-800 shadow-xs'
                              : isDone
                              ? 'bg-emerald-900/50 text-emerald-100 border border-white/20'
                              : 'bg-white/15 text-white hover:bg-white/25'
                          }`}
                        >
                          {isDone ? '✓' : '🍳'} Passo {stepNum}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() =>
                        setCookingSession((prev) => ({
                          ...prev,
                          stepIndex: steps.length + 1,
                        }))
                      }
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap cursor-pointer transition ${
                        isFinalPlating
                          ? 'bg-white text-emerald-800 shadow-xs'
                          : 'bg-white/15 text-white hover:bg-white/25'
                      }`}
                    >
                      🍽️ Empratamento
                    </button>
                  </div>
                </div>
              </div>

              {/* PERSISTENT TIMER BAR (WHEN ACTIVE OR SUGGESTED) */}
              {(cookingSession.timerRunning || cookingSession.timerSeconds > 0 || cookingSession.timerFinished || suggestedSeconds > 0) && (
                <div
                  className={`px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3 transition ${
                    cookingSession.timerFinished
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold ${
                        cookingSession.timerFinished
                          ? 'bg-amber-500 text-white animate-bounce'
                          : cookingSession.timerRunning
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Timer className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {cookingSession.timerFinished
                          ? '🔔 Tempo Concluído!'
                          : cookingSession.timerRunning
                          ? 'Cronômetro em andamento'
                          : 'Cronômetro da Etapa'}
                      </div>
                      <div className="text-xl font-black font-mono tracking-tight">
                        {formatTimerMMSS(
                          cookingSession.timerSeconds > 0
                            ? cookingSession.timerSeconds
                            : suggestedSeconds
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {!cookingSession.timerRunning ? (
                      <button
                        type="button"
                        onClick={() =>
                          setCookingSession((prev) => ({
                            ...prev,
                            timerSeconds:
                              prev.timerSeconds > 0
                                ? prev.timerSeconds
                                : suggestedSeconds > 0
                                ? suggestedSeconds
                                : 60,
                            timerRunning: true,
                            timerFinished: false,
                          }))
                        }
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>
                          {cookingSession.timerSeconds > 0
                            ? 'Retomar Timer'
                            : suggestedSeconds > 0
                            ? `Iniciar Timer (${formatTimerMMSS(suggestedSeconds)})`
                            : 'Iniciar 1 min'}
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setCookingSession((prev) => ({
                            ...prev,
                            timerRunning: false,
                          }))
                        }
                        className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pausar</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setCookingSession((prev) => ({
                          ...prev,
                          timerSeconds: (prev.timerSeconds || 0) + 60,
                          timerFinished: false,
                        }))
                      }
                      className="px-2.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer"
                    >
                      +1 min
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCookingSession((prev) => ({
                          ...prev,
                          timerSeconds: (prev.timerSeconds || 0) + 300,
                          timerFinished: false,
                        }))
                      }
                      className="px-2.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer"
                    >
                      +5 min
                    </button>
                    {(cookingSession.timerSeconds > 0 || cookingSession.timerFinished) && (
                      <button
                        type="button"
                        onClick={() =>
                          setCookingSession((prev) => ({
                            ...prev,
                            timerSeconds: 0,
                            timerRunning: false,
                            timerFinished: false,
                          }))
                        }
                        className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 font-bold text-xs cursor-pointer"
                      >
                        Zerar
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* MAIN STAGE CONTENT */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
                {isMiseEnPlace && (
                  <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
                      <div>
                        <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                          Etapa Inicial • Mise en Place
                        </span>
                        <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                          Separe e pese os ingredientes na bancada
                        </h3>
                        <p className="text-xs text-slate-600">
                          Marque cada insumo abaixo conforme for separando para cozinhar sem imprevistos.
                        </p>
                      </div>

                      {/* PORTION SCALER */}
                      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-emerald-200 shrink-0 self-start sm:self-center">
                        <span className="text-xs font-bold text-slate-500">Porções:</span>
                        <button
                          type="button"
                          onClick={() =>
                            setCookingSession((prev) => ({
                              ...prev,
                              scaleServings: Math.max(1, (prev.scaleServings || 2) - 1),
                            }))
                          }
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-sm font-extrabold text-emerald-700 min-w-[2ch] text-center">
                          {cookingSession.scaleServings}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setCookingSession((prev) => ({
                              ...prev,
                              scaleServings: Math.min(20, (prev.scaleServings || 2) + 1),
                            }))
                          }
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(rec.ingredients || []).map((ing, idx) => {
                        const checked = !!cookingSession.checkedIngredients[idx];
                        const scaledAmt = Number((ing.amount * scaleRatio).toFixed(2));
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              setCookingSession((prev) => ({
                                ...prev,
                                checkedIngredients: {
                                  ...prev.checkedIngredients,
                                  [idx]: !prev.checkedIngredients[idx],
                                },
                              }))
                            }
                            className={`p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 cursor-pointer transition ${
                              checked
                                ? 'bg-emerald-50/70 border-emerald-300 text-slate-400 line-through'
                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-2xs'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-2xl shrink-0">
                                {getIngredientEmoji(ing.name, ing.aisle)}
                              </span>
                              <div className="min-w-0">
                                <div className="font-bold text-sm truncate">{ing.name}</div>
                                <div className="text-xs text-slate-500">
                                  {scaledAmt} {ing.unit}
                                </div>
                              </div>
                            </div>
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                checked
                                  ? 'bg-emerald-600 text-white'
                                  : 'border-2 border-slate-300 text-transparent'
                              }`}
                            >
                              ✓
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!isMiseEnPlace && !isFinalPlating && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider">
                        🍳 Passo {currentIdx} de {steps.length}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setCookingSession((prev) => ({
                            ...prev,
                            completedSteps: {
                              ...prev.completedSteps,
                              [currentIdx - 1]: !prev.completedSteps[currentIdx - 1],
                            },
                          }))
                        }
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
                          cookingSession.completedSteps[currentIdx - 1]
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {cookingSession.completedSteps[currentIdx - 1]
                            ? 'Passo Concluído'
                            : 'Marcar como Concluído'}
                        </span>
                      </button>
                    </div>

                    {/* LARGE READABLE STEP CARD */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200/80 shadow-inner">
                      <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed">
                        {currentStepText}
                      </p>
                    </div>

                    {/* INGREDIENTS MENTIONED IN THIS STEP */}
                    {stepIngredients.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                          Insumos utilizados neste passo:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {stepIngredients.map((ing, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-bold"
                            >
                              <span className="text-base">
                                {getIngredientEmoji(ing.name, ing.aisle)}
                              </span>
                              <span>{ing.name}:</span>
                              <strong className="text-emerald-700">
                                {Number((ing.amount * scaleRatio).toFixed(2))} {ing.unit}
                              </strong>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* NEXT STEP PREVIEW */}
                    {currentIdx < steps.length && (
                      <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200/70 flex items-start gap-3">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 shrink-0 mt-0.5">
                          A seguir (Passo {currentIdx + 1}):
                        </span>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {steps[currentIdx]}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {isFinalPlating && (
                  <div className="space-y-5">
                    <div className="p-6 rounded-3xl bg-emerald-50/80 border-2 border-emerald-200 text-center space-y-2">
                      <div className="text-4xl">👨‍🍳🍽️</div>
                      <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                        Etapa Final • Padrão de Serviço
                      </div>
                      <h3 className="text-2xl font-extrabold text-slate-900">
                        Montagem, Peso da Porção e Finalização
                      </h3>
                      <p className="text-xs text-slate-600 max-w-md mx-auto">
                        Siga as instruções da ficha técnica abaixo para empratar e servir sua refeição com padrão de restaurante.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="text-[11px] font-bold uppercase text-slate-400">
                          Peso Recomendado por Porção
                        </div>
                        <div className="text-lg font-extrabold text-slate-900 mt-1">
                          ⚖️ {rec.portionWeight || '300g por porção'}
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="text-[11px] font-bold uppercase text-slate-400">
                          Valor Nutricional por Porção
                        </div>
                        <div className="text-sm font-extrabold text-emerald-700 mt-1">
                          🔥 {rec.calories} kcal • 💪 {rec.protein}g Prot • 🌾 {rec.carbs || 30}g Carb • 🥑 {rec.fat || 10}g Gord
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                      <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                        🍽️ Instruções de Montagem e Finalização
                      </div>
                      <p className="text-sm text-slate-800 leading-relaxed">
                        {rec.platingInstructions || 'Sirva imediatamente após o preparo em prato aquecido.'}
                      </p>
                    </div>

                    {rec.specificInstructions && (
                      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                        <div className="text-xs font-extrabold uppercase tracking-wider text-amber-800">
                          📌 Dica do Chef & Conservação
                        </div>
                        <p className="text-xs text-amber-950 leading-relaxed">
                          {rec.specificInstructions}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* BOTTOM NAVIGATION FOOTER */}
              <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={currentIdx === 0}
                  onClick={() => {
                    const prevIdx = Math.max(0, currentIdx - 1);
                    const nextSec =
                      prevIdx >= 1 && prevIdx <= steps.length
                        ? extractStepSeconds(steps[prevIdx - 1])
                        : 0;
                    setCookingSession((prev) => ({
                      ...prev,
                      stepIndex: prevIdx,
                      timerSeconds: prev.timerRunning ? prev.timerSeconds : nextSec,
                      timerFinished: false,
                    }));
                  }}
                  className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-bold text-sm border border-slate-200 flex items-center gap-2 cursor-pointer transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Etapa Anterior</span>
                </button>

                <div className="text-xs font-bold text-slate-400 hidden sm:block">
                  {isMiseEnPlace
                    ? 'Separe os ingredientes para começar'
                    : isFinalPlating
                    ? 'Prato pronto para servir!'
                    : `Passo ${currentIdx} de ${steps.length}`}
                </div>

                {!isFinalPlating ? (
                  <button
                    type="button"
                    onClick={() => {
                      const nextIdx = Math.min(totalStages - 1, currentIdx + 1);
                      const nextSec =
                        nextIdx >= 1 && nextIdx <= steps.length
                          ? extractStepSeconds(steps[nextIdx - 1])
                          : 0;
                      setCookingSession((prev) => ({
                        ...prev,
                        stepIndex: nextIdx,
                        completedSteps:
                          currentIdx >= 1
                            ? { ...prev.completedSteps, [currentIdx - 1]: true }
                            : prev.completedSteps,
                        timerSeconds: prev.timerRunning ? prev.timerSeconds : nextSec,
                        timerFinished: false,
                      }));
                    }}
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20 transition"
                  >
                    <span>
                      {isMiseEnPlace
                        ? 'Começar Passo 1'
                        : currentIdx === steps.length
                        ? 'Ir para Empratamento'
                        : 'Próximo Passo'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCookingSession(null)}
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20 transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Concluir Receita!</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
