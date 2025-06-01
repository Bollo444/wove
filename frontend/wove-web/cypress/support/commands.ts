// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Add global type for Cypress
// /// <reference types="cypress" />

// Example: Add a custom command for login
// Cypress.Commands.add('login', (username, password) => {
//   cy.visit('/login');
//   cy.get('input[name="username"]').type(username);
//   cy.get('input[name="password"]').type(password);
//   cy.get('button[type="submit"]').click();
//   cy.url().should('not.include', '/login'); // Or whatever your post-login URL is
// });

// Example: Add a custom command for data-testid selection
// Cypress.Commands.add('getByTestId', (testId) => {
//  return cy.get(`[data-testid="${testId}"]`);
// });
