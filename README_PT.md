# 🤖 Bot Discord - ⚡ Alpha Store ⚡

Bot de vendas automáticas para Discord com sistema completo de gerenciamento de produtos, pagamentos e atendimento.

## 📋 Características

- ✅ Sistema de vendas automáticas
- ✅ Gerenciamento de produtos e estoque
- ✅ Sistema de tickets
- ✅ Pagamentos integrados (Mercado Pago)
- ✅ Gerador de contas
- ✅ Sistema de cupons
- ✅ Logs completos
- ✅ Painel administrativo
- ✅ Comandos em português

## 🚀 Como Iniciar

### Método 1: Script de Início (Recomendado)
```bash
./start.sh
```

### Método 2: Manualmente
```bash
npm install
node index.js
```

## ⚙️ Configuração

O token do bot já está configurado no arquivo `config.json`.

### Estrutura de Pastas:
```
/app/
├── ComandosSlash/         # Comandos do bot
│   ├── Administracao/     # Comandos administrativos
│   └── Usuarios/          # Comandos de usuários
├── Functions/             # Funções do bot
├── Handler/              # Handlers de eventos e comandos
├── DataBaseJson/         # Banco de dados JSON
├── Stock/                # Estoque de produtos
└── config.json           # Configurações principais
```

## 📚 Comandos Principais

### Comandos de Administração:
- `/botconfig` - Painel principal de configuração
- `/vendas` - Ver estatísticas de vendas
- `/anunciar` - Enviar anúncios
- `/manage_product` - Gerenciar produtos
- `/manage_stock` - Gerenciar estoque
- `/rank` - Ranking de vendas
- `/backup` - Fazer backup

### Comandos de Usuários:
- `/ajuda` - Menu de ajuda interativo
- `/meu_perfil` - Ver seu perfil

### Sistema Gerador:
- `/gerar [serviço]` - Gerar uma conta
- `/stockgen` - Ver serviços disponíveis

## 🔧 Correções Realizadas

### ✅ Problemas Corrigidos:
1. **Token atualizado** - Token do bot atualizado no config.json
2. **Handler de comandos** - Corrigido para carregar comandos de forma síncrona
3. **Dependências nativas** - Recompiladas (better-sqlite3, canvas)
4. **StartIntents.js** - Adicionado require do node-fetch
5. **Função inexistente** - Removida chamada à configgenpainelzika
6. **Comandos slash** - Agora registram corretamente no Discord

### 🛠️ Melhorias Implementadas:
- Sistema de log melhorado para comandos
- Tratamento de erros aprimorado
- Mensagens de erro mais claras
- Compatibilidade com Node.js v20

## 📱 Como Usar os Comandos no Discord

1. **Digite `/` no chat** - Todos os comandos aparecerão automaticamente
2. **Selecione o comando desejado** - Use as setas ou clique
3. **Preencha os parâmetros** - Se necessário
4. **Pressione Enter** - Para executar

## 🎯 Comandos de Ajuda

O bot possui um **sistema de ajuda interativo**. Use `/ajuda` para:
- Ver todos os comandos disponíveis
- Navegar entre categorias
- Obter descrição detalhada de cada comando

## 🔐 Permissões

Alguns comandos requerem:
- Permissão de Administrador
- Cargos específicos configurados no bot
- Permissões adicionadas via `/perm_add`

## 📊 Banco de Dados

O bot utiliza:
- **wio.db** - Para dados em JSON
- **quick.db** - Para dados rápidos
- **better-sqlite3** - Para SQLite

Todos os dados são armazenados em `/app/DataBaseJson/`

## 🐛 Solução de Problemas

### O bot não inicia:
```bash
npm install
npm rebuild better-sqlite3
node index.js
```

### Comandos não aparecem no Discord:
1. Aguarde até 5 minutos para sincronização
2. Verifique se o bot tem permissões de "applications.commands"
3. Reinicie o bot

### Erros de permissão:
- Verifique se o bot tem permissões de Administrador no servidor
- Use `/perm_add` para adicionar permissões de uso

## 📞 Suporte

Discord: discord.gg/aplicativos

## 📝 Créditos

- @odeletefodendoloiras - yands
- @garotasmentem - sousadelas
- @comendoputa - dnzzkkkkj

## ⚡ Versão

Versão atual: **v2.0.0**

---

**Desenvolvido com 💙 para a comunidade Discord**
