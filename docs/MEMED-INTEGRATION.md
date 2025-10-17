# 📘 Integração com Prescrição Digital Memed

Esta documentação detalha como integrar seu sistema com a **Prescrição Digital Memed**, incluindo tanto o módulo tradicional (`plataforma.prescricao`) quanto o Voice Prescription (`platform.voice-prescription`).

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Configurações Básicas](#configurações-básicas)
3. [Tipos de Integração](#tipos-de-integração)
4. [Guia de Implementação](#guia-de-implementação)
5. [Exemplos Práticos](#exemplos-práticos)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

A integração com a Memed oferece duas opções:

### 1. **Prescrição Tradicional** (`plataforma.prescricao`)
- Interface completa de prescrição
- Médico seleciona medicamentos manualmente
- Usa `MdHub.module.show()` para exibir

### 2. **Voice Prescription** (`platform.voice-prescription`)
- Prescrição baseada em voz/IA
- Medicamentos pré-definidos via API
- Usa `viewVoicePrescription()` para exibir

---

## ⚙️ Configurações Básicas

### Ambiente de Homologação

⚠️ **Atenção:** O ambiente de homologação fica indisponível:
- **Segunda a sexta:** 00h às 06h
- **Fim de semana:** Indisponível

### Credenciais de Homologação

```javascript
const API_KEY = "iJGiB4kjDGOLeDFPWMG3no9VnN7Abpqe3w1jEFm6olkhkZD6oSfSmYCm";
const SECRET_KEY = "Xe8M5GvBGCr4FStKfxXKisRo3SfYKI7KrTMkJpCAstzu2yXVN4av5nmL";
```

🔒 **NUNCA** exponha suas chaves no frontend!

### URLs da Memed

```javascript
// API Backend
const MEMED_API_URL = "https://integrations.api.memed.com.br/v1";

// Script Frontend
const MEMED_SCRIPT_URL = "https://integrations.memed.com.br/modulos/plataforma.sinapse-prescricao/build/sinapse-prescricao.min.js";
```

---

## 🔄 Tipos de Integração

### Módulo: `plataforma.prescricao` (Tradicional)

```typescript
import { bootstrapPrescription, MemedPaciente } from '@doctorassistant/daai-component';

const paciente: MemedPaciente = {
  idExterno: "12345",
  nome: "José da Silva",
  cpf: "99999999999",
  telefone: "11999999999",
  data_nascimento: "10/10/1990",
  email: "jose@example.com"
};

// Executa todo o fluxo automaticamente
await bootstrapPrescription(token, paciente);
```

**Fluxo:**
1. ✅ Carrega script da Memed
2. ✅ Aguarda inicialização do módulo `plataforma.prescricao`
3. ✅ Define dados do paciente
4. ✅ Exibe interface de prescrição

---

### Módulo: `platform.voice-prescription` (Voice)

```typescript
import { bootstrapMemed, MemedPaciente, MemedMedicationItem } from '@doctorassistant/daai-component';

const paciente: MemedPaciente = {
  idExterno: "12345",
  nome: "José da Silva",
  telefone: "11999999999",
  email: "jose@example.com"
};

const medicamentos: MemedMedicationItem[] = [
  {
    medication: "Dipirona 500mg",
    dosageInstruction: "Tomar 1 comprimido a cada 6 horas por 3 dias"
  },
  {
    medication: "Amoxicilina 875mg",
    dosageInstruction: "Tomar 1 comprimido a cada 12 horas por 7 dias"
  }
];

// Executa todo o fluxo automaticamente
await bootstrapMemed(token, paciente, medicamentos);
```

**Fluxo:**
1. ✅ Carrega script da Memed
2. ✅ Aguarda inicialização do módulo `platform.voice-prescription`
3. ✅ Define dados do paciente
4. ✅ Define medicamentos
5. ✅ Abre interface de prescrição

---

## 📚 Guia de Implementação

### 1️⃣ Backend - Obter Token do Prescritor

Você precisa cadastrar o prescritor na API da Memed para obter o `data-token`.

**Endpoint:** `POST https://integrations.api.memed.com.br/v1/prescribers`

```javascript
// Exemplo de requisição
const response = await fetch('https://integrations.api.memed.com.br/v1/prescribers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  },
  body: JSON.stringify({
    nome: "Dr. João Silva",
    cpf: "12345678901",
    crm: "123456",
    uf_crm: "SP",
    especialidade: "Clínico Geral"
  })
});

const { token } = await response.json();
```

📖 [Documentação completa da API](https://api.memed.com.br/docs)

---

### 2️⃣ Frontend - Implementação Manual

#### **Opção A: Prescrição Tradicional**

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Prescrição Memed</title>
</head>
<body>
  <!-- Script da Memed -->
  <script
    src="https://integrations.memed.com.br/modulos/plataforma.sinapse-prescricao/build/sinapse-prescricao.min.js"
    data-token="SEU_TOKEN_AQUI"
  ></script>

  <script>
    // Aguarda inicialização do módulo
    MdSinapsePrescricao.event.add("core:moduleInit", async function (module) {
      if (module.name === "plataforma.prescricao") {
        
        // Define dados do paciente
        await MdHub.command.send("plataforma.prescricao", "setPaciente", {
          idExterno: "12345",
          nome: "José da Silva",
          cpf: "99999999999",
          telefone: "11999999999",
          data_nascimento: "10/10/1990"
        });

        // Exibe a prescrição
        MdHub.module.show("plataforma.prescricao");
      }
    });
  </script>
</body>
</html>
```

#### **Opção B: Voice Prescription**

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Voice Prescription Memed</title>
</head>
<body>
  <!-- Script da Memed -->
  <script
    src="https://integrations.memed.com.br/modulos/plataforma.sinapse-prescricao/build/sinapse-prescricao.min.js"
    data-token="SEU_TOKEN_AQUI"
  ></script>

  <script>
    // Aguarda inicialização do módulo
    MdSinapsePrescricao.event.add("core:moduleInit", async function (module) {
      if (module.name === "platform.voice-prescription") {
        
        // Define dados do paciente
        await MdHub.command.send("plataforma.prescricao", "setPaciente", {
          idExterno: "12345",
          nome: "José da Silva",
          telefone: "11999999999"
        });

        // Define medicamentos
        await MdHub.command.send("platform.voice-prescription", "setMedications", {
          items: [
            {
              medication: "Dipirona 500mg",
              dosageInstruction: "Tomar 1 comprimido a cada 6 horas"
            }
          ]
        });

        // Abre interface
        await MdHub.command.send("platform.voice-prescription", "viewVoicePrescription");
      }
    });
  </script>
</body>
</html>
```

---

### 3️⃣ Frontend - Com Utilitário TypeScript

```typescript
import {
  bootstrapPrescription,
  bootstrapMemed,
  showPrescription,
  hidePrescription,
  setPaciente,
  setMedications,
  viewVoicePrescription,
  type MemedPaciente,
  type MemedMedicationItem
} from '@doctorassistant/daai-component';

// ============================================
// EXEMPLO 1: Prescrição Tradicional (Bootstrap)
// ============================================
async function exemplo1() {
  const token = "SEU_TOKEN_AQUI";
  
  const paciente: MemedPaciente = {
    idExterno: "12345",
    nome: "José da Silva",
    cpf: "99999999999",
    telefone: "11999999999"
  };

  try {
    // Método automático - faz tudo
    await bootstrapPrescription(token, paciente);
    console.log("✅ Prescrição exibida com sucesso!");
  } catch (error) {
    console.error("❌ Erro:", error);
  }
}

// ============================================
// EXEMPLO 2: Voice Prescription (Bootstrap)
// ============================================
async function exemplo2() {
  const token = "SEU_TOKEN_AQUI";
  
  const paciente: MemedPaciente = {
    idExterno: "12345",
    nome: "José da Silva",
    telefone: "11999999999"
  };

  const medicamentos: MemedMedicationItem[] = [
    {
      medication: "Dipirona 500mg",
      dosageInstruction: "Tomar 1 comprimido a cada 6 horas"
    }
  ];

  try {
    // Método automático - faz tudo
    await bootstrapMemed(token, paciente, medicamentos);
    console.log("✅ Voice Prescription exibido com sucesso!");
  } catch (error) {
    console.error("❌ Erro:", error);
  }
}

// ============================================
// EXEMPLO 3: Controle Manual (Prescrição Tradicional)
// ============================================
async function exemplo3() {
  const token = "SEU_TOKEN_AQUI";
  
  try {
    // 1. Inicializa
    await initializeMemed(token, 'plataforma.prescricao');
    
    // 2. Define paciente
    await setPaciente({
      idExterno: "12345",
      nome: "José da Silva",
      cpf: "99999999999",
      telefone: "11999999999"
    });
    
    // 3. Exibe prescrição
    showPrescription();
    
    // 4. Depois, pode ocultar
    // hidePrescription();
    
  } catch (error) {
    console.error("❌ Erro:", error);
  }
}

// ============================================
// EXEMPLO 4: Controle Manual (Voice Prescription)
// ============================================
async function exemplo4() {
  const token = "SEU_TOKEN_AQUI";
  
  try {
    // 1. Inicializa
    await initializeMemed(token, 'platform.voice-prescription');
    
    // 2. Define paciente
    await setPaciente({
      idExterno: "12345",
      nome: "José da Silva",
      telefone: "11999999999"
    });
    
    // 3. Define medicamentos
    await setMedications([
      {
        medication: "Dipirona 500mg",
        dosageInstruction: "Tomar 1 comprimido a cada 6 horas"
      }
    ]);
    
    // 4. Abre interface
    await viewVoicePrescription();
    
  } catch (error) {
    console.error("❌ Erro:", error);
  }
}
```

---

## 📝 Exemplos Práticos

### React

```tsx
import React, { useEffect } from 'react';
import { bootstrapPrescription, MemedPaciente } from '@doctorassistant/daai-component';

function PrescricaoMemed() {
  useEffect(() => {
    const iniciar = async () => {
      const token = process.env.REACT_APP_MEMED_TOKEN!;
      
      const paciente: MemedPaciente = {
        idExterno: "12345",
        nome: "José da Silva",
        cpf: "99999999999",
        telefone: "11999999999"
      };

      try {
        await bootstrapPrescription(token, paciente);
      } catch (error) {
        console.error('Erro ao iniciar Memed:', error);
      }
    };

    iniciar();
  }, []);

  return <div id="memed-container">Carregando prescrição...</div>;
}

export default PrescricaoMemed;
```

---

### Vue.js

```vue
<template>
  <div>
    <button @click="abrirPrescricao">Abrir Prescrição</button>
  </div>
</template>

<script>
import { bootstrapPrescription } from '@doctorassistant/daai-component';

export default {
  methods: {
    async abrirPrescricao() {
      const token = process.env.VUE_APP_MEMED_TOKEN;
      
      const paciente = {
        idExterno: "12345",
        nome: "José da Silva",
        cpf: "99999999999",
        telefone: "11999999999"
      };

      try {
        await bootstrapPrescription(token, paciente);
      } catch (error) {
        console.error('Erro:', error);
      }
    }
  }
};
</script>
```

---

### Angular

```typescript
import { Component } from '@angular/core';
import { bootstrapPrescription, MemedPaciente } from '@doctorassistant/daai-component';

@Component({
  selector: 'app-prescricao',
  template: '<button (click)="abrirPrescricao()">Abrir Prescrição</button>'
})
export class PrescricaoComponent {
  async abrirPrescricao() {
    const token = environment.memedToken;
    
    const paciente: MemedPaciente = {
      idExterno: "12345",
      nome: "José da Silva",
      cpf: "99999999999",
      telefone: "11999999999"
    };

    try {
      await bootstrapPrescription(token, paciente);
    } catch (error) {
      console.error('Erro:', error);
    }
  }
}
```

---

## 🔍 Campos do Paciente

### Campos Obrigatórios

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `idExterno` | string | ID único do paciente no seu sistema |
| `nome` | string | Nome completo do paciente |
| `telefone` | string | Telefone de contato |
| `cpf` | string | CPF do paciente (ou usar `withoutCpf: true`) |

### Campos Opcionais

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `data_nascimento` | string | Data de nascimento (dd/mm/aaaa) |
| `nome_social` | string | Nome social do paciente |
| `endereco` | string | Endereço completo |
| `cidade` | string | Cidade do paciente |
| `peso` | number | Peso em kg |
| `altura` | number | Altura em metros |
| `nome_mae` | string | Nome da mãe |
| `email` | string | E-mail do paciente |
| `dificuldade_locomocao` | boolean | Se tem dificuldade de locomoção |
| `withoutCpf` | boolean | `true` se paciente não possui CPF |

---

## 🐛 Troubleshooting

### ❌ Erro: "SDK da Memed não está disponível"

**Causa:** Script não foi carregado ou token inválido.

**Solução:**
1. Verifique se o token é válido
2. Verifique se aguardou a inicialização do módulo
3. Use `isMemedAvailable()` para verificar status

```typescript
import { isMemedAvailable } from '@doctorassistant/daai-component';

if (isMemedAvailable()) {
  console.log("✅ Memed disponível!");
} else {
  console.log("❌ Memed não está carregado");
}
```

---

### ❌ Erro: "Módulo não inicializado"

**Causa:** Tentou usar comandos antes do módulo estar pronto.

**Solução:** Sempre aguarde o evento `core:moduleInit` ou use as funções bootstrap.

```typescript
// ❌ ERRADO
loadMemedScript(token);
setPaciente(paciente); // Erro!

// ✅ CORRETO
await initializeMemed(token);
await setPaciente(paciente);
```

---

### ❌ Interface não aparece

**Causas possíveis:**
1. Dados do paciente não foram definidos
2. Módulo errado sendo aguardado
3. Token expirado

**Solução:**
```typescript
// Verifique os logs
console.log('Script carregado:', isScriptLoaded);
console.log('Módulo inicializado:', isModuleInitialized);
console.log('SDK disponível:', isMemedAvailable());
```

---

### ❌ Ambiente de homologação offline

**Causa:** Ambiente fica offline em horários específicos.

**Horários offline:**
- **Segunda a sexta:** 00h às 06h
- **Fim de semana:** Todo o período

**Solução:** Teste em horários comerciais ou use ambiente de produção.

---

## 📚 Referências

- [Documentação Oficial API Memed](https://api.memed.com.br/docs)
- [Guia de Eventos da Memed](https://docs.memed.com.br/eventos)
- [Exemplos de Integração](https://github.com/memed/exemplos)

---

## 📞 Suporte

Precisa de ajuda? Entre em contato:
- 📧 Email: suporte@memed.com.br
- 📱 Telefone: (11) 1234-5678
- 💬 Chat: [chat.memed.com.br](https://chat.memed.com.br)

---

**Última atualização:** 17 de outubro de 2025
