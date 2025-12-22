# 🔧 Guia de Solução de Problemas - Bot Discord

## ⚠️ Erros Comuns e Soluções

### 1. Bot não conecta / Token inválido

**Sintomas:**
```
[LOG] Token Incorreto
```

**Solução:**
1. Verifique o token em `config.json`
2. Certifique-se de que copiou o token completo
3. Não compartilhe seu token publicamente

**Token atual configurado:** `MTQ0Njg1NzkzMzkwNzMwMDQwMg.G8Tlnn.jZNB9WCTuyjwbFmNrYmLmqoOsCm3MumtXINfEw`

---

### 2. Intents não ativadas

**Sintomas:**
```
[LOG] Ativa as Intents do Bot
```

**Solução:**
1. Acesse https://discord.com/developers/applications
2. Selecione seu bot
3. Vá em "Bot" → "Privileged Gateway Intents"
4. Ative:
   - ✅ PRESENCE INTENT
   - ✅ SERVER MEMBERS INTENT
   - ✅ MESSAGE CONTENT INTENT

---

### 3. Comandos não aparecem quando digito "/"

**Sintomas:**
- Nenhum comando aparece ao digitar "/"
- Comandos não sincronizam

**Solução:**

**Passo 1:** Verifique permissões do bot
```
O bot precisa da permissão "applications.commands" no servidor
```

**Passo 2:** Convite com permissões corretas
```
https://discord.com/oauth2/authorize?client_id=SEU_BOT_ID&permissions=8&scope=bot%20applications.commands
```

**Passo 3:** Aguarde a sincronização
- Os comandos podem levar até 1 hora para aparecer globalmente
- Em servidores específicos, é instantâneo

**Passo 4:** Force a sincronização
```bash
# Reinicie o bot
node index.js
```

---

### 4. Erro: "better-sqlite3" - invalid ELF header

**Sintomas:**
```
Error: /app/node_modules/better-sqlite3/build/Release/better_sqlite3.node: invalid ELF header
```

**Solução:**
```bash
npm rebuild better-sqlite3
```

---

### 5. Erro: Canvas - pkg-config not found

**Sintomas:**
```
gyp: Call to 'pkg-config pixman-1 --libs' returned exit status 127
```

**Solução:**
```bash
# Instalar dependências do sistema
apt-get update
apt-get install -y pkg-config libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# Recompilar canvas
npm rebuild canvas
```

---

### 6. Comando /ajuda não responde

**Sintomas:**
- O comando é executado mas não recebe resposta
- Timeout ao usar o comando

**Solução:**
1. Verifique os logs do bot
2. Certifique-se de que o arquivo `ajuda.js` existe em `/ComandosSlash/Usuarios/`
3. Reinicie o bot

---

### 7. Sistema de gerador não funciona

**Sintomas:**
- "O sistema do gerador está offline"
- "Serviço não existe no stock"

**Solução:**

**Passo 1:** Configure o sistema
```
Use /botconfig para configurar:
- Canal de geração
- Cargo necessário (opcional)
- Status do sistema (ativo/inativo)
```

**Passo 2:** Adicione produtos ao estoque
```
1. Vá para a pasta /app/Stock/
2. Crie um arquivo .txt com o nome do serviço
3. Adicione uma conta por linha
```

**Exemplo:**
```bash
# Criar arquivo
echo "usuario1:senha1" > /app/Stock/Netflix.txt
echo "usuario2:senha2" >> /app/Stock/Netflix.txt
```

---

### 8. Pagamentos não funcionam

**Sintomas:**
- "Erro ao gerar pagamento"
- Pagamento não é processado

**Solução:**
1. Configure as credenciais do Mercado Pago em `/botconfig`
2. Verifique se tem saldo na conta
3. Confirme que a API está ativa

---

### 9. Logs não aparecem nos canais

**Sintomas:**
- Canais de log não recebem mensagens
- Erro "Canal não encontrado"

**Solução:**

**Passo 1:** Crie os canais automaticamente
```
Use /botconfig → Criar Canais
```

**Passo 2:** Ou configure manualmente
```
Use /botconfig → Configurar Canais
```

**Canais necessários:**
- 🚧 logs-pedidos
- 📈 eventos-compras
- 🛠 logs-sistema
- 🛡 logs-antiraid
- 🚪 logs-entradas
- 🚶 logs-saídas
- 💬 logs-mensagens
- 🎙 tráfego-call
- ⭐ feedback
- 🎫 feedback-ticket

---

### 10. Bot desconecta sozinho

**Sintomas:**
- Bot fica offline aleatoriamente
- Desconexões frequentes

**Solução:**

**Opção 1:** Use PM2 (Recomendado)
```bash
npm install -g pm2
pm2 start index.js --name "alpha-store"
pm2 save
pm2 startup
```

**Opção 2:** Use screen
```bash
screen -S bot
node index.js
# Ctrl+A, depois D para desanexar
```

---

### 11. Erro de dependência circular

**Sintomas:**
```
Warning: Accessing non-existent property 'client' of module exports inside circular dependency
```

**Solução:**
- Este é apenas um aviso, não afeta a funcionalidade
- Pode ser ignorado com segurança

---

### 12. Webhook não funciona

**Sintomas:**
- "Erro ao enviar webhook"
- Notificações não chegam

**Solução:**
1. Verifique se a URL do webhook em `config.json` está correta
2. Teste o webhook manualmente
3. Certifique-se de que o canal do webhook ainda existe

---

## 🔍 Como Verificar Logs

### Ver logs em tempo real:
```bash
node index.js
```

### Ver logs de erro específicos:
```bash
node index.js 2>&1 | grep -i "erro"
```

### Testar comandos individualmente:
```bash
node -c /app/ComandosSlash/Usuarios/ajuda.js
```

---

## 📝 Checklist de Inicialização

Antes de usar o bot, certifique-se:

- [ ] Token está correto em `config.json`
- [ ] Intents estão ativadas no Developer Portal
- [ ] Bot foi convidado com permissões corretas
- [ ] Dependências foram instaladas (`npm install`)
- [ ] Node.js está na versão 16 ou superior
- [ ] Canais de log foram criados
- [ ] Cargos necessários foram configurados

---

## 🆘 Ainda com Problemas?

Se nenhuma solução acima funcionou:

1. **Limpe e reinstale:**
```bash
rm -rf node_modules package-lock.json
npm install
```

2. **Verifique a versão do Node.js:**
```bash
node --version
# Deve ser v16 ou superior
```

3. **Execute com mais detalhes:**
```bash
node --trace-warnings index.js
```

4. **Procure ajuda:**
- Discord: discord.gg/aplicativos
- Verifique os logs em `/var/log/` (se aplicável)

---

## 🛡️ Dicas de Segurança

⚠️ **NUNCA compartilhe:**
- Token do bot
- Credenciais de API (Mercado Pago, etc.)
- Arquivos de configuração com dados sensíveis

✅ **Sempre:**
- Mantenha o bot atualizado
- Use variáveis de ambiente para dados sensíveis
- Faça backups regulares do banco de dados

---

**Última atualização: Dezembro 2024**
