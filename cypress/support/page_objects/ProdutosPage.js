// Page Object — Listagem/Busca de Produtos

class ProdutosPage {
  get campoPesquisa() {
    return cy.get('[data-testid="pesquisar"]');
  }

  get botaoPesquisar() {
    return cy.get('[data-testid="botaoPesquisar"]');
  }

  get listaProdutos() {
    return cy.get('[data-testid="listaProdutos"]');
  }

  get linksDetalheProduto() {
    return cy.get('[data-testid="product-detail-link"]');
  }

  /** Títulos de produtos exibidos nos cards (h5.card-title). */
  get titulosProdutos() {
    return cy.get('h5.card-title');
  }

  visit() {
    // A home ("/") já renderiza a lista de produtos para usuários autenticados
    cy.visit('/');
    return this;
  }

  pesquisar(termo) {
    this.campoPesquisa.clear().type(termo);
    this.botaoPesquisar.click();
    return this;
  }

  /** Verifica que a lista de produtos está presente e não vazia. */
  listaDeveEstarVisivelENaoVazia() {
    // Usa o card de produto (product-detail-link) como prova de que a
    // vitrine carregou.
    this.linksDetalheProduto.should('have.length.of.at.least', 1);
    return this;
  }

  /** Valida que um produto com o nome informado aparece na vitrine. */
  produtoDeveEstarVisivel(nomeProduto) {
    this.titulosProdutos.contains(nomeProduto).should('be.visible');
    return this;
  }

  /** Abre o primeiro produto da lista filtrada. */
  abrirPrimeiroProduto() {
    this.linksDetalheProduto.first().click();
    return this;
  }
}

export default new ProdutosPage();
