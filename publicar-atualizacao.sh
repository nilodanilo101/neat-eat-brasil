#!/bin/bash
set -e

NOVA_VERSAO=${1:-"patch"}

echo "🚀 Preparando nova versão do NeatEat Brasil ($NOVA_VERSAO)..."

# 1. Atualiza a versão no package.json e cria a tag git (ex: v1.0.1)
npm version $NOVA_VERSAO -m "Release v%s"

# 2. Envia código e tag para o GitHub
echo "📤 Enviando código para o GitHub..."
git push origin main --follow-tags

# 3. Gera os instaladores atualizados e publica direto no GitHub Releases com o token do gh CLI
echo "📦 Empacotando e publicando atualização automática no GitHub Releases..."
GH_TOKEN=$(/opt/homebrew/bin/gh auth token) npm run release

# Publica a release (caso electron-builder crie como draft, garante que fique publicada)
TAG_ATUAL="v$(node -p "require('./package.json').version")"
/opt/homebrew/bin/gh release edit "$TAG_ATUAL" --draft=false 2>/dev/null || true

echo "✅ Pronto! A versão $TAG_ATUAL já está no ar em https://github.com/nilodanilo101/neat-eat-brasil/releases"
