#!/bin/bash

echo "========================================="
echo "  Iniciando Bot Discord - Alpha Store"
echo "========================================="
echo ""

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

echo "🚀 Iniciando o bot..."
echo ""

node index.js
