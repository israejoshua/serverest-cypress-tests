/// <reference types="cypress" />

import { factories } from '../../support/factories';
import LoginPage from '../../support/page_objects/LoginPage';
import ProdutosPage from '../../support/page_objects/ProdutosPage';
import ListaComprasPage from '../../support/page_objects/ListaComprasPage';

describe('E2E — Listagem, busca e detalhe de Produtos', () => {
  let adminId;
  let adminToken;
  let clienteId;
  let produtoId;
  let produto;
  let cliente = factories.criarUsuario({ administrador: 'false' });

  before(() => {
    // Arrange — admin cria um produto previsível via API (alvo estável p/ busca)
    const admin = factories.criarUsuario({ administrador: 'true' });
    produto = factories.criarProduto({
      nome: `QA Busca ${Date.now()}`,
      descricao: 'Produto busca E2E',
    });

    // Cria o admin e o produto
    cy.apiCreateUser(admin).then(({ _id }) => {
      adminId = _id;
      cy.apiLogin(admin.email, admin.password).then((loginResp) => {
        adminToken = loginResp.body.authorization;
        cy.apiCreateProduct(adminToken, produto).then(({ _id: prodId }) => {
          produtoId = prodId;
        });
      });
    });

    // Cria um usuário COMUM (não admin) para acessar a vitrine
    cy.apiCreateUser(cliente).then(({ _id }) => {
      clienteId = _id;
    });
  });

  after(() => {
    // Limpeza — remove produto, cliente e admin criados
    if (produtoId && adminToken) {
      cy.apiDeleteProduct(adminToken, produtoId);
    }
    cy.apiDeleteUser(clienteId);
    cy.apiDeleteUser(adminId);
  });

  it('lista produtos, busca pelo nome e acessa o detalhe do produto criado', () => {
    // Act — autentica como usuário comum (o login já redireciona para /home,
    // que é a vitrine de produtos)
    LoginPage.logar(cliente.email, cliente.password);

    // Act — valida que a lista carregou e filtra pelo nome do produto criado
    ProdutosPage.listaDeveEstarVisivelENaoVazia().pesquisar(produto.nome);

    // Assert — o produto criado aparece na listagem filtrada (nome no h5)
    ProdutosPage.produtoDeveEstarVisivel(produto.nome);

    // Act — abre o detalhe do produto encontrado
    ProdutosPage.linksDetalheProduto.first().click();

    // Assert — o detalhe exibe o nome do produto correto
    ListaComprasPage.nomeProdutoDetalhe.should('be.visible').and('contain', produto.nome);
  });
});
