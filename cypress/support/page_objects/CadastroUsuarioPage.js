// Page Object — Cadastro de Usuários (front.serverest.dev/cadastrarusuarios)

class CadastroUsuarioPage {
  get nomeInput() {
    return cy.get('[data-testid="nome"]');
  }

  get emailInput() {
    return cy.get('[data-testid="email"]');
  }

  get passwordInput() {
    return cy.get('[data-testid="password"]');
  }

  get administradorCheckbox() {
    return cy.get('[data-testid="checkbox"]');
  }

  get cadastrarButton() {
    return cy.get('[data-testid="cadastrar"]');
  }

  visit() {
    cy.visit('/cadastrarusuarios');
    return this;
  }

  preencherFormulario({ nome, email, password, administrador = false }) {
    this.nomeInput.clear().type(nome);
    this.emailInput.clear().type(email);
    this.passwordInput.clear().type(password);
    // O checkbox define se o usuário será administrador (true/false)
    this.administradorCheckbox.then(($cb) => {
      const estaMarcado = $cb.is(':checked');
      const deveEstarMarcado = administrador === true || administrador === 'true';
      if (estaMarcado !== deveEstarMarcado) {
        cy.wrap($cb).click();
      }
    });
    return this;
  }

  cadastrar() {
    this.cadastrarButton.click();
    return this;
  }

  /**
   * Fluxo completo: visita, preenche e submete o cadastro.
   */
  cadastrarUsuario(dados) {
    this.visit().preencherFormulario(dados).cadastrar();
    return this;
  }
}

export default new CadastroUsuarioPage();
