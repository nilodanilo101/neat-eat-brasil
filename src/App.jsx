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
  EyeOff,
  Sun,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Timer,
  Repeat,
  ShoppingBag,
  Maximize2,
  Lightbulb,
  Snowflake,
  ListChecks,
  Receipt,
  ScanLine,
  QrCode,
  TrendingDown,
  TrendingUp,
  Volume2,
  VolumeX,
  MoreVertical,
  CalendarDays,
} from 'lucide-react';
import {
  playChefServiceBell,
  playCookingTimerAlarm,
  playPopCheck,
  playStockFridgeChime,
  isSoundEnabled,
  toggleSound,
} from './soundEffects.js';

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const SLOTS = ['Café da Manhã', 'Almoço', 'Jantar'];

function getNextDay(currentDay) {
  const idx = DAYS.indexOf(currentDay);
  if (idx === -1) return DAYS[0];
  return DAYS[(idx + 1) % DAYS.length];
}
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
  const num = Number(value);
  const safe = Number.isFinite(num) ? num : 0;
  return safe.toLocaleString('pt-BR', {
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
  playCookingTimerAlarm();
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
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Local UI controls
  const [budgetDraft, setBudgetDraft] = useState(250);
  const [selectedRecipeModal, setSelectedRecipeModal] = useState(null);
  const [swapSlotTarget, setSwapSlotTarget] = useState(null); // { day, slot }
  const [changelogModalOpen, setChangelogModalOpen] = useState(false);

  // Planner UI Mode & State (Visão Semanal vs Foco Diário + Progressive Disclosure Menu)
  const [plannerViewMode, setPlannerViewMode] = useState('week'); // 'week' | 'day'
  const [plannerSelectedDay, setPlannerSelectedDay] = useState('Segunda');
  const [activeMealMenu, setActiveMealMenu] = useState(null); // { day, slot } | null

  useEffect(() => {
    function handleGlobalClick(e) {
      if (activeMealMenu && !e.target.closest('[data-meal-menu]')) {
        setActiveMealMenu(null);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setActiveMealMenu(null);
      }
    }
    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeMealMenu]);

  // Ficha Técnica Editor Modal state
  const [recipeFormModal, setRecipeFormModal] = useState(null);
  const [savingRecipe, setSavingRecipe] = useState(false);
  const [searchingPhotos, setSearchingPhotos] = useState(false);
  const [candidatePhotos, setCandidatePhotos] = useState([]);

  // Guided Step-by-Step Cooking Mode state (Botão Play)
  const [cookingSession, setCookingSession] = useState(null);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [cookingDrawerOpen, setCookingDrawerOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null); // { src, alt, title }

  // Shopping List "Modo Mercado" (Ocultar comprados)
  const [hideCheckedShopping, setHideCheckedShopping] = useState(false);

  // Quick Repeat / Marmita Meal Target
  const [repeatRecipeTarget, setRepeatRecipeTarget] = useState(null); // { recipe, sourceDay, sourceSlot }

  // SEFAZ / NFC-e Invoice & Price Calibration Modal State
  const [sefazModalOpen, setSefazModalOpen] = useState(false);
  const [sefazText, setSefazText] = useState('');
  const [sefazLoading, setSefazLoading] = useState(false);
  const [sefazConfirming, setSefazConfirming] = useState(false);
  const [sefazInvoice, setSefazInvoice] = useState(null);
  const [sefazError, setSefazError] = useState('');
  const [sefazSuccessMsg, setSefazSuccessMsg] = useState('');

  async function handlePasteClipboard() {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setSefazText(text);
          setSefazError('');
        }
      }
    } catch {
      // Ignora erro se permissão negada
    }
  }

  async function handleParseSefaz() {
    if (!sefazText.trim()) return;
    setSefazLoading(true);
    setSefazError('');
    setSefazSuccessMsg('');
    try {
      const res = await fetch('/api/sefaz/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: sefazText,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Falha ao ler nota fiscal');
      }
      setSefazInvoice(json.invoice);
    } catch (err) {
      setSefazError(err.message || 'Erro ao processar cupom fiscal');
    } finally {
      setSefazLoading(false);
    }
  }

  async function handleConfirmSefazInvoice() {
    if (!sefazInvoice || !sefazInvoice.items) return;
    setSefazConfirming(true);
    setSefazError('');
    try {
      const res = await fetch('/api/sefaz/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supermarket: sefazInvoice.supermarket,
          purchaseDate: sefazInvoice.purchaseDate,
          totalValue: sefazInvoice.totalValue,
          items: sefazInvoice.items,
        }),
      });
      const nextData = await res.json();
      if (!res.ok || !nextData.success) {
        throw new Error(nextData.error || 'Falha ao confirmar calibração');
      }
      setData(nextData);
      playStockFridgeChime();
      setSefazSuccessMsg(
        `✅ Compra confirmada com sucesso! ${nextData.calibratedCount} insumos calibrados e ${nextData.stockedCount} itens guardados na sua Geladeira.`
      );
      setTimeout(() => {
        setSefazModalOpen(false);
        setSefazInvoice(null);
        setSefazText('');
        setSefazSuccessMsg('');
      }, 2400);
    } catch (err) {
      setSefazError(err.message || 'Erro ao salvar calibragem e atualizar geladeira');
    } finally {
      setSefazConfirming(false);
    }
  }

  function handleToggleSefazItemStock(idx) {
    if (!sefazInvoice) return;
    const updated = { ...sefazInvoice };
    const items = [...updated.items];
    items[idx] = { ...items[idx], stockInFridge: !items[idx].stockInFridge };
    updated.items = items;
    setSefazInvoice(updated);
  }

  function handleToggleAllSefazStock(checked) {
    if (!sefazInvoice) return;
    const updated = { ...sefazInvoice };
    updated.items = updated.items.map((i) => ({
      ...i,
      stockInFridge: i.isNonFood ? false : checked,
    }));
    setSefazInvoice(updated);
  }

  // Screen Wake Lock API: impede que a tela desligue durante o Modo Cozinhar
  useEffect(() => {
    let sentinel = null;
    async function requestWake() {
      if (cookingSession && 'wakeLock' in navigator) {
        try {
          sentinel = await navigator.wakeLock.request('screen');
          setWakeLockActive(true);
          sentinel.addEventListener('release', () => {
            setWakeLockActive(false);
          });
        } catch (e) {
          console.log('Wake Lock indisponível ou bloqueado:', e);
          setWakeLockActive(false);
        }
      }
    }
    if (cookingSession) {
      requestWake();
    } else {
      setWakeLockActive(false);
    }
    return () => {
      if (sentinel) {
        sentinel.release().catch(() => {});
        sentinel = null;
      }
    };
  }, [cookingSession]);

  // Atalhos de Teclado no Modo Cozinhar: [Espaço] para Timer, [← / →] para Passos
  useEffect(() => {
    if (!cookingSession) return;
    function handleCookingKeys(e) {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setCookingSession((prev) => {
          if (!prev) return prev;
          if (prev.timerRunning) {
            return { ...prev, timerRunning: false };
          }
          const steps = Array.isArray(prev.recipe.steps) ? prev.recipe.steps : [];
          const currentStep =
            prev.stepIndex >= 1 && prev.stepIndex <= steps.length
              ? steps[prev.stepIndex - 1]
              : '';
          const suggested = currentStep ? extractStepSeconds(currentStep) : 0;
          const secs = prev.timerSeconds > 0 ? prev.timerSeconds : suggested > 0 ? suggested : 60;
          return {
            ...prev,
            timerSeconds: secs,
            timerRunning: true,
            timerFinished: false,
          };
        });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const steps = Array.isArray(cookingSession.recipe.steps) ? cookingSession.recipe.steps : [];
        const totalStages = steps.length + 2;
        const nextIdx = Math.min(totalStages - 1, cookingSession.stepIndex + 1);
        if (nextIdx === totalStages - 1) {
          playChefServiceBell();
        }
        const nextSec =
          nextIdx >= 1 && nextIdx <= steps.length
            ? extractStepSeconds(steps[nextIdx - 1])
            : 0;
        setCookingSession((prev) => ({
          ...prev,
          stepIndex: nextIdx,
          completedSteps:
            prev.stepIndex >= 1
              ? { ...prev.completedSteps, [prev.stepIndex - 1]: true }
              : prev.completedSteps,
          timerSeconds: prev.timerRunning ? prev.timerSeconds : nextSec,
          timerFinished: false,
        }));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const steps = Array.isArray(cookingSession.recipe.steps) ? cookingSession.recipe.steps : [];
        const prevIdx = Math.max(0, cookingSession.stepIndex - 1);
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
      }
    }
    window.addEventListener('keydown', handleCookingKeys);
    return () => window.removeEventListener('keydown', handleCookingKeys);
  }, [cookingSession]);

  useEffect(() => {
    if (!cookingSession?.timerRunning) return;
    const interval = setInterval(() => {
      setCookingSession((prev) => {
        if (!prev || !prev.timerRunning) return prev;
        if (prev.timerSeconds <= 1) {
          playCookingTimerAlarm();
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
  const [mealPriceTier, setMealPriceTier] = useState('all'); // 'all' | '$' | '$$' | '$$$'

  // Suggestions (Descoberta de Pratos) tab state
  const [suggestionCatFilter, setSuggestionCatFilter] = useState('Todas');
  const [suggestionSearch, setSuggestionSearch] = useState('');
  const [suggestionFridgeOnly, setSuggestionFridgeOnly] = useState(false);
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
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const [newFridgeItem, setNewFridgeItem] = useState('');

  // Market Prices Intelligence state
  const [pricesModalOpen, setPricesModalOpen] = useState(false);
  const [priceSearchQuery, setPriceSearchQuery] = useState('');
  const [priceFilterAisle, setPriceFilterAisle] = useState('Todos');
  const [editingPriceKey, setEditingPriceKey] = useState(null);
  const [editingPriceValue, setEditingPriceValue] = useState('');
  const [recalculatingPrices, setRecalculatingPrices] = useState(false);
  const [priceSuccessToast, setPriceSuccessToast] = useState('');

  // APIs & Integrations (Gemini, Open Food Facts, Unsplash, TACO)
  const [apiKeysModalOpen, setApiKeysModalOpen] = useState(false);
  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [unsplashKeyInput, setUnsplashKeyInput] = useState('');
  const [savingApiKeys, setSavingApiKeys] = useState(false);
  const [apiKeysToast, setApiKeysToast] = useState('');

  // Open Food Facts lookup state
  const [offModalOpen, setOffModalOpen] = useState(false);
  const [offSearchQuery, setOffSearchQuery] = useState('');
  const [offSearching, setOffSearching] = useState(false);
  const [offResults, setOffResults] = useState([]);

  async function fetchState() {
    try {
      const res = await fetch('/api/state');
      const json = await res.json();
      setData(json);
      setBudgetDraft(json.user.weekly_budget);
      if (json.user) {
        setGeminiKeyInput(json.user.gemini_api_key || '');
        setUnsplashKeyInput(json.user.unsplash_access_key || '');
      }
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
        setChangelogModalOpen(false);
        setSefazModalOpen(false);
        setCookingDrawerOpen(false);
        setCookingSession(null);
        setRepeatRecipeTarget(null);
        setPricesModalOpen(false);
        setApiKeysModalOpen(false);
        setOffModalOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  async function handleRepeatMealToSlot(targetDay, targetSlot, recipeId) {
    try {
      const res = await fetch('/api/plan/slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day: targetDay,
          slot: targetSlot,
          recipe_id: recipeId,
        }),
      });
      const json = await res.json();
      setData(json);
      setRepeatRecipeTarget(null);
      setSwipeFeedback({
        direction: 'right',
        title: `Prato repetido para ${targetSlot} de ${targetDay}!`,
      });
      setTimeout(() => setSwipeFeedback(null), 3000);
    } catch (err) {
      console.error('Erro ao repetir refeição:', err);
    }
  }

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
    try {
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
    } catch (err) {
      console.error('Erro ao gerar plano inteligente:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSwapSlotRecipe(recipeId) {
    if (!swapSlotTarget) return;
    try {
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
    } catch (err) {
      console.error('Erro ao trocar receita do slot:', err);
    }
  }

  async function handleToggleFridgeItem(name, category = 'Mercearia') {
    playPopCheck();
    const res = await fetch('/api/fridge/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category }),
    });
    const json = await res.json();
    setData(json);
  }

  async function handleClearFridge() {
    if (!window.confirm('Tem certeza de que deseja esvaziar todos os itens da geladeira?')) return;
    try {
      const res = await fetch('/api/fridge/clear', { method: 'POST' });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Erro ao limpar geladeira:', err);
    }
  }

  async function handleToggleShoppingCheck(itemKey) {
    playPopCheck();
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
    setImportError('');
    setImportSuccess('');
    const cleanUrl = importInput.trim();
    if (!cleanUrl) return;

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      setImportError(
        'Apenas links válidos são aceitos (iniciando com http:// ou https://). A digitação livre de nome do prato foi desativada para garantir a precisão dos dados e evitar anomalias.'
      );
      return;
    }

    setImporting(true);
    try {
      const res = await fetch('/api/recipes/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: cleanUrl, category: importCategory }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Falha ao importar receita pelo link');
      }
      setData(json);
      setImportInput('');
      setImportSuccess('Receita importada com sucesso com fotos dos passos e ficha técnica calibrada!');
      setTimeout(() => setImportSuccess(''), 4500);
    } catch (err) {
      setImportError(err.message || 'Erro ao importar receita pelo link informado.');
    } finally {
      setImporting(false);
    }
  }

  async function handleUpdateMarketPrice(key, newPrice) {
    const num = parseFloat(String(newPrice).replace(',', '.'));
    if (!key || isNaN(num) || num <= 0) return;
    try {
      const res = await fetch(`/api/market-prices/${encodeURIComponent(key)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: num }),
      });
      const json = await res.json();
      if (json.fullState) {
        setData(json.fullState);
      }
      playStockFridgeChime();
      setEditingPriceKey(null);
      setEditingPriceValue('');
      setPriceSuccessToast('Preço médio calibrado e fichas técnicas recalculadas!');
      setTimeout(() => setPriceSuccessToast(''), 4000);
    } catch (err) {
      console.error('Erro ao atualizar preço de mercado:', err);
    }
  }

  async function handleRecalculatePrices() {
    setRecalculatingPrices(true);
    try {
      const res = await fetch('/api/market-prices/recalculate', { method: 'POST' });
      const json = await res.json();
      if (json.fullState) {
        setData(json.fullState);
      }
      playChefServiceBell();
      setPriceSuccessToast('Todas as fichas técnicas foram recalculadas com sucesso!');
      setTimeout(() => setPriceSuccessToast(''), 4000);
    } catch (err) {
      console.error('Erro ao recalcular custos:', err);
    } finally {
      setRecalculatingPrices(false);
    }
  }

  async function handleSaveApiKeys(e) {
    if (e) e.preventDefault();
    setSavingApiKeys(true);
    try {
      const res = await fetch('/api/user/api-keys', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gemini_api_key: geminiKeyInput,
          unsplash_access_key: unsplashKeyInput,
        }),
      });
      const json = await res.json();
      setData(json);
      playStockFridgeChime();
      setApiKeysToast('Chaves de API salvas e conectadas com sucesso!');
      setTimeout(() => setApiKeysToast(''), 4000);
    } catch (err) {
      console.error('Erro ao salvar chaves:', err);
    } finally {
      setSavingApiKeys(false);
    }
  }

  async function handleSearchOpenFoodFacts(query) {
    if (!query || query.trim().length < 2) return;
    setOffSearching(true);
    try {
      const res = await fetch(`/api/open-food-facts/search?q=${encodeURIComponent(query.trim())}`);
      const json = await res.json();
      setOffResults(json.products || []);
    } catch (err) {
      console.error('Erro ao buscar Open Food Facts:', err);
    } finally {
      setOffSearching(false);
    }
  }

  async function handleAddOffProductToFridge(product) {
    if (!product) return;
    try {
      const aisle = product.categories?.[0] || 'Mercearia';
      const cleanAisle = aisle.toLowerCase().includes('latic') || aisle.toLowerCase().includes('queijo') || aisle.toLowerCase().includes('leite')
        ? 'Laticínios e Ovos'
        : aisle.toLowerCase().includes('carne') || aisle.toLowerCase().includes('frango') || aisle.toLowerCase().includes('peixe')
        ? 'Açougue'
        : aisle.toLowerCase().includes('horti') || aisle.toLowerCase().includes('fruta') || aisle.toLowerCase().includes('legume')
        ? 'Hortifruti'
        : 'Mercearia';

      const res = await fetch('/api/fridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${product.name} ${product.brand ? `(${product.brand})` : ''}`.trim(),
          category: cleanAisle,
          amount: 1,
          unit: product.quantity || 'un',
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Falha ao adicionar produto à geladeira');
      }
      setData(json);
      playPopCheck();
      setOffModalOpen(false);
    } catch (err) {
      console.error('Erro ao adicionar produto:', err);
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
        if (direction === 'right') {
          playStockFridgeChime();
        } else {
          playPopCheck();
        }
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
    const fridgeItems = data.fridgeItems || [];
    const scale = data.user.household_size;

    const isIngInFridge = (ingName) => {
      const target = (ingName || '').toLowerCase().trim();
      for (const f of fridgeItems) {
        const fName = (f.name || '').toLowerCase().trim();
        if (fName === target) return true;
        if (fName.length >= 4 && target.includes(fName)) return true;
        if (target.length >= 4 && fName.includes(target)) return true;
      }
      return false;
    };

    return data.recipes
      .map((r) => {
        const totalIngs = r.ingredients.length;
        const matchedIngs = r.ingredients.filter((ing) => isIngInFridge(ing.name));
        const missingIngs = r.ingredients.filter((ing) => !isIngInFridge(ing.name));
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
    marketPrices = [],
    groceryHistory = [],
    tasteProfile = null,
  } = data;
  const isOverBudget = totals.netToBuyTotal > user.weekly_budget;
  const budgetPct = Math.min(100, Math.round((totals.netToBuyTotal / Math.max(1, user.weekly_budget)) * 100));

  function getRecipeMealCost(recipe) {
    if (!recipe) return 0;
    const cps = Number(recipe.costPerServing) || (Number(recipe.baseCost) || 0) / Math.max(1, Number(recipe.servings) || 1);
    const size = Math.max(1, Number(user?.household_size) || 1);
    return Number((cps * size).toFixed(2)) || 0;
  }

  function getRecipeServingCost(recipe) {
    if (!recipe) return 0;
    const cps = Number(recipe.costPerServing) || (Number(recipe.baseCost) || 0) / Math.max(1, Number(recipe.servings) || 1);
    return Number(cps.toFixed(2)) || 0;
  }

  const filteredCatalog = recipes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ingredients.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = categoryFilter === 'Todas' || r.category === categoryFilter;
    const matchesTag = tagFilter === 'Todas' || r.tags.includes(tagFilter);

    // Sistema básico de custo por refeição ($ / $$ / $$$)
    const mealCost = getRecipeMealCost(r);
    let matchesPrice = true;
    if (mealPriceTier === '$') {
      matchesPrice = mealCost <= 25;
    } else if (mealPriceTier === '$$') {
      matchesPrice = mealCost > 25 && mealCost <= 50;
    } else if (mealPriceTier === '$$$') {
      matchesPrice = mealCost > 50;
    }

    return matchesSearch && matchesCat && matchesTag && matchesPrice;
  });

  const filteredSuggestions = suggestions.filter((s) => {
    const matchesCat = suggestionCatFilter === 'Todas' || s.category === suggestionCatFilter;
    const matchesSearch =
      !suggestionSearch.trim() ||
      s.title.toLowerCase().includes(suggestionSearch.toLowerCase()) ||
      s.ingredients.some((i) => i.name.toLowerCase().includes(suggestionSearch.toLowerCase()));
    const matchesFridge =
      !suggestionFridgeOnly || (s.fridgeMatch && s.fridgeMatch.matchPct >= 40);
    return matchesCat && matchesSearch && matchesFridge;
  });
  const activeSuggestion = filteredSuggestions[0] || null;
  const nextSuggestion = filteredSuggestions[1] || null;

  // Group shopping list by aisle
  const shoppingByAisle = shoppingList.reduce((acc, item) => {
    if (!acc[item.aisle]) acc[item.aisle] = [];
    acc[item.aisle].push(item);
    return acc;
  }, {});

  // Modo Mercado statistics (In-cart vs Remaining)
  const toBuyList = (shoppingList || []).filter((i) => !i.inFridge);
  const checkedList = toBuyList.filter((i) => i.checked);
  const remainingList = toBuyList.filter((i) => !i.checked);
  const shoppingStats = {
    toBuyCount: toBuyList.length,
    checkedCount: checkedList.length,
    remainingCount: remainingList.length,
    checkedTotal: checkedList.reduce((acc, i) => acc + (i.estimatedPrice || 0), 0),
    remainingTotal: remainingList.reduce((acc, i) => acc + (i.estimatedPrice || 0), 0),
    pct: toBuyList.length > 0 ? Math.round((checkedList.length / toBuyList.length) * 100) : 0,
  };

  const latestRelease = data.releaseNotes?.[0];

  // Live cost calculation inside Ficha Técnica form
  const formTotalCost = recipeFormModal
    ? recipeFormModal.ingredients.reduce((sum, i) => sum + (Number(i.basePrice) || 0), 0)
    : 0;
  const formServingCost = recipeFormModal
    ? formTotalCost / Math.max(1, Number(recipeFormModal.servings) || 1)
    : 0;

  return (
    <div className="min-h-screen flex flex-col liquid-app-bg text-slate-100 relative overflow-x-hidden">
      {/* AMBIENT APPLE LIQUID GLASS REFRACTIVE ORBS */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="liquid-orb-1 absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="liquid-orb-2 absolute top-1/4 -right-28 w-[28rem] h-[28rem] rounded-full bg-sky-500/12 blur-3xl" />
        <div className="liquid-orb-1 absolute -bottom-32 left-1/3 w-[26rem] h-[26rem] rounded-full bg-teal-500/12 blur-3xl" />
      </div>

      {/* HEADER — macOS TAHOE PRO DARK GLASS TOOLBAR */}
      <header className="sticky top-0 z-30 liquid-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3.5 pb-2.5 flex flex-wrap items-center justify-between gap-4">
          {/* Brand with Menu Icon */}
          <div className="flex items-center gap-3">
            <img
              src="/menu-icon.png"
              alt="Ícone Menu NeatEat"
              className="w-10 h-10 object-contain drop-shadow-lg transition-transform hover:scale-105"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-white">
                  n<span className="text-emerald-400">EAT</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-2xs">
                  Brasil Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
                Planejador Semanal & Fichas Técnicas de Restaurante
              </p>
            </div>
          </div>

          {/* Live Budget Gauge Pill (macOS Dark Glass Capsule) */}
          <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-2 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Custo Médio da Lista:</span>
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span
                  className={`text-base font-black ${
                    isOverBudget ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {formatBRL(totals.netToBuyTotal)}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  / meta {formatBRL(user.weekly_budget)}
                </span>
              </div>
            </div>

            <div className="hidden md:block w-32">
              <div className="h-2 w-full bg-slate-950/80 rounded-full overflow-hidden border border-white/5">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isOverBudget
                      ? 'bg-rose-500 shadow-rose-500/50'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-emerald-500/50'
                  }`}
                  style={{ width: `${budgetPct}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 text-right font-medium">
                {totals.fridgeSavings > 0 ? (
                  <span className="text-emerald-300 font-semibold">
                    Economizou {formatBRL(totals.fridgeSavings)} da geladeira
                  </span>
                ) : (
                  `${budgetPct}% do orçamento`
                )}
              </p>
            </div>
          </div>

          {/* Controls: Audio Sound FX & APIs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setApiKeysModalOpen(true)}
              title="Configurar Conexões & APIs (Gemini, Open Food Facts, Unsplash, TACO)"
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-bold transition cursor-pointer shadow-sm bg-slate-900/80 hover:bg-slate-800 text-amber-300 border-amber-500/30 hover:border-amber-400/50 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">APIs & IA</span>
            </button>

            <button
              onClick={() => {
                const next = toggleSound();
                setSoundOn(next);
              }}
              title={soundOn ? 'Sons de alta gastronomia ativados (clique para silenciar)' : 'Sons desativados (clique para ativar)'}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold transition cursor-pointer shadow-sm ${
                soundOn
                  ? 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border-emerald-500/40 shadow-emerald-950/30'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 border-white/10'
              }`}
            >
              {soundOn ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span className="hidden md:inline">Sons Ativos</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span className="hidden md:inline">Mudo</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Apple Segmented Capsule Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-3 pt-1 flex justify-start sm:justify-center overflow-x-auto">
          <nav className="liquid-nav-capsule inline-flex items-center gap-1.5 p-1.5 rounded-full">
            {[
              { id: 'planner', label: 'Planejador Semanal', icon: Calendar, count: null },
              {
                id: 'shopping',
                label: 'Lista de Compras',
                icon: ShoppingCart,
                count: shoppingList.filter((i) => !i.inFridge).length,
              },
              {
                id: 'fridge',
                label: 'Geladeira & IA',
                icon: Refrigerator,
                count: fridgeItems.length,
              },
              {
                id: 'recipes',
                label: 'Catálogo de Receitas',
                icon: BookOpen,
                count: recipes.length,
              },
              {
                id: 'suggestions',
                label: 'Sugestões',
                icon: Flame,
                count: suggestions.length,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    active
                      ? 'liquid-nav-tab-active shadow-md'
                      : 'border border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.2 rounded-full border ${
                        active
                          ? 'bg-emerald-400/20 text-emerald-200 border-emerald-400/30'
                          : 'bg-slate-800/90 text-slate-400 border-white/5'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
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
            {/* TOP BAR / CONTROL CENTER: DUAS ZONAS CLARAS */}
            <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-5">
              {/* ZONA A: CONFIGURAÇÃO DE PARÂMETROS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* Orçamento Semanal com Slider & Feedback Vivo */}
                <div className="lg:col-span-5 space-y-2 bg-slate-950/70 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Wallet className="w-4 h-4 text-emerald-400" />
                      Orçamento Semanal
                    </label>
                    <span className="text-xl font-black text-emerald-400 tracking-tight">
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
                    className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>R$ 100 (Econômico)</span>
                    <span>R$ 400 (Equilibrado)</span>
                    <span>R$ 800 (Família)</span>
                  </div>
                </div>

                {/* Pessoas na Casa & Preferência Alimentar */}
                <div className="lg:col-span-4 grid grid-cols-2 gap-3 bg-slate-950/70 p-4 rounded-2xl border border-white/5">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      Pessoas
                    </label>
                    <select
                      value={user.household_size}
                      onChange={(e) =>
                        updateProfile({ household_size: Number(e.target.value) })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'pessoa' : 'pessoas'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1.5">
                      <Filter className="w-3.5 h-3.5 text-emerald-400" />
                      Preferência
                    </label>
                    <select
                      value={user.dietary_filter}
                      onChange={(e) => updateProfile({ dietary_filter: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {DIETARY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Botão de Ação: Recalcular Cardápio */}
                <div className="lg:col-span-3 flex flex-col justify-center">
                  <button
                    onClick={handleGenerateSmartPlan}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition active:scale-[0.98] cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>Recalcular Cardápio</span>
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-1.5 font-medium">
                    Otimizado para {formatBRL(budgetDraft)}
                  </p>
                </div>
              </div>

              {/* ZONA B: RESUMO FINANCEIRO & STATUS CONSOLIDADO */}
              <div
                className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isOverBudget
                    ? 'bg-rose-950/30 border-rose-800/50 text-rose-200'
                    : 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isOverBudget ? 'bg-rose-900/60 text-rose-400' : 'bg-emerald-900/60 text-emerald-400'
                    }`}
                  >
                    {isOverBudget ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          isOverBudget
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {isOverBudget ? 'Acima da Meta' : 'Dentro do Orçamento'}
                      </span>
                      <span className="text-xs font-semibold text-slate-300">
                        Custo semanal estimado:{' '}
                        <strong className="text-white">{formatBRL(totals.weeklyActualCost)}</strong>
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isOverBudget
                        ? `O cardápio planejado excede a meta em ${formatBRL(
                            Math.abs(totals.budgetRemaining)
                          )}. Clique em "Recalcular Cardápio" para reequilibrar receitas.`
                        : `Plano com 21 refeições para ${user.household_size} ${
                            user.household_size === 1 ? 'pessoa' : 'pessoas'
                          } com saldo livre de ${formatBRL(totals.budgetRemaining)} no orçamento.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveTab('shopping')}
                    className="px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-white/10 text-xs font-bold text-slate-100 flex items-center gap-2 transition cursor-pointer hover:border-emerald-500/40"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ver Lista Consolidada →</span>
                  </button>
                </div>
              </div>

              {/* VIEW SWITCHER CAPSULE: VISÃO SEMANAL vs FOCO DIÁRIO */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => setPlannerViewMode('week')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      plannerViewMode === 'week'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Visão Semanal (7 Dias)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlannerViewMode('day')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      plannerViewMode === 'day'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>Foco Diário</span>
                  </button>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Clique no prato para abrir a ficha técnica ou use os 3 pontinhos para ações rápidas</span>
                </div>
              </div>
            </section>

            {/* MODO 1: GRADE SEMANAL (7 COLUNAS × 3 REFEIÇÕES COM PROGRESSIVE DISCLOSURE) */}
            {plannerViewMode === 'week' && (
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3.5">
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
                      className="bg-slate-900/70 rounded-2xl border border-slate-800/90 shadow-md flex flex-col overflow-hidden transition hover:border-slate-700"
                    >
                      {/* Day Column Header Consolidado */}
                      <div className="p-3 bg-slate-900/95 border-b border-white/5 flex items-center justify-between">
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-100">{day}</h3>
                          <p className="text-[11px] text-slate-400">{dayCals} kcal/dia</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 font-bold text-xs border border-emerald-500/25">
                          {formatBRL(dayCost)}
                        </span>
                      </div>

                      {/* Meal Cards */}
                      <div className="p-2 space-y-2.5 flex-1 flex flex-col justify-between">
                        {daySlots.map(({ slot, recipe }) => {
                          if (!recipe) return null;
                          const mealCost = getRecipeMealCost(recipe);
                          const isMenuOpen =
                            activeMealMenu?.day === day && activeMealMenu?.slot === slot;

                          return (
                            <div
                              key={slot}
                              data-meal-menu
                              className="group relative rounded-xl border border-slate-800/90 bg-slate-900/50 hover:bg-slate-800/80 hover:border-emerald-500/40 p-2.5 transition-all flex flex-col justify-between gap-2 shadow-2xs"
                            >
                              {/* Card Header: Slot Name + Price + 3-Dot Dropdown */}
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                  {slot}
                                </span>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs font-black text-emerald-400">
                                    {formatBRL(mealCost)}
                                  </span>

                                  {/* 3-Dot Context Menu (Progressive Disclosure) */}
                                  <div className="relative">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMealMenu(isMenuOpen ? null : { day, slot });
                                      }}
                                      title="Opções da refeição"
                                      className={`w-6 h-6 rounded-md flex items-center justify-center transition cursor-pointer ${
                                        isMenuOpen
                                          ? 'bg-slate-700 text-white'
                                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/60'
                                      }`}
                                    >
                                      <MoreVertical className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Dropdown Flutuante */}
                                    {isMenuOpen && (
                                      <div
                                        className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1.5 z-40 divide-y divide-white/5 animate-in fade-in zoom-in-95 duration-100"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <div className="py-1">
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              setActiveMealMenu(null);
                                              openCookingMode(recipe, e);
                                            }}
                                            className="w-full px-3 py-1.5 text-left text-xs font-semibold text-emerald-300 hover:bg-emerald-950/50 flex items-center gap-2 cursor-pointer transition"
                                          >
                                            <Play className="w-3 h-3 fill-emerald-300" />
                                            <span>Modo Cozinhar</span>
                                          </button>
                                        </div>
                                        <div className="py-1">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setActiveMealMenu(null);
                                              setRepeatRecipeTarget({
                                                recipe,
                                                sourceDay: day,
                                                sourceSlot: slot,
                                              });
                                            }}
                                            className="w-full px-3 py-1.5 text-left text-xs font-semibold text-slate-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition"
                                          >
                                            <Repeat className="w-3 h-3 text-slate-400" />
                                            <span>Repetir (Sobra)</span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setActiveMealMenu(null);
                                              setSwapSlotTarget({ day, slot });
                                            }}
                                            className="w-full px-3 py-1.5 text-left text-xs font-semibold text-slate-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition"
                                          >
                                            <ArrowRightLeft className="w-3 h-3 text-slate-400" />
                                            <span>Trocar Receita</span>
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Clickable Card Body: Direct Access to Recipe Details */}
                              <div
                                onClick={() => setSelectedRecipeModal(recipe)}
                                className="flex gap-2.5 items-start cursor-pointer group/title"
                              >
                                <img
                                  src={recipe.image}
                                  alt={recipe.title}
                                  className="w-12 h-12 rounded-lg object-cover shrink-0 bg-slate-800 ring-1 ring-white/10 group-hover/title:scale-105 transition-transform"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-bold text-slate-100 group-hover/title:text-emerald-300 line-clamp-2 leading-snug transition-colors">
                                    {recipe.title}
                                  </h4>
                                </div>
                              </div>

                              {/* Subtle Secondary Metadata Badges: Prep Time + Calories */}
                              <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                                <span className="flex items-center gap-1 font-medium">
                                  <Clock className="w-3 h-3 text-slate-500" /> {recipe.prepTime}m
                                </span>
                                <span className="flex items-center gap-1 font-medium">
                                  <Flame className="w-3 h-3 text-amber-500/70" /> {recipe.calories} kcal
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </section>
            )}

            {/* MODO 2: FOCO DIÁRIO DETALHADO (SEGMENTED TABS POR DIA + CARDS AMPLOS) */}
            {plannerViewMode === 'day' && (
              <div className="space-y-6">
                {/* Seletor Horizontal de Dias */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {DAYS.map((day) => {
                    const isSelected = plannerSelectedDay === day;
                    const daySlots = SLOTS.map((slot) => {
                      const found = mealPlan.find((m) => m.day === day && m.slot === slot);
                      return found ? recipeMap.get(found.recipe_id) : recipes[0];
                    }).filter(Boolean);
                    const dayCost = daySlots.reduce((acc, r) => acc + getRecipeMealCost(r), 0);
                    const dayCals = daySlots.reduce((acc, r) => acc + (r?.calories || 0), 0);

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setPlannerSelectedDay(day)}
                        className={`px-4 py-3 rounded-2xl flex flex-col items-center gap-1 min-w-[110px] shrink-0 transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-950/60 scale-[1.02]'
                            : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-white/5'
                        }`}
                      >
                        <span className="text-xs font-black uppercase tracking-wider">{day}</span>
                        <span
                          className={`text-xs font-bold ${
                            isSelected ? 'text-white' : 'text-emerald-400'
                          }`}
                        >
                          {formatBRL(dayCost)}
                        </span>
                        <span
                          className={`text-[10px] ${
                            isSelected ? 'text-emerald-100' : 'text-slate-400'
                          }`}
                        >
                          {dayCals} kcal
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* 3 Cards Amplos para o Dia Selecionado */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {SLOTS.map((slot) => {
                    const found = mealPlan.find(
                      (m) => m.day === plannerSelectedDay && m.slot === slot
                    );
                    const recipe = found ? recipeMap.get(found.recipe_id) : recipes[0];
                    if (!recipe) return null;
                    const mealCost = getRecipeMealCost(recipe);

                    return (
                      <div
                        key={slot}
                        className="bg-slate-900/80 rounded-3xl border border-slate-800/90 shadow-xl overflow-hidden flex flex-col justify-between transition hover:border-emerald-500/40"
                      >
                        <div>
                          {/* Foto Panorâmica em Alta Resolução */}
                          <div
                            onClick={() => setSelectedRecipeModal(recipe)}
                            className="relative aspect-video overflow-hidden cursor-pointer group"
                          >
                            <img
                              src={recipe.image}
                              alt={recipe.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                            <div className="absolute top-3 left-3 flex items-center gap-2">
                              <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider text-slate-200 border border-white/10">
                                {slot}
                              </span>
                            </div>
                            <div className="absolute top-3 right-3">
                              <span className="px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-slate-950 font-black text-xs shadow-md">
                                {formatBRL(mealCost)}
                              </span>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3">
                              <h3 className="font-black text-base text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                                {recipe.title}
                              </h3>
                            </div>
                          </div>

                          {/* Metadados Nutricionais & Tempo */}
                          <div className="p-4 space-y-4">
                            <div className="grid grid-cols-4 gap-2 text-center">
                              <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                                <span className="block text-[10px] font-bold text-slate-400">Tempo</span>
                                <span className="text-xs font-black text-slate-200">{recipe.prepTime}m</span>
                              </div>
                              <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                                <span className="block text-[10px] font-bold text-slate-400">Calorias</span>
                                <span className="text-xs font-black text-amber-400">{recipe.calories}</span>
                              </div>
                              <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                                <span className="block text-[10px] font-bold text-slate-400">Proteína</span>
                                <span className="text-xs font-black text-emerald-400">{recipe.protein || 0}g</span>
                              </div>
                              <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                                <span className="block text-[10px] font-bold text-slate-400">Carbos</span>
                                <span className="text-xs font-black text-cyan-400">{recipe.carbs || 0}g</span>
                              </div>
                            </div>

                            {/* Insumos Principais Preview */}
                            <div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                                Principais Ingredientes ({recipe.ingredients?.length || 0})
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {(recipe.ingredients || []).slice(0, 4).map((ing, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-lg bg-slate-800 text-[11px] font-medium text-slate-300 border border-white/5"
                                  >
                                    {ing.name} ({ing.amount}{ing.unit})
                                  </span>
                                ))}
                                {(recipe.ingredients?.length || 0) > 4 && (
                                  <span className="px-2 py-0.5 rounded-lg bg-slate-800/50 text-[11px] font-medium text-slate-400">
                                    +{recipe.ingredients.length - 4} mais
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Ações Estruturadas do Card Diário */}
                        <div className="p-4 pt-0 space-y-2">
                          <button
                            type="button"
                            onClick={(e) => openCookingMode(recipe, e)}
                            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-950/50 flex items-center justify-center gap-2 transition cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>Iniciar Modo Cozinhar</span>
                          </button>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setRepeatRecipeTarget({
                                  recipe,
                                  sourceDay: plannerSelectedDay,
                                  sourceSlot: slot,
                                })
                              }
                              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-white/5 flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                              <Repeat className="w-3 h-3 text-slate-400" />
                              <span>Repetir Sobra</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSwapSlotTarget({ day: plannerSelectedDay, slot })}
                              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-white/5 flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                              <ArrowRightLeft className="w-3 h-3 text-emerald-400" />
                              <span>Trocar Receita</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LISTA DE COMPRAS INTELIGENTE */}
        {activeTab === 'shopping' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-5">
              {/* PAINEL DO MERCADO (MODO FOCO & TOTAL DINÂMICO NO CARRINHO) */}
              <div className="bg-slate-900/85 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-100">
                        Modo Mercado
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Acompanhamento do carrinho em tempo real
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {shoppingStats.pct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-950/80 overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300 shadow-emerald-500/50"
                    style={{ width: `${shoppingStats.pct}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
                    <span className="text-[10px] font-bold uppercase text-emerald-300 block">
                      🛒 No Carrinho
                    </span>
                    <span className="text-base font-black text-white block mt-0.5">
                      {formatBRL(shoppingStats.checkedTotal)}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-medium">
                      {shoppingStats.checkedCount} de {shoppingStats.toBuyCount} itens
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      ⏳ Falta Comprar
                    </span>
                    <span className="text-base font-black text-white block mt-0.5">
                      {formatBRL(shoppingStats.remainingTotal)}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {shoppingStats.remainingCount}{' '}
                      {shoppingStats.remainingCount === 1 ? 'item restante' : 'itens restantes'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setHideCheckedShopping((prev) => !prev)}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer border ${
                    hideCheckedShopping
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500/50 shadow-md shadow-emerald-950/50'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-white/10'
                  }`}
                >
                  {hideCheckedShopping ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Mostrar todos ({shoppingList.length} itens)</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Ocultar {shoppingStats.checkedCount} já no carrinho</span>
                    </>
                  )}
                </button>
              </div>

              {/* Resumo Financeiro Card */}
              <div className="bg-slate-950/80 text-slate-200 rounded-3xl p-6 border border-white/5 shadow-xl space-y-4">
                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  <span>Resumo Financeiro (Preço Médio)</span>
                </h4>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Custo Bruto dos Insumos:</span>
                    <span className="font-bold text-slate-200">{formatBRL(totals.grossTotal)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Já tenho em casa (Geladeira):</span>
                    <span className="font-extrabold">- {formatBRL(totals.fridgeSavings)}</span>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex justify-between text-base font-black">
                    <span className="text-white">Total Estimado a Comprar:</span>
                    <span className="text-emerald-400">{formatBRL(totals.netToBuyTotal)}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 pt-2 border-t border-white/5 font-medium leading-relaxed">
                  Valores calculados considerando o custo médio dos insumos nas fichas técnicas para{' '}
                  <strong className="text-slate-200">{user.household_size} pessoa(s)</strong>.
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="bg-slate-900/85 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <div>
                    <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                      <span>Lista de Compras Inteligente</span>
                      {hideCheckedShopping && (
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Modo Foco Ativo
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Insumos repetidos entre as 21 refeições foram consolidados para{' '}
                      <strong className="text-slate-200">{user.household_size} pessoas</strong>.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        setSefazInvoice(null);
                        setSefazError('');
                        setSefazSuccessMsg('');
                        setSefazModalOpen(true);
                      }}
                      className="text-xs font-black px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950/50 flex items-center gap-1.5 cursor-pointer transition active:scale-95"
                      title="Importar cupom fiscal com preços reais para calibrar custos e atualizar geladeira"
                    >
                      <Receipt className="w-4 h-4 text-emerald-200" />
                      <span>Cheguei do Mercado (NFC-e)</span>
                    </button>
                    <button
                      onClick={() => setHideCheckedShopping((prev) => !prev)}
                      className={`text-xs font-bold px-3 py-2 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
                        hideCheckedShopping
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-white/10'
                      }`}
                    >
                      {hideCheckedShopping ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Mostrar comprados</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Ocultar comprados ({shoppingStats.checkedCount})</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('fridge')}
                      className="text-xs font-bold text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/50 px-3 py-2 rounded-xl border border-emerald-500/30 transition cursor-pointer"
                    >
                      Gerenciar itens da geladeira ({fridgeItems.length})
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {Object.entries(shoppingByAisle).map(([aisle, items]) => {
                    const visibleItems = hideCheckedShopping ? items.filter((i) => !i.checked) : items;
                    if (hideCheckedShopping && visibleItems.length === 0) {
                      return (
                        <div
                          key={aisle}
                          className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-between text-xs text-emerald-300"
                        >
                          <span className="font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            {aisle}: Todos os {items.length} itens já estão no carrinho!
                          </span>
                          <span className="text-[11px] text-emerald-400 font-black">100% coletado</span>
                        </div>
                      );
                    }
                    return (
                      <div key={aisle} className="space-y-2.5">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>{aisle}</span>
                          </h3>
                          <span className="text-xs text-slate-400 font-medium">
                            {visibleItems.length}{' '}
                            {visibleItems.length === 1 ? 'item pendente' : 'itens pendentes'}
                            {hideCheckedShopping && items.length > visibleItems.length && (
                              <span className="text-emerald-400 font-bold ml-1.5">
                                ({items.length - visibleItems.length} no carrinho)
                              </span>
                            )}
                          </span>
                        </div>

                        <div className="space-y-2 pt-1">
                          {visibleItems.map((item) => (
                          <div
                            key={item.key}
                            onClick={() => handleToggleShoppingCheck(item.key)}
                            className={`py-2.5 px-3.5 rounded-2xl flex items-center justify-between gap-3 transition cursor-pointer border ${
                              item.checked
                                ? 'bg-slate-950/40 text-slate-500 border-transparent opacity-50 line-through'
                                : 'bg-slate-800/60 hover:bg-slate-800/90 border-white/10 hover:border-emerald-500/40 text-slate-100 shadow-sm backdrop-blur-sm'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-5 h-5 rounded-lg flex items-center justify-center border transition shrink-0 ${
                                  item.checked
                                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-xs'
                                    : 'border-slate-600 bg-slate-900/80 hover:border-emerald-400'
                                }`}
                              >
                                {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-base leading-none shrink-0">
                                    {getIngredientEmoji(item.name, item.aisle)}
                                  </span>
                                  <span
                                    className={`text-sm font-bold ${
                                      item.checked ? 'line-through text-slate-500' : 'text-slate-100'
                                    }`}
                                  >
                                    {item.name}
                                  </span>
                                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-300 border border-white/10 shrink-0">
                                    {item.amount} {item.unit}
                                  </span>
                                  {item.inFridge && (
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 shrink-0">
                                      Já tem na geladeira
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                                  Usado em {item.Occurrences || item.occurrences || 1} refeição(ões):{' '}
                                  <span className="text-slate-300 font-semibold">
                                    {(item.recipesUsed || []).slice(0, 2).join(', ')}
                                  </span>
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span
                                className={`text-sm font-black ${
                                  item.inFridge
                                    ? 'line-through text-emerald-500/50 opacity-60'
                                    : 'text-emerald-400'
                                }`}
                              >
                                {formatBRL(item.estimatedPrice)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GELADEIRA & IA IMPORTADOR */}
        {activeTab === 'fridge' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900/85 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl backdrop-blur-xl space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <Refrigerator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">
                      O que tem na sua geladeira / despensa?
                    </h3>
                    <p className="text-xs text-slate-400">
                      Marque o que você já tem em casa para abater da lista de compras e descobrir receitas!
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Receipt className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-200">Entrada Automática por Nota Fiscal</p>
                      <p className="text-[11px] text-emerald-400/90 font-medium">Abasteça quantidades e calibre preços com cupom da SEFAZ</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSefazInvoice(null);
                      setSefazError('');
                      setSefazSuccessMsg('');
                      setSefazModalOpen(true);
                    }}
                    className="text-xs font-black px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shrink-0 cursor-pointer transition flex items-center gap-1 active:scale-95"
                  >
                    <span>Importar Cupom</span>
                  </button>
                </div>

                {/* Card Inteligência de Preços Médios dos Ingredientes */}
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/10 flex items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30 shrink-0">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-white truncate">Preços Médios dos Ingredientes</p>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-sky-950/60 text-sky-300 border border-sky-500/30 shrink-0">
                          {marketPrices.length} Insumos
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium truncate">
                        {marketPrices.filter((p) => p.sample_count > 0).length > 0
                          ? `${marketPrices.filter((p) => p.sample_count > 0).length} calibrados via cupom real • Base CEASA`
                          : 'Calibrado com base CEASA/PROCON • Atualize com cupom'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPricesModalOpen(true)}
                    className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 shadow-xs shrink-0 cursor-pointer transition flex items-center gap-1 active:scale-95"
                  >
                    <span>Ver / Ajustar</span>
                  </button>
                </div>

                {/* Card Consulta Rótulos & Códigos de Barras (Open Food Facts Brasil) */}
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/10 flex items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0">
                      <ScanLine className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-white truncate">Consultar Rótulo / Código de Barras</p>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 shrink-0">
                          Open Food Facts
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium truncate">
                        Busque marcas brasileiras por nome ou código EAN para abastecer com peso e foto
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOffModalOpen(true);
                      setOffResults([]);
                      setOffSearchQuery('');
                    }}
                    className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 shadow-xs shrink-0 cursor-pointer transition flex items-center gap-1 active:scale-95"
                  >
                    <span>Buscar Produto</span>
                  </button>
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
                    className="flex-1 rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold flex items-center gap-1 cursor-pointer transition shadow-xs"
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
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition cursor-pointer ${
                            active
                              ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/50'
                              : 'bg-slate-950/70 text-slate-300 border-white/5 hover:border-emerald-500/40 hover:bg-slate-900'
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

                {/* Lista Completa dos Itens Atualmente na Geladeira */}
                <div className="pt-3 border-t border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                      <Refrigerator className="w-4 h-4 text-emerald-400" />
                      <span>Estoque Atual ({fridgeItems.length} {fridgeItems.length === 1 ? 'item' : 'itens'})</span>
                    </h4>
                    {fridgeItems.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearFridge}
                        className="text-[10px] font-bold text-rose-400 hover:text-rose-300 cursor-pointer transition"
                      >
                        Limpar Geladeira
                      </button>
                    )}
                  </div>

                  {fridgeItems.length === 0 ? (
                    <div className="py-6 text-center text-slate-500 text-xs">
                      Sua geladeira está vazia no momento. Adicione itens acima ou importe seu cupom de compras!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                      {fridgeItems.map((f) => (
                        <div
                          key={f.id || f.name}
                          className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between gap-2 shadow-sm group hover:border-emerald-500/30 transition"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-base leading-none shrink-0">
                              {getIngredientEmoji(f.name, f.category)}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-200 truncate">
                                {f.name}
                              </p>
                              {f.amount > 0 && (
                                <p className="text-[10px] font-bold text-emerald-400">
                                  {f.amount} {f.unit}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleFridgeItem(f.name, f.category)}
                            title="Remover da geladeira"
                            className="w-6 h-6 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 flex items-center justify-center cursor-pointer transition shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* AI Social / URL Recipe Importer (Link Exclusivo) */}
              <div className="bg-slate-900/85 text-white rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 border border-slate-800 backdrop-blur-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <Link2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">
                      Importador de Ficha Técnica por Link
                    </h3>
                    <p className="text-xs text-slate-400">
                      Cole o link direto da receita (Receiteria, TudoGostoso, Panelinha, etc.): a IA gera os insumos, custos, porcionamento e inclui as fotos de cada passo do preparo!
                    </p>
                  </div>
                </div>

                <form onSubmit={handleImportRecipe} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Link Direto da Receita (URL)
                    </label>
                    <div className="relative">
                      <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="url"
                        required
                        placeholder="Cole aqui o link: https://www.receiteria.com.br/receita/... ou https://..."
                        value={importInput}
                        onChange={(e) => {
                          setImportInput(e.target.value);
                          if (importError) setImportError('');
                        }}
                        className="w-full rounded-xl bg-slate-950/80 border border-white/10 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Apenas links diretos são permitidos para garantir a fidelidade dos insumos e fotos dos passos.
                    </span>
                  </div>

                  {importError && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{importError}</span>
                    </div>
                  )}

                  {importSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{importSuccess}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <select
                      value={importCategory}
                      onChange={(e) => setImportCategory(e.target.value)}
                      className="rounded-xl bg-slate-950/80 border border-white/10 px-3 py-2.5 text-sm font-semibold text-white focus:outline-none cursor-pointer"
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
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-emerald-950/50"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{importing ? 'Importando Receita e Fotos...' : 'Importar Ficha Técnica via Link'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-900/85 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl backdrop-blur-xl space-y-4">
                <div>
                  <h2 className="text-lg font-extrabold text-white">
                    Sugestões da IA com o que você já tem em casa
                  </h2>
                  <p className="text-xs text-slate-400">
                    Receitas ordenadas pela maior compatibilidade com sua geladeira e menor custo médio adicional:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {fridgeMatches.slice(0, 8).map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => setSelectedRecipeModal(rec)}
                      className="rounded-2xl border border-slate-800 hover:border-emerald-500/40 p-3.5 flex flex-col justify-between gap-3 transition cursor-pointer bg-slate-950/60 hover:bg-slate-850/80 shadow-md group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
                              rec.matchPct >= 60
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            {rec.matchPct}% na geladeira ({rec.matchedCount}/{rec.totalIngs})
                          </span>
                          <span className="text-xs font-bold text-slate-400">
                            {rec.category}
                          </span>
                        </div>

                        <div className="flex gap-3 items-center">
                          <img
                            src={rec.image}
                            alt={rec.title}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-900 border border-white/10 group-hover:scale-105 transition-transform"
                          />
                          <div>
                            <h4 className="font-extrabold text-sm text-slate-100 group-hover:text-emerald-300 line-clamp-2 transition-colors">
                              {rec.title}
                            </h4>
                            <p className="text-xs text-emerald-400 font-black mt-1">
                              Falta comprar: {formatBRL(rec.missingCost)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 border-t border-white/5 pt-2 flex items-center justify-between gap-2">
                        <div className="truncate">
                          {rec.missingIngs.length === 0 ? (
                            <span className="text-emerald-400 font-bold">
                              Você tem 100% dos ingredientes! Custo extra R$ 0,00!
                            </span>
                          ) : (
                            <span className="truncate">
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
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
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
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/85 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl backdrop-blur-xl">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  Catálogo de Fichas Técnicas de Restaurante
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cadastre, edite ou exclua receitas completas com custo unitário de insumos, gramatura de porção, montagem e fotos de cada passo do preparo.
                </p>
              </div>
              <button
                onClick={openNewRecipeModal}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-md shadow-emerald-950/50 flex items-center gap-2 transition cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 text-emerald-200" />
                <span>Nova Ficha Técnica</span>
              </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-slate-900/85 rounded-3xl p-5 border border-slate-800 shadow-xl backdrop-blur-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Buscar Prato ou Insumo
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Ex: frango, tapioca, mandioca..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Refeição
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm font-semibold text-white focus:outline-none cursor-pointer"
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
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Restrição / Estilo
                </label>
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm font-semibold text-white focus:outline-none cursor-pointer"
                >
                  {DIETARY_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Faixa de Custo / Refeição
                </label>
                <div className="flex p-1 rounded-xl bg-slate-950/90 border border-white/10 gap-1">
                  {[
                    { id: 'all', label: 'Todos', title: 'Todas as faixas de custo' },
                    { id: '$', label: '$', title: '$ Econômico (até R$ 25 por refeição)' },
                    { id: '$$', label: '$$', title: '$$ Médio (R$ 25 a R$ 50 por refeição)' },
                    { id: '$$$', label: '$$$', title: '$$$ Especial (acima de R$ 50 por refeição)' },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setMealPriceTier(tier.id)}
                      title={tier.title}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-black transition cursor-pointer text-center ${
                        mealPriceTier === tier.id
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
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
                    className="bg-slate-900/80 hover:bg-slate-850/90 rounded-3xl border border-slate-800/90 hover:border-emerald-500/40 shadow-xl overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                  >
                    <div>
                      <div className="relative aspect-video overflow-hidden bg-slate-950">
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur text-white text-[10px] font-extrabold uppercase tracking-wider border border-white/10">
                          {recipe.category}
                        </div>

                        {/* Play, Edit & Delete Quick Buttons on Card */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <button
                            onClick={(e) => openCookingMode(recipe, e)}
                            title="Iniciar Modo Cozinhar (Passo a Passo)"
                            className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transition cursor-pointer active:scale-95"
                          >
                            <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                          </button>
                          <button
                            onClick={(e) => openEditRecipeModal(recipe, e)}
                            title="Editar Ficha Técnica"
                            className="w-8 h-8 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center shadow-sm transition cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteRecipe(recipe, e)}
                            title="Excluir Receita"
                            className="w-8 h-8 rounded-full bg-slate-950/80 hover:bg-rose-950/80 text-slate-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/40 flex items-center justify-center shadow-sm transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/85 text-slate-200 text-[11px] font-semibold flex items-center gap-1 border border-white/10">
                          <Scale className="w-3 h-3 text-emerald-400" />
                          <span>{recipe.portionWeight || '350g/porção'}</span>
                        </div>

                        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-md">
                          {formatBRL(servingPrice)} / porção
                        </div>
                      </div>

                      <div className="p-4 space-y-2.5">
                        <div className="flex flex-wrap gap-1.5">
                          {recipe.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-950/50 text-emerald-300 border border-emerald-500/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <h3 className="font-extrabold text-base text-slate-100 group-hover:text-emerald-300 line-clamp-2 transition-colors">
                          {recipe.title}
                        </h3>

                        <p className="text-xs text-slate-400 line-clamp-2">
                          <strong className="text-slate-300">Montagem:</strong>{' '}
                          {recipe.platingInstructions}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 py-3 bg-slate-950/60 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {recipe.prepTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-400" /> {recipe.calories} kcal
                      </span>
                      <button
                        type="button"
                        onClick={(e) => openCookingMode(recipe, e)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1 shadow-sm transition cursor-pointer"
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
            <div className="bg-slate-900/85 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl backdrop-blur-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <Flame className="w-5 h-5 text-rose-500" />
                      Descoberta de Pratos
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                      Atualizado 1x por dia {data.discoveryDate ? `(${data.discoveryDate.split('-').reverse().slice(0, 2).join('/')})` : ''}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Arraste o card para a <strong className="text-rose-400">esquerda (❌ Passar)</strong> ou para a{' '}
                    <strong className="text-emerald-400">direita (💚 Adicionar)</strong> para incluir a Ficha Técnica no seu Catálogo de Receitas!
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {lastSuggestionSwipe && (
                    <button
                      onClick={handleUndoLastSwipe}
                      className="px-3.5 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-600/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                      title="Desfazer último swipe"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                      <span>Desfazer último swipe</span>
                    </button>
                  )}

                  {dismissedSuggestionsCount > 0 && (
                    <button
                      onClick={handleResetDismissedSuggestions}
                      className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-white/10 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                      <span>Rever descartadas ({dismissedSuggestionsCount})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Pills, Fridge Match Toggle & Search */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
                <div className="flex flex-wrap items-center gap-1.5">
                  {['Todas', ...SLOTS].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSuggestionCatFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        suggestionCatFilter === cat
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/50'
                          : 'bg-slate-950/70 text-slate-400 border-white/5 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setSuggestionFridgeOnly(!suggestionFridgeOnly)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border flex items-center gap-1.5 ml-1 ${
                      suggestionFridgeOnly
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/60'
                        : 'bg-slate-950/70 text-slate-300 border-white/5 hover:border-emerald-500/40 hover:text-white'
                    }`}
                  >
                    <Refrigerator className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Na Minha Geladeira</span>
                  </button>
                </div>

                <div className="relative flex-1 min-w-[200px] max-w-xs">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Filtrar por ingrediente ou prato..."
                    value={suggestionSearch}
                    onChange={(e) => setSuggestionSearch(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Live Taste Profile Insights Bar */}
              {tasteProfile && (
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-slate-400">
                      Perfil de Paladar:{' '}
                      <strong className="text-amber-300 font-extrabold">
                        {tasteProfile.styleSummary}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>
                      {tasteProfile.totalSwipes > 0
                        ? `${tasteProfile.totalSwipes} escolhas • ${tasteProfile.acceptanceRate}% aceitação`
                        : 'Aprendendo suas preferências conforme você avalia pratos'}
                    </span>
                    {tasteProfile.avgPrepTime && (
                      <span className="hidden sm:inline">
                        • Tempo médio ideal: ~{tasteProfile.avgPrepTime} min
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Live Toast Feedback on Swipe */}
            {swipeFeedback && (
              <div
                className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between transition ${
                  swipeFeedback.direction === 'right'
                    ? 'bg-emerald-950/50 border-emerald-600/50 text-emerald-300 shadow-md'
                    : swipeFeedback.direction === 'left'
                    ? 'bg-rose-950/50 border-rose-600/50 text-rose-300 shadow-md'
                    : 'bg-amber-950/50 border-amber-600/50 text-amber-300 shadow-md'
                }`}
              >
                <div className="flex items-center gap-2">
                  {swipeFeedback.direction === 'right' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : swipeFeedback.direction === 'left' ? (
                    <X className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : (
                    <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
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
                    className="underline font-black hover:opacity-80 cursor-pointer"
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
                      className="absolute inset-x-4 top-4 bottom-0 bg-slate-900 rounded-3xl border border-slate-800 shadow-md scale-[0.95] translate-y-3 opacity-50 pointer-events-none overflow-hidden"
                    >
                      <div className="h-64 bg-slate-950">
                        <img
                          src={nextSuggestion.image}
                          alt={nextSuggestion.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="font-extrabold text-lg text-slate-300">
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
                    className="relative z-10 w-full bg-slate-900/95 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
                  >
                    {/* Dynamic STAMPS ("ADICIONAR" vs "PASSAR") */}
                    {(dragState.dx > 35 || swipeAnim === 'right') && (
                      <div className="absolute top-6 left-6 z-20 px-4 py-1.5 rounded-xl border-4 border-emerald-500 bg-emerald-600 text-white font-black text-lg uppercase tracking-widest -rotate-12 shadow-2xl">
                        💚 ADICIONAR
                      </div>
                    )}
                    {(dragState.dx < -35 || swipeAnim === 'left') && (
                      <div className="absolute top-6 right-6 z-20 px-4 py-1.5 rounded-xl border-4 border-rose-500 bg-rose-600 text-white font-black text-lg uppercase tracking-widest rotate-12 shadow-2xl">
                        ❌ PASSAR
                      </div>
                    )}

                    {/* Dish Photo Header */}
                    <div className="relative h-72 bg-slate-950 overflow-hidden">
                      <img
                        src={activeSuggestion.image}
                        alt={activeSuggestion.title}
                        draggable={false}
                        onError={(e) => {
                          e.currentTarget.src = '/dishes/rec-5.jpg';
                        }}
                        className="w-full h-full object-cover select-none pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />

                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur text-white text-xs font-extrabold border border-white/10">
                          {activeSuggestion.category}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-slate-950/80 text-slate-200 text-xs font-bold flex items-center gap-1 border border-white/10">
                          <Scale className="w-3.5 h-3.5 text-emerald-400" />
                          {activeSuggestion.portionWeight}
                        </span>
                      </div>

                      <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-2xl bg-emerald-600 text-white text-sm font-black shadow-lg">
                        {formatBRL(activeSuggestion.costPerServing)} / porção
                      </div>

                      <div className="absolute bottom-4 left-5 right-5 text-white">
                        {/* Taste Affinity & Fridge Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          {activeSuggestion.affinity && (
                            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/30 border border-amber-400/40 text-amber-200 flex items-center gap-1 shadow-sm backdrop-blur">
                              <Sparkles className="w-3 h-3 text-amber-300" />
                              <span>{activeSuggestion.affinity.affinityPct}% Afinidade</span>
                            </span>
                          )}
                          {activeSuggestion.fridgeMatch && activeSuggestion.fridgeMatch.matchPct > 0 && (
                            <span
                              className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1 shadow-sm backdrop-blur ${
                                activeSuggestion.fridgeMatch.matchPct >= 70
                                  ? 'bg-emerald-500/30 border-emerald-400/40 text-emerald-200'
                                  : 'bg-sky-500/30 border-sky-400/40 text-sky-200'
                              }`}
                            >
                              <Refrigerator className="w-3 h-3" />
                              <span>{activeSuggestion.fridgeMatch.matchPct}% na geladeira</span>
                            </span>
                          )}
                          {activeSuggestion.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-900/70 border border-white/10 text-slate-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-2xl font-black leading-tight drop-shadow-md">
                          {activeSuggestion.title}
                        </h3>
                      </div>
                    </div>

                    {/* Visual Card Body (Time, Macros, Key Ingredients & Inspect Ficha Button) */}
                    <div className="p-5 space-y-4">
                      {/* Smart Fridge Financial Opportunity Callout */}
                      {activeSuggestion.fridgeMatch && (
                        <div
                          className={`p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
                            activeSuggestion.fridgeMatch.matchPct >= 70
                              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200 shadow-sm'
                              : activeSuggestion.fridgeMatch.matchPct >= 40
                              ? 'bg-sky-950/60 border-sky-500/40 text-sky-200'
                              : 'bg-slate-950/60 border-white/5 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Refrigerator className="w-4 h-4 text-emerald-400 shrink-0" />
                            <div>
                              <span className="font-extrabold block">
                                {activeSuggestion.fridgeMatch.badgeText}
                              </span>
                              {activeSuggestion.fridgeMatch.fridgeSavings > 0 && (
                                <span className="text-[11px] opacity-80">
                                  Economia de R${' '}
                                  {activeSuggestion.fridgeMatch.fridgeSavings.toFixed(2)}{' '}
                                  aproveitando o que já tem em casa
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-black/30 border border-white/10">
                              {activeSuggestion.fridgeMatch.matchedCount} de{' '}
                              {activeSuggestion.fridgeMatch.totalCount} insumos em casa
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Quick Nutrition & Time Row */}
                      <div className="grid grid-cols-5 gap-2 text-center">
                        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                          <div className="text-[10px] font-bold uppercase text-slate-400">
                            Preparo
                          </div>
                          <div className="text-xs font-black text-slate-200 flex items-center justify-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-emerald-400" />
                            {activeSuggestion.prepTime}m
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/20">
                          <div className="text-[10px] font-bold uppercase text-amber-400">
                            Calorias
                          </div>
                          <div className="text-xs font-black text-amber-200 mt-0.5">
                            {activeSuggestion.calories} kcal
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                          <div className="text-[10px] font-bold uppercase text-slate-400">
                            Proteína
                          </div>
                          <div className="text-xs font-black text-slate-200 mt-0.5">
                            {activeSuggestion.protein}g
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                          <div className="text-[10px] font-bold uppercase text-slate-400">
                            Carbo
                          </div>
                          <div className="text-xs font-black text-slate-200 mt-0.5">
                            {activeSuggestion.carbs}g
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                          <div className="text-[10px] font-bold uppercase text-slate-400">
                            Gordura
                          </div>
                          <div className="text-xs font-black text-slate-200 mt-0.5">
                            {activeSuggestion.fat}g
                          </div>
                        </div>
                      </div>

                      {/* Key Ingredients Preview */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                          <span>Principais Insumos da Ficha Técnica:</span>
                          <span className="text-slate-300">
                            Custo Total ({activeSuggestion.servings}{' '}
                            {activeSuggestion.servings === 1 ? 'porção' : 'porções'}):{' '}
                            <strong className="text-emerald-400 font-black">
                              {formatBRL(activeSuggestion.baseCost)}
                            </strong>
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeSuggestion.ingredients.map((ing, idx) => {
                            const isItemInFridge = activeSuggestion.fridgeMatch?.matchedItems?.some(
                              (m) =>
                                m.name.toLowerCase() === ing.name.toLowerCase() ||
                                ing.name.toLowerCase().includes(m.name.toLowerCase())
                            );
                            return (
                              <span
                                key={idx}
                                className={`px-2.5 py-1 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                                  isItemInFridge
                                    ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200 shadow-2xs'
                                    : 'bg-slate-950/80 border-white/5 text-slate-300'
                                }`}
                              >
                                <span>{getIngredientEmoji(ing.name, ing.aisle)}</span>
                                <span>
                                  {ing.name} ({ing.amount}
                                  {ing.unit})
                                </span>
                                {isItemInFridge ? (
                                  <span className="text-[10px] font-black text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-900/60">
                                    ✓ Na Geladeira
                                  </span>
                                ) : (
                                  <span className="text-emerald-400 font-bold">
                                    {formatBRL(ing.estimatedPrice || ing.basePrice || 0)}
                                  </span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Montagem preview + Button to open full Ficha Técnica */}
                      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs text-slate-300 flex-1 line-clamp-2">
                          <strong className="text-white">Empratamento:</strong>{' '}
                          {activeSuggestion.platingInstructions}
                        </p>
                        <button
                          type="button"
                          onClick={() => setSelectedRecipeModal(activeSuggestion)}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition cursor-pointer shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
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
                    className="group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-700/40 font-extrabold text-sm shadow-md transition cursor-pointer active:scale-95"
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-900/60 group-hover:bg-rose-600 group-hover:text-white flex items-center justify-center transition">
                      <X className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div>Passar</div>
                      <div className="text-[10px] font-medium text-rose-400">
                        Jogar p/ Esquerda
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRecipeModal(activeSuggestion)}
                    className="px-4 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-white/10 font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Ver Ficha Completa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwipeSuggestion(activeSuggestion, 'right')}
                    className="group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/40 font-extrabold text-sm shadow-xl shadow-emerald-950/60 transition cursor-pointer active:scale-95"
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
              <div className="bg-slate-900/85 rounded-3xl p-10 border border-slate-800 text-center space-y-4 shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-white">
                  Você avaliou todas as sugestões deste filtro!
                </h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  As receitas que você jogou para a direita já estão salvas no seu{' '}
                  <strong className="text-slate-200">Catálogo de Receitas</strong> e disponíveis para o seu Cardápio Semanal.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {suggestionCatFilter !== 'Todas' && (
                    <button
                      onClick={() => setSuggestionCatFilter('Todas')}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer transition border border-white/10"
                    >
                      Ver Todas as Categorias
                    </button>
                  )}
                  {dismissedSuggestionsCount > 0 && (
                    <button
                      onClick={handleResetDismissedSuggestions}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/50"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Rever Receitas Descartadas ({dismissedSuggestionsCount})</span>
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('recipes')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-bold cursor-pointer transition"
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
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900/95 text-slate-100 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-white/10"
          >
            <div className="relative h-64 bg-slate-950">
              <img
                src={selectedRecipeModal.image}
                alt={selectedRecipeModal.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/40" />

              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={(e) => openCookingMode(selectedRecipeModal, e)}
                  className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 cursor-pointer active:scale-95 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Cozinhar Agora</span>
                </button>
                {recipeMap.has(selectedRecipeModal.id) ? (
                  <>
                    <button
                      onClick={(e) => openEditRecipeModal(selectedRecipeModal, e)}
                      className="px-3.5 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition"
                    >
                      <Pencil className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={(e) => handleDeleteRecipe(selectedRecipeModal, e)}
                      className="px-3.5 py-2 rounded-full bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-600/40 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleSwipeSuggestion(selectedRecipeModal, 'left')}
                      className="px-3.5 py-2 rounded-full bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-600/40 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Passar</span>
                    </button>
                    <button
                      onClick={() => handleSwipeSuggestion(selectedRecipeModal, 'right')}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg cursor-pointer transition"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>Adicionar ao Catálogo</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedRecipeModal(null)}
                  className="w-9 h-9 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center hover:bg-slate-800 cursor-pointer transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-950/90 text-slate-200 text-xs font-bold border border-white/10">
                  📋 Ficha Técnica Operacional • {selectedRecipeModal.category}
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-black shadow-lg">
                  Custo por Porção: {formatBRL(selectedRecipeModal.costPerServing)} (Total:{' '}
                  {formatBRL(selectedRecipeModal.baseCost)})
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Header & Quick Action */}
              <div className="border-b border-white/10 pb-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-xl">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                        {selectedRecipeModal.category}
                      </span>
                      {selectedRecipeModal.tags && selectedRecipeModal.tags.map((t, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-full bg-slate-950/80 text-slate-400 border border-white/5 text-[10px] font-semibold">
                          {t}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {selectedRecipeModal.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Fonte: <strong className="text-slate-200">{selectedRecipeModal.source || 'NeatEat Brasil'}</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => openCookingMode(selectedRecipeModal, e)}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/60 transition-all hover:scale-102 shrink-0 active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Iniciar Modo Cozinhar</span>
                  </button>
                </div>

                {/* Nutrition metrics grid */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 mt-5">
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Tempo Preparo</div>
                    <div className="text-sm font-black text-slate-200">{selectedRecipeModal.prepTime} min</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Rendimento</div>
                    <div className="text-sm font-black text-slate-200">
                      {selectedRecipeModal.servings} {selectedRecipeModal.servings === 1 ? 'porção' : 'porções'}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/20">
                    <div className="text-[10px] font-bold uppercase text-amber-400">Calorias</div>
                    <div className="text-sm font-black text-amber-200">{selectedRecipeModal.calories} kcal</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Proteínas</div>
                    <div className="text-sm font-black text-slate-200">{selectedRecipeModal.protein}g</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Carboidratos</div>
                    <div className="text-sm font-black text-slate-200">{selectedRecipeModal.carbs}g</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Gorduras</div>
                    <div className="text-sm font-black text-slate-200">{selectedRecipeModal.fat}g</div>
                  </div>
                </div>
              </div>

              {/* Insumos Utilizados agrupados por seção */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-emerald-400" />
                    <span>Insumos & Ingredientes ({selectedRecipeModal.ingredients?.length || 0} itens)</span>
                  </h3>
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    Para {user.household_size} pessoa(s): {formatBRL(getRecipeMealCost(selectedRecipeModal))}
                  </span>
                </div>

                {(() => {
                  const sectionsMap = new Map();
                  (selectedRecipeModal.ingredients || []).forEach((ing) => {
                    const sec = ing.section || 'Ingredientes Gerais';
                    if (!sectionsMap.has(sec)) sectionsMap.set(sec, []);
                    sectionsMap.get(sec).push(ing);
                  });
                  const entries = Array.from(sectionsMap.entries());

                  return (
                    <div className="space-y-3.5">
                      {entries.map(([secName, ings], sIdx) => (
                        <div key={sIdx} className="overflow-hidden rounded-2xl border border-white/10 shadow-md">
                          {entries.length > 1 && (
                            <div className="bg-slate-950/80 px-3.5 py-2 border-b border-white/10 font-black text-xs text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                              <span>🍳 {secName}</span>
                            </div>
                          )}
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-slate-950/90 text-slate-400 font-bold uppercase border-b border-white/10">
                                <th className="py-2.5 px-3">Insumo</th>
                                <th className="py-2.5 px-3">Setor</th>
                                <th className="py-2.5 px-3">Quantidade Ficha</th>
                                <th className="py-2.5 px-3 text-right">Custo Est.</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 bg-slate-900/60">
                              {ings.map((ing, i) => (
                                <tr key={i} className="hover:bg-white/5 transition">
                                  <td className="py-2.5 px-3 font-bold text-slate-100">
                                    <span className="mr-1.5">{getIngredientEmoji(ing.name, ing.aisle)}</span>
                                    {ing.name}
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-400">{ing.aisle}</td>
                                  <td className="py-2.5 px-3 font-semibold text-slate-300">
                                    {ing.amount} {ing.unit}
                                  </td>
                                  <td className="py-2.5 px-3 text-right font-black text-emerald-400">
                                    {formatBRL(ing.basePrice)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10 flex items-center justify-between text-xs font-black">
                        <span className="text-slate-300">Custo Total da Ficha Técnica (CMV):</span>
                        <span className="text-emerald-400 text-sm font-black">{formatBRL(selectedRecipeModal.baseCost)}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Modo de Preparo Operacional com Fotos dos Key-Frames */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <span>👩‍🍳 Modo de Preparo Operacional ({selectedRecipeModal.steps?.length || 0} passos)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={(e) => openCookingMode(selectedRecipeModal, e)}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Abrir no Modo Cozinha</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {(() => {
                    const steps = selectedRecipeModal.steps || [];
                    const details = selectedRecipeModal.stepDetails || [];

                    return steps.map((stepText, idx) => {
                      const d = details[idx];
                      const hasImg = d && d.image;
                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 shadow-md flex flex-col sm:flex-row gap-4 items-start"
                        >
                          {hasImg && (
                            <div
                              onClick={() => setZoomedImage({ src: d.image, alt: d.alt || stepText, title: `Passo ${idx + 1}` })}
                              className="relative w-full sm:w-36 h-28 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-slate-950 cursor-pointer group"
                            >
                              <img
                                src={d.image}
                                alt={d.alt || stepText}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/0 transition" />
                              <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-white flex items-center gap-1 border border-white/10">
                                <Maximize2 className="w-2.5 h-2.5" />
                                <span>Ver foto</span>
                              </span>
                            </div>
                          )}

                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-black text-xs flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              {d && d.section && (
                                <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-white/10 text-[10px] font-bold uppercase tracking-wide">
                                  {d.section}
                                </span>
                              )}
                              {d && d.timerSeconds > 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/40 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                                  <Timer className="w-3 h-3" />
                                  <span>{Math.round(d.timerSeconds / 60)} min</span>
                                </span>
                              )}
                            </div>

                            <p className="text-sm text-slate-200 leading-relaxed font-medium">
                              {stepText}
                            </p>

                            {d && d.tip && (
                              <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-2 text-xs text-amber-200">
                                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                <p className="leading-snug">
                                  <strong className="text-amber-300">Dica do Chef:</strong> {d.tip}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Bloco "Anote aí..." — Dicas do Chef, Conservação e Segredos */}
              {selectedRecipeModal.chefTips && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <span>📝 Anote aí... (Dicas do Chef, Conservação & Segredos)</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {selectedRecipeModal.chefTips.intro && (
                      <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1.5 shadow-md backdrop-blur-md">
                        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-300">
                          <Lightbulb className="w-4 h-4 text-emerald-400" />
                          <span>Dica & Variações</span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">
                          {selectedRecipeModal.chefTips.intro}
                        </p>
                      </div>
                    )}

                    {selectedRecipeModal.chefTips.storage && (
                      <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/30 space-y-1.5 shadow-md backdrop-blur-md">
                        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-sky-300">
                          <Snowflake className="w-4 h-4 text-sky-400" />
                          <span>Conservação & Congelamento</span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">
                          {selectedRecipeModal.chefTips.storage}
                        </p>
                      </div>
                    )}

                    {selectedRecipeModal.chefTips.secret && (
                      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-1.5 shadow-md backdrop-blur-md">
                        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-300">
                          <Flame className="w-4 h-4 text-amber-400" />
                          <span>Segredo da Textura & Ponto</span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">
                          {selectedRecipeModal.chefTips.secret}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Como a Porção Deve Ser Servida: Peso, Montagem e Finalização */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                      <Utensils className="w-4 h-4 text-emerald-400" />
                      Serviço da Porção: Peso, Montagem e Finalização
                    </h4>
                  </div>
                  <div className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-xs font-bold">
                    Peso Padrão: {selectedRecipeModal.portionWeight || '350g por porção'}
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedRecipeModal.platingInstructions}
                  </p>
                </div>

                {/* Outras Instruções Específicas */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-400" />
                    Outras Instruções Específicas (Conservação / Chef)
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed">
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
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900/95 text-slate-100 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-white/10 space-y-6 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-white">
                  {recipeFormModal.id
                    ? 'Editar Ficha Técnica de Restaurante'
                    : 'Nova Receita — Ficha Técnica de Restaurante'}
                </h3>
                <p className="text-xs text-slate-400">
                  Preencha todos os requisitos operacionais, custos unitários de insumos, montagem da porção e foto exata do prato.
                </p>
              </div>
              <button
                onClick={() => setRecipeFormModal(null)}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFichaTecnica} className="space-y-6">
              {/* 1. Identificação do Prato e Tempos */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-6">
                  <label className="text-xs font-bold text-slate-300 block mb-1">
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
                    className="w-full rounded-xl bg-slate-950/80 border border-white/10 px-3.5 py-2 text-sm font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Categoria
                  </label>
                  <select
                    value={recipeFormModal.category}
                    onChange={(e) =>
                      setRecipeFormModal({ ...recipeFormModal, category: e.target.value })
                    }
                    className="w-full rounded-xl bg-slate-950/80 border border-white/10 px-3 py-2 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {SLOTS.map((s) => (
                      <option key={s} value={s} className="bg-slate-900 text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Preparo (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={recipeFormModal.prepTime}
                    onChange={(e) =>
                      setRecipeFormModal({ ...recipeFormModal, prepTime: e.target.value })
                    }
                    className="w-full rounded-xl bg-slate-950/80 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Rendimento (porções)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={recipeFormModal.servings}
                    onChange={(e) =>
                      setRecipeFormModal({ ...recipeFormModal, servings: e.target.value })
                    }
                    className="w-full rounded-xl bg-slate-950/80 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* 2. Imagem Ilustrativa Real ou IA Exata do Prato */}
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-400" />
                      Imagem Exata da Refeição (Nunca Genérica)
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Busque automaticamente fotos reais exatas do prato digitado, envie uma foto do seu Mac ou cole o link da imagem.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSearchExactDishPhotos}
                      disabled={searchingPhotos || !recipeFormModal.title.trim()}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {searchingPhotos
                          ? 'Buscando fotos do prato...'
                          : 'Buscar Foto Exata do Prato'}
                      </span>
                    </button>

                    <label className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition border border-white/10">
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
                      className="w-28 h-24 rounded-xl object-cover border border-white/15 shrink-0 bg-slate-800"
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
                      className="w-full rounded-xl bg-slate-900 border border-white/10 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />

                    {candidatePhotos.length > 0 && (
                      <div>
                        <p className="text-[11px] font-bold text-slate-300 mb-1">
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
                                  ? 'border-emerald-500 scale-105 shadow-md shadow-emerald-500/20'
                                  : 'border-transparent opacity-70 hover:opacity-100'
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
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                      Ingredientes Utilizados, Quantidade & Custo de Cada Insumo
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Custo Total da Receita:{' '}
                      <strong className="text-emerald-400">{formatBRL(formTotalCost)}</strong> •
                      Custo Médio por Porção:{' '}
                      <strong className="text-emerald-400">{formatBRL(formServingCost)}</strong>
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
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Insumo
                  </button>
                </div>

                <div className="space-y-2">
                  {recipeFormModal.ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center bg-slate-950/60 p-2.5 rounded-xl border border-white/10"
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
                          className="w-full rounded-lg bg-slate-900 border border-white/10 px-2.5 py-1.5 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
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
                          className="w-full rounded-lg bg-slate-900 border border-white/10 px-2.5 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-1">
                        <input
                          type="text"
                          placeholder="Un"
                          value={ing.unit}
                          onChange={(e) => {
                            const next = [...recipeFormModal.ingredients];
                            next[idx] = { ...next[idx], unit: e.target.value };
                            setRecipeFormModal({ ...recipeFormModal, ingredients: next });
                          }}
                          className="w-full rounded-lg bg-slate-900 border border-white/10 px-2 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 text-center"
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
                          className="w-full rounded-lg bg-slate-900 border border-white/10 px-2 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          {AISLES.map((a) => (
                            <option key={a} value={a} className="bg-slate-900 text-white">
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
                            className="w-full rounded-lg bg-slate-900 border border-white/10 pl-7 pr-2 py-1.5 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
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
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 cursor-pointer transition"
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
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 block mb-1">
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
                  className="w-full rounded-xl bg-slate-950/80 border border-white/10 p-3 text-xs leading-relaxed text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-emerald-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Padrão Gastronômico: Cada etapa do preparo recebe automaticamente fotos ilustrativas de alta resolução com zoom no Modo Cozinha.</span>
                </div>
              </div>

              {/* 5. Como a Porção Deve Ser Servida: Peso, Montagem e Finalização + Instruções Específicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 block">
                    Como a Porção Deve Ser Servida (Peso, Montagem e Finalização) *
                  </label>
                  <div>
                    <span className="text-[11px] font-bold text-slate-300 block mb-1">
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
                      className="w-full rounded-xl bg-slate-900 border border-white/10 px-3 py-1.5 text-xs font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-300 block mb-1">
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
                      className="w-full rounded-xl bg-slate-900 border border-white/10 p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-2 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-amber-300 block">
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
                    className="w-full rounded-xl bg-slate-900 border border-white/10 p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* 6. Informações Nutricionais & Tags */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Calorias (kcal/porção)
                  </label>
                  <input
                    type="number"
                    value={recipeFormModal.calories}
                    onChange={(e) =>
                      setRecipeFormModal({ ...recipeFormModal, calories: e.target.value })
                    }
                    className="w-full rounded-xl bg-slate-950/80 border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Proteínas (g)
                  </label>
                  <input
                    type="number"
                    value={recipeFormModal.protein}
                    onChange={(e) =>
                      setRecipeFormModal({ ...recipeFormModal, protein: e.target.value })
                    }
                    className="w-full rounded-xl bg-slate-950/80 border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Carboidratos (g)
                  </label>
                  <input
                    type="number"
                    value={recipeFormModal.carbs}
                    onChange={(e) =>
                      setRecipeFormModal({ ...recipeFormModal, carbs: e.target.value })
                    }
                    className="w-full rounded-xl bg-slate-950/80 border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Gorduras (g)
                  </label>
                  <input
                    type="number"
                    value={recipeFormModal.fat}
                    onChange={(e) =>
                      setRecipeFormModal({ ...recipeFormModal, fat: e.target.value })
                    }
                    className="w-full rounded-xl bg-slate-950/80 border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Etiquetas / Classificação Dietética */}
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 block mb-2">
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
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                            : 'bg-slate-950/60 text-slate-400 border-white/10 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setRecipeFormModal(null)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-bold text-xs cursor-pointer transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingRecipe}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 cursor-pointer transition"
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
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900/95 text-slate-100 rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-white/10 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-white">
                  Trocar Refeição: {swapSlotTarget.day} ({swapSlotTarget.slot})
                </h3>
                <p className="text-xs text-slate-400">
                  Preço médio estimado para {user.household_size} pessoas
                </p>
              </div>
              <button
                onClick={() => setSwapSlotTarget(null)}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Buscar receita para este horário..."
                value={swapSearch}
                onChange={(e) => setSwapSearch(e.target.value)}
                className="w-full rounded-xl bg-slate-950/80 border border-white/10 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
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
                      className="w-full p-3 rounded-2xl border border-white/10 bg-slate-950/50 hover:border-emerald-500/50 hover:bg-emerald-500/10 flex items-center justify-between gap-3 text-left transition cursor-pointer"
                    >
                    <div className="flex items-center gap-3">
                      <img
                        src={r.image}
                        alt={r.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-800 border border-white/10"
                      />
                      <div>
                        <span className="text-[10px] font-bold uppercase text-emerald-400">
                          {r.category} • {r.portionWeight}
                        </span>
                        <h4 className="font-bold text-sm text-white">{r.title}</h4>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-sm text-emerald-400">
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

      {/* MODAL: REPETIR / APROVEITAR REFEIÇÃO / MARMITA */}
      {repeatRecipeTarget && (() => {
        const { recipe, sourceDay, sourceSlot } = repeatRecipeTarget;
        const nextDay = getNextDay(sourceDay);
        return (
          <div
            onClick={() => setRepeatRecipeTarget(null)}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900/95 text-slate-100 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-white/10 backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-extrabold uppercase tracking-wider mb-1">
                    <Repeat className="w-3 h-3" />
                    <span>Aproveitar / Marmita</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-white">
                    Repetir "{recipe.title}"
                  </h3>
                  <p className="text-xs text-slate-400">
                    Origem: <strong className="text-white">{sourceSlot} de {sourceDay}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setRepeatRecipeTarget(null)}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick smart shortcuts */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                  Sugestões Rápidas (1 clique)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {sourceSlot === 'Almoço' && (
                    <button
                      type="button"
                      onClick={() => handleRepeatMealToSlot(sourceDay, 'Jantar', recipe.id)}
                      className="p-3.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-100 border border-emerald-500/30 text-left transition cursor-pointer flex flex-col justify-between"
                    >
                      <span className="text-xs font-bold flex items-center gap-1.5 text-white">
                        🍲 Aproveitar no Jantar de Hoje
                      </span>
                      <span className="text-[11px] text-emerald-400 font-semibold mt-1">
                        {sourceDay} • Jantar
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRepeatMealToSlot(nextDay, 'Almoço', recipe.id)}
                    className="p-3.5 rounded-2xl bg-teal-950/40 hover:bg-teal-900/50 text-teal-100 border border-teal-500/30 text-left transition cursor-pointer flex flex-col justify-between"
                  >
                    <span className="text-xs font-bold flex items-center gap-1.5 text-white">
                      🍱 Marmita no Almoço de Amanhã
                    </span>
                    <span className="text-[11px] text-teal-400 font-semibold mt-1">
                      {nextDay} • Almoço
                    </span>
                  </button>

                  {sourceSlot === 'Jantar' && (
                    <button
                      type="button"
                      onClick={() => handleRepeatMealToSlot(nextDay, 'Jantar', recipe.id)}
                      className="p-3.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-100 border border-emerald-500/30 text-left transition cursor-pointer flex flex-col justify-between"
                    >
                      <span className="text-xs font-bold flex items-center gap-1.5 text-white">
                        🍲 Repetir no Jantar de Amanhã
                      </span>
                      <span className="text-[11px] text-emerald-400 font-semibold mt-1">
                        {nextDay} • Jantar
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Or pick any day and slot */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                  Ou escolha qualquer dia e horário na grade:
                </span>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {DAYS.map((day) => (
                    <div
                      key={day}
                      className="p-2.5 rounded-2xl bg-slate-950/50 border border-white/10 flex items-center justify-between gap-2"
                    >
                      <span className="text-xs font-bold text-slate-300 w-20 shrink-0">
                        {day}
                      </span>
                      <div className="flex gap-1.5 flex-1 justify-end">
                        {SLOTS.map((slot) => {
                          const isOrigin = day === sourceDay && slot === sourceSlot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={isOrigin}
                              onClick={() => handleRepeatMealToSlot(day, slot, recipe.id)}
                              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                                isOrigin
                                  ? 'opacity-30 bg-slate-800 text-slate-500 cursor-not-allowed'
                                  : 'bg-slate-900 hover:bg-emerald-600 hover:text-white text-slate-200 border border-white/10 shadow-xs'
                              }`}
                            >
                              {slot === 'Café da Manhã'
                                ? 'Café'
                                : slot === 'Almoço'
                                ? 'Almoço'
                                : 'Jantar'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL 5: NOVIDADES DA VERSÃO (APARECE APENAS NA ABERTURA QUANDO ATUALIZADO) */}
      {changelogModalOpen && latestRelease && (
        <div
          onClick={handleDismissChangelog}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900/95 text-slate-100 rounded-3xl max-w-lg w-full shadow-2xl border border-white/10 overflow-hidden backdrop-blur-2xl"
          >
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white relative">
              <button
                onClick={handleDismissChangelog}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition"
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
              <div className="rounded-2xl p-4 bg-slate-950/60 border border-white/10">
                <ul className="space-y-2">
                  {latestRelease.items.map((item, i) => (
                    <li key={i} className="text-sm text-slate-200 leading-relaxed flex gap-2">
                      <span className="text-emerald-400 shrink-0 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleDismissChangelog}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/30 cursor-pointer transition"
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
            className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900/95 text-slate-100 rounded-3xl max-w-3xl w-full shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* TOP HEADER */}
              <div className="bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 p-5 sm:p-6 text-white relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={rec.image}
                      alt={rec.title}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-white/30 shadow-md shrink-0 bg-slate-900"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-extrabold uppercase tracking-wider">
                          <Play className="w-3 h-3 fill-current" />
                          <span>Modo Cozinhar Guiado • Etapa {currentIdx + 1} de {totalStages}</span>
                        </div>
                        {wakeLockActive && (
                          <div
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400/30 border border-emerald-300/50 text-[10px] font-bold text-white tracking-wide"
                            title="Sua tela não vai escurecer nem apagar durante o preparo"
                          >
                            <Sun className="w-3 h-3 text-amber-300" />
                            <span>Tela Sempre Ativa</span>
                          </div>
                        )}
                      </div>
                      <h2 className="text-lg sm:text-xl font-black leading-tight">
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

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCookingDrawerOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                      title="Consultar lista completa de ingredientes"
                    >
                      <ListChecks className="w-4 h-4" />
                      <span className="hidden sm:inline">Ingredientes</span>
                    </button>
                    <button
                      onClick={() => setCookingSession(null)}
                      className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer shrink-0 transition"
                      title="Sair do Modo Cozinhar"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* PROGRESS BAR & STEP PILLS */}
                <div className="mt-4">
                  <div className="w-full h-2 rounded-full bg-black/30 overflow-hidden">
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
                          ? 'bg-white text-emerald-800 shadow-md font-black'
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
                              ? 'bg-white text-emerald-800 shadow-md font-black'
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
                          ? 'bg-white text-emerald-800 shadow-md font-black'
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
                      ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                      : 'bg-slate-950/80 border-white/10 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                        cookingSession.timerFinished
                          ? 'bg-amber-500 text-white animate-bounce'
                          : cookingSession.timerRunning
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-300 border border-white/10'
                      }`}
                    >
                      <Timer className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {cookingSession.timerFinished
                          ? '🔔 Tempo Concluído!'
                          : cookingSession.timerRunning
                          ? 'Cronômetro em andamento'
                          : 'Cronômetro da Etapa'}
                      </div>
                      <div className="text-xl font-black font-mono tracking-tight text-white">
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
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition"
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
                        className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition"
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
                      className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-white/10 cursor-pointer transition"
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
                      className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-white/10 cursor-pointer transition"
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
                        className="px-2.5 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 font-bold text-xs cursor-pointer transition"
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                          Etapa Inicial • Mise en Place
                        </span>
                        <h3 className="text-lg font-black text-white mt-0.5">
                          Separe e pese os ingredientes na bancada
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Marque cada insumo abaixo conforme for separando para cozinhar sem imprevistos.
                        </p>
                      </div>

                      {/* PORTION SCALER */}
                      <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-2 rounded-xl border border-white/10 shrink-0 self-start sm:self-center">
                        <span className="text-xs font-bold text-slate-400">Porções:</span>
                        <button
                          type="button"
                          onClick={() =>
                            setCookingSession((prev) => ({
                              ...prev,
                              scaleServings: Math.max(1, (prev.scaleServings || 2) - 1),
                            }))
                          }
                          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-sm flex items-center justify-center cursor-pointer transition"
                        >
                          -
                        </button>
                        <span className="text-sm font-black text-emerald-400 min-w-[2ch] text-center">
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
                          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-sm flex items-center justify-center cursor-pointer transition"
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
                                ? 'bg-slate-950/40 border-transparent text-slate-500 opacity-50 line-through'
                                : 'bg-slate-950/70 hover:bg-slate-850/80 border-white/10 text-slate-200 shadow-sm'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-2xl shrink-0">
                                {getIngredientEmoji(ing.name, ing.aisle)}
                              </span>
                              <div className="min-w-0">
                                <div className="font-bold text-sm truncate">{ing.name}</div>
                                <div className="text-xs text-slate-400">
                                  {scaledAmt} {ing.unit}
                                </div>
                              </div>
                            </div>
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                checked
                                  ? 'bg-emerald-600 text-white'
                                  : 'border-2 border-slate-600 text-transparent'
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

                {!isMiseEnPlace && !isFinalPlating && (() => {
                  const currentStepDetail = rec.stepDetails && rec.stepDetails[currentIdx - 1];
                  const hasStepImg = currentStepDetail && currentStepDetail.image;

                  return (
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
                            🍳 Passo {currentIdx} de {steps.length}
                          </span>
                          {currentStepDetail && currentStepDetail.section && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-950/80 text-slate-300 border border-white/10 text-xs font-bold">
                              {currentStepDetail.section}
                            </span>
                          )}
                        </div>

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
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition border ${
                            cookingSession.completedSteps[currentIdx - 1]
                              ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-white/10'
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

                      {/* PHOTO OF THE STEP */}
                      {hasStepImg && (
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-slate-950 group max-h-72 sm:max-h-80">
                          <img
                            key={currentIdx}
                            src={currentStepDetail.image}
                            alt={currentStepDetail.alt || currentStepText}
                            decoding="async"
                            className="w-full h-56 sm:h-72 object-cover transition-transform duration-300 group-hover:scale-102"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setZoomedImage({
                                src: currentStepDetail.image,
                                alt: currentStepDetail.alt || currentStepText,
                                title: `Passo ${currentIdx}: ${currentStepDetail.section || ''}`,
                              })
                            }
                            className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition border border-white/10"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Ampliar Foto</span>
                          </button>
                          {currentStepDetail.alt && (
                            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[11px] font-medium text-white max-w-sm truncate border border-white/10">
                              {currentStepDetail.alt}
                            </div>
                          )}
                        </div>
                      )}

                      {/* LARGE READABLE STEP CARD */}
                      <div className="p-6 sm:p-7 rounded-3xl bg-slate-950/80 border border-white/10 shadow-inner">
                        <p className="text-xl sm:text-2xl font-bold text-slate-100 leading-relaxed">
                          {currentStepText}
                        </p>
                      </div>

                      {/* DICA DO CHEF PARA ESTE PASSO */}
                      {currentStepDetail && currentStepDetail.tip && (
                        <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
                          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div className="text-xs text-amber-200 leading-relaxed">
                            <strong className="font-bold text-amber-300">Dica do Chef: </strong>
                            {currentStepDetail.tip}
                          </div>
                        </div>
                      )}

                      {/* INGREDIENTS MENTIONED IN THIS STEP */}
                      {stepIngredients.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Insumos utilizados neste passo:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {stepIngredients.map((ing, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-slate-200 text-xs font-bold"
                              >
                                <span className="text-base">
                                  {getIngredientEmoji(ing.name, ing.aisle)}
                                </span>
                                <span>{ing.name}:</span>
                                <strong className="text-emerald-400">
                                  {Number((ing.amount * scaleRatio).toFixed(2))} {ing.unit}
                                </strong>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* NEXT STEP PREVIEW */}
                      {currentIdx < steps.length && (
                        <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm backdrop-blur-md">
                          <div className="flex items-start sm:items-center gap-3 min-w-0">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-black uppercase tracking-wider shrink-0">
                              <span>A seguir • Passo {currentIdx + 1}</span>
                            </span>
                            <p className="text-sm font-semibold text-slate-200 line-clamp-2 leading-relaxed">
                              {steps[currentIdx]}
                            </p>
                          </div>
                          <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-emerald-400 shrink-0">
                            <span>Próximo</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {isFinalPlating && (
                  <div className="space-y-5">
                    <div className="p-6 rounded-3xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-2">
                      <div className="text-4xl">👨‍🍳🍽️</div>
                      <div className="text-xs font-black uppercase tracking-wider text-emerald-300">
                        Etapa Final • Padrão de Serviço
                      </div>
                      <h3 className="text-2xl font-black text-white">
                        Montagem, Peso da Porção e Finalização
                      </h3>
                      <p className="text-xs text-slate-300 max-w-md mx-auto">
                        Siga as instruções da ficha técnica abaixo para empratar e servir sua refeição com padrão de restaurante.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10">
                        <div className="text-[11px] font-bold uppercase text-slate-400">
                          Peso Recomendado por Porção
                        </div>
                        <div className="text-lg font-black text-white mt-1">
                          ⚖️ {rec.portionWeight || '300g por porção'}
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10">
                        <div className="text-[11px] font-bold uppercase text-slate-400">
                          Valor Nutricional por Porção
                        </div>
                        <div className="text-sm font-bold text-emerald-400 mt-1">
                          🔥 {rec.calories} kcal • 💪 {rec.protein}g Prot • 🌾 {rec.carbs || 30}g Carb • 🥑 {rec.fat || 10}g Gord
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                      <div className="text-xs font-black uppercase tracking-wider text-emerald-400">
                        🍽️ Instruções de Montagem e Finalização
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed">
                        {rec.platingInstructions || 'Sirva imediatamente após o preparo em prato aquecido.'}
                      </p>
                    </div>

                    {rec.specificInstructions && (
                      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1">
                        <div className="text-xs font-black uppercase tracking-wider text-amber-300">
                          📌 Dica do Chef & Conservação
                        </div>
                        <p className="text-xs text-amber-200 leading-relaxed">
                          {rec.specificInstructions}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* BOTTOM NAVIGATION FOOTER */}
              <div className="p-4 sm:p-5 bg-slate-950/80 border-t border-white/10 flex items-center justify-between gap-3">
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
                  className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 font-bold text-sm border border-white/10 flex items-center gap-2 cursor-pointer transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Etapa Anterior</span>
                </button>

                <div className="flex flex-col items-center justify-center text-center">
                  <div className="text-xs font-bold text-slate-300">
                    {isMiseEnPlace
                      ? 'Separe os ingredientes para começar'
                      : isFinalPlating
                      ? 'Prato pronto para servir!'
                      : `Passo ${currentIdx} de ${steps.length}`}
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                    <span className="font-semibold text-slate-400">Atalhos:</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono font-bold border border-white/10">Espaço</span>
                    <span>Timer</span>
                    <span className="text-slate-600">•</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono font-bold border border-white/10">← / →</span>
                    <span>Passos</span>
                    <span className="text-slate-600">•</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono font-bold border border-white/10">Esc</span>
                    <span>Fechar</span>
                  </div>
                </div>

                {!isFinalPlating ? (
                  <button
                    type="button"
                    onClick={() => {
                      const nextIdx = Math.min(totalStages - 1, currentIdx + 1);
                      if (nextIdx === totalStages - 1) {
                        playChefServiceBell();
                      }
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
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/60 transition active:scale-95"
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
                    onClick={() => {
                      playChefServiceBell();
                      setCookingSession(null);
                    }}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/60 transition active:scale-95"
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

      {/* INGREDIENTS DRAWER (DURING COOKING MODE) */}
      {cookingDrawerOpen && cookingSession && (
        <div
          onClick={() => setCookingDrawerOpen(false)}
          className="fixed inset-0 z-60 bg-black/75 backdrop-blur-sm flex items-center justify-end p-0 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 text-slate-100 rounded-l-3xl sm:rounded-3xl max-w-md w-full h-full sm:h-auto sm:max-h-[85vh] p-6 shadow-2xl border border-white/10 flex flex-col space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-base text-white">Ingredientes da Receita</h3>
              </div>
              <button
                onClick={() => setCookingDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Quantidades escaladas para <strong className="text-slate-200">{cookingSession.scaleServings || 2} porções</strong>.
            </p>
            <div className="overflow-y-auto flex-1 space-y-2 pr-1 max-h-[60vh]">
              {(cookingSession.recipe.ingredients || []).map((ing, idx) => {
                const checked = !!cookingSession.checkedIngredients[idx];
                const baseS = cookingSession.recipe.servings || 2;
                const ratio = (cookingSession.scaleServings || baseS) / baseS;
                const scaledAmt = Number((ing.amount * ratio).toFixed(2));
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
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-3 cursor-pointer transition ${
                      checked
                        ? 'bg-slate-950/40 border-transparent text-slate-500 opacity-50 line-through'
                        : 'bg-slate-950/70 hover:bg-slate-800 border-white/10 text-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl shrink-0">{getIngredientEmoji(ing.name, ing.aisle)}</span>
                      <div className="min-w-0">
                        <div className="font-bold text-xs truncate">{ing.name}</div>
                        <div className="text-[11px] text-slate-400">{scaledAmt} {ing.unit} ({ing.aisle})</div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        checked ? 'bg-emerald-600 text-white' : 'border border-slate-600 text-transparent'
                      }`}
                    >
                      ✓
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setCookingDrawerOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition border border-white/10"
            >
              Fechar Lista
            </button>
          </div>
        </div>
      )}

      {/* MODAL 7: CALIBRADOR DE PREÇOS REAIS & ENTRADA DE COMPRAS (SEFAZ / NFC-e) */}
      {sefazModalOpen && (
        <div
          onClick={() => {
            if (!sefazConfirming) {
              setSefazModalOpen(false);
              setSefazInvoice(null);
              setSefazError('');
              setSefazSuccessMsg('');
            }
          }}
          className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900/95 text-slate-100 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-white/10 space-y-6 backdrop-blur-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/25 shrink-0">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-white">
                      Calibrador de Preços & Entrada de Compras
                    </h2>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      NFC-e / SEFAZ
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Cole o texto do cupom de compras ou da nota fiscal. O NeatEat calibra os preços médios reais dos ingredientes e abastece o estoque da sua geladeira com as quantidades exatas compradas.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!sefazConfirming) {
                    setSefazModalOpen(false);
                    setSefazInvoice(null);
                    setSefazError('');
                    setSefazSuccessMsg('');
                  }
                }}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer shrink-0 border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error / Success Feedback */}
            {sefazError && (
              <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-800/40 text-rose-200 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Atenção ao processar cupom fiscal:</p>
                  <p className="leading-relaxed">{sefazError}</p>
                </div>
              </div>
            )}

            {sefazSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-sm font-bold flex items-center gap-3 animate-fade-in shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{sefazSuccessMsg}</span>
              </div>
            )}

            {/* STEP 1: ENTRADA DE DADOS POR TEXTO DO CUPOM / NOTA */}
            {!sefazInvoice && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                      Cole o texto da nota fiscal ou cupom de compras:
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handlePasteClipboard}
                        className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition shadow-2xs"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Colar da Área de Transferência</span>
                      </button>
                      {sefazText && (
                        <button
                          type="button"
                          onClick={() => setSefazText('')}
                          className="px-2 py-1 rounded-lg text-slate-400 hover:text-slate-200 text-[11px] font-bold cursor-pointer"
                        >
                          Limpar
                        </button>
                      )}
                    </div>
                  </div>

                  <textarea
                    rows={8}
                    placeholder={`Cole aqui o texto copiado da tela da SEFAZ, do cupom fiscal ou da sua compra no mercado.\n\nExemplo:\nARROZ CAMIL 1KG 2 UN 5,89 11,78\nPEITO DE FRANGO 1.45 KG 21,90 31,75\nTOMATE 1KG 8,90\nOVOS 30UN 24,00`}
                    value={sefazText}
                    onChange={(e) => setSefazText(e.target.value)}
                    className="w-full rounded-2xl bg-slate-950/80 border border-white/10 p-4 text-xs font-mono text-white placeholder:text-slate-500 leading-relaxed focus:outline-none focus:border-emerald-500 shadow-inner"
                  />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    💡 <strong>O que acontece ao processar:</strong> O NeatEat abastece sua <strong>Geladeira</strong> com as quantidades reais de alimentos comprados e atualiza a <strong>calibragem dos preços médios reais</strong> dos insumos para calcular com precisão o custo das suas refeições.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={!sefazText.trim() || sefazLoading}
                  onClick={() => handleParseSefaz(false)}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/30 transition"
                >
                  {sefazLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analisando e normalizando insumos...</span>
                    </>
                  ) : (
                    <>
                      <ScanLine className="w-4 h-4" />
                      <span>Processar Cupom, Abastecer Geladeira & Calibrar Preços</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* STEP 2: CONFERÊNCIA DOS ITENS PARSEADOS & SELEÇÃO PARA GELADEIRA */}
            {sefazInvoice && (!sefazInvoice.items || sefazInvoice.items.length === 0) && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-center justify-between">
                <span>Nenhum item válido foi encontrado no cupom processado.</span>
                <button
                  type="button"
                  onClick={() => setSefazInvoice(null)}
                  className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg text-xs font-bold text-amber-200 cursor-pointer"
                >
                  Voltar e Tentar Novamente
                </button>
              </div>
            )}

            {sefazInvoice && sefazInvoice.items && sefazInvoice.items.length > 0 && (
              <div className="space-y-5">
                {/* Supermarket Banner */}
                <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-white">
                        {sefazInvoice.supermarket}
                      </h3>
                      {sefazInvoice.isDemo && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/30">
                          Demonstração
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Data da compra: <strong>{sefazInvoice.purchaseDate}</strong> • Total pago: <strong className="text-emerald-400">{formatBRL(sefazInvoice.totalValue)}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                      🥬 {sefazInvoice.foodItemsCount} Alimentos
                    </span>
                    {sefazInvoice.itemsCount > sefazInvoice.foodItemsCount && (
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-white/10">
                        🧴 {sefazInvoice.itemsCount - sefazInvoice.foodItemsCount} Outros
                      </span>
                    )}
                  </div>
                </div>

                {/* Items Review Table */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sefazInvoice.items.filter((i) => !i.isNonFood).every((i) => i.stockInFridge)}
                          onChange={(e) => handleToggleAllSefazStock(e.target.checked)}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Marcar todos os alimentos para a Geladeira</span>
                      </label>
                    </div>
                    <span className="text-xs text-slate-400">
                      {sefazInvoice.items.filter((i) => i.stockInFridge).length} de {sefazInvoice.items.length} itens selecionados
                    </span>
                  </div>

                  <div className="border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5 max-h-[44vh] overflow-y-auto">
                    {sefazInvoice.items.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                          item.isNonFood
                            ? 'bg-slate-950/40 opacity-60'
                            : item.stockInFridge
                            ? 'bg-slate-800/40'
                            : 'bg-slate-950/60'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={item.stockInFridge}
                            onChange={() => handleToggleSefazItemStock(idx)}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                            title="Marque para guardar na geladeira"
                          />

                          <div className="min-w-0 space-y-0.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-bold text-slate-100 truncate">
                                {item.rawName}
                              </span>
                              {item.isNonFood && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/10">
                                  Não Alimentício
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="text-emerald-300 font-semibold flex items-center gap-1">
                                <span>↳ {item.matchedName}</span>
                              </span>
                              <span className="text-slate-500">•</span>
                              <span className="text-slate-400 font-medium">
                                {item.quantity} {item.unit}
                              </span>
                              <span className="text-slate-500">•</span>
                              <span className="text-slate-400">
                                {formatBRL(item.unitPrice)} / {item.unit}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 shrink-0 text-right">
                          <span className="text-sm font-black text-white">
                            {formatBRL(item.totalPrice)}
                          </span>

                          {item.priceVariationPct !== null && (
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                                item.priceVariationPct < 0
                                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                                  : item.priceVariationPct > 0
                                  ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                                  : 'bg-slate-800 text-slate-400 border border-white/10'
                              }`}
                            >
                              {item.priceVariationPct < 0 ? (
                                <>
                                  <TrendingDown className="w-3 h-3 text-emerald-400" />
                                  <span>{item.priceVariationPct}% mais barato</span>
                                </>
                              ) : item.priceVariationPct > 0 ? (
                                <>
                                  <TrendingUp className="w-3 h-3 text-rose-400" />
                                  <span>+{item.priceVariationPct}%</span>
                                </>
                              ) : (
                                <span>Referência</span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary & Impact Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs space-y-1">
                    <span className="font-extrabold text-emerald-300 flex items-center gap-1.5">
                      <Refrigerator className="w-4 h-4 text-emerald-400" />
                      <span>Geladeira & Despensa</span>
                    </span>
                    <p className="text-slate-300">
                      <strong>{sefazInvoice.items.filter((i) => i.stockInFridge).length} itens</strong> entrarão no seu estoque com quantidade real.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-sky-950/30 border border-sky-500/20 text-xs space-y-1">
                    <span className="font-extrabold text-sky-300 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-sky-400" />
                      <span>Fichas Técnicas</span>
                    </span>
                    <p className="text-slate-300">
                      <strong>{sefazInvoice.foodItemsCount} insumos</strong> calibrarão os custos por porção das suas receitas.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/20 text-xs space-y-1">
                    <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
                      <ShoppingCart className="w-4 h-4 text-amber-400" />
                      <span>Lista da Semana</span>
                    </span>
                    <p className="text-slate-300">
                      Baixa automática no carrinho dos itens comprados.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    disabled={sefazConfirming}
                    onClick={() => {
                      setSefazInvoice(null);
                      setSefazError('');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition border border-white/10"
                  >
                    <span>← Voltar ou Outra Nota</span>
                  </button>

                  <button
                    type="button"
                    disabled={sefazConfirming}
                    onClick={handleConfirmSefazInvoice}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
                  >
                    {sefazConfirming ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Calibrando e Atualizando Estoque...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirmar & Calibrar NeatEat</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 8: INTELIGÊNCIA DE PREÇOS MÉDIOS & GESTÃO DE INSUMOS */}
      {pricesModalOpen && (
        <div
          onClick={() => {
            setPricesModalOpen(false);
            setEditingPriceKey(null);
          }}
          className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900/95 text-slate-100 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-white/10 backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-sky-600/25 shrink-0">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-white">
                      Inteligência de Preços Médios dos Ingredientes
                    </h2>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      {marketPrices.length} Insumos
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tabela base CEASA/PROCON calibrada dinamicamente via cupons fiscais (NFC-e). Define o custo real por porção de todas as receitas.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPricesModalOpen(false);
                  setEditingPriceKey(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer shrink-0 border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions & Filters Bar */}
            <div className="p-4 sm:p-5 bg-slate-950/40 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[260px]">
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Buscar insumo (ex: arroz, alho, peito de frango)..."
                    value={priceSearchQuery}
                    onChange={(e) => setPriceSearchQuery(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-white/10 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                  />
                </div>
                <select
                  value={priceFilterAisle}
                  onChange={(e) => setPriceFilterAisle(e.target.value)}
                  className="rounded-xl bg-slate-900 border border-white/10 px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="Todos">Todos os Setores</option>
                  <option value="Açougue">Açougue</option>
                  <option value="Laticínios">Laticínios</option>
                  <option value="Hortifruti">Hortifruti</option>
                  <option value="Grãos e Cereais">Grãos e Cereais</option>
                  <option value="Mercearia">Mercearia</option>
                  <option value="Temperos">Temperos</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleRecalculatePrices}
                disabled={recalculatingPrices}
                className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-sky-600/25 cursor-pointer transition disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${recalculatingPrices ? 'animate-spin' : ''}`} />
                <span>{recalculatingPrices ? 'Recalculando Custos...' : 'Recalcular Receitas'}</span>
              </button>
            </div>

            {/* Success Toast */}
            {priceSuccessToast && (
              <div className="mx-4 mt-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{priceSuccessToast}</span>
              </div>
            )}

            {/* Insumos List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-white/5 space-y-1">
              {marketPrices
                .filter((item) => {
                  const matchQuery =
                    !priceSearchQuery.trim() ||
                    item.name.toLowerCase().includes(priceSearchQuery.toLowerCase()) ||
                    item.key.toLowerCase().includes(priceSearchQuery.toLowerCase());
                  const matchAisle =
                    priceFilterAisle === 'Todos' || item.aisle === priceFilterAisle;
                  return matchQuery && matchAisle;
                })
                .map((item) => {
                  const isCalibrated = (item.sample_count || 0) > 0;
                  const isEditing = editingPriceKey === item.key;

                  return (
                    <div
                      key={item.key}
                      className="py-3 px-3 rounded-2xl hover:bg-slate-800/40 transition flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-lg shrink-0 border border-white/5">
                          {getIngredientEmoji(item.name, item.aisle)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-white">{item.name}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/5">
                              {item.aisle}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Unidade base:{' '}
                            <span className="font-semibold text-slate-300">
                              1 {item.unit}
                            </span>
                            {item.supermarket && (
                              <span> • Último: {item.supermarket}</span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-slate-400 font-bold">R$</span>
                              <input
                                type="number"
                                step="0.01"
                                min="0.05"
                                value={editingPriceValue}
                                onChange={(e) => setEditingPriceValue(e.target.value)}
                                className="w-20 rounded-lg bg-slate-950 border border-sky-400 px-2 py-1 text-xs font-black text-emerald-400 focus:outline-none"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateMarketPrice(item.key, editingPriceValue)
                                }
                                className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold cursor-pointer"
                              >
                                Salvar
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingPriceKey(null)}
                                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] font-bold cursor-pointer"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <div>
                              <span className="text-sm sm:text-base font-black text-emerald-400">
                                R$ {Number(item.avg_unit_price).toFixed(2)}
                              </span>
                              <span className="text-[10px] text-slate-400">/{item.unit}</span>
                            </div>
                          )}

                          <div>
                            {isCalibrated ? (
                              <span className="text-[10px] font-bold text-emerald-400 flex items-center justify-end gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                Calibrado Cupom ({item.sample_count}x)
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-slate-400 flex items-center justify-end gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                                Referência CEASA
                              </span>
                            )}
                          </div>
                        </div>

                        {!isEditing && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPriceKey(item.key);
                              setEditingPriceValue(String(item.avg_unit_price));
                            }}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/5 cursor-pointer transition active:scale-95"
                            title="Editar preço de mercado"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-950/60 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-400">
                Os preços são ponderados automaticamente a cada nova nota fiscal inserida.
              </span>
              <button
                type="button"
                onClick={() => {
                  setPricesModalOpen(false);
                  setEditingPriceKey(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition border border-white/10"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 9: GERENCIADOR DE APIS & CONEXÕES INTELIGENTES */}
      {apiKeysModalOpen && (
        <div
          onClick={() => setApiKeysModalOpen(false)}
          className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900/95 text-slate-100 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-white/10 space-y-6 backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25 shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-white">
                      APIs & Conexões Externas
                    </h2>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      4 Motores Integrados
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Conecte inteligência artificial, acervo de fotos em alta definição e bancos abertos de nutrição e alimentos para potencializar o NeatEat.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setApiKeysModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer shrink-0 border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Success Toast */}
            {apiKeysToast && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{apiKeysToast}</span>
              </div>
            )}

            <form onSubmit={handleSaveApiKeys} className="space-y-4">
              {/* Card 1: Google Gemini API */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">✨</span>
                    <h3 className="font-extrabold text-sm text-white">
                      1. Google Gemini 2.0 Flash (IA de Fichas Técnicas)
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      geminiKeyInput.trim()
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-white/5'
                    }`}
                  >
                    {geminiKeyInput.trim() ? '🟢 Conectado' : '⚪ Chave Opcional'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Lê e estrutura qualquer link de receita (ou foto de receita de família) em formato JSON de restaurante: ingredientes precisos em gramas, tempo, porções, passos e modo de empratamento.
                </p>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Chave de API do Google Gemini (GEMINI_API_KEY):
                  </label>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={geminiKeyInput}
                    onChange={(e) => setGeminiKeyInput(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Cota gratuita oficial disponível em:{' '}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline font-semibold"
                    >
                      aistudio.google.com → Obter Chave Grátis
                    </a>
                  </span>
                </div>
              </div>

              {/* Card 2: Open Food Facts */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ScanLine className="w-4 h-4 text-indigo-400" />
                    <h3 className="font-extrabold text-sm text-white">
                      2. Open Food Facts (Banco Aberto de Alimentos do Brasil)
                    </h3>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    🟢 100% Conectado (Gratuito)
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Mais de 3 milhões de produtos cadastrados. Permite consultar rótulos reais por nome de marca ou código de barras (EAN-13), trazendo pesos líquidos exatos, fotos da embalagem, Nutri-Score e índice de ultraprocessados (Classificação NOVA).
                </p>
              </div>

              {/* Card 3: Unsplash Food API */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-sky-400" />
                    <h3 className="font-extrabold text-sm text-white">
                      3. Unsplash Food API (Fotografia Gastronômica de Alta Resolução)
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      unsplashKeyInput.trim()
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                    }`}
                  >
                    {unsplashKeyInput.trim() ? '🟢 Conectado' : '🔵 Curadoria Ativa'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fotos culinárias profissionais com iluminação de estúdio para pratos e etapas de preparo, com fallback automático para o acervo gastronômico integrado.
                </p>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Unsplash Access Key (Opcional):
                  </label>
                  <input
                    type="password"
                    placeholder="Cole sua Access Key do Unsplash..."
                    value={unsplashKeyInput}
                    onChange={(e) => setUnsplashKeyInput(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-400 font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Cadastre-se gratuitamente em:{' '}
                    <a
                      href="https://unsplash.com/developers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:underline font-semibold"
                    >
                      unsplash.com/developers →
                    </a>
                  </span>
                </div>
              </div>

              {/* Card 4: Tabela TACO / TBCA */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-extrabold text-sm text-white">
                      4. Tabela TACO / TBCA (USP & UNICAMP)
                    </h3>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    🟢 100% Integrado no SQLite (Oficial / Offline)
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tabela Brasileira de Composição de Alimentos. O NeatEat calcula macronutrientes (calorias, proteínas, carboidratos, gorduras, fibras e sódio) com base científica oficial para carnes, leguminosas e vegetais do cardápio nacional.
                </p>
              </div>

              {/* Save Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setApiKeysModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition border border-white/10"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  disabled={savingApiKeys}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{savingApiKeys ? 'Salvando...' : 'Salvar Configurações de API'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 10: CONSULTA DE PRODUTOS & CÓDIGO DE BARRAS (OPEN FOOD FACTS) */}
      {offModalOpen && (
        <div
          onClick={() => setOffModalOpen(false)}
          className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900/95 text-slate-100 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-white/10 space-y-6 backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/25 shrink-0">
                  <ScanLine className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-white">
                      Consulta de Rótulos & Código de Barras
                    </h2>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Open Food Facts Brasil
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Digite o nome de uma marca/produto (ex: <em>Arroz Camil</em>, <em>Leite Ninho</em>, <em>Azeite Gallo</em>) ou cole o código de barras (EAN-13).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOffModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer shrink-0 border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchOpenFoodFacts(offSearchQuery);
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Nome do produto ou código EAN (ex: 7891000100103 ou Leite Moça)..."
                  value={offSearchQuery}
                  onChange={(e) => setOffSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-white/10 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div>
              <button
                type="submit"
                disabled={offSearching || !offSearchQuery.trim()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/25 cursor-pointer transition disabled:opacity-50"
              >
                <ScanLine className={`w-4 h-4 ${offSearching ? 'animate-spin' : ''}`} />
                <span>{offSearching ? 'Buscando...' : 'Consultar'}</span>
              </button>
            </form>

            {/* Results Grid */}
            <div className="space-y-3">
              {offResults.length > 0 && (
                <p className="text-xs font-bold text-slate-400">
                  {offResults.length} produtos encontrados no banco oficial:
                </p>
              )}

              {offResults.map((p, idx) => (
                <div
                  key={p.code || idx}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 flex flex-wrap items-center justify-between gap-4 hover:border-indigo-500/40 transition"
                >
                  <div className="flex items-center gap-3.5 min-w-[240px] flex-1">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-14 h-14 rounded-xl object-contain bg-slate-900 border border-white/10 p-1 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-xl shrink-0">
                        📦
                      </div>
                    )}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-black text-sm text-white">{p.name}</h4>
                        {p.brand && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/5">
                            {p.brand}
                          </span>
                        )}
                        {p.quantity && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {p.quantity}
                          </span>
                        )}
                      </div>

                      {/* Badges Nova & NutriScore */}
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                        {p.nova_group && (
                          <span className="text-[10px] font-bold text-slate-300">
                            Classificação NOVA: Grupo {p.nova_group}{' '}
                            {p.nova_group === 1
                              ? '(In natura)'
                              : p.nova_group === 4
                              ? '(Ultraprocessado)'
                              : ''}
                          </span>
                        )}
                        {p.nutriscore_grade && (
                          <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                            Nutri-Score: {p.nutriscore_grade}
                          </span>
                        )}
                        {p.nutriments?.kcal_100g > 0 && (
                          <span>• {p.nutriments.kcal_100g} kcal/100g</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddOffProductToFridge(p)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/25 cursor-pointer transition shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar à Geladeira</span>
                  </button>
                </div>
              ))}

              {!offSearching && offResults.length === 0 && offSearchQuery && (
                <div className="text-center py-6 text-slate-500 text-xs">
                  Nenhum produto encontrado para "{offSearchQuery}". Tente buscar por palavras mais curtas como "leite", "arroz" ou digite o código de barras numérico.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ZOOM LIGHTBOX MODAL */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-70 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full flex flex-col items-center"
          >
            <div className="w-full flex items-center justify-between text-white mb-3">
              <span className="font-extrabold text-sm sm:text-base">{zoomedImage.title || 'Foto em Alta Resolução'}</span>
              <button
                onClick={() => setZoomedImage(null)}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={zoomedImage.src}
              alt={zoomedImage.alt || 'Foto ampliada'}
              className="max-h-[80vh] w-auto max-w-full rounded-2xl shadow-2xl object-contain border border-white/20"
            />
            {zoomedImage.alt && (
              <p className="text-xs text-slate-300 text-center mt-3 max-w-xl">
                {zoomedImage.alt}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
