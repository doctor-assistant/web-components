# 🧪 Como Testar a Integração Memed

## 🚀 Iniciar o Servidor de Desenvolvimento

```bash
npm start
```

O servidor será iniciado em: **http://localhost:3333**

---

## 📋 Página de Testes

Ao acessar `http://localhost:3333`, você verá a página principal com:

### 1. **Seção: Configuração Básica**
- Informações do componente DAAI
- API Key configurada
- Professional ID

### 2. **Seção: Dados do Paciente**
- Dados de exemplo pré-configurados

### 3. **Seção: Integração Memed** ⭐ NOVA!
Esta é a seção principal para testar a integração com a Memed.

#### **Campos disponíveis:**

1. **Token Memed**
   - Insira o token do prescritor obtido via API da Memed
   - Ambiente de homologação: use o token fornecido pela Memed
   
2. **Dados do Paciente (JSON)**
   - JSON pré-preenchido com dados de exemplo
   - Campos obrigatórios:
     - `idExterno`: ID único do paciente
     - `nome`: Nome completo
     - `telefone`: Telefone de contato
     - `cpf`: CPF (ou `withoutCpf: true`)

3. **Medicamentos (JSON)**
   - Lista de medicamentos para Voice Prescription
   - Cada medicamento deve ter:
     - `medication`: Nome do medicamento
     - `dosageInstruction`: Instruções de uso

#### **Botões de Teste:**

- **📋 Testar Prescrição Tradicional**
  - Testa o fluxo completo do módulo `plataforma.prescricao`
  - Exibe a interface completa da Memed
  - O médico pode selecionar medicamentos manualmente
  
- **🎤 Testar Voice Prescription**
  - Testa o módulo `platform.voice-prescription`
  - Usa os medicamentos pré-definidos no JSON
  - Ideal para prescrições baseadas em IA/voz

- **ℹ️ Verificar Status Memed**
  - Verifica se o SDK da Memed está carregado
  - Mostra disponibilidade de `MdHub` e `MdSinapsePrescricao`
  - Útil para debugging

---

## 🎯 Fluxo de Teste Recomendado

### **Teste 1: Verificar Status (Inicial)**

1. Clique em **"ℹ️ Verificar Status Memed"**
2. Você verá que o SDK ainda não está carregado
3. Isso é normal - o SDK será carregado no primeiro teste

### **Teste 2: Prescrição Tradicional**

1. Insira seu **token da Memed** no campo
2. Revise os dados do paciente (JSON)
3. Clique em **"📋 Testar Prescrição Tradicional"**
4. Observe os logs no console abaixo:
   - ✅ Script carregado
   - ✅ Módulo inicializado
   - ✅ Paciente definido
   - ✅ Prescrição exibida
5. A interface da Memed deve aparecer

### **Teste 3: Voice Prescription**

1. Mantenha o token no campo
2. Revise os medicamentos (JSON)
3. Clique em **"🎤 Testar Voice Prescription"**
4. Observe os logs:
   - ✅ Script carregado (ou reutilizado)
   - ✅ Módulo voice-prescription inicializado
   - ✅ Paciente definido
   - ✅ Medicamentos definidos
   - ✅ Interface aberta
5. A interface Voice Prescription deve aparecer

### **Teste 4: Verificar Status Novamente**

1. Clique em **"ℹ️ Verificar Status Memed"**
2. Agora você verá:
   - ✅ MdHub disponível
   - ✅ MdSinapsePrescricao disponível
   - ✅ Script tag encontrada

---

## 📊 Console de Logs

Cada teste exibe logs detalhados mostrando:

- ⏱️ Timestamp de cada ação
- ✅ Sucessos (verde)
- ❌ Erros (vermelho)
- ⚠️ Avisos (amarelo)
- ℹ️ Informações (azul)

### **Exemplo de log bem-sucedido:**

