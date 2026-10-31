#!/bin/bash
set -e

NOVA_VERSAO=${1:-"patch"}

echo "🚀 Preparando nova versão do NeatEat Brasil ($NOVA_VERSAO)..."

# Atualiza a versão no package.json e cria a tag git (ex: v1.0.1)
npm version $NOVA_VERSAO -m "Release v%s"

echo "📤 Enviando código e tag para o GitHub..."
git push origin main --follow-tags

echo "✅ Pronto! O GitHub Actions vai gerar os instaladores (.dmg e .exe) e o app do seu amigo receberá a atualização automaticamente!"
