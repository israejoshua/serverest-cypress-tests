/// <reference types="cypress" />

import { factories } from '../../support/factories';

describe('API /login — Autenticação', () => {
  let usuario;
  let userId;

  before(() => {
    // Arrange — provisiona um usuário válido via API para usar no login
    usuario = factories.criarUsuario();
    cy.apiCreateUser(usuario).then(({ response, _id }) => {
      expect(response.status, 'setup usuário').to.eq(201);
      userId = _id;
    });
  });

  after(() => {
    // Limpeza — remove o usuário criado para os testes
    cy.apiDeleteUser(userId);
  });

  it('realiza login com credenciais válidas e retorna token Bearer JWT', () => {
    cy.apiLogin(usuario.email, usuario.password).then((response) => {
      // Assert — login bem-sucedido com token no formato JWT
      expect(response.status, 'status HTTP').to.eq(200);
      expect(response.body.message, 'mensagem').to.eq('Login realizado com sucesso');
      expect(response.body.authorization, 'token Bearer').to.match(/^Bearer .+\..+\..+$/);
    });
  });

  it('rejeita login com senha inválida (status 401)', () => {
    cy.apiLogin(usuario.email, 'senhaIncorreta999').then((response) => {
      // Assert — credenciais inválidas (msg exata retornada pela API)
      expect(response.status, 'status HTTP').to.eq(401);
      expect(response.body.message, 'mensagem de erro').to.eq('Email e/ou senha inválidos');
    });
  });
});
