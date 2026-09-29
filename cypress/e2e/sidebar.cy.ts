describe("handbook sidebar", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  it("shows CSS Core as a single row instead of nested Fundamentals", () => {
    cy.visit("/en/frontend/css");
    cy.nav("cluster", "core").should("be.visible").and("contain", "Core");
    cy.nav("topic", "css-fundamentals").should("not.exist");
    cy.nav("topic", "css-core").should("not.exist");
    cy.nav("cluster", "core").click();
    cy.location("pathname").should("eq", "/en/frontend/css-core");
    cy.contains("h1", "Core");
  });

  it("highlights Frontend while CSS is the open page", () => {
    cy.visit("/en/frontend/css");
    cy.nav("track", "frontend").should("have.attr", "aria-expanded", "true");
    cy.nav("track", "frontend").should("have.class", "bg-yellow-50");
    cy.nav("subject", "css").should("have.class", "bg-yellow-50");

    cy.nav("track", "frontend").click({ scrollBehavior: false, force: true });
    cy.nav("track", "frontend").should("have.attr", "aria-expanded", "false");
    cy.nav("track", "frontend").should("have.class", "bg-yellow-50");
    cy.nav("track", "backend").should("not.have.class", "bg-yellow-50");
  });

  it("opens the Backend hub when that track is chosen from System design", () => {
    cy.visit("/en/system-design");
    cy.contains("h1", "System design");

    cy.nav("track", "backend").click();

    cy.location("pathname").should("eq", "/en/backend");
    cy.contains("h1", "Backend");
    cy.contains("h2", "Node.js");
    cy.contains("h2", "Database");
    cy.nav("track", "backend").should("have.attr", "aria-expanded", "true");
    cy.nav("subject", "nodejs").should("be.visible");
    cy.nav("subject", "database").should("be.visible");
  });

  it("keeps Patterns open when opening it from Algorithms Core", () => {
    cy.visit("/en/algorithms/algorithms-core#time-vs-space-complexity");
    cy.nav("track", "algorithms").should("have.attr", "aria-expanded", "true");
    cy.nav("cluster", "core").should("have.attr", "aria-expanded", "true");
    cy.sidebar().contains("Time vs space complexity").should("be.visible");

    cy.nav("cluster", "patterns").click();

    cy.nav("cluster", "patterns").should("have.attr", "aria-expanded", "true");
    cy.sidebar().contains("Patterns").should("be.visible");
    cy.nav("cluster", "core").should("have.attr", "aria-expanded", "false");
    cy.nav("cluster", "algorithms").should(
      "have.attr",
      "aria-expanded",
      "false",
    );
    cy.nav("track", "algorithms").should("have.attr", "aria-expanded", "true");
    cy.url().should("include", "/algorithms");
    cy.url().should("include", "patterns");
  });

  it("opens Data Structures as its own track from Algorithms", () => {
    cy.visit("/en/algorithms");
    cy.nav("track", "data-structures").click();

    cy.location("pathname").should("eq", "/en/data-structures");
    cy.contains("h1", "Data Structures");
    cy.nav("track", "data-structures").should(
      "have.attr",
      "aria-expanded",
      "true",
    );
    cy.sidebar().contains("Choosing a data structure").should("be.visible");
  });

  it("shows System design Core as a single row instead of nested Foundations", () => {
    cy.visit("/en/system-design");
    cy.nav("cluster", "core").should("be.visible").and("contain", "Core");
    cy.nav("topic", "sd-foundations").should("not.exist");
    cy.nav("cluster", "core").click();
    cy.location("pathname").should("eq", "/en/system-design/sd-core");
    cy.contains("h1", "Core");
  });

  it("opens SOLID under System design Principles", () => {
    cy.visit("/en/system-design");
    cy.nav("cluster", "principles").click();
    cy.nav("topic", "solid").should("be.visible").and("contain", "OOP & SOLID");
    cy.nav("topic", "sd-principles")
      .should("be.visible")
      .and("contain", "DRY, KISS, YAGNI");
    cy.nav("topic", "sd-grasp").should("be.visible").and("contain", "GRASP");
    cy.nav("topic", "sd-grasp").click();
    cy.location("pathname").should("eq", "/en/system-design/sd-grasp");
    cy.sidebar().contains("GRASP principles").should("not.exist");
    cy.contains("h1", "GRASP");
    cy.contains("General Responsibility Assignment Software Patterns").should(
      "be.visible",
    );
    cy.get("main .concept-list > details").should("not.exist");
    cy.nav("topic", "solid").click();
    cy.location("pathname").should("eq", "/en/system-design/solid");
    cy.contains("h1", "OOP & SOLID");
    cy.sidebar().contains("Single Responsibility (SRP)").should("be.visible");
  });

  it("opens Architecture patterns under System design Architecture", () => {
    cy.visit("/en/system-design");
    cy.nav("cluster", "architecture").click();
    cy.nav("topic", "special-architecture").should("be.visible");
    cy.nav("topic", "sd-architecture").should("be.visible");
    cy.nav("topic", "special-patterns")
      .should("be.visible")
      .and("contain", "Design patterns");
    cy.nav("cluster", "additional").should("not.exist");
    cy.nav("topic", "sd-patterns").should("not.exist");
    cy.nav("topic", "special-patterns").click();
    cy.location("pathname").should("eq", "/en/system-design/special-patterns");
    cy.contains("h1", "Design patterns");
    cy.sidebar().contains("GOF design patterns — catalog").should("be.visible");
    cy.sidebar().contains("Mediator").should("be.visible");
    cy.nav("topic", "special-architecture").click();
    cy.location("pathname").should(
      "eq",
      "/en/system-design/special-architecture",
    );
    cy.contains("h1", "Architecture patterns");
    cy.sidebar().contains("MVC (Model-View-Controller)").should("be.visible");
  });

  it("opens Computer science from Other without sending the track to Algorithms", () => {
    cy.visit("/en/other");
    cy.nav("subject", "git").should("be.visible");
    cy.nav("topic", "special-testing").should("be.visible");
    cy.nav("topic", "special-sdlc").should("be.visible");
    cy.nav("topic", "special-security").should("be.visible");
    cy.nav("topic", "computer-science").should("be.visible");
    cy.nav("subject", "paradigms").should("not.exist");
    cy.nav("cluster", "additional").should("not.exist");
    cy.nav("cluster", "engineering").should("not.exist");

    cy.nav("topic", "computer-science").click();

    cy.location("pathname").should("eq", "/en/other/computer-science");
    cy.contains("h1", "Computer science");
    cy.nav("topic", "special-testing").should("be.visible");
    cy.nav("topic", "special-security").should("be.visible");
  });

  it("opens Patterns from the Algorithms hub without collapsing the track", () => {
    cy.visit("/en/algorithms");
    cy.nav("track", "algorithms").should("have.attr", "aria-expanded", "true");
    cy.nav("cluster", "patterns").click();

    cy.nav("cluster", "patterns").should("have.attr", "aria-expanded", "true");
    cy.sidebar().contains("Patterns").should("be.visible");
    cy.nav("cluster", "core").should("have.attr", "aria-expanded", "false");
    cy.nav("track", "algorithms").should("have.attr", "aria-expanded", "true");
  });

  it("switches from Patterns back to Core on the Algorithms hub", () => {
    cy.visit("/en/algorithms#patterns");
    cy.nav("cluster", "patterns").should("have.attr", "aria-expanded", "true");

    cy.nav("cluster", "core").click();

    cy.nav("cluster", "core").should("have.attr", "aria-expanded", "true");
    cy.sidebar().contains("Algorithm").should("be.visible");
    cy.nav("cluster", "patterns").should("have.attr", "aria-expanded", "false");
  });

  it("toggles the same hub cluster closed on a second click", () => {
    cy.visit("/en/frontend/html");
    cy.nav("cluster", "core").click();
    cy.nav("cluster", "core").should("have.attr", "aria-expanded", "true");
    cy.sidebar().contains("Structure").should("be.visible");

    cy.nav("cluster", "core").click();
    cy.nav("cluster", "core").should("have.attr", "aria-expanded", "false");
  });

  it("opens Additional on an HTML hub after Core is open", () => {
    cy.visit("/en/frontend/html");
    cy.nav("subject", "html").should("have.attr", "aria-expanded", "true");
    cy.nav("cluster", "core").click();
    cy.nav("cluster", "core").should("have.attr", "aria-expanded", "true");

    cy.nav("cluster", "additional").click();

    cy.nav("cluster", "additional").should(
      "have.attr",
      "aria-expanded",
      "true",
    );
    cy.sidebar().contains("Accessibility").should("be.visible");
    cy.nav("cluster", "core").should("have.attr", "aria-expanded", "false");
    cy.nav("cluster", "browser").should("have.attr", "aria-expanded", "false");
  });

  it("opens Core from a JavaScript Browser topic without collapsing everything", () => {
    cy.visit("/en/frontend/js-browser-extra");
    cy.nav("subject", "javascript").should(
      "have.attr",
      "aria-expanded",
      "true",
    );
    cy.nav("cluster", "browser").should("have.attr", "aria-expanded", "true");
    cy.nav("topic", "js-browser-extra").should(
      "have.attr",
      "aria-expanded",
      "true",
    );

    cy.nav("cluster", "core").click();

    cy.nav("cluster", "core").should("have.attr", "aria-expanded", "true");
    cy.sidebar().contains("Language").should("be.visible");
    cy.sidebar().contains("Functions").should("be.visible");
    cy.nav("cluster", "browser").should("have.attr", "aria-expanded", "false");
    cy.nav("track", "frontend").should("have.attr", "aria-expanded", "true");
    cy.url().should("include", "/frontend/javascript");
    cy.url().should("include", "core");
  });

  it("shows React 19 as a single sidebar row instead of dumping concepts", () => {
    cy.visit("/en/frontend/react-hooks");
    cy.nav("cluster", "react-19").should("be.visible");
    cy.nav("cluster", "react-19").click();

    cy.location("pathname").should("eq", "/en/frontend/react-server");
    cy.nav("cluster", "react-19").should("have.attr", "aria-expanded", "false");
    cy.sidebar().contains("Overview").should("not.exist");
    cy.nav("cluster", "core").should("have.attr", "aria-expanded", "false");
  });

  it("keeps an open Structure topic stuck after its concepts scroll away", () => {
    cy.viewport(1280, 560);
    cy.visit("/en/frontend/html-structure");
    cy.nav("topic", "html-structure").should(
      "have.attr",
      "aria-expanded",
      "true",
    );
    cy.sidebar().contains("Global attributes").should("be.visible");

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
        140;
    });

    cy.nav("topic", "html-structure").should("be.visible");
    cy.nav("topic", "html-forms").should("be.visible");
    cy.nav("cluster", "core").should(($core) => {
      const structure = Cypress.$(
        '#handbook-sidebar [data-nav="topic"][data-nav-id="html-structure"]',
      )[0];
      expect(structure.getBoundingClientRect().top).to.be.gte(
        $core[0].getBoundingClientRect().bottom - 1,
      );
    });
  });

  it("keeps a collapsed Structure topic stuck while later topics scroll", () => {
    cy.viewport(1280, 560);
    cy.visit("/en/frontend/html-structure");
    cy.nav("topic", "html-structure").should(
      "have.attr",
      "aria-expanded",
      "true",
    );
    cy.nav("topic", "html-structure").click({
      scrollBehavior: false,
      force: true,
    });
    cy.nav("topic", "html-structure").should(
      "have.attr",
      "aria-expanded",
      "false",
    );

    cy.get("#handbook-nav-aside").scrollTo("bottom");

    cy.nav("track", "frontend").should("be.visible");
    cy.nav("subject", "html").should("be.visible");
    cy.nav("cluster", "core").should("be.visible");
    cy.nav("topic", "html-structure").should("be.visible");
    cy.nav("topic", "html-structure").should(($el) => {
      const asideBox = Cypress.$(
        "#handbook-nav-aside",
      )[0].getBoundingClientRect();
      const box = $el[0].getBoundingClientRect();
      expect(box.top).to.be.gte(asideBox.top - 1);
      expect(box.bottom).to.be.lt(asideBox.top + 220);
    });
    cy.nav("cluster", "core").should(($core) => {
      const structure = Cypress.$(
        '#handbook-sidebar [data-nav="topic"][data-nav-id="html-structure"]',
      )[0];
      expect(structure.getBoundingClientRect().top).to.be.gte(
        $core[0].getBoundingClientRect().bottom - 1,
      );
    });
  });

  it("keeps Forms in the sidebar view when Structure collapses", () => {
    cy.viewport(1280, 560);
    cy.visit("/en/frontend/html-structure#doctype");
    cy.nav("topic", "html-structure").should(
      "have.attr",
      "aria-expanded",
      "true",
    );
    cy.sidebar().contains("DOCTYPE").should("be.visible");

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
      cy.nav("topic", "html-forms").should(
        "have.attr",
        "aria-expanded",
        "true",
      );
      cy.nav("topic", "html-structure").should(
        "have.attr",
        "aria-expanded",
        "false",
      );
      cy.nav("topic", "html-forms").should("be.visible");
      cy.nav("topic", "html-forms").should(($el) => {
        const box = $el[0].getBoundingClientRect();
        const asideBox = aside.getBoundingClientRect();
        expect(box.top).to.be.gte(asideBox.top - 1);
        expect(box.top).to.be.lt(asideBox.bottom);
      });
    });
  });

  it("sticks the active path to the top of the sidebar when scrolled away", () => {
    cy.viewport(1280, 560);
    cy.visit("/en/frontend/js-browser-extra");
    cy.nav("topic", "js-browser-extra").should(
      "have.attr",
      "aria-expanded",
      "true",
    );

    cy.get("#handbook-nav-aside").then(($aside) => {
      const aside = $aside[0];
      const core = aside.querySelector(
        '[data-nav="cluster"][data-nav-id="core"]',
      ) as HTMLElement | null;
      expect(core, "Core cluster").to.exist;
      if (!core) {
        return;
      }
      // Scroll Core just out of view without releasing sticky path rows at the end.
      aside.scrollTop +=
        core.getBoundingClientRect().bottom -
        aside.getBoundingClientRect().top +
        24;
    });

    cy.nav("track", "frontend").should("be.visible");
    cy.nav("subject", "javascript").should("be.visible");
    cy.nav("cluster", "browser").should("be.visible");
    cy.nav("topic", "js-browser-extra").should("be.visible");
    cy.get('#handbook-sidebar [data-nav="cluster"][data-nav-id="core"]').each(
      ($el) => {
        const asideBox = Cypress.$(
          "#handbook-nav-aside",
        )[0].getBoundingClientRect();
        const box = $el[0].getBoundingClientRect();
        expect(box.bottom).to.be.at.most(asideBox.top + 1);
      },
    );
    cy.nav("topic", "js-browser-extra").should(($el) => {
      const asideBox = Cypress.$(
        "#handbook-nav-aside",
      )[0].getBoundingClientRect();
      const box = $el[0].getBoundingClientRect();
      expect(box.top).to.be.gte(asideBox.top - 1);
      expect(box.bottom).to.be.lt(asideBox.top + 180);
    });
  });

  it("does not jump the main pane when opening a concept in the page list", () => {
    cy.visit("/en/frontend/react-core");
    cy.get("#jsx > summary").click({ scrollBehavior: false, force: true });
    cy.get("#jsx").should("have.prop", "open", true);

    cy.get("#react > summary").then(($summary) => {
      const main = Cypress.$("#handbook-main")[0];
      const desired =
        $summary[0].getBoundingClientRect().top -
        main.getBoundingClientRect().top +
        main.scrollTop -
        220;
      main.scrollTop = desired;
      const before =
        $summary[0].getBoundingClientRect().top -
        main.getBoundingClientRect().top;
      expect(before).to.be.within(80, 400);

      cy.wrap($summary).click({ scrollBehavior: false, force: true });
      cy.get("#react").should("have.prop", "open", true);
      cy.get("#jsx").should("have.prop", "open", false);
      cy.get("#react > summary").should(($el) => {
        const after =
          $el[0].getBoundingClientRect().top - main.getBoundingClientRect().top;
        expect(after).to.be.closeTo(before, 40);
      });
    });
  });

  it("scrolls the opened concept to the top when it is chosen in the sidebar", () => {
    cy.visit("/en/frontend/html-performance");
    cy.get("#core-web-vitals-html-developer-impact > summary").click({
      scrollBehavior: false,
    });
    cy.get("#core-web-vitals-html-developer-impact").should(
      "have.prop",
      "open",
      true,
    );

    const cachingId = "caching-historical-note-applicationcache";
    cy.get(`#handbook-sidebar [data-concept-id="${cachingId}"]`).click({
      scrollBehavior: false,
      force: true,
    });
    cy.location("hash").should("eq", `#${cachingId}`);
    cy.get(`#${cachingId}`).should("have.prop", "open", true);
    cy.get("#core-web-vitals-html-developer-impact").should(
      "have.prop",
      "open",
      false,
    );
    cy.get(`#${cachingId} > summary`).should(($el) => {
      const main = Cypress.$("#handbook-main")[0];
      const top =
        $el[0].getBoundingClientRect().top - main.getBoundingClientRect().top;
      expect(top).to.be.within(0, 24);
    });
  });

  it("restores search and the last page from browser storage", () => {
    cy.visit("/en/frontend/react-core");
    cy.get('[data-search-mode="notes"]').click();
    cy.get('input[placeholder="Search in notes…"]').clear().type("useState");
    cy.wait(400);
    cy.reload();
    cy.get('input[placeholder="Search in notes…"]').should(
      "have.value",
      "useState",
    );
    cy.get('[data-search-mode="notes"]').should(
      "have.attr",
      "aria-checked",
      "true",
    );

    cy.visit("/en");
    cy.location("pathname").should("not.eq", "/");
    cy.get('input[placeholder="Search in notes…"]').should(
      "have.value",
      "useState",
    );
  });

  it("filters the sidebar to matching topics while searching", () => {
    cy.visit("/en/frontend/javascript");
    cy.get('input[placeholder="Search topics…"]').clear().type("event loop");
    cy.wait(400);
    cy.sidebar().should(($nav) => {
      const text = $nav.text().toLowerCase();
      expect(text).to.contain("event loop");
    });
    cy.get("#handbook-sidebar [data-search-hit='true']").should("exist");
  });

  it("does not search inside notes in Topics mode", () => {
    cy.visit("/en/frontend/js-browser-extra");
    cy.get('input[placeholder="Search topics…"]').clear().type("resize layout");
    cy.wait(400);
    cy.sidebar().should("contain", "No topics or concepts match that search.");
    cy.get("#handbook-sidebar [data-search-in='notes']").should("not.exist");
  });

  it("finds a phrase inside concept notes in Notes mode", () => {
    cy.visit("/en/frontend/js-browser-extra");
    cy.get('[data-search-mode="notes"]').click();
    cy.get('input[placeholder="Search in notes…"]')
      .clear()
      .type("resize ended");
    cy.wait(400);
    cy.sidebar().should(($nav) => {
      const text = $nav.text().toLowerCase();
      expect(text).to.contain("debounc");
    });
    cy.location("hash").should("match", /debounc/i);
    cy.get("#handbook-sidebar [data-search-in='notes']").should(
      "contain",
      "resize ended",
    );
    cy.get("#handbook-main mark").should("contain", "resize ended");
  });

  it("keeps search mode buttons inside the phone header", () => {
    cy.viewport(384, 844);
    cy.visit("/en/backend/database");
    cy.get("#handbook-header [data-search-mode]").should(($buttons) => {
      const viewportRight = 384;
      expect($buttons.length).to.be.greaterThan(0);
      for (const button of $buttons) {
        const box = button.getBoundingClientRect();
        expect(box.left).to.be.at.least(0);
        expect(box.right).to.be.at.most(viewportRight);
      }
    });
    cy.get('#handbook-header [data-search-mode="titles"]').should(
      "have.attr",
      "aria-label",
      "Topics",
    );
    cy.get('#handbook-header [data-search-mode="notes"]').should(
      "have.attr",
      "aria-label",
      "Notes",
    );
    cy.get("#handbook-header [data-search-mode] svg").should("be.visible");
    cy.get("#handbook-header [data-search-mode] span").should("not.be.visible");
    cy.get("#handbook-header > header > div").should(($row) => {
      expect($row[0].scrollWidth).to.be.at.most($row[0].clientWidth + 1);
    });
  });

  it("opens the search sidebar when typing on a phone", () => {
    cy.viewport(390, 844);
    cy.visit("/en/frontend/react-hooks");
    cy.get('input[placeholder="Search topics…"]').clear().type("useEf");
    cy.wait(400);
    cy.contains("button", "Close topics").should("be.visible");
    cy.sidebar().should("be.visible");
    cy.sidebar().should(($nav) => {
      const text = $nav.text().toLowerCase();
      expect(text).to.contain("useeffect");
      expect(text).not.to.contain("javascript");
    });
    cy.sidebar().contains("HTML").should("not.exist");

    cy.get('#handbook-sidebar [data-concept-id="useeffect"]').click();
    cy.get('#handbook-header button[aria-controls="handbook-sidebar"]').should(
      "have.attr",
      "aria-expanded",
      "false",
    );
    cy.location("pathname").should("eq", "/en/frontend/react-hooks");
    cy.location("hash").should("eq", "#useeffect");
    cy.get("#useeffect").should("have.prop", "open", true);
  });

  it("keeps the overlay open until a concept is chosen", () => {
    cy.viewport(390, 844);
    cy.visit("/en/frontend/web-api");
    cy.contains("button", "Open topics").click();
    cy.get('button[aria-label="Close topics"]').should(
      "have.attr",
      "tabindex",
      "0",
    );
    cy.get("aside").should(($aside) => {
      const box = $aside[0].getBoundingClientRect();
      expect(box.top).to.be.closeTo(56, 2);
      expect(box.left).to.be.closeTo(0, 2);
      expect(box.right).to.be.closeTo(390, 2);
      expect(box.bottom).to.be.closeTo(844, 2);
    });

    cy.nav("cluster", "core").click();
    cy.get('button[aria-label="Close topics"]').should(
      "have.attr",
      "tabindex",
      "0",
    );
    cy.sidebar().contains("HTTP").should("be.visible");

    cy.nav("topic", "web-api-http").click();
    cy.get('button[aria-label="Close topics"]').should(
      "have.attr",
      "tabindex",
      "0",
    );
    cy.sidebar().contains("HTTP protocol").should("be.visible");

    cy.get('#handbook-sidebar [data-concept-id="http-protocol"]').click();
    cy.get('button[aria-label="Close topics"]').should(
      "have.attr",
      "tabindex",
      "-1",
    );
    cy.location("pathname").should("eq", "/en/frontend/web-api-http");
    cy.location("hash").should("eq", "#http-protocol");
  });

  it("shows the last updated day, month, and year next to contact links", () => {
    cy.visit("/en");
    cy.get("nav[aria-label='Contact']").should("be.visible");
    cy.contains("Last updated")
      .closest("time")
      .should("have.attr", "datetime")
      .and("match", /^\d{4}-\d{2}-\d{2}$/);
    cy.contains("Last updated")
      .closest("time")
      .invoke("text")
      .should("match", /\d{1,2} [A-Z][a-z]+ \d{4}/);
  });

  it("collapses the desktop sidebar and restores it", () => {
    cy.visit("/en/frontend/html-structure");
    cy.sidebar().should("be.visible");
    cy.get('button[aria-label="Collapse topics"]').click();
    cy.sidebar().should("not.be.visible");
    cy.reload();
    cy.sidebar().should("not.be.visible");
    cy.get('button[aria-label="Expand topics"]').should("be.visible").click();
    cy.sidebar().should("be.visible");
  });

  it("collapses the desktop sidebar while a search query is active", () => {
    cy.visit("/en/system-design/sd-core");
    cy.get('input[placeholder="Search topics…"]').clear().type("design");
    cy.wait(400);
    cy.sidebar().should("be.visible");
    cy.get('button[aria-label="Collapse topics"]').click();
    cy.sidebar().should("not.be.visible");
    cy.get('button[aria-label="Expand topics"]').should("be.visible");
    cy.get('input[placeholder="Search topics…"]').should(
      "have.value",
      "design",
    );
  });

  it("does not peek the collapsed sidebar while searching", () => {
    cy.visit("/en/system-design/sd-core");
    cy.get('input[placeholder="Search topics…"]').clear().type("design");
    cy.wait(400);
    cy.get('button[aria-label="Collapse topics"]').click();
    cy.sidebar().should("not.be.visible");

    cy.get("aside").trigger("pointerenter", { pointerType: "mouse" });
    cy.sidebar().should("not.be.visible");
    cy.get('button[aria-label="Expand topics"]').trigger("pointerenter", {
      pointerType: "mouse",
    });
    cy.sidebar().should("not.be.visible");
  });

  it("peeks the collapsed sidebar on hover and collapses again on leave", () => {
    cy.visit("/en/frontend/html-structure");
    cy.get('button[aria-label="Collapse topics"]').click();
    cy.get('button[aria-label="Expand topics"]').should("be.visible");

    cy.get("aside").trigger("pointerenter", { pointerType: "mouse" });
    cy.sidebar().should("be.visible");
    cy.sidebar().contains("HTML").should("be.visible");

    cy.get("aside").trigger("pointerleave", { pointerType: "mouse" });
    cy.sidebar().should("not.be.visible");
    cy.get('button[aria-label="Expand topics"]').should("be.visible");
  });

  it("does not peek the collapsed sidebar when hovering the dock button", () => {
    cy.visit("/en/frontend/html-structure");
    cy.get('button[aria-label="Collapse topics"]').click();
    cy.sidebar().should("not.be.visible");

    cy.get('button[aria-label="Expand topics"]').trigger("pointerenter", {
      pointerType: "mouse",
    });
    cy.sidebar().should("not.be.visible");
  });

  it("keeps a peeked sidebar open when the pointer moves onto the dock", () => {
    cy.visit("/en/frontend/html-structure");
    cy.get('button[aria-label="Collapse topics"]').click();
    cy.get("aside").trigger("pointerenter", { pointerType: "mouse" });
    cy.sidebar().should("be.visible");

    cy.get('button[aria-label="Expand topics"]').trigger("pointerover", {
      pointerType: "mouse",
    });
    cy.sidebar().should("be.visible");
  });
});
