describe("handbook sidebar", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  it("highlights Frontend while CSS is the open page", () => {
    cy.visit("/frontend/css");
    cy.nav("track", "frontend").should("have.attr", "aria-expanded", "true");
    cy.nav("track", "frontend").should("have.class", "bg-yellow-50");
    cy.nav("subject", "css").should("have.class", "bg-yellow-50");

    cy.nav("track", "frontend").click({ scrollBehavior: false, force: true });
    cy.nav("track", "frontend").should("have.attr", "aria-expanded", "false");
    cy.nav("track", "frontend").should("have.class", "bg-yellow-50");
    cy.nav("track", "backend").should("not.have.class", "bg-yellow-50");
  });

  it("keeps Additional open when opening it from Algorithms Core", () => {
    cy.visit("/algorithms/algorithms-core#time-vs-space-complexity");
    cy.nav("track", "algorithms").should("have.attr", "aria-expanded", "true");
    cy.nav("cluster", "core").should("have.attr", "aria-expanded", "true");
    cy.sidebar().contains("Time vs space complexity").should("be.visible");

    cy.nav("cluster", "additional").click();

    cy.nav("cluster", "additional").should("have.attr", "aria-expanded", "true");
    cy.sidebar().contains("Patterns").should("be.visible");
    cy.sidebar().contains("Data structures").should("be.visible");
    cy.nav("cluster", "core").should("have.attr", "aria-expanded", "false");
    cy.nav("cluster", "algorithms").should("have.attr", "aria-expanded", "false");
    cy.nav("track", "algorithms").should("have.attr", "aria-expanded", "true");
    cy.url().should("include", "/algorithms");
    cy.url().should("include", "additional");
  });

  it("opens Additional from the Algorithms hub without collapsing the track", () => {
    cy.visit("/algorithms");
    cy.nav("track", "algorithms").should("have.attr", "aria-expanded", "true");
    cy.nav("cluster", "additional").click();

    cy.nav("cluster", "additional").should("have.attr", "aria-expanded", "true");
    cy.sidebar().contains("Patterns").should("be.visible");
    cy.nav("cluster", "core").should("have.attr", "aria-expanded", "false");
    cy.nav("track", "algorithms").should("have.attr", "aria-expanded", "true");
  });

  it("switches from Additional back to Core on the Algorithms hub", () => {
    cy.visit("/algorithms#additional");
    cy.nav("cluster", "additional").should("have.attr", "aria-expanded", "true");

    cy.nav("cluster", "core").click();

    cy.nav("cluster", "core").should("have.attr", "aria-expanded", "true");
    cy.sidebar().contains("Algorithm").should("be.visible");
    cy.nav("cluster", "additional").should("have.attr", "aria-expanded", "false");
  });

  it("toggles the same hub cluster closed on a second click", () => {
    cy.visit("/frontend/html");
    cy.nav("cluster", "core").click();
    cy.nav("cluster", "core").should("have.attr", "aria-expanded", "true");
    cy.sidebar().contains("Structure").should("be.visible");

    cy.nav("cluster", "core").click();
    cy.nav("cluster", "core").should("have.attr", "aria-expanded", "false");
  });

  it("opens Additional on an HTML hub after Core is open", () => {
    cy.visit("/frontend/html");
    cy.nav("subject", "html").should("have.attr", "aria-expanded", "true");
    cy.nav("cluster", "core").click();
    cy.nav("cluster", "core").should("have.attr", "aria-expanded", "true");

    cy.nav("cluster", "additional").click();

    cy.nav("cluster", "additional").should("have.attr", "aria-expanded", "true");
    cy.sidebar().contains("Accessibility").should("be.visible");
    cy.nav("cluster", "core").should("have.attr", "aria-expanded", "false");
    cy.nav("cluster", "browser").should("have.attr", "aria-expanded", "false");
  });

  it("opens Core from a JavaScript Browser topic without collapsing everything", () => {
    cy.visit("/frontend/js-browser-extra");
    cy.nav("subject", "javascript").should("have.attr", "aria-expanded", "true");
    cy.nav("cluster", "browser").should("have.attr", "aria-expanded", "true");
    cy.nav("topic", "js-browser-extra").should("have.attr", "aria-expanded", "true");

    cy.nav("cluster", "core").click();

    cy.nav("cluster", "core").should("have.attr", "aria-expanded", "true");
    cy.sidebar().contains("Language").should("be.visible");
    cy.sidebar().contains("Functions").should("be.visible");
    cy.nav("cluster", "browser").should("have.attr", "aria-expanded", "false");
    cy.nav("track", "frontend").should("have.attr", "aria-expanded", "true");
    cy.url().should("include", "/frontend/javascript");
    cy.url().should("include", "core");
  });

  it("keeps Forms in the sidebar view when Structure collapses", () => {
    cy.viewport(1280, 560);
    cy.visit("/frontend/html-structure#heading-hierarchy");
    cy.nav("topic", "html-structure").should("have.attr", "aria-expanded", "true");
    cy.sidebar().contains("Heading hierarchy").should("be.visible");

    cy.get("#handbook-nav-aside").then(($aside) => {
      const aside = $aside[0];
      const forms = aside.querySelector(
        '[data-nav="topic"][data-nav-id="html-forms"]',
      ) as HTMLElement | null;
      expect(forms, "Forms topic").to.exist;
      if (!forms) {
        return;
      }
      aside.scrollTop +=
        forms.getBoundingClientRect().top -
        aside.getBoundingClientRect().top -
        96;
    });

    cy.nav("topic", "html-forms").then(($forms) => {
      const aside = Cypress.$("#handbook-nav-aside")[0];
      cy.wrap($forms).click({ scrollBehavior: false, force: true });
      cy.url().should("include", "/frontend/html-forms");
      cy.nav("topic", "html-forms").should("have.attr", "aria-expanded", "true");
      cy.nav("topic", "html-structure").should("have.attr", "aria-expanded", "false");
      cy.nav("topic", "html-forms").should("be.visible");
      cy.nav("topic", "html-forms").should(($el) => {
        const box = $el[0].getBoundingClientRect();
        const asideBox = aside.getBoundingClientRect();
        expect(box.top).to.be.gte(asideBox.top - 1);
        expect(box.top).to.be.lt(asideBox.bottom);
      });
    });
  });

  it("does not jump the main pane when opening a concept in the page list", () => {
    cy.visit("/frontend/react-core");
    cy.get("#tooling > summary").click({ scrollBehavior: false });
    cy.get("#tooling").should("have.prop", "open", true);

    cy.get("#react > summary").then(($summary) => {
      const main = Cypress.$("#handbook-main")[0];
      const desired =
        $summary[0].getBoundingClientRect().top -
        main.getBoundingClientRect().top +
        main.scrollTop -
        220;
      main.scrollTop = desired;
      const before =
        $summary[0].getBoundingClientRect().top - main.getBoundingClientRect().top;
      expect(before).to.be.within(80, 400);

      cy.wrap($summary).click({ scrollBehavior: false });
      cy.get("#react").should("have.prop", "open", true);
      cy.get("#tooling").should("have.prop", "open", false);
      cy.get("#react > summary").should(($el) => {
        const after =
          $el[0].getBoundingClientRect().top - main.getBoundingClientRect().top;
        expect(after).to.be.closeTo(before, 40);
      });
    });
  });

  it("scrolls the opened concept to the top when it is chosen in the sidebar", () => {
    cy.visit("/frontend/html-performance");
    cy.get("#core-web-vitals-html-developer-impact > summary").click({
      scrollBehavior: false,
    });
    cy.get("#core-web-vitals-html-developer-impact").should("have.prop", "open", true);

    const cachingId = "caching-historical-note-applicationcache";
    cy.get(`#handbook-sidebar [data-concept-id="${cachingId}"]`).click();
    cy.location("hash").should("eq", `#${cachingId}`);
    cy.get(`#${cachingId}`).should("have.prop", "open", true);
    cy.get("#core-web-vitals-html-developer-impact").should("have.prop", "open", false);
    cy.get(`#${cachingId} > summary`).should(($el) => {
      const main = Cypress.$("#handbook-main")[0];
      const top =
        $el[0].getBoundingClientRect().top - main.getBoundingClientRect().top;
      expect(top).to.be.within(0, 24);
    });
  });

  it("filters the sidebar to matching topics while searching", () => {
    cy.visit("/frontend/javascript");
    cy.get('input[placeholder="Search topics and concepts…"]').clear().type("event loop");
    cy.wait(400);
    cy.sidebar().should(($nav) => {
      const text = $nav.text().toLowerCase();
      expect(text).to.contain("event loop");
    });
    cy.get("#handbook-sidebar [data-search-hit='true']").should("exist");
  });

  it("does not search inside notes in Topics mode", () => {
    cy.visit("/frontend/js-browser-extra");
    cy.get('input[placeholder="Search topics and concepts…"]').clear().type("resize layout");
    cy.wait(400);
    cy.sidebar().should("contain", "No topics or concepts match that search.");
    cy.get("#handbook-sidebar [data-search-in='notes']").should("not.exist");
  });

  it("finds a phrase inside concept notes in Notes mode", () => {
    cy.visit("/frontend/js-browser-extra");
    cy.get('[data-search-mode="notes"]').click();
    cy.get('input[placeholder="Search in notes…"]').clear().type("resize layout");
    cy.wait(400);
    cy.sidebar().should(($nav) => {
      const text = $nav.text().toLowerCase();
      expect(text).to.contain("debounc");
    });
    cy.location("hash").should("match", /debounc/i);
    cy.get("#handbook-sidebar [data-search-in='notes']").should("contain", "resize layout");
    cy.get("#handbook-main mark").should("contain", "resize layout");
  });
});
