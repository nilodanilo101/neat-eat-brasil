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

  // Recipe catalog filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [tagFilter, setTagFilter] = useState('Todas');
  const [maxPricePerServing, setMaxPricePerServing] = useState(35);

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

  const { user, recipes, mealPlan, fridgeItems, shoppingList, totals } = data;
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Brand with Menu Icon */}
          <div className="flex items-center gap-3">
            <img
              src="/menu-icon.png"
              alt="Ícone Menu NeatEat"
              className="w-11 h-11 rounded-2xl shadow-sm object-cover border border-emerald-600/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  n<span className="text-emerald-600">EAT</span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Brasil
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Planejador Semanal & Fichas Técnicas de Restaurante
              </p>
            </div>
          </div>

          {/* Live Budget Gauge Pill */}
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

          {/* Household & Auth Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(user.household_code);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              title="Copiar código de convite da família"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-amber-600" />
              <span> Casa: {user.household_code}</span>
              {copiedCode && <span className="text-emerald-700 font-bold ml-1">Copiado!</span>}
            </button>

            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>{user.name}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto border-t border-slate-100">
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
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition cursor-pointer ${
                  active
                    ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
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
                              <button
                                onClick={() => setSwapSlotTarget({ day, slot })}
                                className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <ArrowRightLeft className="w-3 h-3" />
                                Trocar
                              </button>
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

                      <div className="text-[11px] text-slate-500 border-t border-slate-200/70 pt-2">
                        {rec.missingIngs.length === 0 ? (
                          <span className="text-emerald-700 font-bold">
                            Você tem 100% dos ingredientes! Custo extra R$ 0,00!
                          </span>
                        ) : (
                          <span>
                            Faltam:{' '}
                            {rec.missingIngs
                              .map((i) => i.name)
                              .slice(0, 3)
                              .join(', ')}
                          </span>
                        )}
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

                        {/* Edit & Delete Quick Buttons on Card */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
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
                      <span className="font-bold text-slate-700">
                        CMV Total: {formatBRL(recipe.baseCost)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
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
                          <td className="py-2.5 px-3 font-bold text-slate-800">{ing.name}</td>
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

            <div className="space-y-2.5">
              {recipes.map((r) => {
                const cost = getRecipeMealCost(r);
                return (
                  <button
                    key={r.id}
                    onClick={() => handleSwapSlotRecipe(r.id)}
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
    </div>
  );
}
