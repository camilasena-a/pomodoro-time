# 🍅 Pomodoro Timer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-enabled-green.svg)](https://web.dev/progressive-web-apps/)

Uma plataforma moderna e intuitiva para aplicar a técnica Pomodoro e aumentar sua produtividade.

## 📋 Sobre

O Pomodoro Timer é uma aplicação web PWA (Progressive Web App) que ajuda você a gerenciar seu tempo usando a técnica Pomodoro, desenvolvida por Francesco Cirillo. A técnica consiste em trabalhar em blocos de 25 minutos (pomodoros) seguidos de pausas curtas, aumentando o foco e a produtividade.

## ✨ Funcionalidades

### ⏱️ Timer e Sessões
- Timer Pomodoro configurável (padrão: 25 minutos)
- Pausas curtas (5min) e longas (15min)
- Presets rápidos para diferentes durações
- Persistência de sessão ativa (sobrevive a recarregamentos)

### 📊 Estatísticas e Produtividade
- Histórico completo de sessões
- Gráficos semanais e mensais (Chart.js)
- Sistema de metas diárias configuráveis
- Contador de streaks (dias consecutivos)
- Sistema de conquistas e XP
- Estatísticas detalhadas de produtividade

### 📝 Gerenciamento
- Gerenciamento de tarefas
- Histórico filtrado por data e tipo
- Exportação e importação de dados (planejado)

### 🎨 Interface
- Modo escuro/claro com persistência
- Design minimalista e focado
- Totalmente responsivo (mobile e desktop)
- Animações suaves e feedback visual
- Toast notifications
- Confetti ao completar sessões

### 🔔 Notificações
- Notificações do navegador
- Notificações sonoras opcionais
- Mensagens motivacionais

### 💾 PWA
- Funciona offline (Service Worker)
- Instalável como app
- Cache inteligente de recursos
- Atualizações automáticas

### ⌨️ Acessibilidade
- Atalhos de teclado
- Navegação por teclado completa
- Atributos ARIA
- Suporte a leitores de tela

## 🚀 Como Usar

### Para Usuários

#### Uso Básico
1. Abra o arquivo `index.html` no seu navegador (ou use `npm start`)
2. Clique em "Iniciar" ou pressione `Espaço` para começar um pomodoro
3. Trabalhe focado durante os 25 minutos
4. Quando o timer terminar, faça uma pausa
5. Após 4 pomodoros completos, o sistema sugere uma pausa longa

#### Instalação como PWA
1. Abra o app no navegador
2. Clique no ícone de instalação na barra de endereço (ou menu)
3. O app será instalado e funcionará offline

#### Atalhos de Teclado
- `Espaço` - Iniciar/Pausar timer
- `R` - Resetar timer
- `T` - Alternar tema (claro/escuro)
- `S` - Abrir configurações
- `Esc` - Fechar modais

### Para Desenvolvedores

#### Pré-requisitos
- Node.js 16+ e npm
- TypeScript 5.3+

#### Instalação
```bash
npm install
```

#### Scripts Disponíveis

```bash
# Compilar TypeScript
npm run build

# Verificar tipos sem compilar
npm run type-check

# Modo watch (desenvolvimento)
npm run watch
# ou
npm run dev

# Iniciar servidor local (compila e serve)
npm start
# ou apenas servir arquivos
npm run serve

# Preview da build
npm run preview

# Limpar arquivos compilados (multiplataforma)
npm run clean

# Gerar ícones do PWA
npm run generate-icons
```

#### Estrutura do Projeto
```
pomodoro-time/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── services/       # Lógica de negócio
│   ├── utils/          # Funções utilitárias
│   └── types/          # Definições TypeScript
├── index.html          # Página principal
├── styles.css          # Estilos
├── script.ts           # Entry point (compila para script.js)
├── sw.js               # Service Worker
└── manifest.json        # Manifest do PWA
```

## ⚙️ Configurações

Você pode personalizar:
- **Duração do Trabalho**: Padrão 25 minutos (1-60 min)
- **Pausa Curta**: Padrão 5 minutos (1-30 min)
- **Pausa Longa**: Padrão 15 minutos (1-60 min)
- **Notificação Sonora**: Ativar/desativar
- **Meta Diária**: Número de pomodoros por dia
- **Tema**: Claro ou escuro (com persistência)

