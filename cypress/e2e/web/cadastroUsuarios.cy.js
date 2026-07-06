/// <reference types="cypress" />

import { factories } from '../../support/factories';
import CadastroUsuarioPage from '../../support/page_objects/CadastroUsuarioPage';

describe('E2E — Cadastro de Usuário no Frontend ServeRest', () => {
  let usuario;
  let userId;

  beforeEach(() => {
    // Arrange — massa dinâmica a cada execução (email único)
    usuario = factories.criarUsuario({ administrador: 'false' });
  });

  after(() => {
    // Limpeza — remove o usuário criado durante os testes
    cy.apiDeleteUser(userId);
  });

  it('cadastra um novo usuário com sucesso e valida a persistência via API', () => {
    // Act — preenche e submete o formulário de cadastro
    CadastroUsuarioPage.cadastrarUsuario(usuario);

    // Assert — o frontend exibe um alerta (div.alert) confirmando o cadastro
    cy.contains('.alert', 'Cadastro realizado com sucesso').should('be.visible');

    // Assert — valida via API que o usuário foi realmente persistido,
    // buscando pelo email (GET /usuarios + filtro em memória)
    cy.request(`${Cypress.env('apiBaseUrl')}/usuarios`).then((res) => {
      const encontrado = res.body.usuarios.find((u) => u.email === usuario.email);
      expect(encontrado, 'usuário persistido na API').to.not.be.undefined;
      expect(encontrado.nome).to.eq(usuario.nome);
      expect(encontrado.administrador).to.eq(usuario.administrador);
      // Guarda o id para limpeza no after()
      userId = encontrado._id;
    });
  });
});
