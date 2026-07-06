// Page Object — Detalhe do Produto (visualização individual)

class ListaComprasPage {
  get nomeProdutoDetalhe() {
    return cy.get('[data-testid="product-detail-name"]');
  }

  get adicionarNaListaButton() {
    return cy.get('[data-testid="adicionarNaLista"]');
  }

  get shoppingCartButton() {
    return cy.get('[data-testid="shopping-cart-button"]');
  }

  get checkoutProducts() {
    return cy.get('[data-testid="checkout-products"]');
  }

  get shoppingCartProductName() {
    return cy.get('[data-testid="shopping-cart-product-name"]');
  }

  /** Valida que o detalhe do produto exibe o nome esperado. */
  validarNomeProdutoVisivel() {
    this.nomeProdutoDetalhe.should('be.visible');
    return this;
  }

  adicionarNaLista() {
    this.adicionarNaListaButton.click();
    return this;
  }
}

export default new ListaComprasPage();
