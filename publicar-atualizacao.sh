#!/bin/bash
set -e

NOVA_VERSAO=${1:-"patch"}

echo "🚀 Preparando nova versão do NeatEat Brasil ($NOVA_VERSAO)..."

# 1. Atualiza a versão no package.json sem criar tag ainda
npm version $NOVA_VERSAO --no-git-tag-version

VERSAO_ATUAL=$(node -p "require('./package.json').version")
TAG_ATUAL="v$VERSAO_ATUAL"

# Sincroniza CURRENT_VERSION em server/changelog.js
node -e "
const fs = require('fs');
let content = fs.readFileSync('./server/changelog.js', 'utf8');
content = content.replace(/export const CURRENT_VERSION = '[^']+';/, \"export const CURRENT_VERSION = '$VERSAO_ATUAL';\");
fs.writeFileSync('./server/changelog.js', content);
"

# Extrai o texto de novidades da versão atual de server/changelog.js para o GitHub Releases
NOTAS_RELEASE=$(node --input-type=module -e "
import { RELEASE_NOTES } from './server/changelog.js';
const latest = RELEASE_NOTES[0];
console.log('### ' + latest.title + '\n\n' + latest.summary + '\n\n' + latest.items.map(i => '- ' + i).join('\n'));
")

# 2. Faz commit e cria a tag
git add package.json package-lock.json server/changelog.js
git commit -m "Release $TAG_ATUAL"
git tag "$TAG_ATUAL"

# 3. Envia código e tag para o GitHub
echo "📤 Enviando código e tag $TAG_ATUAL para o GitHub..."
git push origin main --follow-tags

# 4. Empacota localmente para Mac (.dmg e .zip)
echo "📦 Gerando instaladores atualizados ($TAG_ATUAL)..."
rm -rf release
npm run dist:mac

# Padroniza nomes com hífen conforme latest-mac.yml
cp "release/NeatEat Brasil-${VERSAO_ATUAL}-arm64.dmg" "release/NeatEat-Brasil-${VERSAO_ATUAL}-arm64.dmg"
cp "release/NeatEat Brasil-${VERSAO_ATUAL}-arm64-mac.zip" "release/NeatEat-Brasil-${VERSAO_ATUAL}-arm64-mac.zip"
cp "release/NeatEat Brasil-${VERSAO_ATUAL}-arm64.dmg.blockmap" "release/NeatEat-Brasil-${VERSAO_ATUAL}-arm64.dmg.blockmap"
cp "release/NeatEat Brasil-${VERSAO_ATUAL}-arm64-mac.zip.blockmap" "release/NeatEat-Brasil-${VERSAO_ATUAL}-arm64-mac.zip.blockmap"

# 5. Cria ou atualiza a Release no GitHub com as Novidades da Versão
echo "☁️ Publicando Release $TAG_ATUAL no GitHub..."
/opt/homebrew/bin/gh release create "$TAG_ATUAL" \
  "release/NeatEat-Brasil-${VERSAO_ATUAL}-arm64.dmg" \
  "release/NeatEat-Brasil-${VERSAO_ATUAL}-arm64-mac.zip" \
  "release/NeatEat-Brasil-${VERSAO_ATUAL}-arm64.dmg.blockmap" \
  "release/NeatEat-Brasil-${VERSAO_ATUAL}-arm64-mac.zip.blockmap" \
  "release/latest-mac.yml" \
  --title "NeatEat Brasil $TAG_ATUAL" \
  --notes "$NOTAS_RELEASE"

echo "✅ Pronto! A versão $TAG_ATUAL já está no ar com o resumo de Novidades da Versão!"
