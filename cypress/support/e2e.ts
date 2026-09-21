function nav(kind: "track" | "subject" | "cluster" | "topic", id: string) {
  return cy.get(
    `#handbook-sidebar a[data-nav="${kind}"][data-nav-id="${id}"], #handbook-sidebar button[data-nav="${kind}"][data-nav-id="${id}"]`,
  );
}

function sidebar() {
  return cy.get("#handbook-sidebar");
}

function mainScroller() {
  return cy.get("#handbook-main");
}

declare global {
  namespace Cypress {
    interface Chainable {
      nav(kind: "track" | "subject" | "cluster" | "topic", id: string): Chainable<JQuery<HTMLElement>>;
      sidebar(): Chainable<JQuery<HTMLElement>>;
      mainScroller(): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add("nav", nav);
Cypress.Commands.add("sidebar", sidebar);
Cypress.Commands.add("mainScroller", mainScroller);

export {};
