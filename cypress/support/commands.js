// Comandos customizados do Cypress.
// Centraliza chamadas de API (preparo/limpeza de massa) e ações de UI,
// evitando duplicação de código entre os testes de API e E2E.

import { criarUsuario, criarProduto } from './factories';

const apiBaseUrl = () => Cypress.env('apiBaseUrl') || 'https://serverest.dev';

// ===== Usuários =====

// Cria um usuário via API e retorna o response (status 201 + _id).
Cypress.Commands.add('apiCreateUser', (usuario = criarUsuario()) => {
  // Envia um payload limpo (sem _id) para não poluir a requisição em re-POSTs
  const payload = {
    nome: usuario.nome,
    email: usuario.email,
    password: usuario.password,
    administrador: usuario.administrador,
  };
  return cy
    .request({
      method: 'POST',
      url: `${apiBaseUrl()}/usuarios`,
      body: payload,
      failOnStatusCode: false,
    })
    .then((response) => {
      return cy.wrap({ response, usuario, _id: response.body?._id });
    });
});

// Remove um usuário via API pelo id (limpeza).
Cypress.Commands.add('apiDeleteUser', (userId) => {
  if (!userId) return cy.wrap(null);
  return cy.request({
    method: 'DELETE',
    url: `${apiBaseUrl()}/usuarios/${userId}`,
    failOnStatusCode: false,
  });
});

// Consulta um usuário via API pelo id.
Cypress.Commands.add('apiGetUser', (userId) => {
  return cy.request({
    method: 'GET',
    url: `${apiBaseUrl()}/usuarios/${userId}`,
    failOnStatusCode: false,
  });
});

// ===== Autenticação =====

// Realiza login via API e retorna o response.
Cypress.Commands.add('apiLogin', (email, password) => {
  return cy.request({
    method: 'POST',
    url: `${apiBaseUrl()}/login`,
    body: { email, password },
    failOnStatusCode: false,
  });
});

// ===== Produtos =====

// Cria um produto via API usando o token de admin e retorna o response.
Cypress.Commands.add('apiCreateProduct', (token, produto = criarProduto()) => {
  const payload = {
    nome: produto.nome,
    preco: produto.preco,
    descricao: produto.descricao,
    quantidade: produto.quantidade,
  };
  return cy
    .request({
      method: 'POST',
      url: `${apiBaseUrl()}/produtos`,
      headers: { Authorization: token },
      body: payload,
      failOnStatusCode: false,
    })
    .then((response) => {
      return cy.wrap({ response, produto, _id: response.body?._id });
    });
});

// Remove um produto via API (limpeza).
Cypress.Commands.add('apiDeleteProduct', (token, productId) => {
  if (!productId) return cy.wrap(null);
  return cy.request({
    method: 'DELETE',
    url: `${apiBaseUrl()}/produtos/${productId}`,
    headers: { Authorization: token },
    failOnStatusCode: false,
  });
});

// ===== UI =====

// Faz login via UI (fluxo real do frontend).
Cypress.Commands.add('loginViaUi', (email, password) => {
  cy.visit('/login');
  cy.get('[data-testid="email"]').clear();
  cy.get('[data-testid="email"]').type(email);
  cy.get('[data-testid="senha"]').clear();
  cy.get('[data-testid="senha"]').type(password);
  cy.get('[data-testid="entrar"]').click();
});

// Faz login via API e injeta o token no localStorage, deixando a aplicação
// autenticada sem passar pelo formulário (mais rápido para testes de UI).
// Usa as mesmas chaves lidas pelo frontend do ServeRest.
Cypress.Commands.add('loginViaApi', (email, password) => {
  cy.apiLogin(email, password).then((response) => {
    expect(response.status, 'login via API').to.eq(200);
    const token = response.body.authorization;
    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.setItem('serverest/userToken', token);
      win.localStorage.setItem('serverest/userEmail', email);
    });
    cy.reload();
  });
});

// ===== Feedback da UI =====

// Valida que o frontend exibiu uma mensagem de feedback (div.alert do
// Bootstrap renderizada no DOM) contendo o texto esperado.
Cypress.Commands.add('validarMensagemDeFeedback', (texto) => {
  cy.contains('.alert', texto).should('be.visible');
});
