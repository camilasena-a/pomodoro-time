# Contribuindo para o Pomodoro Timer

Obrigado por considerar contribuir para o Pomodoro Timer! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Como Contribuir

### Reportando Bugs

Se você encontrou um bug:

1. Verifique se o bug já não foi reportado nas [Issues](https://github.com/USER/pomodoro-time/issues)
2. Crie uma nova issue descrevendo:
   - Passos para reproduzir o bug
   - Comportamento esperado vs comportamento atual
   - Navegador e versão
   - Sistema operacional
   - Screenshots se aplicável

### Sugerindo Funcionalidades

Para sugerir uma nova funcionalidade:

1. Verifique se já não existe uma issue similar
2. Crie uma nova issue com o label `enhancement`
3. Descreva claramente:
   - O que você gostaria de ver
   - Por que seria útil
   - Como você imagina que funcionaria

### Contribuindo com Código

#### Configuração do Ambiente

1. **Fork o repositório**
   ```bash
   git clone https://github.com/SEU-USUARIO/pomodoro-time.git
   cd pomodoro-time
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Compile o TypeScript**
   ```bash
   npm run build
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm start
   ```

#### Processo de Desenvolvimento

1. **Crie uma branch para sua feature**
   ```bash
   git checkout -b feature/nome-da-feature
   # ou
   git checkout -b fix/nome-do-bug
   ```

2. **Faça suas alterações**
   - Siga os padrões de código existentes
   - Use TypeScript para novos arquivos
   - Adicione comentários quando necessário
   - Mantenha o código limpo e organizado

3. **Teste suas alterações**
   - Teste em diferentes navegadores se possível
   - Verifique se não quebrou funcionalidades existentes
   - Teste em dispositivos móveis se aplicável

4. **Compile o TypeScript**
   ```bash
   npm run build
   ```

5. **Commit suas alterações**
   ```bash
   git add .
   git commit -m "feat: adiciona nova funcionalidade X"
   # ou
   git commit -m "fix: corrige bug Y"
   ```

#### Convenções de Commit

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Mudanças na documentação
- `style:` Formatação, ponto e vírgula faltando, etc (não afeta código)
- `refactor:` Refatoração de código
- `test:` Adicionando ou corrigindo testes
- `chore:` Mudanças em build, ferramentas, etc

#### Criando um Pull Request

1. **Atualize sua branch**
   ```bash
   git pull origin main
   ```

2. **Envie suas alterações**
   ```bash
   git push origin feature/nome-da-feature
   ```

3. **Crie o Pull Request**
   - Vá para o repositório no GitHub
   - Clique em "New Pull Request"
   - Descreva suas alterações claramente
   - Referencie issues relacionadas se aplicável

## 📝 Guidelines de Código

### TypeScript

- Use TypeScript para todos os novos arquivos
- Mantenha tipagem forte
- Evite usar `any` quando possível
- Use interfaces para tipos complexos

### Estrutura de Arquivos

```
src/
├── components/     # Componentes reutilizáveis
├── services/      # Lógica de negócio e serviços
├── utils/         # Funções utilitárias
└── types/         # Definições de tipos TypeScript
```

### Estilo de Código

- Use nomes descritivos para variáveis e funções
- Mantenha funções pequenas e focadas
- Comente código complexo
- Use `Logger` para logs (não `console.log` diretamente)

### Acessibilidade

- Use atributos ARIA quando necessário
- Mantenha contraste adequado
- Teste com leitores de tela se possível
- Suporte navegação por teclado

## 🧪 Testes

Atualmente não temos testes automatizados, mas estamos trabalhando nisso. Se você adicionar testes:

- Use um framework de testes (Vitest ou Jest)
- Teste funcionalidades críticas
- Mantenha cobertura de código alta

## 📚 Documentação

- Atualize o README.md se necessário
- Adicione comentários JSDoc para funções públicas
- Documente APIs novas ou mudanças significativas

## 🐛 Issues para Iniciantes

Procurando por onde começar? Procure por issues com a label `good first issue`. Essas são ótimas para novos contribuidores!

## ❓ Dúvidas?

Se você tiver dúvidas sobre como contribuir:

- Abra uma issue com a label `question`
- Verifique a documentação existente
- Revise issues e PRs anteriores

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto (MIT).

---

Obrigado por contribuir! 🎉
