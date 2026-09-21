describe("handbook breadcrumbs", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  it("lives in the content pane and stays stuck while that pane scrolls", () => {
    cy.visit("/data-structures#tree");
    cy.contains("h1", "Data Structures");
    cy.mainScroller()
      .find("nav[aria-label='Breadcrumb']")
      .should("be.visible")
      .and("contain", "Tree");
    cy.get("#handbook-header nav[aria-label='Breadcrumb']").should("not.exist");

    cy.mainScroller().scrollTo("bottom");
    cy.mainScroller().find("nav[aria-label='Breadcrumb']").should("be.visible");
    cy.mainScroller().then(($main) => {
      const main = $main[0];
      const nav = main.querySelector("nav[aria-label='Breadcrumb']");
      expect(nav, "breadcrumb nav").to.exist;
      const sticky = nav!.closest(".sticky");
      expect(sticky, "sticky breadcrumb bar").to.exist;
      const mainBox = main.getBoundingClientRect();
      const stickyBox = sticky!.getBoundingClientRect();
      expect(stickyBox.top).to.be.closeTo(mainBox.top, 2);
    });
  });

  it("keeps Node.js current on the hub when the URL has an HTTP cluster hash", () => {
    cy.visit("/backend/nodejs#http");
    cy.contains("h1", "Node.js");
    cy.get("nav[aria-label='Breadcrumb'] li").last().should("contain", "Node.js");
    cy.get("nav[aria-label='Breadcrumb']").should("not.contain", "HTTP");
  });

  it("shows Core once on the Node.js Core topic", () => {
    cy.visit("/backend/nodejs-core");
    cy.contains("h1", "Core");
    cy.get("nav[aria-label='Breadcrumb']").then(($nav) => {
      const labels = [...$nav.find("li")].map((li) =>
        li.innerText.replaceAll("/", "").trim(),
      );
      expect(labels.filter((label) => label === "Core")).to.have.length(1);
      expect(labels).to.deep.equal(["Home", "Backend", "Node.js", "Core"]);
    });
  });
});
