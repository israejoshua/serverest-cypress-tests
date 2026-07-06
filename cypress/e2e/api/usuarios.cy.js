/// <reference types="cypress" />

import { factories } from '../../support/factories';

describe('API /usuarios — Cadastro de usuário com massa dinâmica', () => {
  // Rastreia todos os ids criados para limpeza completa no after()
  const idsCriados = [];

  after(() => {
    // Limpeza — remove TODOS os usuários criados durante os testes
    idsCriados.forEach((id) => cy.apiDeleteUser(id));
  });

  it('cadastra um novo usuário, consulta e valida os dados persistidos', () => {
    // Arrange — massa dinâmica (email único)
    const usuario = factories.criarUsuario({ administrador: 'false' });

    // Act — cria o usuário
    cy.apiCreateUser(usuario)
      .then(({ response, _id }) => {
        // Assert — cadastro criado com sucesso
        expect(response.status, 'status HTTP').to.eq(201);
        expect(response.body.message, 'mensagem').to.eq('Cadastro realizado com sucesso');
        expect(response.body._id, '_id retornado').to.be.a('string').and.not.be.empty;
        idsCriados.push(_id);

        // Act — consulta o usuário recém-criado pelo id retornado
        return cy.apiGetUser(_id);
      })
      .then((response) => {
        // Assert — dados persistidos conferem com o payload enviado
        expect(response.status, 'status HTTP da consulta').to.eq(200);
        expect(response.body.nome).to.eq(usuario.nome);
        expect(response.body.email).to.eq(usuario.email);
        expect(response.body.password).to.eq(usuario.password);
        expect(response.body.administrador).to.eq(usuario.administrador);
      });
  });

  it('impede o cadastro com email já existente (status 400)', () => {
    // Arrange — massa dinâmica
    const usuario = factories.criarUsuario({ administrador: 'false' });

    // Act — cria o usuário uma primeira vez
    cy.apiCreateUser(usuario)
      .then(({ response, _id }) => {
        expect(response.status, 'primeiro cadastro').to.eq(201);
        idsCriados.push(_id);

        // Act — tenta cadastrar novamente com o MESMO email
        return cy.apiCreateUser(usuario);
      })
      .then(({ response }) => {
        // Assert — rejeita duplicidade
        expect(response.status, 'email duplicado').to.eq(400);
        expect(response.body.message, 'mensagem de duplicidade').to.contain('já está sendo usado');
      });
  });
});
