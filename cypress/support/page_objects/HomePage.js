// Page Object — Página Inicial (home logada)

class HomePage {
  get tituloBemVindo() {
    return cy.contains('Bem Vindo');
  }

  get logoutButton() {
    return cy.get('[data-testid="logout"]');
  }

  get cadastrarProdutosLink() {
    return cy.get('[data-testid="cadastrarProdutos"]');
  }

  get listarProdutosLink() {
    return cy.get('[data-testid="listarProdutos"]');
  }

  get listaProdutos() {
    return cy.get('[data-testid="listaProdutos"]');
  }

  get primeiroDetalheProdutoLink() {
    return cy.get('[data-testid="product-detail-link"]').first();
  }

  visit() {
    cy.visit('/');
    return this;
  }

  /** Valida que o usuário está autenticado vendo a saudação "Bem Vindo". */
  estarLogado(nomeUsuario = '') {
    if (nomeUsuario) {
      // O frontend exibe "Bem Vindo  <nome>"; valida saudação + nome do usuário
      cy.contains('Bem Vindo').should('be.visible').and('contain', nomeUsuario);
    } else {
      this.tituloBemVindo.should('be.visible');
    }
    return this;
  }

  irParaListaProdutos() {
    this.listarProdutosLink.click();
    return this;
  }

  abrirPrimeiroProduto() {
    this.primeiroDetalheProdutoLink.click();
    return this;
  }

  logout() {
    this.logoutButton.click();
    return this;
  }
}

export default new HomePage();
