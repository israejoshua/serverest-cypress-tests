// Factories de massa de dados dinâmica.
// Gera dados únicos a cada execução para evitar duplicidade e dados instáveis.

import { faker } from '@faker-js/faker';

const sufixoUnico = () => `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

/**
 * Cria um usuário válido com dados aleatórios.
 * @param {Object} [overrides] Propriedades a sobrescrever.
 * @returns {Object} Usuário { nome, email, password, administrador }
 */
export function criarUsuario(overrides = {}) {
  const sufixo = sufixoUnico();
  return {
    nome: faker.person.fullName(),
    email: `qa_${sufixo}@qa.com`,
    password: faker.internet.password({ length: 10 }),
    administrador: 'true',
    ...overrides,
  };
}

/**
 * Cria um produto válido com dados aleatórios.
 * @param {Object} [overrides] Propriedades a sobrescrever.
 * @returns {Object} Produto { nome, preco, descricao, quantidade }
 */
export function criarProduto(overrides = {}) {
  return {
    nome: `${faker.commerce.productName()} ${sufixoUnico()}`,
    preco: Number(faker.commerce.price({ min: 10, max: 999, dec: 0 })),
    descricao: faker.commerce.productDescription().slice(0, 40),
    quantidade: faker.number.int({ min: 1, max: 100 }),
    ...overrides,
  };
}

/**
 * Cria credenciais de login a partir de um usuário.
 * @param {Object} usuario Usuário contendo email e password.
 * @returns {Object} { email, password }
 */
export function credenciaisDoUsuario(usuario) {
  return { email: usuario.email, password: usuario.password };
}

// Export agrupado para uso nos testes: `import { factories } from './factories'`
export const factories = { criarUsuario, criarProduto, credenciaisDoUsuario };