```
========================================
🏥 TESTE: PRESCRIÇÃO TRADICIONAL MEMED
========================================
📋 Validando dados do paciente...
✅ Dados validados com sucesso!
📦 Passo 1/4: Carregando script da Memed...
✨ Script da Memed carregado com sucesso!
⏳ Passo 2/4: Aguardando módulo plataforma.prescricao...
✨ Módulo plataforma.prescricao inicializado!
👤 Passo 3/4: Definindo dados do paciente...
✅ Paciente definido com sucesso!
🖥️ Passo 4/4: Exibindo módulo de prescrição...
✅ Prescrição exibida com sucesso!
========================================
🎉 TESTE CONCLUÍDO COM SUCESSO!
========================================
```

---

## 🐛 Troubleshooting

### **Erro: "Token não configurado"**
**Solução:** Insira o token da Memed no campo de texto no topo da seção.

### **Erro: "SDK da Memed não disponível"**
**Solução:** 
1. Verifique se o token é válido
2. Verifique a conexão com a internet
3. Confirme que está usando o token correto (homologação ou produção)

### **Erro: "JSON inválido"**
**Solução:** Verifique a sintaxe do JSON nos campos de texto. Use uma ferramenta como [jsonlint.com](https://jsonlint.com) para validar.

### **Interface não aparece**
**Solução:**
1. Verifique os logs no console
2. Certifique-se de que todos os passos foram concluídos com sucesso
3. Tente limpar o cache do navegador
4. Recarregue a página e tente novamente

### **Ambiente de homologação offline**
A Memed informa que o ambiente de homologação fica offline:
- **Segunda a sexta:** 00h às 06h
- **Fim de semana:** Todo o período

**Solução:** Teste em horário comercial.

---

## 📝 Outras Seções da Página

### **🧪 Testes e Debug**
Botões para testar outras funcionalidades do componente:
- Validação de dados do paciente
- Teste básico da integração Memed
- Informações do componente
- Tratamento de erros

### **✅ Status da Implementação**
Mostra o status de todas as features implementadas.

---

## 🔗 Links Úteis

- **Documentação Completa:** [docs/MEMED-INTEGRATION.md](./docs/MEMED-INTEGRATION.md)
- **Exemplo HTML Standalone:** [docs/example-memed-integration.html](./docs/example-memed-integration.html)
- **Resumo de Mudanças:** [docs/CHANGES-SUMMARY.md](./docs/CHANGES-SUMMARY.md)
- **API Memed:** [https://api.memed.com.br/docs](https://api.memed.com.br/docs)

---

## 🎓 Credenciais de Homologação

```javascript
// API Backend
const API_KEY = "iJGiB4kjDGOLeDFPWMG3no9VnN7Abpqe3w1jEFm6olkhkZD6oSfSmYCm";
const SECRET_KEY = "Xe8M5GvBGCr4FStKfxXKisRo3SfYKI7KrTMkJpCAstzu2yXVN4av5nmL";

// URL da API
const MEMED_API_URL = "https://integrations.api.memed.com.br/v1";

// URL do Script
const MEMED_SCRIPT_URL = "https://integrations.memed.com.br/modulos/plataforma.sinapse-prescricao/build/sinapse-prescricao.min.js";
```

⚠️ **Importante:** Nunca exponha suas chaves de produção no frontend!

---

## ✅ Checklist de Testes

- [ ] Página carrega corretamente em `http://localhost:3333`
- [ ] Token da Memed inserido no campo
- [ ] Teste "Verificar Status" executado (inicial - SDK não carregado)
- [ ] Teste "Prescrição Tradicional" executado com sucesso
- [ ] Interface da Memed apareceu
- [ ] Teste "Voice Prescription" executado com sucesso
- [ ] Medicamentos apareceram na interface
- [ ] Teste "Verificar Status" executado novamente (SDK carregado)
- [ ] Todos os logs aparecem sem erros
- [ ] Console do navegador não mostra erros críticos

---

**Última atualização:** 17 de outubro de 2025
