# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2024-01-01

### Adicionado
- Timer Pomodoro configurável (25 minutos padrão)
- Pausas curtas (5 minutos) e longas (15 minutos)
- Sistema de estatísticas com histórico de sessões
- Gráficos semanais e mensais usando Chart.js
- Sistema de metas diárias configuráveis
- Contador de streaks (dias consecutivos)
- Sistema de conquistas e XP
- Gerenciamento de tarefas
- Modo escuro/claro com persistência
- Notificações do navegador
- Notificações sonoras opcionais
- Service Worker para PWA (funciona offline)
- Persistência de dados com LocalStorage
- Atalhos de teclado
- Design responsivo para mobile e desktop
- Toast notifications
- Confetti ao completar sessões
- Mensagens motivacionais

### Técnico
- Migração completa para TypeScript
- Arquitetura modular com serviços separados
- Sistema de logging condicional
- Tratamento de erros robusto
- Validação de dados
- Verificação de suporte a APIs
- Fallback para CDNs alternativos
- Tratamento de LocalStorage desabilitado
- Versionamento de cache no Service Worker

### Documentação
- README.md completo
- CONTRIBUTING.md
- CHANGELOG.md
- Documentação de issues
- Guias de desenvolvimento

### Corrigido
- Console.log removidos do código de produção
- Tratamento adequado de erros no Service Worker
- Verificação de suporte a APIs antes de usar
- Melhor tratamento de notificações não disponíveis
- Logging condicional em todos os serviços

### Melhorado
- Performance do timer (remoção de setInterval desnecessário)
- Acessibilidade (atributos ARIA, navegação por teclado)
- Tratamento de erros em todas as operações
- Mensagens de erro amigáveis ao usuário
- Organização do código e estrutura de pastas

---

## Tipos de Mudanças

- `Adicionado` para novas funcionalidades
- `Modificado` para mudanças em funcionalidades existentes
- `Descontinuado` para funcionalidades que serão removidas
- `Removido` para funcionalidades removidas
- `Corrigido` para correção de bugs
- `Segurança` para vulnerabilidades
