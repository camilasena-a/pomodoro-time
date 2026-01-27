# Adicionar Testes End-to-End (E2E)

**Labels:** `enhancement`, `testing`, `e2e`  
**Prioridade:** 🟡 Média  
**Estimativa:** 2-3 dias

## 📋 Descrição

Adicionar testes end-to-end para validar fluxos completos do aplicativo do ponto de vista do usuário. Complementa os testes unitários (Issue #001) testando integrações e comportamento real.

## ✅ Tarefas

- [ ] Escolher framework de E2E (Playwright recomendado)
- [ ] Configurar ambiente de testes E2E
- [ ] Criar testes para fluxo principal do timer
- [ ] Criar testes para persistência de dados
- [ ] Criar testes para notificações
- [ ] Criar testes para modais e navegação
- [ ] Criar testes para responsividade mobile
- [ ] Adicionar testes para PWA (service worker, offline)
- [ ] Configurar CI/CD para rodar testes E2E
- [ ] Documentar como rodar testes localmente

## 🔧 Framework Sugerido: Playwright

### Por que Playwright?
- ✅ Suporte multi-navegador (Chromium, Firefox, WebKit)
- ✅ Auto-wait inteligente
- ✅ Screenshots e vídeos automáticos
- ✅ Mobile emulation
- ✅ TypeScript nativo
- ✅ Excelente para PWA testing

## 📝 Testes Principais

### 1. Fluxo do Timer

```typescript
import { test, expect } from '@playwright/test';

test('deve iniciar e pausar timer', async ({ page }) => {
  await page.goto('/');
  
  // Iniciar timer
  await page.click('#start-btn');
  await expect(page.locator('#timer')).not.toHaveText('25:00');
  
  // Aguardar alguns segundos
  await page.waitForTimeout(2000);
  
  // Pausar
  await page.click('#pause-btn');
  const timeText = await page.locator('#timer').textContent();
  
  // Verificar que tempo mudou
  expect(timeText).not.toBe('25:00');
});

test('deve resetar timer', async ({ page }) => {
  await page.goto('/');
  
  await page.click('#start-btn');
  await page.waitForTimeout(1000);
  await page.click('#reset-btn');
  
  await expect(page.locator('#timer')).toHaveText('25:00');
});
```

### 2. Persistência de Dados

```typescript
test('deve salvar e restaurar estado', async ({ page, context }) => {
  await page.goto('/');
  
  // Completar um pomodoro
  await page.click('#start-btn');
  // ... acelerar timer para teste ...
  
  // Recarregar página
  await page.reload();
  
  // Verificar que estatísticas foram mantidas
  const pomodoros = await page.locator('#completed-pomodoros').textContent();
  expect(parseInt(pomodoros || '0')).toBeGreaterThan(0);
});
```

### 3. Notificações

```typescript
test('deve solicitar permissão de notificação', async ({ page, context }) => {
  await context.grantPermissions(['notifications']);
  
  await page.goto('/');
  
  // Verificar que notificação foi solicitada
  // (implementação depende de como notificações são tratadas)
});
```

### 4. Modais

```typescript
test('deve abrir e fechar modais', async ({ page }) => {
  await page.goto('/');
  
  // Abrir configurações
  await page.click('#settings-toggle');
  await expect(page.locator('#settings-modal')).toBeVisible();
  
  // Fechar com ESC
  await page.keyboard.press('Escape');
  await expect(page.locator('#settings-modal')).not.toBeVisible();
});
```

### 5. Responsividade

```typescript
test('deve funcionar em mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  
  // Verificar que elementos estão visíveis
  await expect(page.locator('#timer')).toBeVisible();
  await expect(page.locator('#start-btn')).toBeVisible();
});
```

### 6. PWA

```typescript
test('deve registrar service worker', async ({ page }) => {
  await page.goto('/');
  
  // Verificar que service worker foi registrado
  const swRegistration = await page.evaluate(() => {
    return navigator.serviceWorker.getRegistration();
  });
  
  expect(swRegistration).toBeTruthy();
});

test('deve funcionar offline', async ({ page, context }) => {
  await page.goto('/');
  
  // Simular offline
  await context.setOffline(true);
  
  // Verificar que app ainda funciona
  await expect(page.locator('#timer')).toBeVisible();
});
```

## 📁 Estrutura de Arquivos

```
tests/
  e2e/
    timer.spec.ts
    persistence.spec.ts
    notifications.spec.ts
    modals.spec.ts
    mobile.spec.ts
    pwa.spec.ts
  fixtures/
    test-data.ts
  utils/
    helpers.ts
playwright.config.ts
```

## 🔧 Configuração

### `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run serve',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## 📁 Arquivos Afetados

- Criar `tests/e2e/` (estrutura de testes)
- Criar `playwright.config.ts`
- Atualizar `package.json` (scripts e dependências)
- Criar `.github/workflows/e2e.yml` (CI/CD)

## 📚 Referências

- [Playwright Documentation](https://playwright.dev/)
- [E2E Testing Best Practices](https://playwright.dev/docs/best-practices)
- [PWA Testing Guide](https://web.dev/pwa-checklist/)

## 💡 Notas

- Rodar testes em CI/CD antes de merge
- Adicionar screenshots em caso de falha
- Considerar visual regression testing
- Testar em navegadores reais, não apenas headless
- Adicionar testes de performance (Lighthouse CI)
