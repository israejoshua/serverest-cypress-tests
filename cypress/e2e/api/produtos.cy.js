/// <reference types="cypress" />

import { factories } from '../../support/factories';

describe('API /produtos — Gestão com permissão de administrador', () => {
  const api = () => Cypress.env('apiBaseUrl');
  let adminToken;
  let adminId;
  let produtoId;

  before(() => {
    // Arrange — provisiona um usuário admin e obtém o token via API
    const admin = factories.criarUsuario({ administrador: 'true' });
    cy.apiCreateUser(admin).then(({ response, _id }) => {
      expect(response.status, 'setup admin').to.eq(201);
      adminId = _id;
      cy.apiLogin(admin.email, admin.password).then((loginResp) => {
        expect(loginResp.status, 'login admin').to.eq(200);
        adminToken = loginResp.body.authorization;
      });
    });
  });

  beforeEach(() => {
    // Produto recriado (em memória) a cada teste
  });

  after(() => {
    // Limpeza — remove produto e admin criados
    if (produtoId && adminToken) {
      cy.apiDeleteProduct(adminToken, produtoId);
    }
    cy.apiDeleteUser(adminId);
  });

  it('bloqueia cadastro de produto sem token de autenticação (status 401)', () => {
    const produto = factories.criarProduto();
    // Act — tenta criar produto SEM token
    cy.request({
      method: 'POST',
      url: `${api()}/produtos`,
      body: produto,
      failOnStatusCode: false,
    }).then((response) => {
      // Assert — rota protegida exige token
      expect(response.status, 'status HTTP sem token').to.eq(401);
      expect(response.body.message, 'mensagem de token ausente').to.match(/token|acesso/i);
    });
  });

  it('cadastra um produto com token de admin, consulta e valida a persistência', () => {
    const produto = factories.criarProduto();

    // Arrange/Act — cria o produto autenticado
    cy.apiCreateProduct(adminToken, produto)
      .then(({ response, _id }) => {
        // Assert — cadastro autorizado
        expect(response.status, 'status HTTP com token').to.eq(201);
        expect(response.body.message, 'mensagem').to.eq('Cadastro realizado com sucesso');
        expect(response.body._id, '_id retornado').to.be.a('string').and.not.be.empty;
        produtoId = _id;

        // Act — consulta o produto criado
        return cy.request('GET', `${api()}/produtos/${_id}`);
      })
      .then((getResp) => {
        // Assert — dados persistidos conferem com o payload
        expect(getResp.status, 'status HTTP da consulta').to.eq(200);
        expect(getResp.body.nome).to.eq(produto.nome);
        expect(getResp.body.preco).to.eq(produto.preco);
        expect(getResp.body.descricao).to.eq(produto.descricao);
        expect(getResp.body.quantidade).to.eq(produto.quantidade);
      });
  });
});
