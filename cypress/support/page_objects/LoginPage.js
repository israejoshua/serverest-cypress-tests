// Page Object — Página de Login (front.serverest.dev/login)

class LoginPage {
  get emailInput() {
    return cy.get('[data-testid="email"]');
  }

  get passwordInput() {
    return cy.get('[data-testid="senha"]');
  }

  get entrarButton() {
    return cy.get('[data-testid="entrar"]');
  }

  visit() {
    cy.visit('/login');
    return this;
  }

  preencherCredenciais(email, password) {
    this.emailInput.clear().type(email);
    this.passwordInput.clear().type(password);
    return this;
  }

  entrar() {
    this.entrarButton.click();
    return this;
  }

  /**
   * Fluxo completo: visita, preenche e submete o login.
   */
  logar(email, password) {
    this.visit().preencherCredenciais(email, password).entrar();
    return this;
  }
}

export default new LoginPage();
