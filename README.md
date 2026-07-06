# 🧪 Automação de Testes — ServeRest (Cypress + JavaScript)

Projeto de automação de testes para a aplicação **[ServeRest](https://github.com/ServeRest/ServeRest)**, contemplando **3 cenários E2E (frontend)** e **3 cenários de API**, desenvolvido com **Cypress** e **JavaScript**, seguindo boas práticas de QA.

- 🖥️ **Frontend:** https://front.serverest.dev/
- 🔌 **Swagger API:** https://serverest.dev/

---

## 📚 Stack Utilizada

| Ferramenta | Finalidade |
|------------|-----------|
| [Cypress](https://www.cypress.io/) | Framework de automação E2E e de API |
| [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript) | Linguagem de programação |
| [@faker-js/faker](https://fakerjs.dev/) | Geração de massa de dados dinâmica |
| [Mochawesome](https://github.com/adamgruber/mochawesome) | Relatórios HTML de evidências |
| [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) | Padronização e qualidade de código |
| [GitHub Actions](https://github.com/features/actions) | Pipeline de Integração Contínua |

### Padrões e Práticas Adotadas
- ✅ **Page Object Model (POM)** — separação entre mapeamento de elementos e testes
- ✅ **Comandos customizados** — centralização de chamadas de API e ações de UI (sem duplicação)
- ✅ **Factories + Faker** — massa de dados dinâmica e única por execução
- ✅ **Preparo de massa via API** — `cy.request` no `before/beforeEach` (mais rápido e estável)
- ✅ **Limpeza dos dados criados** — hooks `after/afterEach` removem toda a massa gerada
- ✅ **Testes independentes** — cada cenário cria e destrói sua própria massa
- ✅ **Assertivas objetivas** — validação de status HTTP, mensagens e persistência de dados

---

## 📁 Estrutura do Projeto

```
serverest-cypress-tests/
├── .github/workflows/
│   └── cypress.yml                         # Pipeline CI (GitHub Actions)
├── cypress/
│   ├── e2e/
│   │   ├── api/
│   │   │   ├── usuarios.cy.js              # API 1: Cadastro de usuário (massa dinâmica)
│   │   │   ├── login.cy.js                 # API 2: Autenticação (token JWT)
│   │   │   └── produtos.cy.js              # API 3: Produtos com permissão de admin
│   │   └── web/
│   │       ├── login.cy.js                 # E2E 1: Login válido e inválido
│   │       ├── cadastroUsuarios.cy.js      # E2E 2: Cadastro de novo usuário
│   │       └── listaProdutos.cy.js         # E2E 3: Listagem, busca e detalhe de produto
│   ├── fixtures/                           # Templates de payload (referência)
│   │   ├── usuario.json
│   │   ├── produto.json
│   │   └── login.json
│   └── support/
│       ├── page_objects/                   # Page Object Model
│       │   ├── LoginPage.js
│       │   ├── HomePage.js
│       │   ├── CadastroUsuarioPage.js
│       │   ├── ProdutosPage.js
│       │   └── ListaComprasPage.js
│       ├── commands.js                     # Comandos customizados (API + UI)
│       ├── factories.js                    # Factories de massa (faker)
│       └── e2e.js                          # Entry point do suporte
├── cypress.config.js                       # Configuração do Cypress
├── package.json
├── .eslintrc.json
├── .prettierrc
└── README.md
```

---

## 🎯 Cenários de Teste

### API (3 cenários)

| # | Arquivo | Cenário | Assertivas |
|---|---------|---------|-----------|
| 1 | `api/usuarios.cy.js` | Cadastro de usuário com massa dinâmica | 201 + `_id`; consulta GET confirma persistência; email duplicado → 400 |
| 2 | `api/login.cy.js` | Autenticação (login) | Válido → 200 + token Bearer JWT; inválido → 401 + msg "Email e/ou senha inválido" |
| 3 | `api/produtos.cy.js` | Produto com permissão de admin | Sem token → 401; com token → 201; consulta confirma dados; limpeza ao final |

### E2E / Frontend (3 cenários)

| # | Arquivo | Cenário | Assertivas |
|---|---------|---------|-----------|
| 1 | `web/login.cy.js` | Login no frontend | Válido: home logada + "Bem Vindo"; inválido: alert "Email e/ou senha inválido" |
| 2 | `web/cadastroUsuarios.cy.js` | Cadastro de usuário | Alert "Cadastro realizado com sucesso"; confirmação via API (persistência) |
| 3 | `web/listaProdutos.cy.js` | Listagem, busca e detalhe | Lista visível e não vazia; produto buscado aparece; detalhe com nome correto |

---

## 🚀 Instalação e Execução

### Pré-requisitos
- [Node.js](https://nodejs.org/) **versão 18 ou superior**
- npm (já vem com o Node.js)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/<seu-usuario>/serverest-cypress-tests.git
cd serverest-cypress-tests

# 2. Instale as dependências
npm install
```

### Comandos de execução

```bash
# Abrir o Cypress em modo interativo (interface gráfica)
npm run open

# Executar TODOS os testes (API + E2E) em modo headless
npm test

# Executar SOMENTE os testes de API
npm run test:api

# Executar SOMENTE os testes E2E (frontend)
npm run test:web
```

### Qualidade de código

```bash
# Verificar e corrigir com ESLint
npm run lint

# Formatar com Prettier
npm run format
```

### Relatórios de evidências

Após a execução, os artefatos ficam disponíveis em:

- 📸 **Screenshots:** `cypress/screenshots/` (capturados em falhas)
- 🎥 **Vídeos:** `cypress/videos/` (gravação completa de cada spec)
- 📊 **Relatório Mochawesome (JSON):** `cypress/reports/`

---

## ⚙️ Configuração

A configuração principal está em [`cypress.config.js`](./cypress.config.js):

```js
baseUrl: 'https://front.serverest.dev',          // URL do frontend
apiBaseUrl: 'https://serverest.dev',              // URL da API (Cypress.env)
```

Os testes referenciam a API via `Cypress.env('apiBaseUrl')`, permitindo trocar facilmente de ambiente.

---

## 🧹 Estratégia de Massa e Limpeza

- **Massa dinâmica:** `factories.js` gera emails únicos (`qa_<timestamp>_<rand>@qa.com`), nomes e produtos a cada execução via `@faker-js/faker`, evitando dados instáveis e conflitos de duplicidade.
- **Preparo via API:** usuários e produtos são criados via `cy.request` no `before/beforeEach` — mais rápido e estável que criar via interface.
- **Limpeza automática:** os hooks `after/afterEach` chamam comandos como `cy.apiDeleteUser` e `cy.apiDeleteProduct`, removendo toda a massa criada durante os testes.
- **Independência:** cada teste é autossuficiente — cria e destrói sua própria massa, podendo ser executado isoladamente.

---

## 🔁 Integração Contínua (CI)

O pipeline em [`.github/workflows/cypress.yml`](./github/workflows/cypress.yml) executa automaticamente em **push** e **pull request**:

- **Job `cypress-api`** → roda os 3 cenários de API
- **Job `cypress-web`** → roda os 3 cenários E2E
- **Job `lint`** → verifica ESLint e Prettier
- **Upload de artefatos** → relatórios, screenshots e vídeos disponíveis para download

---

## 📌 Observações

- A aplicação ServeRest é pública e não requer cadastro prévio — toda a massa é criada e removida durante a execução.
- Os seletores do frontend utilizam o atributo `data-testid`, seguindo a [recomendação oficial do Cypress](https://docs.cypress.io/app/core-concepts/best-practices#Selecting-Elements) para testes estáveis.
- Os testes são determinísticos e reexecutáveis: não há dependência entre cenários nem ordem de execução obrigatória.
