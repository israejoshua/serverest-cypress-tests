/// <reference types="cypress" />

import { factories } from '../../support/factories';
import LoginPage from '../../support/page_objects/LoginPage';
import HomePage from '../../support/page_objects/HomePage';

describe('E2E — Login no Frontend ServeRest', () => {
  let usuario;
  let userId;

  before(() => {
    // Arrange — provisiona usuário via API (mais rápido e estável que via UI)
    usuario = factories.criarUsuario();
    cy.apiCreateUser(usuario).then(({ response, _id }) => {
      expect(response.status, 'setup usuário').to.eq(201);
      userId = _id;
    });
  });

  after(() => {
    cy.apiDeleteUser(userId);
  });

  it('autentica com credenciais válidas e exibe a home logada', () => {
    // Act — fluxo de login pela UI
    LoginPage.logar(usuario.email, usuario.password);

    // Assert — redireciona para a home autenticada
    cy.url().should('not.include', '/login');
    HomePage.estarLogado(usuario.nome);
  });

  it('exibe mensagem de erro ao tentar autenticar com credenciais inválidas', () => {
    // Act — login com senha incorreta
    LoginPage.logar(usuario.email, 'senhaErrada123');

    // Assert — o frontend exibe um alerta (div.alert) com a mensagem de erro
    cy.contains('.alert', 'Email e/ou senha inválidos').should('be.visible');
  });
});
