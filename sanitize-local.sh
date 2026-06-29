# Script mandatório: sanitize-local.sh
echo "🧹 Higienizando ambiente sob protocolo Zero-Trust..."
# Limpeza de builds e logs; .venv e dotfiles sensíveis são preservados
rm -rf .next/ coverage/ dist/ build/ *.log
git stash push -m "wip: backup automático pre-higienização" --include-untracked
npm cache verify
echo "✅ Ambiente sanitizado. Valide o git status antes de commitar."
