# Automação de Testes — ServeRest

Projeto de automação de testes para a aplicação [ServeRest](https://github.com/ServeRest/ServeRest), contemplando cenários E2E para o frontend e testes de API. Desenvolvido com Cypress e JavaScript, seguindo boas práticas como Page Object Model, geração de massa dinâmica e pipeline de CI.

- Frontend: https://front.serverest.dev/
- Swagger API: https://serverest.dev/

## Stack

- [Cypress](https://www.cypress.io/) — automação E2E e de API
- [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript) — linguagem
- [@faker-js/faker](https://fakerjs.dev/) — geração de massa dinâmica
- [Mochawesome](https://github.com/adamgruber/mochawesome) — relatórios HTML de execução
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) — padronização de código
- [GitHub Actions](https://github.com/features/actions) — integração contínua

## Padrões e práticas adotadas

- **Page Object Model**: mapeamento de elementos e ações isolados em classes, separando o "como interagir" do "o que testar".
- **Massa de dados dinâmica**: emails, nomes e produtos são gerados via Faker a cada execução, evitando conflitos de duplicidade.
- **Preparo de massa via API**: usuários e produtos são criados por `cy.request` nos hooks `before/beforeEach`, mais rápido e estável que criar pela UI.
- **Limpeza automática**: hooks `after/afterEach` removem tudo o que foi criado, mantendo o estado limpo entre execuções.
- **Testes independentes**: cada cenário cria e destrói a própria massa, sem dependência de ordem.

## Estrutura do projeto

```
serverest-cypress-tests/
├── .github/workflows/
│   └── cypress.yml                         # Pipeline de CI
├── cypress/
│   ├── e2e/
│   │   ├── api/
│   │   │   ├── usuarios.cy.js              # Cadastro de usuário (massa dinâmica)
│   │   │   ├── login.cy.js                 # Autenticação (token JWT)
│   │   │   └── produtos.cy.js              # Produtos com permissão de admin
│   │   └── web/
│   │       ├── login.cy.js                 # Login válido e inválido
│   │       ├── cadastroUsuarios.cy.js      # Cadastro de novo usuário
│   │       └── listaProdutos.cy.js         # Listagem, busca e detalhe de produto
│   ├── fixtures/                           # Templates de payload (referência)
│   └── support/
│       ├── page_objects/                   # LoginPage, HomePage, etc.
│       ├── commands.js                     # Comandos customizados (API e UI)
│       ├── factories.js                    # Fábricas de massa (Faker)
│       └── e2e.js                          # Entry point do suporte
├── cypress.config.js                       # Configuração do Cypress
├── package.json
├── .eslintrc.json
├── .prettierrc
└── README.md
```

## Cenários de teste

### API (3 cenários)

1. **Cadastro de usuário com massa dinâmica** (`api/usuarios.cy.js`)
   - Cria usuário, consulta por ID e valida persistência dos dados.
   - Valida bloqueio de email duplicado (HTTP 400).

2. **Autenticação** (`api/login.cy.js`)
   - Login válido retorna HTTP 200 e token Bearer JWT.
   - Login inválido retorna HTTP 401 com mensagem de erro.

3. **Gestão de produtos com admin** (`api/produtos.cy.js`)
   - POST sem token retorna HTTP 401 (rota protegida).
   - POST com token de admin retorna HTTP 201 e persiste o produto.

### E2E / Frontend (3 cenários)

1. **Login no frontend** (`web/login.cy.js`)
   - Login válido redireciona para a home e exibe "Bem Vindo".
   - Login inválido exibe mensagem de erro na tela.

2. **Cadastro de usuário** (`web/cadastroUsuarios.cy.js`)
   - Preenche formulário e valida mensagem de sucesso.
   - Confirma persistência via consulta à API.

3. **Listagem, busca e detalhe de produtos** (`web/listaProdutos.cy.js`)
   - Valida lista de produtos visível na home.
   - Busca produto por nome e acessa a tela de detalhe.

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm (já vem com o Node.js)

## Instalação

```bash
git clone https://github.com/israejoshua/serverest-cypress-tests.git
cd serverest-cypress-tests
npm install
```

## Execução

```bash
# Interface gráfica do Cypress
npm run open

# Todos os testes (headless)
npm test

# Apenas testes de API
npm run test:api

# Apenas testes E2E
npm run test:web
```

## Qualidade de código

```bash
# Verificar com ESLint
npm run lint

# Formatar com Prettier
npm run format
```

## Relatórios

Após a execução, os seguintes artefatos são gerados:

- `cypress/screenshots/` — capturas de tela (em caso de falha)
- `cypress/videos/` — gravação de cada spec
- `cypress/reports/` — relatório Mochawesome (JSON)

Para consolidar os relatórios por spec em um HTML único:

```bash
npm run report:merge
```

O resultado fica em `cypress/reports/html/index.html`.

## Integração contínua

O pipeline em `.github/workflows/cypress.yml` é executado a cada push ou pull request na `main`. Ele possui três jobs:

- **cypress-api**: roda os cenários de API
- **cypress-web**: roda os cenários E2E
- **lint**: valida ESLint e Prettier

Screenshots, vídeos e relatórios ficam disponíveis como artifacts na aba Actions do repositório.

## Observações

- A aplicação ServeRest é pública e não requer cadastro prévio — toda a massa é criada e removida durante a execução.
- Os seletores do frontend utilizam o atributo `data-testid`, conforme a recomendação da documentação do Cypress.
- Os testes são determinísticos e podem ser executados em qualquer ordem.

## Licença

MIT
