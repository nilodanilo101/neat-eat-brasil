/**
 * mobileShoppingHtml.js
 * Página web leve e ultra-responsiva para uso do NeatEat direto no celular dentro do supermercado.
 * Permite marcar itens no carrinho em tempo real, sincronizado com o computador via rede local.
 */

export function renderMobileShoppingPageHtml() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="theme-color" content="#090d16">
  <title>NeatEat Brasil • Modo Supermercado</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    body {
      background-color: #090d16;
      color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding-bottom: 90px;
      line-height: 1.4;
    }
    header {
      position: sticky;
      top: 0;
      z-index: 50;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 12px 16px;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 900;
      font-size: 16px;
      letter-spacing: -0.5px;
      color: #fff;
    }
    .badge {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
      font-size: 11px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .metrics {
      display: grid;
      grid-template-cols: 1fr 1fr;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 10px;
    }
    .metric-card {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 14px;
      padding: 8px 10px;
    }
    .metric-card.checked {
      background: rgba(6, 78, 59, 0.3);
      border-color: rgba(16, 185, 129, 0.4);
    }
    .metric-label {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      color: #94a3b8;
    }
    .metric-val {
      font-size: 16px;
      font-weight: 900;
      color: #fff;
      margin-top: 2px;
    }
    .metric-sub {
      font-size: 11px;
      color: #10b981;
      font-weight: 700;
    }
    .progress-bar-bg {
      width: 100%;
      height: 6px;
      background: #1e293b;
      border-radius: 999px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #14b8a6);
      border-radius: 999px;
      transition: width 0.3s ease;
    }
    .controls-row {
      display: flex;
      gap: 8px;
    }
    .search-input {
      flex: 1;
      background: #0b1120;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 8px 12px;
      color: #fff;
      font-size: 13px;
      outline: none;
    }
    .search-input:focus {
      border-color: #10b981;
    }
    .toggle-btn {
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #cbd5e1;
      font-size: 12px;
      font-weight: 700;
      border-radius: 12px;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      white-space: nowrap;
    }
    .toggle-btn.active {
      background: #10b981;
      color: #fff;
      border-color: #10b981;
    }
    main {
      padding: 12px 16px;
    }
    .category-group {
      margin-bottom: 20px;
    }
    .category-title {
      font-size: 12px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #38bdf8;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
      padding-left: 2px;
    }
    .item-card {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 14px;
      padding: 12px 14px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: all 0.15s ease;
      user-select: none;
    }
    .item-card:active {
      transform: scale(0.98);
      background: #1e293b;
    }
    .item-card.is-checked {
      background: rgba(15, 23, 42, 0.4);
      border-color: rgba(255, 255, 255, 0.02);
      opacity: 0.55;
    }
    .item-card.is-checked .item-name {
      text-decoration: line-through;
      color: #64748b;
    }
    .checkbox {
      width: 26px;
      height: 26px;
      border-radius: 8px;
      border: 2px solid #334155;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: 900;
      color: transparent;
      transition: all 0.15s ease;
      flex-shrink: 0;
    }
    .item-card.is-checked .checkbox {
      background: #10b981;
      border-color: #10b981;
      color: #fff;
    }
    .item-info {
      flex: 1;
      min-width: 0;
    }
    .item-name {
      font-weight: 700;
      font-size: 14px;
      color: #f8fafc;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .item-sub {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 2px;
      font-weight: 500;
    }
    .item-price {
      font-size: 13px;
      font-weight: 800;
      color: #34d399;
      text-align: right;
      white-space: nowrap;
    }
    .in-fridge-tag {
      display: inline-block;
      font-size: 10px;
      font-weight: 800;
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      padding: 1px 6px;
      border-radius: 4px;
      margin-top: 3px;
    }
    footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(15, 23, 42, 0.96);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: 10px 16px;
      display: flex;
      gap: 10px;
      align-items: center;
      z-index: 50;
    }
    .wa-btn {
      flex: 1;
      background: #25D366;
      color: #fff;
      border: none;
      border-radius: 14px;
      padding: 12px;
      font-weight: 800;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
    }
    .wa-btn:active {
      transform: scale(0.98);
    }
    .sync-indicator {
      font-size: 11px;
      color: #94a3b8;
      font-weight: 600;
      text-align: center;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .sync-dot {
      width: 7px;
      height: 7px;
      background: #10b981;
      border-radius: 50%;
      display: inline-block;
    }
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #64748b;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <header>
    <div class="header-top">
      <div class="brand">
        <span>🍲 NeatEat Brasil</span>
        <span class="badge">🛒 Modo Mercado</span>
      </div>
      <div class="sync-indicator">
        <span class="sync-dot"></span>
        <span id="syncText">Sincronizado</span>
      </div>
    </div>

    <div class="metrics">
      <div class="metric-card checked">
        <div class="metric-label">🛒 No Carrinho</div>
        <div class="metric-val" id="checkedTotal">R$ 0,00</div>
        <div class="metric-sub" id="checkedCount">0 itens</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">⏳ Falta Comprar</div>
        <div class="metric-val" id="remainingTotal">R$ 0,00</div>
        <div class="metric-sub" id="remainingCount" style="color: #94a3b8;">0 itens</div>
      </div>
    </div>

    <div class="progress-bar-bg">
      <div class="progress-bar-fill" id="progressBar" style="width: 0%;"></div>
    </div>

    <div class="controls-row">
      <input type="text" id="searchInput" class="search-input" placeholder="🔍 Filtrar produtos no mercado...">
      <button type="button" id="toggleHideBtn" class="toggle-btn">
        <span>Ocultar Comprados</span>
      </button>
    </div>
  </header>

  <main id="itemsContainer">
    <div class="empty-state">Carregando lista de compras...</div>
  </main>

  <footer>
    <button type="button" id="waShareBtn" class="wa-btn">
      <span>📲 Copiar p/ WhatsApp</span>
    </button>
  </footer>

  <script>
    const urlParams = new URLSearchParams(window.location.search);
    const sessionToken = urlParams.get('token') || '';

    let stateData = null;
    let hideChecked = false;
    let searchTerm = '';

    function getHeaders() {
      const h = { 'Content-Type': 'application/json' };
      if (sessionToken) h['x-neateat-token'] = sessionToken;
      return h;
    }

    function formatBRL(val) {
      return (Number(val) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function categorizeItem(name, cat) {
      const n = (name || '').toLowerCase();
      if (n.includes('frango') || n.includes('carne') || n.includes('patinho') || n.includes('acém') || n.includes('bife') || n.includes('peixe') || n.includes('tilápia') || n.includes('salmão') || n.includes('lombo') || n.includes('calabresa') || n.includes('bacon')) return '🥩 Açougue & Proteínas';
      if (n.includes('ovo') || n.includes('queijo') || n.includes('ricota') || n.includes('leite') || n.includes('iogurte') || n.includes('manteiga')) return '🧀 Laticínios & Ovos';
      if (n.includes('cebola') || n.includes('alho') || n.includes('tomate') || n.includes('cenoura') || n.includes('abóbora') || n.includes('batata') || n.includes('espinafre') || n.includes('couve') || n.includes('pimentão') || n.includes('brócolis') || n.includes('banana') || n.includes('limão') || n.includes('alface') || n.includes('cheiro-verde') || n.includes('salsinha')) return '🥦 Hortifrúti & Feira';
      if (n.includes('sal') || n.includes('pimenta') || n.includes('orégano') || n.includes('páprica') || n.includes('louro') || n.includes('cominho')) return '🧂 Temperos & Condimentos';
      if (n.includes('arroz') || n.includes('feijão') || n.includes('aveia') || n.includes('tapioca') || n.includes('macarrão') || n.includes('azeite') || n.includes('extrato') || n.includes('shoyu') || n.includes('quinoa') || n.includes('grão-de-bico') || n.includes('polvilho') || n.includes('pão')) return '🌾 Mercearia & Grãos';
      return '🛒 Outros Insumos';
    }

    async function loadState() {
      try {
        const url = '/api/state' + (sessionToken ? '?token=' + encodeURIComponent(sessionToken) : '');
        const res = await fetch(url, { headers: getHeaders() });
        if (!res.ok) throw new Error('Falha ao carregar');
        stateData = await res.json();
        render();
        document.getElementById('syncText').textContent = 'Sincronizado';
      } catch (e) {
        document.getElementById('syncText').textContent = 'Tentando conectar...';
      }
    }

    async function toggleItem(itemKey, currentChecked) {
      if ('vibrate' in navigator) navigator.vibrate(35);
      const newChecked = !currentChecked;

      // Atualização otimista imediata na UI
      if (stateData && stateData.checkedMap) {
        stateData.checkedMap[itemKey.toLowerCase().trim()] = newChecked;
        render();
      }

      try {
        const url = '/api/shopping/toggle' + (sessionToken ? '?token=' + encodeURIComponent(sessionToken) : '');
        await fetch(url, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ itemKey, checked: newChecked })
        });
      } catch (err) {
        console.error('Erro ao sincronizar toggle:', err);
      }
    }

    function render() {
      if (!stateData) return;
      const shoppingList = stateData.shoppingList || [];
      const checkedMap = stateData.checkedMap || {};

      let checkedTotal = 0;
      let checkedCount = 0;
      let remainingTotal = 0;
      let remainingCount = 0;

      const grouped = {};

      shoppingList.forEach((it) => {
        const key = (it.name || '').toLowerCase().trim();
        const isChecked = Boolean(checkedMap[key]);
        const price = Number(it.totalPrice) || 0;

        if (isChecked) {
          checkedTotal += price;
          checkedCount++;
        } else {
          remainingTotal += price;
          remainingCount++;
        }

        const matchesSearch = !searchTerm || key.includes(searchTerm.toLowerCase());
        if (!matchesSearch) return;
        if (hideChecked && isChecked) return;

        const cat = categorizeItem(it.name, it.category);
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push({ ...it, isChecked });
      });

      const totalItems = checkedCount + remainingCount;
      const pct = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

      document.getElementById('checkedTotal').textContent = formatBRL(checkedTotal);
      document.getElementById('checkedCount').textContent = checkedCount + ' de ' + totalItems + ' itens';
      document.getElementById('remainingTotal').textContent = formatBRL(remainingTotal);
      document.getElementById('remainingCount').textContent = remainingCount + ' restantes';
      document.getElementById('progressBar').style.width = pct + '%';

      const container = document.getElementById('itemsContainer');
      const cats = Object.keys(grouped);

      if (cats.length === 0) {
        container.innerHTML = '<div class="empty-state">Nenhum item pendente para comprar! 🎉</div>';
        return;
      }

      let html = '';
      cats.forEach((cat) => {
        const items = grouped[cat];
        html += '<div class="category-group">';
        html += '<div class="category-title">' + cat + ' (' + items.length + ')</div>';
        items.forEach((it) => {
          const checkedClass = it.isChecked ? 'is-checked' : '';
          const checkedMark = it.isChecked ? '✓' : '';
          const priceStr = it.totalPrice ? formatBRL(it.totalPrice) : '';
          const inFridge = it.inFridge ? '<span class="in-fridge-tag">🧊 Já tem em casa</span>' : '';

          html += \`
            <div class="item-card \${checkedClass}" onclick="toggleItem('\${it.name.replace(/'/g, "\\\\'")}', \${it.isChecked})">
              <div class="checkbox">\${checkedMark}</div>
              <div class="item-info">
                <div class="item-name">\${it.name}</div>
                <div class="item-sub">\${it.amount} \${it.unit} \${inFridge}</div>
              </div>
              <div class="item-price">\${priceStr}</div>
            </div>
          \`;
        });
        html += '</div>';
      });

      container.innerHTML = html;
    }

    document.getElementById('searchInput').addEventListener('input', (e) => {
      searchTerm = e.target.value.trim();
      render();
    });

    document.getElementById('toggleHideBtn').addEventListener('click', () => {
      hideChecked = !hideChecked;
      const btn = document.getElementById('toggleHideBtn');
      if (hideChecked) {
        btn.classList.add('active');
        btn.innerHTML = '<span>Ver Todos</span>';
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '<span>Ocultar Comprados</span>';
      }
      render();
    });

    document.getElementById('waShareBtn').addEventListener('click', () => {
      if (!stateData) return;
      const shoppingList = stateData.shoppingList || [];
      const checkedMap = stateData.checkedMap || {};
      const household = stateData.user?.household_size || 2;

      let text = '🛒 *LISTA DE COMPRAS • NEATEAT BRASIL*\\n';
      text += '📅 *Semana Atual* (' + household + (household === 1 ? ' pessoa' : ' pessoas') + ')\\n';
      text += '────────────────────\\n\\n';

      const grouped = {};
      let totalEst = 0;

      shoppingList.forEach((it) => {
        const key = (it.name || '').toLowerCase().trim();
        const isChecked = Boolean(checkedMap[key]);
        totalEst += Number(it.totalPrice) || 0;
        const cat = categorizeItem(it.name, it.category);
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push({ ...it, isChecked });
      });

      for (const [cat, items] of Object.entries(grouped)) {
        text += '*' + cat + '*\\n';
        items.forEach((it) => {
          const mark = it.isChecked ? '✅' : '⬜';
          const price = it.totalPrice ? ' (~' + formatBRL(it.totalPrice) + ')' : '';
          text += mark + ' ' + it.name + ' • ' + it.amount + ' ' + it.unit + price + '\\n';
        });
        text += '\\n';
      }

      text += '────────────────────\\n';
      text += '💰 *Total Estimado:* ' + formatBRL(totalEst) + '\\n';
      text += '_Sincronizado via NeatEat Brasil 3.5.0_';

      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          alert('Lista formatada copiada com sucesso para o WhatsApp!');
        });
      } else {
        window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(text), '_blank');
      }
    });

    // Carga inicial e polling suave de atualização (a cada 4s)
    loadState();
    setInterval(loadState, 4000);
  </script>
</body>
</html>`;
}
