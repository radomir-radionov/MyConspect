# Testing — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./7_special_testing.md)

### Related docs

- [Fundamentals](./7_special_testing_fundamentals.md) · [Layers](./7_special_testing_layers.md) · [Practices](./7_special_testing_practices.md) · [Tooling](./7_special_testing_tooling.md) · [Interview](./7_special_testing_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Testing](https://devinterview.io/questions/web-and-mobile-development/testing-interview-questions/).

### Testing Fundamentals

<details>
<summary>What is software testing, and why is it important?</summary>

### What is software testing, and why is it important?

**Definition:**

Software testing is the discipline of checking that a system does what it should and of learning where it does not, before users pay for the mistake.

**How it works:**

- It finds defects: behavior that disagrees with a requirement or with an expectation you can state.
- Finding them early cuts the cost and the blast radius. A bug in production is more expensive than the same bug next to the change that introduced it.
- The result is evidence about quality, not a proof that no defects remain.
- That evidence is also feedback for the process: repeated failures in one area say where the design or the requirements are weak.
- Testing is not “trying the happy path once,” and it is not a phase that starts only after coding is finished.

**Examples:**

A checkout test that asserts the total is `price + tax` will fail the day someone changes rounding. That failure is the point of the test.

</details>

<details>
<summary>Define the difference between verification and validation in software testing.</summary>

### Define the difference between verification and validation in software testing.

**Definition:**

Verification asks whether the product was built to its specification. Validation asks whether that specification is the product people actually need.

**How it works:**

- Verification answers “are we building it right?” Reviews, inspections, and walkthroughs of requirements, design, and code are typical, and so are tests traced to a written rule.
- Validation answers “are we building the right thing?” Acceptance tests, alpha and beta use, and a user attempting a real task are typical.
- A feature can pass verification and still fail validation: the tax calculation matches the spec, and the spec charges the wrong party.

**Examples:**

A review that checks the rounding rule against the requirements document is verification. A merchant running a real invoice through checkout is validation.

</details>

<details>
<summary>Explain the software development life cycle and the role testing plays in each phase.</summary>

### Explain the software development life cycle and the role testing plays in each phase.

**Definition:**

The software development life cycle is the path from a need to a running system and its upkeep. Testing has a job in every phase, not only in a single “QA” box at the end.

**How it works:**

- While needs are gathered, testing reviews them: prototypes and use cases show gaps and contradictions before code exists.
- While the design is written, reviews check that the structure can satisfy those needs.
- While code is written, unit tests check small pieces in isolation.
- As pieces are combined, integration tests check the boundaries. System tests then exercise the whole product. Acceptance, including alpha and beta, asks whether it is fit to ship.
- Stress and similar trials push the system past normal load before release. After deployment, checks confirm the live environment, and later maintenance re-runs tests as the system changes.

**Examples:**

```text
needs reviewed → design reviewed → unit tests
  → integration → system → acceptance → live checks
```

</details>

<details>
<summary>What are the different levels of software testing?</summary>

### What are the different levels of software testing?

**Definition:**

Testing levels are the scopes you check, from one function up to a user deciding the product is acceptable.

**How it works:**

- Unit tests cover one function or class, usually while it is being written, with dependencies replaced. They form the wide base of the test pyramid. JUnit, NUnit, and pytest are typical runners.
- Component tests check a larger unit, such as a service module, after the units inside it pass and before you wire it to the rest of the system.
- Integration tests check the interfaces between those parts. Failures here are contracts and wiring, not the arithmetic inside one function.
- System tests run the integrated product against its requirements, in an environment that resembles production.
- Acceptance tests ask whether the result meets the customer’s conditions. They sit at the narrow top of the pyramid.
- Alpha is that trial inside the organization. Beta is a limited trial with external users, often after an internal acceptance pass.

**Examples:**

A unit test calls `tax(100, 20)` and expects `20`. An integration test posts an order through the API and checks the row the database stored. A system test completes checkout in a browser.

</details>

<details>
<summary>Describe the difference between static and dynamic testing.</summary>

### Describe the difference between static and dynamic testing.

**Definition:**

Static testing examines artifacts without running them. Dynamic testing executes the software and compares what it does with what it should do.

**How it works:**

- Static work happens early: reviews of requirements and design, plus linters, type checkers, and other analyzers on the source. It can flag a missing requirement or a dangerous call that no test happens to execute.
- Dynamic work needs a build. Unit, integration, system, and acceptance tests are all dynamic. They show behavior, including paths the review did not imagine.
- Static analysis can tell you a line exists. Only execution tells you that line ran for a given input.
- Use both. A review will not catch a wrong tax rate that type-checks, and a test will not catch a requirement that was never written down.

**Examples:**

A linter rejecting `eval(userInput)` is static. A test that posts that input and expects the value to be stored as text is dynamic.

</details>

<details>
<summary>What is a test case, and what elements should it contain?</summary>

### What is a test case, and what elements should it contain?

**Definition:**

A test case is one documented check: the situation, the steps, and the result that would count as a pass.

**How it works:**

- Give it an id and a title so people can talk about it.
- State the purpose, the preconditions, and the steps that reproduce the situation.
- Write the expected result before you run it. The actual result is what happened, filled in during the run.
- Comments, the person responsible, and the last-updated time keep the case maintainable.
- An automated test is the same record in code: arrange, act, assert.

**Examples:**

```text
id: TAX-14
title: Tax is added once
precondition: a cart with one line of 100
steps: set the rate to 20% and request the total
expected: 120
```

</details>

<details>
<summary>Explain the concept of coverage in testing and the main types of coverage (e.g., line, branch, path, statement).</summary>

### Explain the concept of coverage in testing and the main types of coverage (e.g., line, branch, path, statement).

**Definition:**

Coverage measures how much of the program a test suite actually exercises. A high number is not the same as a meaningful test.

**How it works:**

- Statement coverage (often reported as line coverage) is the share of statements that ran at least once.
- Branch coverage asks whether each side of a decision ran, both the true and the false outcome of an `if`.
- Path coverage asks whether every route through the decisions ran. The number of paths grows quickly, so full path coverage is rarely practical.
- Two tests can hit the same lines with inputs that never threaten the bug you care about. Use coverage to find code that never runs, then decide which of that code needs a stronger assertion.

**Examples:**

```text
if (rate < 0) reject();
else total = price + price * rate;
```

A single call with `rate = 20` covers the `else` statement and misses the `reject` branch.

</details>

<details>
<summary>What is the difference between white-box, black-box, and grey-box testing?</summary>

### What is the difference between white-box, black-box, and grey-box testing?

**Definition:**

Black-box testing treats the system as a surface of inputs and outputs. White-box testing uses the internal structure. Grey-box testing uses a limited view of that structure.

**How it works:**

- Black-box cases come from requirements and from the behavior a user can observe. You do not need the source. Equivalence classes and boundary values are typical techniques.
- White-box cases come from the code: branches, loops, and error paths. They need the source and are what coverage tools measure.
- Grey-box testing sits between them. You might know the database schema or the API shape and still not step through every function. It is common for integration tests.
- The three answer different questions, so a change usually needs more than one of them.

**Examples:**

Black box: a total of 100 at 20% tax should display 120, whatever the formula is. White box: the negative-rate branch must call `reject`. Grey box: the order API must write one row with `total = 120`.

</details>

<details>
<summary>What is regression testing, and why is it performed?</summary>

### What is regression testing, and why is it performed?

**Definition:**

Regression testing re-checks behavior that already worked after a change, so a fix or a new feature does not break something else.

**How it works:**

- The trigger is a defect fix, a new feature, a refactor, or a dependency upgrade.
- A full regression runs the broad suite. It is the safest and the slowest.
- A selective regression runs the cases tied to the area that changed, plus a thin smoke pass over the rest.
- Unit tests in CI are the regression net that runs on every commit. Broader UI passes, often with a browser driver such as Selenium, run on a schedule or before release. The pipeline itself may be Jenkins, GitLab CI, or another runner.
- If the suite never fails, it is not protecting you. If it fails on irrelevant edits, it is too tightly bound to implementation details.

**Examples:**

After changing rounding, re-run the tax unit tests and one checkout flow. You do not need to re-test the password-reset screens unless the change touched shared code they use.

</details>

<details>
<summary>Explain unit testing and which tools you might use for it.</summary>

### Explain unit testing and which tools you might use for it.

**Definition:**

A unit test checks one small piece of behavior in isolation, fast enough to run on every change.

**How it works:**

- The unit does not talk to the real network, database, or clock. Those are replaced with fakes or stubs so a failure points at this unit.
- The same inputs must produce the same result, on every machine.
- Common runners are JUnit 5 and TestNG for Java, NUnit and xUnit for .NET, pytest and unittest for Python, Jest and Mocha for JavaScript, RSpec for Ruby, and GoogleTest for C++.
- Build tools (Maven, Gradle, npm) and CI (Jenkins, GitHub Actions) execute them. An IDE runs the same tests locally.
- JUnit organizes this with `@Test`, assertions such as `assertEquals`, and hooks: `@BeforeEach` / `@AfterEach` around every test, `@BeforeAll` / `@AfterAll` once per class.
- The suite documents the intended behavior and makes a refactor safer. It fails when coverage is wishful, when tests share global state, or when they duplicate one another without a new assertion.

**Examples:**

```java
@Test
void addsTaxOnce() {
    assertEquals(120, new Cart(100).total(20));
}
```

</details>

<details>
<summary>What is integration testing and what are its types?</summary>

### What is integration testing and what are its types?

**Definition:**

Integration testing checks that separately correct parts still work when they call each other.

**How it works:**

- The failures you want are wrong messages, mismatched types, bad error handling, and resource leaks at the boundary.
- Top-down starts at the user-facing entry and replaces modules that are not ready with stubs. Architectural mistakes show up early. The stubs are the extra work.
- Bottom-up starts at the leaves, with drivers calling them, and assembles upward. Real lower-level bugs surface before the UI exists.
- Sandwich, or middle-out, builds from a core in both directions so the middle is real while the ends are still stubbed.
- A hybrid slices the system vertically (one user path through every layer) or grows outward from a core area, then joins those slices.
- Big-bang, wiring everything at once, is the version that makes the first failure hard to attribute. Prefer it only when the pieces are tiny.

**Examples:**

Top-down: the checkout handler runs against a stub payment service that always approves. Bottom-up: the real payment client is called by a small driver before the handler exists.

</details>

<details>
<summary>What is system testing, and how does it differ from other types of testing?</summary>

### What is system testing, and how does it differ from other types of testing?

**Definition:**

System testing runs the finished, integrated product against its requirements, the way it will be used, rather than against one module.

**How it works:**

- A unit test isolates one piece and replaces its neighbors. A system test uses the real composition in an environment that matches production as closely as you can afford.
- Integration testing stops at “do these parts talk correctly?” System testing asks “does the whole product meet the specification?”
- Acceptance testing asks a stakeholder whether the product is fit for their goal. System testing is still the team’s check against requirements, even when no customer is in the room.
- Cases are end to end: a browser, the API, the database, and the external sandbox, not a mock of all of them.

**Examples:**

Place an order, pay with a sandbox card, and confirm the confirmation email and the stock decrement. That is a system test. Asking the merchant whether this flow is how they take payment is acceptance.

</details>

<details>
<summary>Define acceptance testing and describe its types.</summary>

### Define acceptance testing and describe its types.

**Definition:**

Acceptance testing decides whether the system is fit for the people who will use it or for the contract that ordered it. It is the last question before release, not another pass over individual functions.

**How it works:**

- Alpha runs inside the organization, with a controlled build, to find defects that block any external trial.
- Beta gives a limited external group the real product so you learn what the lab missed.
- User acceptance is performed by the customer or by people who represent them, against their scenarios.
- Contract acceptance checks the deliverable against a written agreement. It is common on government and client work.
- Regulation acceptance checks a legal or industry rule: health, finance, aviation.
- Operational acceptance checks that the system can be run: backups, monitoring, failover, and the procedures the operators will follow.

**Examples:**

A clinic confirming that a prescription flow meets its procedure is user acceptance. A checklist that backups restore and alerts fire is operational acceptance.

</details>

<details>
<summary>What are the benefits of test automation?</summary>

### What are the benefits of test automation?

**Definition:**

Test automation runs checks by machine so the same evidence can be produced on every change, without a person repeating the steps.

**How it works:**

- The run is the same every time, which removes missed steps and makes a failure attributable to the change rather than to the tester.
- Repetitive checks become cheap, so they can sit in CI and block a release. The setup cost is paid once.
- Reports name the failing assertion, and coverage tools show what never ran.
- Fast feedback lets the author fix the break while the change is still in their head. The same results are what the team looks at together.
- The pipeline, not a memory, decides that the suite ran before deploy.
- Automation does not replace judgment about what is worth asserting. It makes the assertions you chose repeatable.

**Examples:**

A pull request runs the unit suite and a handful of API checks. The merge waits on that result instead of on someone clicking through checkout again.

</details>

<details>
<summary>When would you choose not to automate test cases?</summary>

### When would you choose not to automate test cases?

**Definition:**

Leave a check manual when automating it would cost more than it can save, or when the thing you need to learn cannot be written as an assertion in advance.

**How it works:**

- A one-off scenario, a throwaway migration, or a check you will not run again is often faster by hand.
- Exploratory testing is a person looking for behavior you did not predict. Scripting the paths you already know is a different activity.
- A tiny or short-lived project may not recover the cost of the harness.
- Sensitive or regulated data sometimes cannot be placed in an automated fixture.
- A small localized fix can be confirmed with one manual pass if there is no suite around it yet.
- The durable approach is mixed: explore first, then automate the cases that are repeated and high-risk. Tools can record what the explorer saw, but the exploration itself stays human.

**Examples:**

Automate “tax on a 100 line is 20” because it will run on every commit. Do not automate a one-time visual check of a printed poster that will never be generated again.

</details>


### Test Design Techniques

<details>
<summary>What is equivalence partitioning in software testing?</summary>

### What is equivalence partitioning in software testing?

**Definition:**

</details>

<details>
<summary>Explain boundary value analysis with an example.</summary>

### Explain boundary value analysis with an example.

**Definition:**

</details>

<details>
<summary>What is state transition testing, and where is it useful?</summary>

### What is state transition testing, and where is it useful?

**Definition:**

</details>

<details>
<summary>Describe the concept of decision table testing.</summary>

### Describe the concept of decision table testing.

**Definition:**

</details>

<details>
<summary>What is pairwise testing, and what tools support this technique?</summary>

### What is pairwise testing, and what tools support this technique?

**Definition:**

</details>

<details>
<summary>How do you prioritize test cases in a test suite?</summary>

### How do you prioritize test cases in a test suite?

**Definition:**

</details>

<details>
<summary>Explain error guessing and its effectiveness.</summary>

### Explain error guessing and its effectiveness.

**Definition:**

</details>

<details>
<summary>What is exploratory testing, and how is it structured?</summary>

### What is exploratory testing, and how is it structured?

**Definition:**

</details>

<details>
<summary>Describe the use-cases for model-based testing.</summary>

### Describe the use-cases for model-based testing.

**Definition:**

</details>


### Test Management

<details>
<summary>What is a test plan, and what should it typically include?</summary>

### What is a test plan, and what should it typically include?

**Definition:**

</details>

<details>
<summary>Describe test strategy and its importance.</summary>

### Describe test strategy and its importance.

**Definition:**

</details>

<details>
<summary>Explain the concept of a test charter in exploratory testing.</summary>

### Explain the concept of a test charter in exploratory testing.

**Definition:**

</details>

<details>
<summary>What is a test data management process?</summary>

### What is a test data management process?

**Definition:**

</details>

<details>
<summary>Define risk-based testing and its benefits.</summary>

### Define risk-based testing and its benefits.

**Definition:**

</details>

<details>
<summary>How do you track and manage defects in software testing?</summary>

### How do you track and manage defects in software testing?

**Definition:**

</details>

<details>
<summary>What is the role of a test lead or test manager in a testing team?</summary>

### What is the role of a test lead or test manager in a testing team?

**Definition:**

</details>

<details>
<summary>Describe the challenges in test environment management.</summary>

### Describe the challenges in test environment management.

**Definition:**

</details>

<details>
<summary>What tools are available for test management, and how do they differ?</summary>

### What tools are available for test management, and how do they differ?

**Definition:**

</details>

<details>
<summary>Explain what a traceability matrix is and how it is used in testing.</summary>

### Explain what a traceability matrix is and how it is used in testing.

**Definition:**

</details>

<details>
<summary>What are the key metrics used to measure test progress and coverage?</summary>

### What are the key metrics used to measure test progress and coverage?

**Definition:**

</details>


### Automation Testing

<details>
<summary>What are the criteria to decide whether a test should be automated?</summary>

### What are the criteria to decide whether a test should be automated?

**Definition:**

</details>

<details>
<summary>Describe the Page Object Model in automated testing.</summary>

### Describe the Page Object Model in automated testing.

**Definition:**

</details>

<details>
<summary>Explain the advantages and disadvantages of record and playback in test automation.</summary>

### Explain the advantages and disadvantages of record and playback in test automation.

**Definition:**

</details>

<details>
<summary>What is continuous integration, and how does it relate to test automation?</summary>

### What is continuous integration, and how does it relate to test automation?

**Definition:**

</details>

<details>
<summary>Which automation testing tools are you familiar with, and what are their strengths?</summary>

### Which automation testing tools are you familiar with, and what are their strengths?

**Definition:**

</details>

<details>
<summary>What is keyword-driven testing, and how does it work?</summary>

### What is keyword-driven testing, and how does it work?

**Definition:**

</details>

<details>
<summary>How does test automation fit into a DevOps environment?</summary>

### How does test automation fit into a DevOps environment?

**Definition:**

</details>

<details>
<summary>What are the main challenges you have faced in test automation?</summary>

### What are the main challenges you have faced in test automation?

**Definition:**

</details>

<details>
<summary>Explain the use of assertions in automated tests.</summary>

### Explain the use of assertions in automated tests.

**Definition:**

</details>

<details>
<summary>What is data-driven testing, and how can it be implemented?</summary>

### What is data-driven testing, and how can it be implemented?

**Definition:**

</details>


### Performance Testing

<details>
<summary>What is performance testing, and how does it differ from functional testing?</summary>

### What is performance testing, and how does it differ from functional testing?

**Definition:**

</details>

<details>
<summary>Describe the subtypes of performance testing (e.g., load, stress, capacity).</summary>

### Describe the subtypes of performance testing (e.g., load, stress, capacity).

**Definition:**

</details>

<details>
<summary>What are the key performance testing metrics?</summary>

### What are the key performance testing metrics?

**Definition:**

</details>

<details>
<summary>Explain how to set up a performance test.</summary>

### Explain how to set up a performance test.

**Definition:**

</details>

<details>
<summary>What tools can be used for performance testing, and what factors influence their selection?</summary>

### What tools can be used for performance testing, and what factors influence their selection?

**Definition:**

</details>

<details>
<summary>What is a performance bottleneck, and how is it identified and addressed?</summary>

### What is a performance bottleneck, and how is it identified and addressed?

**Definition:**

</details>

<details>
<summary>Explain the performance testing lifecycle.</summary>

### Explain the performance testing lifecycle.

**Definition:**

</details>


### Security Testing

<details>
<summary>What is security testing and why is it important?</summary>

### What is security testing and why is it important?

**Definition:**

</details>

<details>
<summary>Describe common security threats that testing should address.</summary>

### Describe common security threats that testing should address.

**Definition:**

</details>

<details>
<summary>What is OWASP, and why is it significant in security testing?</summary>

### What is OWASP, and why is it significant in security testing?

**Definition:**

</details>

<details>
<summary>Explain SQL injection and how you test for it.</summary>

### Explain SQL injection and how you test for it.

**Definition:**

</details>

<details>
<summary>How do you perform authentication and authorization checks in security testing?</summary>

### How do you perform authentication and authorization checks in security testing?

**Definition:**

</details>

<details>
<summary>What tools can be used for security testing?</summary>

### What tools can be used for security testing?

**Definition:**

</details>

<details>
<summary>What is penetration testing, and how is it executed?</summary>

### What is penetration testing, and how is it executed?

**Definition:**

</details>

<details>
<summary>What is the role of encryption and secure communication in testing?</summary>

### What is the role of encryption and secure communication in testing?

**Definition:**

</details>


### Mobile and Web Application Testing

<details>
<summary>How does mobile application testing differ from desktop application testing?</summary>

### How does mobile application testing differ from desktop application testing?

**Definition:**

</details>

<details>
<summary>Explain different types of mobile application testing, such as native, web, and hybrid.</summary>

### Explain different types of mobile application testing, such as native, web, and hybrid.

**Definition:**

</details>

<details>
<summary>What emulators are available for mobile testing, and when would you use real devices?</summary>

### What emulators are available for mobile testing, and when would you use real devices?

**Definition:**

</details>

<details>
<summary>What is responsive testing, and how is it conducted?</summary>

### What is responsive testing, and how is it conducted?

**Definition:**

</details>

<details>
<summary>Describe challenges unique to mobile application testing.</summary>

### Describe challenges unique to mobile application testing.

**Definition:**

</details>

<details>
<summary>What is cross-browser testing?</summary>

### What is cross-browser testing?

**Definition:**

</details>

<details>
<summary>What are the key areas to focus on in web application testing?</summary>

### What are the key areas to focus on in web application testing?

**Definition:**

</details>


### Test Automation Frameworks

<details>
<summary>What is a test automation framework?</summary>

### What is a test automation framework?

**Definition:**

</details>

<details>
<summary>Describe different types of test automation frameworks (e.g., data-driven, keyword-driven, hybrid, modular).</summary>

### Describe different types of test automation frameworks (e.g., data-driven, keyword-driven, hybrid, modular).

**Definition:**

</details>

<details>
<summary>What considerations are involved in choosing a test automation framework?</summary>

### What considerations are involved in choosing a test automation framework?

**Definition:**

</details>

<details>
<summary>How can you ensure maintainability of an automation framework?</summary>

### How can you ensure maintainability of an automation framework?

**Definition:**

</details>

<details>
<summary>How is reporting implemented in automation frameworks?</summary>

### How is reporting implemented in automation frameworks?

**Definition:**

</details>


### API Testing

<details>
<summary>What is API testing, and why is it important?</summary>

### What is API testing, and why is it important?

**Definition:**

</details>

<details>
<summary>How do you approach testing RESTful APIs?</summary>

### How do you approach testing RESTful APIs?

**Definition:**

</details>

<details>
<summary>Explain how to test SOAP-based web services.</summary>

### Explain how to test SOAP-based web services.

**Definition:**

</details>

<details>
<summary>What kind of tests would you write for an API?</summary>

### What kind of tests would you write for an API?

**Definition:**

</details>

<details>
<summary>Describe how to use Postman for API testing.</summary>

### Describe how to use Postman for API testing.

**Definition:**

</details>

<details>
<summary>What is contract testing, and which tools support this type of API testing?</summary>

### What is contract testing, and which tools support this type of API testing?

**Definition:**

</details>


### Quality Assurance Processes

<details>
<summary>What is quality assurance, and how does it differ from testing?</summary>

### What is quality assurance, and how does it differ from testing?

**Definition:**

</details>

<details>
<summary>Describe the QA process in agile development.</summary>

### Describe the QA process in agile development.

**Definition:**

</details>

<details>
<summary>Explain the role of a QA engineer in a scrum team.</summary>

### Explain the role of a QA engineer in a scrum team.

**Definition:**

</details>

<details>
<summary>What quality metrics are important for a software project?</summary>

### What quality metrics are important for a software project?

**Definition:**

</details>

<details>
<summary>How do you establish a QA process in an organization that has none?</summary>

### How do you establish a QA process in an organization that has none?

**Definition:**

</details>


### Advanced Testing Topics

<details>
<summary>What are the emerging trends in software testing, such as AI and ML applications?</summary>

### What are the emerging trends in software testing, such as AI and ML applications?

**Definition:**

</details>

<details>
<summary>How do you handle testing in a continuous delivery environment?</summary>

### How do you handle testing in a continuous delivery environment?

**Definition:**

</details>

<details>
<summary>Describe the concept of shift-left testing.</summary>

### Describe the concept of shift-left testing.

**Definition:**

</details>

<details>
<summary>What is chaos engineering, and how do you apply it?</summary>

### What is chaos engineering, and how do you apply it?

**Definition:**

</details>

<details>
<summary>Explain the role of virtualization in software testing.</summary>

### Explain the role of virtualization in software testing.

**Definition:**

</details>


### Behavioral Testing Questions

<details>
<summary>How do you stay updated about new testing technologies and practices?</summary>

### How do you stay updated about new testing technologies and practices?

**Definition:**

</details>

<details>
<summary>Describe a situation where you had to meet a tight deadline for testing. How did you handle it?</summary>

### Describe a situation where you had to meet a tight deadline for testing. How did you handle it?

**Definition:**

</details>

<details>
<summary>How do you handle disagreements with developers regarding bugs or software issues?</summary>

### How do you handle disagreements with developers regarding bugs or software issues?

**Definition:**

</details>

<details>
<summary>Can you explain your approach to testing a feature with unclear requirements?</summary>

### Can you explain your approach to testing a feature with unclear requirements?

**Definition:**

</details>

<details>
<summary>Describe a particularly challenging bug or issue you've had to deal with.</summary>

### Describe a particularly challenging bug or issue you've had to deal with.

**Definition:**

</details>


### Situation-based Testing Questions

<details>
<summary>How would you test an ATM machine as an end-user?</summary>

### How would you test an ATM machine as an end-user?

**Definition:**

</details>

<details>
<summary>Imagine you have a website that is experiencing performance issues. How would you test to find the cause?</summary>

### Imagine you have a website that is experiencing performance issues. How would you test to find the cause?

**Definition:**

</details>

<details>
<summary>Given an e-commerce application, how would you carry out security testing?</summary>

### Given an e-commerce application, how would you carry out security testing?

**Definition:**

</details>

<details>
<summary>How would you approach testing a new software application with no documentation available?</summary>

### How would you approach testing a new software application with no documentation available?

**Definition:**

</details>

<details>
<summary>Describe how you would test a new feature that interacts with multiple systems.</summary>

### Describe how you would test a new feature that interacts with multiple systems.

**Definition:**

</details>


### Technical Testing Questions

<details>
<summary>Write a basic SQL query to fetch records from a customer table where the customer's age is more than 30 years.</summary>

### Write a basic SQL query to fetch records from a customer table where the customer's age is more than 30 years.

**Definition:**

</details>

<details>
<summary>Given a function that calculates the nth Fibonacci number, how would you test it?</summary>

### Given a function that calculates the nth Fibonacci number, how would you test it?

**Definition:**

</details>