## 🎯 Técnica Pomodoro

A técnica Pomodoro consiste em:
1. Escolher uma tarefa
2. Trabalhar por 25 minutos (1 pomodoro)
3. Fazer uma pausa de 5 minutos
4. Repetir o processo
5. Após 4 pomodoros, fazer uma pausa longa de 15-30 minutos

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos com animações e gradientes
- **TypeScript 5.3** - Tipagem forte e desenvolvimento moderno
- **JavaScript ES2020** - Compilado do TypeScript
- **Chart.js 4.4** - Gráficos e visualizações
- **LocalStorage API** - Persistência de dados local
- **Web Notifications API** - Notificações do navegador
- **Web Audio API** - Notificações sonoras
- **Service Worker** - Funcionalidade offline e PWA
- **IndexedDB** - Armazenamento avançado (futuro)

## 📁 Estrutura do Projeto

```
pomodoro-time/
├── src/                    # Código fonte TypeScript
│   ├── components/         # Componentes reutilizáveis
│   ├── services/           # Lógica de negócio e serviços
│   ├── utils/              # Funções utilitárias
│   └── types/              # Definições TypeScript
├── scripts/                # Scripts de build e utilitários
├── docs/                   # Documentação adicional
├── issues/                 # Templates de issues
├── index.html              # Página principal
├── styles.css              # Estilos globais
├── script.ts               # Entry point (compila para script.js)
├── script.js               # Arquivo compilado (commitado para GitHub Pages)
├── sw.js                   # Service Worker
├── manifest.json           # Manifest do PWA
├── tsconfig.json           # Configuração TypeScript
├── package.json            # Dependências e scripts
├── .editorconfig          # Configuração do editor
├── .prettierrc.json       # Configuração Prettier
└── README.md              # Este arquivo
```

## 🌐 Requisitos do Navegador

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

**APIs Necessárias:**
- LocalStorage (ou fallback em memória)
- Service Worker (opcional, para PWA)
- Notifications API (opcional)
- Web Audio API (opcional)

## 📝 Notas Importantes

- As notificações do navegador precisam ser permitidas pelo usuário
- Os dados são salvos apenas no navegador local (não há servidor)
- O app funciona offline após a primeira visita (PWA)
- Para usar em produção, hospede os arquivos em qualquer servidor web estático
- O Service Worker atualiza automaticamente quando há novas versões

## 🛠️ Ferramentas de Desenvolvimento

O projeto inclui configurações para melhorar a experiência de desenvolvimento:

- **EditorConfig** (`.editorconfig`) - Padronização de estilo de código
- **Prettier** (`.prettierrc.json`) - Formatação automática de código
- **TypeScript** - Tipagem estática e verificação de tipos
- **VS Code** - Configurações recomendadas em `.vscode/`

### Configuração Recomendada do VS Code

Instale as extensões recomendadas:
- ESLint
- Prettier
- TypeScript and JavaScript Language Features

As configurações são carregadas automaticamente ao abrir o projeto.

## 🐛 Troubleshooting

### Notificações não funcionam
- Verifique se permitiu notificações nas configurações do navegador
- Alguns navegadores bloqueiam notificações em HTTP (use HTTPS)

### Dados não são salvos
- Verifique se LocalStorage está habilitado
- Em modo privado, os dados podem não persistir
- O app usa fallback em memória se LocalStorage não estiver disponível

### Service Worker não atualiza
- Limpe o cache do navegador
- Desregistre o Service Worker nas DevTools
- Recarregue a página com Ctrl+Shift+R (ou Cmd+Shift+R no Mac)

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja [CONTRIBUTING.md](CONTRIBUTING.md) para mais detalhes.

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

## 🔗 Links Úteis

- [Issues](https://github.com/USER/pomodoro-time/issues)
- [Changelog](CHANGELOG.md)
- [Documentação de Issues](issues/README.md)

---

Desenvolvido com ❤️ para aumentar sua produtividade! 🍅
