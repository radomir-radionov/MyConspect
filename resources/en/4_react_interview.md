# React — Interview

React interview questions. Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./4_react.md)

### Related docs

- [React — Core](./4_react_core.md) · [React — Hooks](./4_react_hooks.md) · [React — React 19](./4_react_server.md) · [React — Ecosystem](./4_react_ecosystem.md) · [React — Redux](./4_react_redux.md) · [React — TanStack](./4_react_tanstack.md) · [React — Interview](./4_react_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — React](https://devinterview.io/questions/web-and-mobile-development/react-interview-questions/).

### React Basics

<details>
<summary>What is React and why is it used?</summary>

### What is React and why is it used?

**Definition:**

- **React**: Modern Definition (2026)

React is a declarative, component-based library for building user interfaces. As of 2026, it is governed by the React 19+ paradigm, emphasizing Concurrent Rendering, Server Components, and Actions.

**How it works:**

#### Core Architectural Concepts

#### Concurrent Rendering & Virtual DOM

While React still utilizes a Virtual DOM for reconciliation, the 2026 standard emphasizes Concurrent React. This allows React to prepare multiple versions of the UI simultaneously without blocking the main thread. By prioritizing updates (e.g., input typing over data fetching), React achieves better responsiveness. The diffing algorithm maintains O(n) complexity through heuristic assumptions, optimized for modern browser engines.

#### Functional Components & Hooks (The Standard)

Class Components are effectively legacy. Modern development exclusively uses Functional Components.

- **Hooks**: The standard mechanism for state (useState), side effects (useEffect), and memoization (useMemo, useCallback).

- **React 19 Features**: The introduction of the use hook and automatic transitions has replaced much of the boilerplate previously required for data fetching.

#### Server Components (RSC)

The architectural divide between Client Components and Server Components is fundamental. Server Components execute exclusively on the server, sending rendered UI to the client. This reduces bundle size significantly, as component-level logic and dependencies remain on the server, shipping zero-kilobyte JavaScript to the browser for static portions of the UI.

#### Unidirectional Data-Flow & Server Actions

Data remains strictly one-way (parent-to-child). However, Server Actions have replaced the traditional pattern of fetching data via useEffect + useState. Actions allow you to call server-side functions directly from UI elements (e.g., forms), integrating mutation logic directly into the component lifecycle.

#### JSX: Transpilation to React Elements

JSX remains the syntax extension for JavaScript. In modern build tools (e.g., Vite, Rspack), JSX is transformed into _jsx runtime calls, optimized for the specific rendering target (Client vs. Server).

**When to use:**

#### Why use React in 2026?

- **Server-Side First**: Modern frameworks (e.g., Next.js, Remix) built on React leverage React Server Components (RSC) for superior SEO and performance metrics.

- **Declarative UI**: By defining UI as a function of state ($UI = f(state)$), React simplifies state transitions and ensures predictable rendering.

- **The Ecosystem**: 2026 React is part of a massive ecosystem including TanStack (Query/Router), Zustand (State), and Tailwind CSS, providing a standardized path for enterprise-grade scalability.

- **Type Safety**: First-class support for TypeScript is now the baseline. Prop definitions and state types are strictly enforced during the build process, minimizing runtime errors.

**Examples:**

#### Modern Code Example (React 19+)

The following snippet demonstrates the shift toward useActionState and modern functional patterns, replacing legacy class-based state management.

```tsx
'use client'; // Required for interactivity in RSC environments

import { useActionState } from 'react';

// Modern approach: Server Actions integration
async function incrementCounter(previousState, formData) {
  return previousState + 1;
}

export default function Counter() {
  const [state, action, isPending] = useActionState(incrementCounter, 0);

  return (
    <form action={action}>
      <button type="submit" disabled={isPending}>
        Clicked {state} times
      </button>
    </form>
  );
}
```

- **Audit Note**: The Class-based component example in the original content is now considered an anti-pattern. New projects must utilize functional patterns to leverage Suspense and Streaming SSR capabilities inherent in the modern React pipeline.

**Sources:**

- https://devinterview.io/questions/web-and-mobile-development/react-interview-questions/
</details>

<details>
<summary>How is React different from Angular or Vue?</summary>

### How is React different from Angular or Vue?

**Definition:**

#### Architectural Paradigm

- **React (19)**: A library for building user interfaces using a Causal Decoder-only conceptual model for rendering. It emphasizes functional programming paradigms via Hooks and the React Compiler (automatic memoization).

- **Angular (v19+)**: A platform utilizing a Signals-based reactivity system (replacing legacy Zone.js change detection). It mandates a strict Dependency Injection architecture.

- **Vue.js (3.x/4)**: A progressive framework utilizing a Proxy-based reactivity system. It bridges the gap between React’s composability and Angular’s template-first DX.

**How it works:**

#### Learning Curve

- **React**: Steepened in 2026 due to the required mastery of Server Components (RSC), Suspense, and the transition to native asynchronous patterns.

- **Angular**: Flattened by Standalone Components, removing the necessity for NgModules which previously burdened beginners.

- **Vue.js**: Remains the most accessible due to the Composition API and its similarity to standard Web Components.

#### Performance & Rendering

- **React**: Shifted toward Server-Side Rendering (SSR) and Partial Hydration. Complexity of re-renders: O(n) where n is the number of component nodes; optimized via the React Compiler to minimize unnecessary diffing.

- **Angular**: The Signals API allows for granular updates (O(1) component updates) by tracking state dependencies directly rather than diffing the entire component tree.

- **Vue.js**: Highly performant through Virtual DOM combined with Static Hoisting and Patch Flags, allowing the compiler to optimize dynamic content patching at O(m) where m is the number of dynamic nodes.

#### State Management

- **React**: Canonical approach is Server Actions and React Query (TanStack) for server state; Zustand or Context for client state. setState is effectively superseded by useActionState and useOptimistic hooks.

- **Angular**: RxJS is now optional in favor of Signals, which provide a more ergonomic, imperative-like syntax for reactive state without the complexity of streams.

- **Vue.js**: Pinia is the official standard, replacing Vuex. It is built natively for TypeScript and provides a modular, lightweight store architecture.

#### Templating & Composition

- **React**: JSX remains the industry standard. The trend is moving toward Server Components, where logic and UI are unified to reduce client-side bundle size.

- **Angular**: Uses Template Syntax with structural directives. The recent introduction of Control Flow (@if, @for) has replaced *ngIf and *ngFor for better type safety and performance.

- **Vue.js**: Single-File Components (SFCs) using <script setup> syntax are the industry best practice, offering the tightest integration between template logic and reactive state.

#### Tooling & Language Support

- **React**: TypeScript is ubiquitous. Tooling is highly dependent on the meta-framework (e.g., Next.js or Remix), which manages the LSP and build pipeline.

- **Angular**: Angular Language Service remains the gold standard for enterprise-grade IDE support, providing deep type-checking across templates and controllers.

- **Vue.js**: Volar (Vue Language Tools) provides best-in-class support for TypeScript inference within SFCs, often outperforming JSX-based tooling in template type-checking precision.

**Sources:**

- https://devinterview.io/questions/web-and-mobile-development/react-interview-questions/
</details>

<details>
<summary>What is a React component?</summary>

### What is a React component?

**Definition:**

#### React Component Definition (2026 Standard)

A React component is the fundamental building block of modern React applications, encapsulating UI logic and structure. In the current ecosystem (React 19+), components are defined as function components. While class components remain technically supported for legacy compatibility, they are considered deprecated architectural patterns in favor of functional paradigms.

**How it works:**

#### Function Components vs. Legacy Class Components

- **Function Components**: The industry standard. These are JavaScript functions that accept props as an argument and return UI elements. They leverage Hooks to manage state, context, and side effects.

- **Class Components**: Legacy structures that use ES6 classes extending React.Component. These are now discouraged due to increased bundle sizes and complexities regarding this binding and lifecycle fragmentation.

#### JSX and Modern Rendering

- **JSX**: A syntax extension to JavaScript that allows UI markup to be written within code. As of React 19, the React.createElement transformation is largely optimized by modern compilers (like SWC or Babel), transpiling JSX directly into highly performant virtual DOM nodes.

- **Server Components (RSC)**: The 2026 standard dictates that components are now differentiated by their execution environment. Server Components run exclusively on the server, reducing client-side bundle size, while Client Components handle interactivity via hooks.

#### Structural Coherence

React applications maintain a hierarchical tree structure. The entry point (e.g., createRoot) initiates the tree, which propagates updates through Concurrent Rendering. This allows React to prioritize urgent updates (like user input) over transitionary background tasks, improving perceived performance.

#### Data Flow and State Management

React enforces unidirectional data flow. Data (props) flows strictly from parent to child.

- **Props**: Immutable data passed down the component tree.

- **State**: Reactive data managed via useState or useReducer. In modern React, state updates trigger a re-render cycle where React computes the "diff" between the previous and current Virtual DOM, applying only necessary patches (O(n) complexity).

- **State Synchronization**: Modern state management often moves beyond simple props drilling, utilizing useContext or external reactive stores (e.g., Zustand, TanStack Query) to facilitate cross-tree data access without performance bottlenecks.

#### Lifecycle Operations: The Hook Paradigm

Lifecycle methods (componentDidMount, etc.) have been superseded by the useEffect hook and the broader Effect API.

- **Declarative Synchronization**: Instead of imperative lifecycle hooks, modern components synchronize with external systems using declarative dependencies.

- **Suspense & Transitions**: React 19+ handles "loading" states and complex data fetching via <Suspense> boundaries. Rather than manually managing "mounting" status, components define their loading state declaratively, leading to a smoother user experience in data-intensive applications.

- **Architectural Note**: As of 2026, the focus has shifted from "lifecycle management" to "synchronization with external state," prioritizing Composition over the inheritance models used in older class-based designs.

**Sources:**

- https://devinterview.io/questions/web-and-mobile-development/react-interview-questions/
</details>

<details>
<summary>How do you create a component in React?</summary>

### How do you create a component in React?

**Definition:**

#### Component Architecture in React (2026 Standards)

Modern React development strictly prioritizes Functional Components using Hooks. While Class-based components remain supported for legacy compatibility, they are considered an anti-pattern in new feature development due to higher memory overhead and complex this binding behaviors.

**How it works:**

#### Modern Implementation

Functional components leverage Hooks (e.g., useState, useEffect) to manage state and side effects, replacing the legacy lifecycle methods (componentDidMount, componentWillUnmount).

#### Functional Component Example (React 19+)

- **Note**: The use of TypeScript is the industry standard for 2026, providing static type checking for props and return types.

#### Modern State and Lifecycle Management

In 2026, the industry has transitioned away from manual lifecycle management toward declarative synchronization.

- **Hooks**: Logic is encapsulated in custom hooks, increasing reusability and testability compared to class methods.

- **Server Components**: For performance optimization, components can now execute on the server, reducing the client-side JavaScript bundle size.

- **Concurrency**: React 19 features, such as useTransition and useActionState, allow for non-blocking UI transitions and seamless form state management.

#### Development Standards: Linting and Formatting

Modern ecosystems rely on ESLint (Flat Config) and Biome or Prettier to enforce code quality.

- **TypeScript Integration**: Strict mode is mandated to ensure type safety, reducing runtime errors.

- **Component Composition**: Architecture patterns favor Composition over Inheritance. Complex behaviors are abstracted into reusable Hooks rather than High-Order Components (HOCs) or Render Props.

- **Modern Formatting**: The Airbnb style guide has largely been superseded by community-driven standards that emphasize readability and zero-config setups (e.g., Vite/Turbopack ecosystems).

#### Technical Audit Summary

| Feature | Legacy Status | 2026 Standard |
| --- | --- | --- |
| Component Type | Class-based | Functional (Hooks) |
| Type Checking | PropTypes | TypeScript (Interface/Types) |
| Data Fetching | componentDidMount | use API / TanStack Query |
| Rendering | Client-Side (CSR) | Server Components (RSC) / Streaming |

#### Key Takeaways

Functional Components are the standard; avoid classes in new architecture.
TypeScript is essential for maintaining large-scale codebases.
Composition is the primary mechanism for logic reuse; prioritize Custom Hooks.
Performance is optimized via Server Components and concurrent rendering features.

**Examples:**

```tsx
// React 19 no longer requires explicit 'import React' for JSX
const Greeting = ({ name }: { name: string }) => {
  return <h1>Hello, {name}!</h1>;
};

export default Greeting;
```

**Sources:**

- https://devinterview.io/questions/web-and-mobile-development/react-interview-questions/
</details>

<details>
<summary>What is JSX and why do we use it in React?</summary>

### What is JSX and why do we use it in React?

**Definition:**

#### JSX in React 19+

JSX (JavaScript XML) is a syntax extension for JavaScript that provides a declarative way to describe the UI structure. While it resembles HTML, it is a syntactic sugar for function calls that compile into the React element tree.

**How it works:**

#### Technical Foundations

- **Syntactic Sugar**: JSX is not HTML; it is an abstraction over React.createElement (or the newer jsx() transform introduced in React 17+).

- **Expression Embedding**: Developers can embed arbitrary JavaScript expressions within curly braces {}. The React runtime handles the evaluation and injection of these expressions into the VDOM.

- **Transpilation**: Modern build tools (Vite, SWC, or Babel) transform JSX into standard JavaScript during the build phase. SWC, written in Rust, is the 2026 standard for high-performance JSX transpilation.

#### Key Features

- **Declarative UI**: By aligning code structure with the DOM hierarchy, JSX reduces cognitive load, mapping component logic directly to the rendered output.

- **Type-Safe Elements**: When coupled with TypeScript, JSX provides full type inference for component props, ensuring that the interface contracts are enforced during the compilation phase (O(n) complexity for type checking against the component's signature).

- **Component Composition**: JSX facilitates the composition of complex UIs by allowing the nesting of custom components just like standard intrinsic elements.

#### Benefits of Modern JSX

- **Performance Optimization**: React 19’s compiler can perform advanced memoization and hoisting optimizations directly on JSX structures, reducing the overhead of re-renders.

- **Developer Experience (DX)**: IDEs (VS Code/Cursor) utilize the JSX structure to provide robust IntelliSense, refactoring capabilities, and real-time linting.

- **Reduced Boilerplate**: JSX eliminates the verbosity of manual functional calls, replacing deeply nested React.createElement chains with readable, declarative trees.

**When to use:**

#### Why Use JSX in 2026?

- **Ecosystem Alignment**: The entire React ecosystem (Server Components, Suspense, Hooks) is built around JSX. Deviating from JSX restricts access to the latest framework features and community-maintained UI libraries.

- **Compile-Time Verification**: JSX allows build tools to detect missing props or invalid tag structures before the code ever reaches the browser, drastically reducing runtime errors.

- **Declarative Consistency**: JSX provides a unified language for both Client Components and React Server Components (RSC), allowing for a seamless transition between server-side rendering and client-side interactivity.

- **Tooling Optimization**: The 2026 build stack is optimized specifically for JSX. Using JSX allows tools like the React Compiler to analyze your component graph statically, resulting in significant runtime performance gains compared to non-JSX approaches.

**Examples:**

#### Code Example: JSX and Transpiled Output

#### JSX (React 19 syntax)

```js
// Direct usage of the new JSX transform
const element = <h1 className="title">Hello, World!</h1>;
```

#### Transpiled JavaScript (React 19 Runtime)

```js
import { jsx as _jsx } from "react/jsx-runtime";

// The modern transform removes the need to import 'React' in every file
const element = _jsx("h1", { className: "title", children: "Hello, World!" });
```

**Sources:**

- https://devinterview.io/questions/web-and-mobile-development/react-interview-questions/
</details>

<details>
<summary>Can you explain the virtual DOM in React?</summary>

### Can you explain the virtual DOM in React?

**Definition:**

- **Virtual DOM**: 2026 Technical Audit

The Virtual DOM (VDOM) remains a fundamental architectural pattern in React, though its implementation has evolved significantly with the introduction of React Fiber and concurrent rendering primitives. It serves as a declarative blueprint for the UI, allowing React to decouple UI state from expensive imperative browser DOM manipulations.

**How it works:**

#### Refined Mechanism

- **Initial Rendering**: React creates a Fiber tree, a internal data structure representing the component tree. Each Fiber node corresponds to a React component or DOM element, holding state, props, and side effects.

- **Reconciliation (The Diffing Algorithm)**: When state updates occur, React triggers a re-render. It performs a tree comparison between the current Fiber tree and the new structure. React uses a heuristic O(n) algorithm, assuming that components of the same type produce similar trees, to minimize computational overhead.

- **Fiber Architecture**: Unlike older versions, the 2026 reconciliation process is incremental and interruptible. React can pause, abort, or reuse work on the component tree to prioritize urgent updates (e.g., user input) over background tasks (e.g., data fetching), maintaining high frame rates.

- **Batched Transitions**: React 19+ utilizes useTransition and useDeferredValue to categorize updates. State changes are grouped into transitions, ensuring that lower-priority updates do not block the main thread, effectively decoupling logic from rendering.

- **Commit Phase**: Once reconciliation is complete, React enters the "Commit Phase." Here, it applies changes to the actual DOM in a single pass. By batching these operations, React minimizes layout thrashing and forced synchronous reflows.

- **Concurrent Rendering**: Modern React renders components "concurrently," meaning multiple versions of the UI can be prepared in memory simultaneously. The VDOM acts as a scratchpad where React experiments with changes before "committing" them to the screen, providing a seamless transition between states.

- **Declarative DOM Abstraction**: Direct DOM manipulation (e.g., document.getElementById) is considered an anti-pattern. React provides useRef for necessary imperative escapes, but the VDOM ensures that the source of truth remains within the React component lifecycle, preventing synchronization desyncs.

- **Universal Reconciliation**: The VDOM is platform-agnostic. While react-dom handles browser-specific updates, the reconciliation logic is reused by react-native (via native bridge) and react-three-fiber (via custom renderers), providing a consistent declarative API across platforms.

#### Performance Complexity

The efficiency of the VDOM is rooted in:

- **Heuristic Diffing**: Reduces tree comparison from O(n^3) to O(n) by utilizing key properties on lists and component type comparisons.

- **Batching**: Reduces the constant factor of DOM writes, which are typically O(DOM nodes changed), by grouping them into a single browser reflow cycle.

**Sources:**

- https://devinterview.io/questions/web-and-mobile-development/react-interview-questions/
</details>

<details>
<summary>What are the differences between a class component and a functional component?</summary>

### What are the differences between a class component and a functional component?

**Definition:**

- **Technical Audit**: Component Architecture (2026 Standards)

In 2026, Functional Components are the industry standard for all new development. Class Components are considered legacy and should be avoided in modern React 19+ applications.

**How it works:**

#### Core Distinctions

#### Class Components (Legacy)

Defined by extending React.Component or React.PureComponent.
Relies heavily on the this keyword, which often leads to complex binding issues.
Encapsulates state in an object-based this.state.
Uses imperative lifecycle methods (e.g., componentDidMount, componentDidUpdate).

#### Functional Components (Modern)

Defined as pure JavaScript functions.
Stateless by nature but achieve state/effect persistence via Hooks.
Eliminates the this binding overhead.
Optimized for modern compiler features like React Forget (Automatic Memoization).

#### Detail Evaluation

#### Code Structure

- **Class Components**: Requires a render() method returning JSX. Complex components often result in "wrapper hell" due to the limitations of inheritance and Higher-Order Components (HOCs).

- **Functional Components**: Direct return of JSX. Employs Composition and Custom Hooks to extract logic, resulting in a cleaner, flatter component tree.

#### Editable State

- **Class Components**: this.setState() triggers a shallow merge.

- **Functional Components**: useState and useReducer allow for granular state updates. In 2026, state is typically treated as immutable, often managed via deep-comparable structures or reactive primitives.

#### Lifecycle Methods vs. Synchronization

- **Class Components**: Lifecycle methods are imperative and grouped by timing (Mount, Update, Unmount). This often leads to fragmented logic, where related code is spread across multiple methods.

- **Functional Components**: The useEffect hook enables synchronization logic. By focusing on state dependencies rather than lifecycle events, the code remains highly cohesive.

- **Note**: useEffect is increasingly replaced by specialized hooks or server-side primitives in React 19+.

#### Context and State Management

- **Class Components**: Consumed via static contextType (limited to one context) or Render Props.

- **Functional Components**: useContext hook allows multiple context consumptions. Compatible with modern state stores like Zustand, Valtio, or React Query, which leverage hooks for seamless reactivity.

#### Adoption and Transition

- **React 19/20 Shift**: Modern React emphasizes Server Components (RSC). Functional Components are now the execution unit for both Server and Client-side rendering.

- **Performance**: Functional components perform better with the React Compiler, which automatically memoizes components, a feat difficult to achieve with complex class hierarchies.

- **Maintenance**: Migrating legacy classes to functional components is the recommended path to reduce technical debt and unlock features like Concurrent Rendering and Streaming SSR.

#### Key Takeaways

#### Class Components

Deprecated pattern; rely on this context.
Heavyweight, imperative, and verbose.
Restrictive composition patterns.

#### Functional Components

Standardized since React 16.8; mandatory for modern paradigms (RSC).
Lean, declarative, and highly reusable.
Deeply integrated with the React ecosystem and performance-optimizing compilers.

**When to use:**

#### Purpose and Use-Cases

- **Class Components**: Exists strictly for maintenance of legacy codebases (pre-React 16.8).

- **Functional Components**: The primary building block. Encourages the "Single Responsibility Principle" through Hook composition.

**Sources:**

- https://devinterview.io/questions/web-and-mobile-development/react-interview-questions/
</details>

<details>
<summary>How do you handle events in React?</summary>

### How do you handle events in React?

**Definition:**

#### Handling Events in React (2026 Standards)

React handles events via SyntheticBaseEvent, a cross-browser wrapper around the native browser event. This abstraction ensures consistent interface behavior across environments (DOM, React Native) and provides performance optimizations.

**How it works:**

#### Synthetic Events

React normalizes events so that they have the same properties across all browsers. As of React 19, synthetic events are not pooled, eliminating the need to call event.persist() to access event properties asynchronously.

#### Event Subscription

- **Naming Conventions**: React uses camelCase for event handlers (e.g., onClick, onKeyDown) instead of the native HTML lowercase (e.g., onclick).

- **Function References**: You pass a function as the event handler rather than a string.

- **Modern Syntax**: Class components are legacy. Modern development utilizes Functional Components with Hooks.

#### Modern Event Handling: Functional Components

In 2026, state is managed via useState. Binding in constructors is unnecessary, and the use of useCallback is recommended to prevent unnecessary re-renders of child components receiving event handlers.

#### Key Architectural Updates (2026)

- **Event Delegation**: React 19 continues to attach event listeners to the root container rather than individual DOM nodes, reducing memory overhead to O(1) relative to total interactive elements.

- **TypeScript Integration**: Strictly typed ChangeEvent and FormEvent objects replace the generic event type, ensuring type safety in the event pipeline.

- **Transition API**: For non-urgent updates (e.g., filtering a large list), useTransition should be used to prevent event handlers from blocking the main thread, maintaining a UI responsiveness complexity of O(1) for input latency.

**Examples:**

#### Code Example: Functional Component Pattern (React 19)

```tsx
import { useState, useCallback, FormEvent, ChangeEvent } from 'react';

export default function Form() {
  const [value, setValue] = useState<string>('');

  // useCallback optimizes performance by memoizing the handler reference
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitted:', value);
  }, [value]);

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name-input">Name:</label>
      <input 
        id="name-input"
        type="text" 
        value={value} 
        onChange={handleChange} 
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Sources:**

- https://devinterview.io/questions/web-and-mobile-development/react-interview-questions/
</details>

<details>
<summary>What are state and props in React?</summary>

### What are state and props in React?

**Definition:**

#### Data Management in React (2026 Standards)

In modern React (v19+), props and state remain the fundamental primitives for data propagation and UI synchronization. React's architecture follows a unidirectional data flow where data typically moves from parent to child via props, while state remains localized to the component or lifted to shared ancestors.

**How it works:**

#### Role & Lifecycle

- **Props (Properties)**: Immutable data objects passed from a parent component to a child. They serve as the component’s configuration. A component must be pure with respect to its props; it should never modify its own props, as they are managed by the parent.

- **State**: Local, mutable data storage within a component. Updating state via the setter function (e.g., useState dispatch) schedules a re-render of the component tree to reflect the new state.

#### Strategic Selection

- **Props**: Use for data transmission, configuration, and event callbacks. Props act as the "API" of a component.

- **State**: Use for data that changes over the component’s lifecycle—such as user inputs, server-side response buffers, or ephemeral UI toggles. With the rise of Server Components in React 19, state is minimized in favor of streaming data directly from the server.

#### Management & Performance

- **Re-rendering**: React uses a Fiber reconciliation algorithm. Updating state triggers a sub-tree render. In 2026, we avoid manual optimization like shouldComponentUpdate (deprecated for functional components). Instead, we utilize useMemo, useCallback, and the memo Higher-Order Component to prevent unnecessary re-computations.

- **State Hoisting**: When multiple components share state, "lift" the state to the nearest common ancestor.

- **Composition**: Rather than deep prop-drilling, use React Context or Server Components to inject data into sub-trees.

#### Unifying with Hooks and Server Components

- **Functional Components**: The industry standard. Class components are legacy and should not be used in new projects.

- **React 19 Context**: The use hook has modernized how we consume Promises and Context, allowing for cleaner asynchronous state resolution within components.

- **Server Components**: By default, components in the App Router architecture are Server Components. They do not support hooks like useState. State is relegated to Client Components explicitly marked with the "use client" directive.

#### Complexity Analysis

- **Rendering Complexity**: Given n nodes in a component sub-tree, a state update has a time complexity of O(n) in the worst case, as React must perform reconciliation (diffing) to determine DOM patches.

- **Optimization**: Using memo reduces the branching factor of the reconciliation process, effectively pruning sub-trees that do not require re-evaluation, optimizing performance towards O(k) where k is the number of changed nodes.

**Examples:**

#### Code Example: Modernized State and Props

```tsx
'use client';

import React, { useState, memo } from 'react';

// Use memo to prevent unnecessary re-renders of stable children
const Button = memo(({ text, color, onClick }) => {
  return (
    <button style={{ backgroundColor: color }} onClick={onClick}>
      {text}
    </button>
  );
});

const ColorPicker = () => {
  const [color, setColor] = useState('blue');

  // useCallback is omitted here for brevity, 
  // but recommended for complex prop-drilling scenarios.
  return (
    <div>
      <p>Current Color: {color}</p>
      <Button text="Red" color="red" onClick={() => setColor('red')} />
      <Button text="Blue" color="blue" onClick={() => setColor('blue')} />
    </div>
  );
};

export default ColorPicker;
```

**Sources:**

- https://devinterview.io/questions/web-and-mobile-development/react-interview-questions/
</details>

<details>
<summary>How do you pass data between components in React?</summary>

### How do you pass data between components in React?

**Definition:**

#### Data Propagation in React (2026)

Data propagation in React (v19+) adheres to the core principle of unidirectional data flow. While the fundamentals of Props and Callbacks remain, modern React emphasizes Server Components, Context API, and Signals (or state management libraries) to mitigate "prop drilling."

**How it works:**

#### Mechanism 1: Unidirectional Props

Props facilitate parent-to-child communication. In React 19, props are now treated as standard stable arguments to component functions, eliminating the need for React.FC wrapper types, which are now largely considered boilerplate.

#### Mechanism 2: Callback Functions

Data moves up the tree when children invoke functions passed down as props. These functions typically trigger dispatch actions or state setters (e.g., useState, useActionState).

- **Best Practices**: 2026 Standards

- **Component Definition**: Prefer standard function declarations over React.FC.

- **Type Safety**: Use interface or type for props, favoring discriminated unions for complex state transitions.

- **Prop Drilling Mitigation**: For deep tree propagation, use the Context API or Signals to bypass intermediary components.

- **Composition**: Use the children prop (or slot patterns) to compose components, reducing the need to pass data through multiple layers.

#### Complexity Analysis

For a tree of depth d and branching factor b, passing props through every layer incurs:

- **Time Complexity**: O(1) per prop transfer.

- **Maintenance Complexity**: O(d) for refactoring.

Using Context API reduces maintenance complexity to O(1) for leaf node access, effectively decoupling the intermediate nodes from the data propagation logic.

**Examples:**

#### Modernized Code Example: State Synchronization

In this 2026-compliant implementation, App maintains the state, and DropDown notifies the parent of changes via a callback, maintaining Single Source of Truth (SSOT).

```tsx
// src/components/DropDown.tsx
interface DropDownProps {
  options: string[];
  onSelect: (option: string) => void;
  selected: string;
}

// Modern function declaration without React.FC boilerplate
export function DropDown({ options, onSelect, selected }: DropDownProps) {
  return (
    <nav>
      <p>Current: {selected}</p>
      {options.map((opt) => (
        <button 
          key={opt} 
          onClick={() => onSelect(opt)}
          aria-pressed={selected === opt}
        >
          {opt}
        </button>
      ))}
    </nav>
  );
}

// src/App.tsx
import { useState } from 'react';
import { DropDown } from './components/DropDown';

export default function App() {
  const [selection, setSelection] = useState<string>('Apple');
  const options = ['Apple', 'Banana', 'Cherry'];

  return (
    <main>
      <DropDown 
        options={options} 
        onSelect={setSelection} 
        selected={selection} 
      />
      <section>You selected: {selection}</section>
    </main>
  );
}
```

**Sources:**

- https://devinterview.io/questions/web-and-mobile-development/react-interview-questions/
</details>

### React State Management

<details>
<summary>What is a stateful component?</summary>

### What is a stateful component?

**Definition:**

#### Modernization Audit (2026 Standards)

The original content relies on Class Components (React.Component), which are legacy patterns. In React 19, the industry standard for state management is the Hooks API. While class components remain supported for backward compatibility, they are deprecated in modern architectural paradigms.

**How it works:**

#### Definition

Stateful components in React are components that manage internal data that persists across renders. In modern React, this is achieved using the useState or useReducer hooks. When state values update, React triggers a re-render of the component to synchronize the DOM with the new state.

#### Technical Note: Complexity & Performance

- **Re-rendering**: State updates in React trigger a reconciliation process. React utilizes a Fiber architecture, allowing the engine to split rendering work into chunks with an asymptotic complexity of O(n) in the worst case relative to the component tree size.

- **Memoization**: To optimize stateful components, use React.memo or useMemo to prevent unnecessary re-renders of child components if props remain referentially equal, maintaining efficient O(1) lookup for dependency changes.

**When to use:**

#### When to Use

- **Dynamic Interactions**: Components requiring real-time updates (e.g., counters, toggles).

- **User Input Handling**: Managing controlled components in forms.

- **Data Synchronization**: Handling asynchronous API responses and managing their loading/error states.

**Examples:**

#### Code Example: Functional Stateful Component

In React 19, use the useState hook. This approach eliminates this binding issues and reduces boilerplate code.

```tsx
import React, { useState } from 'react';

const ClickCounter = () => {
  // useState returns the current value and a setter function
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    // Functional updates ensure correct state transition based on previous value
    setCount((prevCount) => prevCount + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
};

export default ClickCounter;
```

**Sources:**

- https://devinterview.io/questions/web-and-mobile-development/react-interview-questions/
</details>

<details>
<summary>Can you explain how useState works?</summary>

### Can you explain how useState works?

**Definition:**

useState in Modern React (2026) useState is a fundamental React Hook that enables functional components to maintain state across re-renders. It returns a pair: the current state value and a dispatch function to update it. By leveraging Fiber architecture, React tracks the order of hook calls via a linked list stored on the memoizedState property of the fiber node.

**How it works:**

#### Core Components of useState

- **Stateful Value**: The first element in the returned array represents the current state. React preserves this value between renders.

- **Dispatch Function**: The second element is the state-setter. In React 19+, this function is stable across renders, allowing it to be passed as a prop without triggering unnecessary downstream re-renders.

#### Behavioral Traits of useState

O(n) complexity relative to the state tree size.

- **State Batching**: Since React 18, all state updates—including those in promises, timeouts, and native event handlers—are automatically batched. This minimizes the number of DOM mutations, effectively reducing the render cost to O(1) per state transition.

- **Referential Integrity**: Each call to useState is indexed by its position in the component's hook list. Conditional execution of hooks is strictly forbidden; breaking this rule causes an architectural mismatch in the linked list, leading to state corruption.

#### Functional Updates

When the new state is derived from the previous state, pass an updater function to avoid stale closures. This pattern is mandatory for Concurrent React environments to ensure consistent state transitions.

#### Performance Analysis

Updating state triggers a Reconciliation process. React compares the new state with the previous state using Object.is. If they are identical, React performs a bailout, preventing a re-render of the component and its children. The time complexity for this check is O(1).

**Examples:**

```js
Lazy Initialization: Passing a function to useState (e.g., useState(() => expensiveCalculation())) ensures the function executes only during the initial mount. This prevents unnecessary overhead during subsequent render cycles, which occur with 
```

```tsx
import { useState } from 'react';

const Counter = () => {
  // 2026 Best Practice: Using an arrow function for atomic updates
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((prev) => prev + 1)}>
      Count: {count}
    </button>
  );
};
```

**Sources:**

- https://devinterview.io/questions/web-and-mobile-development/react-interview-questions/
</details>

<details>
<summary>How do you update the state of a parent component from a child component?</summary>

### How do you update the state of a parent component from a child component?

**Definition:**

#### Modernizing React State Synchronization (2026 Standards)

React enforces unidirectional data flow, where data descends the tree via props. Updating Parent state from a Child component is fundamentally achieved via Lifting State Up, leveraging callbacks or dependency injection.

**How it works:**

#### Primary Methods

- **Props Callback (Standard Pattern)**: The parent passes a memoized handler function (e.g., useCallback) as a prop. The child invokes this function to trigger a state update in the parent.

- **Context API (via State-Reducer Pattern)**: Use createContext coupled with useReducer to provide a state dispatcher. This avoids "prop drilling" in deep component trees and is the preferred 2026 standard for intermediate-scale state sharing.

#### Advanced Patterns (2026 Context)

- **Imperative Handle (useImperativeHandle)**: Used with forwardRef to expose specific imperative methods to a parent. This is preferred over direct reference manipulation, allowing the parent to trigger child logic while maintaining encapsulation.

- **State Management Libraries (Zustand/TanStack Store)**: For complex global state, Zustand is the industry standard (2026) due to its minimal boilerplate and atomic updates. Redux Toolkit remains viable for large-scale enterprise systems, while MobX is largely relegated to legacy maintenance.

- **Server State (TanStack Query/SWR)**: Do not use local/global state for server data. Use TanStack Query to synchronize client-side state with the server, ensuring automatic cache invalidation and mutation handling.

#### Architectural Performance Note

When updating parent state, ensure the state is placed as low as possible in the tree to prevent unnecessary re-renders of unrelated branches. Complexity of state propagation in React is O(n), where n is the number of component updates. Utilize React.memo and useCallback to maintain an amortized update cost of O(1) relative to the total component count.

**Examples:**

#### Code Example: Optimized Callback (React 19+)

```tsx
// Parent.jsx
import { useState, useCallback } from 'react';
import { Child } from './Child';

export const Parent = () => {
  const [data, setData] = useState('');

  // useCallback prevents unnecessary re-renders of the child
  const handleUpdate = useCallback((newValue) => {
    setData(newValue);
  }, []);

  return <Child onUpdate={handleUpdate} />;
};

// Child.jsx
import { memo } from 'react';

// memo ensures the child only re-renders if props change
export const Child = memo(({ onUpdate }) => {
  return (
    <button onClick={() => onUpdate('Updated via memoized callback')}>
      Update Parent
    </button>
  );
});
```

**Sources:**

- https://devinterview.io/questions/web-and-mobile-development/react-interview-questions/
</details>

<details>
<summary>What is lifting state up in React?</summary>

### What is lifting state up in React?

**Definition:**

#### Definition: Lifting State Up

Lifting State Up is the architectural pattern of moving local component state to a common ancestor to synchronize data across multiple dependent components. This enforces a unidirectional data flow, ensuring that changes propagate downward through props while maintaining a Single Source of Truth (SSOT).

**How it works:**

#### Modernized Code Implementation (React 19)

#### Advantages

- **SSOT Integrity**: Prevents state duplication. Since React's reconciliation engine (O(n) complexity for component tree updates) relies on state stability, centralized control minimizes unnecessary re-renders.

- **Predictable Debugging**: Facilitates the use of DevTools to trace state mutations from the parent down, streamlining the isolation of UI defects.

#### Implementation Patterns

- **Controlled Components**: Form inputs are managed entirely via parent state, making validation and submission logic centralized.

- **Cross-Component Communication**: Facilitates sibling interaction that would otherwise require complex event bubbling or context overhead.

#### When It's Overkill

Lifting state unnecessarily causes Prop Drilling, where intermediate components pass data they do not utilize.

- **Escalation Path**: If state must be accessed by components deeply nested in the tree (e.g., global themes, auth state), utilize the Context API or state management libraries (e.g., Zustand or TanStack Store) to bypass the middle-tier components.

- **Heuristic**: If moving state up increases the props count of intermediate components by more than 3, evaluate the use of Composition (passing components as children) or a dedicated state provider.

**When to use:**

#### Why Use Lifting State Up?

- **Data Synchronization**: Ensures child components react to the same state updates, preventing disparate or "stale" UI states.

- **Derived State Efficiency**: Simplifies logic where multiple children depend on a single state variable; the parent calculates derived values, reducing redundant computations.

- **Core Mechanism**: React 19 Standards

In modern React (19+), functional components and hooks have superseded class-based components. State is managed via useState and synchronized via prop drilling or React Context for deep component trees.

**Examples:**

#### Parent Component: RectangleAreaCalculator

```tsx
import { useState } from 'react';

const RectangleAreaCalculator = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDimensions(prev => ({ ...prev, [name]: Number(value) }));
  };

  return (
    <section>
      <ShapeInput name="width" value={dimensions.width} onChange={handleChange} />
      <ShapeInput name="height" value={dimensions.height} onChange={handleChange} />
      <ShapeArea area={dimensions.width * dimensions.height} />
    </section>
  );
};
```

#### Child Components: ShapeInput and ShapeArea

```html
const ShapeInput = ({ name, value, onChange }) => (
  <div>
    <label>{name.charAt(0).toUpperCase() + name.slice(1)}</label>
    <input name={name} type="number" value={value} onChange={onChange} />
  </div>
);

const ShapeArea = ({ area }) => <div>Area: {area}</div>;
```

**Sources:**

- https://devinterview.io/questions/web-and-mobile-development/react-interview-questions/
</details>

<details>
<summary>When do you use Redux or Context API for state management?</summary>

### When do you use Redux or Context API for state management?

**Definition:**

- **State Management Architecture**: Redux vs. Context API (2026 Standards)

Managing application state in React 19 requires distinguishing between Global App State (frequently changing, high-frequency updates) and Dependency Injection (low-frequency updates, configuration).

**How it works:**

#### Redux (Redux Toolkit)

In 2026, Redux Toolkit (RTK) is the mandatory interface. The legacy connect HOC is deprecated; the useSelector and useDispatch hooks are the standard for all functional components.

- **High-Frequency State**: Optimized for state that changes multiple times per second (e.g., real-time tickers, complex drag-and-drop buffers).

- **Predictable State Transitions**: Enforces unidirectional data flow via Immer-integrated reducers, ensuring state immutability with O(1) conceptual complexity for developers.

- **Middleware Ecosystem**: Robust support for side-effect management via RTK Query, which natively handles caching, polling, and optimistic updates, reducing boilerplate compared to manual useEffect implementations.

- **DevTools & Observability**: Provides centralized logging and time-travel debugging, which remains the industry standard for auditing complex state trajectories in distributed teams.

#### React Context API

Context API is a dependency injection mechanism, not a state management solution. It is designed to propagate values through the tree without prop drilling.

- **Lightweight Integration**: Zero-bundle overhead as it is a core feature of React. Ideal for avoiding third-party dependency bloat in lightweight components.

- **Performance Constraints**: Context broadcasts updates to all consumers whenever the value changes. Without memoization (useMemo, memo), this triggers re-renders across the entire provider tree, resulting in O(n) re-render complexity where n is the number of child nodes.

- **Encapsulation**: Simplifies the distribution of static or semi-static data (e.g., Localization, Theme, Auth session).

#### Technical Comparison Summary

| Feature | Redux Toolkit | Context API |
| --- | --- | --- |
| Primary Use | Complex, high-frequency state | Configuration, Dependency Injection |
| Performance | Selective rendering (selectors) | Full subtree re-render (default) |
| Boilerplate | Moderate (standardized via RTK) | Minimal |
| DevTools | Native Time-Travel | Limited (React DevTools only) |
| Complexity | O(1) to O(log n) scaling | O(n) rendering behavior |

- **Audit Conclusion**: Favor Context API for global UI configurations and Redux Toolkit for application business logic, form state, and server-cache synchronization. Abandon the use of legacy class-based connect patterns in favor of the current Hook-based API.

**When to use:**

#### When to Pick Redux

- **Complex State Dependencies**: Use when state slices share data or require relational logic.

- **Large-Scale Performance Requirements**: Use when granular component updates are required to prevent re-rendering the entire component tree.

- **Advanced Caching**: Use when the application requires sophisticated data fetching and cache invalidation strategies provided by RTK Query.

#### When to Pick Context API

- **Static or Low-Frequency Data**: Ideal for configuration data that rarely changes (e.g., UI themes, current user locale).

- **Simple Dependency Injection**: Use when you need to pass down services or singleton instances without explicit prop drilling.

- **Component Libraries**: Essential for building compound component patterns where sub-components must access parent state implicitly.

**Sources:**

- https://devinterview.io/questions/web-and-mobile-development/react-interview-questions/
</details>

### React Lifecycle & Hooks

<details>
<summary>Explain the lifecycle methods of a React class component.</summary>

### Explain the lifecycle methods of a React class component.

**Definition:**

These methods belong to the legacy class API on `Component`. React calls them when a class instance mounts, updates, and unmounts. New components use functions and Hooks; keep these methods when you are maintaining a class.

**How it works:**

#### Before render

- `static getDerivedStateFromProps(props, state)` runs before every `render`, including the first mount. Return a partial state object, or `null` to change nothing. It has no `this`.
- `render` must stay pure. It returns the UI for the current props and state.

#### After commit

- `componentDidMount` runs after the instance is added to the screen. Start a subscription or a network read here. In development with Strict Mode, React calls `componentDidMount`, then `componentWillUnmount`, then `componentDidMount` again.
- `componentDidUpdate(prevProps, prevState, snapshot)` runs after a DOM update. Compare the previous props and state before starting new work.
- `componentWillUnmount` runs before removal. Disconnect whatever `componentDidMount` connected.

#### Optional skips and snapshots

- `shouldComponentUpdate(nextProps, nextState, nextContext)` runs before rendering. Return `false` to skip the update. The default is `true`.
- `getSnapshotBeforeUpdate(prevProps, prevState)` runs after render and before the DOM update. Its return value is the `snapshot` argument of `componentDidUpdate`. React skips it when `shouldComponentUpdate` returns `false`.

**Examples:**

```jsx
class ChatRoom extends Component {
  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps) {
    if (this.props.roomId !== prevProps.roomId) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  render() {
    return <h1>Welcome to the {this.props.roomId} room!</h1>;
  }
}
```

**Sources:**

- [React — Component](https://react.dev/reference/react/Component)
</details>

<details>
<summary>How do hooks work in React?</summary>

### How do hooks work in React?

**Definition:**

Hooks are functions whose names start with `use`. They let a function component keep state and connect to systems outside React. React calls them during render and pairs each call with the same call from the previous render by order.

**How it works:**

#### Where a call is legal

- Call a Hook at the top level of a function component, or at the top level of a custom Hook, before any early return.
- React stores Hook state in the order of the calls. A call inside a condition, loop, or nested function would line the next render up with the wrong slot.

#### What the common Hooks do

- `useState` keeps a value across renders and returns a setter.
- `useEffect` connects the component to an external system after commit. Effects are an escape hatch: if you are not talking to something outside React, you often do not need one.
- `useContext` reads the nearest matching context value above the component.

**Examples:**

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Clicked: {count} times
    </button>
  );
}
```

**Sources:**

- [React — Built-in React Hooks](https://react.dev/reference/react/hooks)
- [React — Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
</details>

<details>
<summary>Can you describe the useEffect hook and its purpose?</summary>

### Can you describe the useEffect hook and its purpose?

**Definition:**

`useEffect` connects a component to an external system after React commits the UI. The setup function may return a cleanup function. It is not the place to calculate data that can be derived during render.

**How it works:**

#### Setup and cleanup

- React runs the effect after the browser paints. `useLayoutEffect` is the variant that runs before paint; `useInsertionEffect` runs before React changes the DOM and is meant for CSS-in-JS libraries.
- Return a function from the effect to disconnect, remove a listener, or ignore a stale result. React runs that cleanup before the effect runs again and when the component unmounts.
- In development with Strict Mode, React runs setup, cleanup, and setup again so a missing cleanup is visible.

#### Dependencies

- The second argument lists the reactive values the effect reads. When one of them changes, React runs cleanup, then setup.
- Leaving out a value you read is a stale closure. The `exhaustive-deps` lint reports it.
- `useEffectEvent` wraps a function you want to call from an effect without making that function a dependency.

**Examples:**

```jsx
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState("https://localhost:1234");

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);
}
```

**Sources:**

- [React — useEffect](https://react.dev/reference/react/useEffect)
- [React — Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
</details>

<details>
<summary>How do you fetch data with hooks in React?</summary>

### How do you fetch data with hooks in React?

**Definition:**

On the client, start the request in `useEffect`, write the result with `useState`, and ignore a response that arrives after cleanup. In React 19, a Client Component can also read a Promise with `use` while a parent `Suspense` shows the fallback.

**How it works:**

#### Effect fetch

- Do not pass an `async` function to `useEffect`. Declare an async function inside the effect and call it.
- Keep an `ignore` flag. The cleanup sets it to `true` so an older, slower response cannot call the setter after a newer request started.
- Put the values the request depends on in the dependency array so a change refetches.

#### Reading a Promise with use

- `use(promise)` reads the resolved value during render. Unlike other Hooks, `use` may be called conditionally.
- A Client Component cannot `await` during render. Wrap the reader in `<Suspense fallback={...}>`.
- Effects stay the escape hatch for a browser-only subscription. They are a poor place to orchestrate data flow that a framework or `use` already covers.

**Examples:**

```jsx
useEffect(() => {
  let ignore = false;
  setBio(null);
  fetchBio(person).then((result) => {
    if (!ignore) {
      setBio(result);
    }
  });
  return () => {
    ignore = true;
  };
}, [person]);
```

**Sources:**

- [React — Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [React — use](https://react.dev/reference/react/use)
</details>

<details>
<summary>What rules do you have to follow when using hooks?</summary>

### What rules do you have to follow when using hooks?

**Definition:**

Call Hooks only while React is rendering a function component or a custom Hook, and only at the top level, in the same order every time. `use` is the exception that may run conditionally.

**How it works:**

#### Top level only

- Do not call Hooks inside conditions, loops, nested functions, or `try` / `catch` / `finally`.
- Do not call them after a conditional `return`, in an event handler, in a class, or inside the function you pass to `useMemo`, `useReducer`, or `useEffect`.
- A custom Hook may call other Hooks, because it is itself called during render.

#### Why the order matters

- React matches the nth Hook call on this render to the nth call on the previous render. A skipped call attaches state to the wrong Hook.
- `eslint-plugin-react-hooks` flags these mistakes, including missing effect dependencies.

**Examples:**

```jsx
function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState("");

  if (isSent) {
    return <h1>Thank you!</h1>;
  }

  return <textarea value={message} onChange={(e) => setMessage(e.target.value)} />;
}
```

**Sources:**

- [React — Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
</details>

### Component Communication

<details>
<summary>How do props work in React?</summary>

### How do props work in React?

**Definition:**

Props are the inputs a parent passes into a component. The child reads them as the argument of its function (or `this.props` in a class) and does not change them.

**How it works:**

#### What you can pass

- A prop can be a string, number, object, array, or function. JSX attributes become those fields.
- Nested JSX between the opening and closing tags arrives as the `children` prop.
- A render reads `props` for that pass. The next render from the parent supplies the next values.

#### One-way data

- The child renders from the props it received. To change what the parent stores, the parent passes a function and the child calls it.
- Passing the same prop through many layers that do not use it is prop drilling. Context or composition removes that chain.

**Examples:**

```jsx
function Avatar({ person, size }) {
  return (
    <img
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

<Avatar size={100} person={{ name: "Katsuko Saruhashi", imageId: "YfeOqp2" }} />
```

**Sources:**

- [React — Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
</details>

<details>
<summary>What is prop drilling and how can you avoid it?</summary>

### What is prop drilling and how can you avoid it?

**Definition:**

Prop drilling is passing a prop through components that do not use it, only so a deeper child can. It shows up when the nearest owner of the data sits far above the components that read it.

**How it works:**

#### Why it appears

- Props are explicit. Each layer must name a prop it does not care about, and a rename touches every file in the chain.
- Lifting state to the common ancestor makes the chain longer.

#### Ways through it

- Context lets a parent publish a value. Any descendant calls `useContext` and skips the middle components. In current React the provider is `<LevelContext value={level}>`, not a separate `.Provider` element.
- Composition keeps the parent that owns the data as the one that renders the child, and passes the ready element down as `children`, so the middle component never sees the prop.
- A function prop such as `renderItem` is another way for the parent to decide the child UI. Context fits data many distant components share, such as theme or the current level of a heading.

**Examples:**

```jsx
function Section({ level, children }) {
  return (
    <section>
      <LevelContext value={level}>{children}</LevelContext>
    </section>
  );
}
```

**Sources:**

- [React — Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
</details>

<details>
<summary>Explain the Context API and its use cases.</summary>

### Explain the Context API and its use cases.

**Definition:**

Context publishes a value from a component to any descendant that calls `useContext`, without threading that value through props. The default from `createContext` is used only when no provider sits above the reader.

**How it works:**

#### Setup

- `createContext(defaultValue)` returns a context object.
- Render `<SomeContext value={value}>` around the subtree that should see `value`. A reader below subscribes with `const value = useContext(SomeContext)`.
- When `value` changes, every component that read that context re-renders, including a child wrapped in `memo`.

#### Fits

- Theme, locale, the current user, or a heading level: data many components need and that changes rarely.
- A tasks list plus a dispatch function, split into two contexts so a component that only dispatches does not re-render on every list change.
- Context is a poor place for high-frequency state. A new object or function as `value` on every render notifies every reader.

**Examples:**

```jsx
const theme = useContext(ThemeContext);

return (
  <ThemeContext value={theme}>
    <Button />
  </ThemeContext>
);
```

**Sources:**

- [React — useContext](https://react.dev/reference/react/useContext)
- [React — Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
</details>

<details>
<summary>How do you use render props?</summary>

### How do you use render props?

**Definition:**

A render prop is a prop whose value is a function that returns JSX. The component calls that function with data it owns, and the parent decides what to render.

**How it works:**

#### Call the function during render

- The parent passes `renderItem` or `renderContent`. The child calls it with the current item, id, or highlight flag.
- The child keeps the state (which tab is selected, which row is highlighted). The parent stays in charge of the markup.
- `children` can be that function too. A named prop makes the role obvious when the component also wraps other elements.

#### Prefer a plain child when you can

- If the parent already knows the UI, pass elements as `children` instead of a function.
- The docs show `renderItem` as the alternative to cloning children and overwriting their props with `cloneElement`.

**Examples:**

```jsx
<List
  items={products}
  renderItem={(product, isHighlighted) => (
    <Row key={product.id} title={product.title} isHighlighted={isHighlighted} />
  )}
/>
```

**Sources:**

- [React — cloneElement](https://react.dev/reference/react/cloneElement)
</details>

<details>
<summary>What is the children prop?</summary>

### What is the children prop?

**Definition:**

`children` is the prop React fills with whatever you nest between a component’s opening and closing tags. The component chooses where that content appears.

**How it works:**

#### Where it comes from

- `<Card><Avatar /></Card>` passes `<Avatar />` as `children`. Text and several elements arrive the same way.
- The component renders `{children}` in the place the wrapper should show them. It does not need to know what the content is.
- A function as `children` is a render prop. The usual case is an element or a list of elements.

**Examples:**

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

<Card>
  <Avatar size={100} person={{ name: "Katsuko Saruhashi", imageId: "YfeOqp2" }} />
</Card>
```

**Sources:**

- [React — Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
</details>

### Performance Optimization

<details>
<summary>Why is performance optimization important in React?</summary>

### Why is performance optimization important in React?

**Definition:**

A parent re-render re-renders its children. That work is wasted when a slow child receives the same props, and it shows up as a lagging list or a blocked interaction.

**How it works:**

#### What actually costs time

- Rendering runs your component functions. A list that does heavy work on every parent update repeats that work even when its items did not change.
- State updates are tied to the component that owns them. Colocating state keeps the re-render in a small subtree.
- `memo` is a performance tool. If the UI is wrong without it, fix the bug first. The docs show an artificially slowed `List` so you can see a skipped render.

#### What to reach for

- `memo` skips a function component when its props are shallowly equal to the last render.
- `useMemo` keeps an object or a filtered array referentially stable so that `memo` child still sees the same prop.
- `useCallback` does the same for a function prop.

**Examples:**

```jsx
const List = memo(function List({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
});
```

**Sources:**

- [React — memo](https://react.dev/reference/react/memo)
- [React — useMemo](https://react.dev/reference/react/useMemo)
</details>

<details>
<summary>What is React.memo and when would you use it?</summary>

### What is React.memo and when would you use it?

**Definition:**

`memo` wraps a component so React can skip re-rendering it when the new props are shallowly equal to the previous ones. It remembers only the last render.

**How it works:**

#### The check

- `const Memoized = memo(Component, arePropsEqual?)`. Without the second argument, React compares each prop with `Object.is`.
- A new object, array, or function created during the parent render fails that check. Cache those with `useMemo` or `useCallback` if the child is wrapped in `memo`.
- Reading context inside the memoized component still re-renders it when that context value changes. Split the reader out, or pass the needed field as a prop.

**When to use:**

- A slow child re-renders because the parent updated state the child does not read.
- The props are primitives, or you already keep objects and callbacks stable.
- Skip it on a cheap component. The docs treat `memo` as an optimization you add after the UI is correct, not as a requirement for correctness.

**Examples:**

```jsx
const person = useMemo(() => ({ name, age }), [name, age]);

const Profile = memo(function Profile({ person }) {
  return <p>{person.name}</p>;
});
```

**Sources:**

- [React — memo](https://react.dev/reference/react/memo)
</details>

<details>
<summary>How does PureComponent differ from Component in React?</summary>

### How does PureComponent differ from Component in React?

**Definition:**

`PureComponent` is the class form of a shallow prop and state check. `Component` always re-renders when the parent renders or when its own state updates. `PureComponent` may skip that render. Both are the legacy class API; a function component uses `memo` instead.

**How it works:**

#### The difference

- A `Component` subclass runs `render` on every parent render unless you write `shouldComponentUpdate` yourself.
- `PureComponent` implements that method with a shallow compare of `props` and `state`. If every field is equal, React skips the re-render.
- A new object in a prop still counts as a change, the same way it does for `memo`. Mutating an existing object or array and passing the same reference hides the change from the shallow compare.

**When to use:**

- An existing class re-renders because a parent updated unrelated state, and its props and state are shallow data.
- New UI should be a function component wrapped in `memo` when a skip is actually needed.

**Examples:**

```jsx
class Greeting extends PureComponent {
  render() {
    return <h3>Hello{this.props.name && ", "}{this.props.name}!</h3>;
  }
}
```

**Sources:**

- [React — PureComponent](https://react.dev/reference/react/PureComponent)
- [React — memo](https://react.dev/reference/react/memo)
</details>

<details>
<summary>Can you explain the concept of reconciliation in React?</summary>

### Can you explain the concept of reconciliation in React?

**Definition:**

Reconciliation is how React matches the UI you just rendered with the UI already on the screen and updates only what changed. It matches components by their position in the tree, and by `key` when several siblings share a type.

**How it works:**

#### Position keeps state

- React keeps a component’s state while that component stays at the same place in the tree. Rendering it in a different place unmounts the old one and mounts a new one, which drops the state.
- Two `<Counter />` elements of the same type in the same position are the same component with new props. Putting them in different branches (`{a && <Counter />}` versus `{!a && <Counter />}`) treats them as different instances.

#### Keys name siblings

- In a list, `key` must come from stable data, such as `person.id`, so React can track which item moved, appeared, or disappeared.
- Changing `key` tells React this is a different component at that position, so state resets. That is the reset button pattern: `<Form key={version} />`.

**Examples:**

```jsx
{people.map((person) => (
  <li key={person.id}>{person.name}</li>
))}
```

**Sources:**

- [React — Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)
- [React — Rendering Lists](https://react.dev/learn/rendering-lists)
</details>

<details>
<summary>How can you prevent unnecessary re-renders in React?</summary>

### How can you prevent unnecessary re-renders in React?

**Definition:**

Keep state close to the UI that reads it, and skip a child render only when that child is slow and its props are the same as last time.

**How it works:**

#### Shrink the update

- State in a leaf does not re-render the whole page. A parent that stores both a text field and a heavy list re-renders the list on every keystroke.
- Split context. A component re-renders when the context value it read changes, even if it is wrapped in `memo`.

#### Skip a child that did not change

- Wrap the slow child in `memo` (or extend `PureComponent` in a class). The skip is shallow: a freshly created object or function still counts as a new prop.
- Cache that object with `useMemo` and that callback with `useCallback`, with the values they read listed as dependencies.
- Do not call `useMemo` in a loop to memoize each row. Extract a row component and wrap that component in `memo`.

**Examples:**

```jsx
const visibleTodos = useMemo(
  () => filterTodos(todos, tab),
  [todos, tab]
);

return <List items={visibleTodos} />;
```

**Sources:**

- [React — memo](https://react.dev/reference/react/memo)
- [React — useCallback](https://react.dev/reference/react/useCallback)
</details>

### Styling in React

<details>
<summary>How do you apply styles in a React application?</summary>

### How do you apply styles in a React application?

**Definition:**

Style a DOM node with the `className` string, which maps to the HTML `class` attribute, or with the `style` object for values that depend on data. The stylesheet itself is ordinary CSS.

**How it works:**

#### Classes

- `<img className="avatar" />` picks rules you wrote for `.avatar` in a CSS file imported by the app.
- Several classes are one string. A conditional class is still a string you build before the return.

#### Dynamic values

- `style` takes an object of camelCase CSS properties: `backgroundColor`, not `background-color`.
- Use it when the number comes from state or props, such as `width: user.imageSize`.
- CSS-in-JS libraries inject `<style>` tags. `useInsertionEffect` exists so those libraries can insert CSS before layout effects read the layout.

**Examples:**

```jsx
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```

**Sources:**

- [React — Common components (className and style)](https://react.dev/reference/react-dom/components/common)
- [React — useInsertionEffect](https://react.dev/reference/react/useInsertionEffect)
</details>

<details>
<summary>What is CSS-in-JS and how do you implement it in React?</summary>

### What is CSS-in-JS and how do you implement it in React?

**Definition:**

CSS-in-JS writes style rules in JavaScript and injects them into the document as `<style>` tags, usually scoped to a component. React’s hook for that injection is `useInsertionEffect`, and it is aimed at library authors.

**How it works:**

#### When the styles land

- `useInsertionEffect(setup, dependencies)` runs before layout effects. A CSS-in-JS helper calls it to insert the `<style>` tag before any effect measures the DOM.
- The setup may return a cleanup. You cannot set state from this hook, and refs are not attached yet.
- These effects run on the client, not during server rendering.

#### In an application

- Prefer a stylesheet and `className` for rules that do not change, and the `style` object for a few dynamic values.
- A library such as styled-components hides the insertion. You call its API; it calls something like `useInsertionEffect` so the CSS exists before layout is read.

**Examples:**

```jsx
function useCSS(rule) {
  useInsertionEffect(() => {
    // Inject the <style> tag for this rule before layout effects.
  });
  return rule;
}
```

**Sources:**

- [React — useInsertionEffect](https://react.dev/reference/react/useInsertionEffect)
</details>

<details>
<summary>Can you describe how Styled-Components work?</summary>

### Can you describe how Styled-Components work?

**Definition:**

styled-components defines a React component with a tagged template literal of real CSS. The call returns a component that renders the HTML tag and applies a generated class next to any `className` you pass.

**How it works:**

#### The component

- `styled.h1` or `styled.button` plus a template string returns a component. You render `<Title>` the same way as any other component.
- HTML attributes go to the DOM node. Other props are available only inside interpolations.
- An interpolation is a function of props. `background: ${(props) => props.$primary ? "#BF4F74" : "white"}` changes the rule. The `$` prefix marks a transient prop so it is not forwarded to the DOM.
- For discrete variants in a React Server Component, the library docs prefer a data attribute over a prop, to avoid serializing the function.

**Examples:**

```jsx
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: #bf4f74;
`;

const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;
```

**Sources:**

- [styled-components — Basics](https://styled-components.com/docs/basics)
- [styled-components — API](https://styled-components.com/docs/api)
</details>

<details>
<summary>What are the advantages of using Sass or LESS in a React project?</summary>

### What are the advantages of using Sass or LESS in a React project?

**Definition:**

Sass is a stylesheet language that compiles to CSS. Variables, nested rules, mixins, and functions keep a large sheet organized. The React component still receives a class name; it does not parse Sass.

**How it works:**

#### What you write

- `$base-color: #c6538c` is replaced at compile time. The browser sees the computed color, not the variable.
- `@mixin` plus `@include` drops a reusable block of declarations into a rule, so you do not invent a class whose only job is `float`.
- Nested rules follow the component’s structure in the source and flatten to normal selectors in the output.

#### What React sees

- `sass.compile("style.scss")` returns CSS. A bundler does that compile when you import the file.
- The component uses `className` against the emitted classes, the same as a hand-written stylesheet.
- LESS is the same kind of preprocessor with its own syntax. The advantage is the same: shared tokens and mixins in source, plain CSS at runtime.

**Examples:**

```scss
$base-color: #c6538c;
$border-dark: rgba($base-color, 0.88);

.alert {
  border: 1px solid $border-dark;
}
```

**Sources:**

- [Sass — Variables](https://sass-lang.com/documentation/variables)
- [Sass — @mixin and @include](https://sass-lang.com/documentation/at-rules/mixin)
</details>

<details>
<summary>How do you use inline styles in React?</summary>

### How do you use inline styles in React?

**Definition:**

The `style` prop takes a JavaScript object. Property names are camelCase, and the values are strings or numbers. In JSX the object sits in a second pair of braces.

**How it works:**

#### The object

- `style={{ backgroundColor: "black", color: "pink" }}` becomes the HTML `style` attribute.
- A dynamic field is any expression: `style={{ width: user.imageSize, height: user.imageSize }}`.
- Pixel numbers can be bare numbers for many length properties. Values that are not lengths stay strings.

#### When it is the wrong tool

- Shared rules, hover, and media queries belong in a stylesheet selected with `className`.
- A new object on every render is fine for the DOM `style` attribute. It does not by itself skip a child re-render.

**Examples:**

```jsx
<ul
  style={{
    backgroundColor: "black",
    color: "pink"
  }}
>
  <li>Improve the videophone</li>
</ul>
```

**Sources:**

- [React — JavaScript in JSX with Curly Braces](https://react.dev/learn/javascript-in-jsx-with-curly-braces)
- [React — Common components (style)](https://react.dev/reference/react-dom/components/common)
</details>

### React Routing

<details>
<summary>What is React Router?</summary>

### What is React Router?

**Definition:**

React Router maps URL segments to React elements. You configure that map with `<Routes>` and `<Route>` inside `<BrowserRouter>`, or with route objects passed to `createBrowserRouter`.

**How it works:**

#### Declarative routes

- `<Route path="about" element={<About />} />` renders `About` when the URL matches.
- A parent path is included in the child, so `dashboard` plus `settings` is `/dashboard/settings`. The parent renders the child through `<Outlet />`.
- A route with no `path` is a layout: it wraps children and adds no URL segment. An `index` route renders in the parent outlet at the parent URL.

#### Links

- `<Link to="/login">` is the normal navigation. `<NavLink>` adds an active state for the current URL.
- Import these from `react-router` in the current docs.

**Examples:**

```tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
  </Routes>
</BrowserRouter>
```

**Sources:**

- [React Router — Routing](https://reactrouter.com/start/library/routing)
</details>

<details>
<summary>How do you create dynamic routes in React?</summary>

### How do you create dynamic routes in React?

**Definition:**

A dynamic route is a path segment that starts with `:`, such as `teams/:teamId`. React Router reads that segment from the URL and returns it from `useParams`.

**How it works:**

#### Segments

- `<Route path="teams/:teamId" element={<Team />} />` matches `/teams/42` and sets `params.teamId` to `"42"`.
- A splat path `files/*` matches the rest of the URL, including further slashes. The remainder is `params["*"]`.
- The same `params` object is passed into a route `loader` or `action`.

**Examples:**

```tsx
import { useParams } from "react-router";

function Team() {
  const params = useParams();
  return <h1>Team {params.teamId}</h1>;
}
```

**Sources:**

- [React Router — Routing](https://reactrouter.com/start/declarative/routing)
- [React Router — useParams](https://reactrouter.com/api/hooks/useParams)
</details>

<details>
<summary>How would you pass data to routes in React Router v5+?</summary>

### How would you pass data to routes in React Router v5+?

**Definition:**

Pass route data through the URL, a loader, history state, or the parent route. The matched component reads it with `useParams`, `useLoaderData`, `useLocation`, or `useOutletContext`.

**How it works:**

#### Four channels

- A `:postId` segment is URL data. `useParams()` returns it on every render of that route.
- A `loader` runs before the route renders and returns data. `useLoaderData()` reads the nearest loader result.
- `<Link to="/elsewhere" state={{ some: "value" }} />` stores client history state. `useLocation().state` reads it. That state is not available during server rendering.
- A parent layout renders `<Outlet context={value} />`. The child calls `useOutletContext()`.

**Examples:**

```tsx
import { useLoaderData } from "react-router";

export async function loader() {
  return await fakeDb.invoices.findAll();
}

export default function Invoices() {
  const invoices = useLoaderData();
  return <p>{invoices.length}</p>;
}
```

**Sources:**

- [React Router — useLoaderData](https://reactrouter.com/api/hooks/useLoaderData)
- [React Router — Link](https://reactrouter.com/api/components/Link)
</details>

<details>
<summary>How do you programmatically navigate using React Router?</summary>

### How do you programmatically navigate using React Router?

**Definition:**

`useNavigate` returns a function that changes the URL from code. For a click the user makes, render `<Link>` or `<NavLink>` instead.

**How it works:**

#### The navigate function

- `navigate("/tasks")` pushes a new history entry. `navigate("/tasks", { replace: true })` replaces the current entry.
- `navigate(-1)` moves back one entry. A positive number moves forward.
- `state` on the options object is stored with the new location, the same way as `state` on `<Link>`.
- `<Navigate to="/tasks" />` redirects while rendering. The docs say to prefer `useNavigate` when you can.

#### When the user is clicking

- `<Link>` and `<NavLink>` keep keyboard behavior, a real href, and the open-in-new-tab menu.
- Call `navigate` after a submit, a timeout, or a logout, when there is no link to press.

**Examples:**

```tsx
import { useNavigate } from "react-router";

function BackButton() {
  const navigate = useNavigate();
  return <button onClick={() => navigate(-1)}>Go back</button>;
}
```

**Sources:**

- [React Router — useNavigate](https://reactrouter.com/api/hooks/useNavigate)
- [React Router — Navigating](https://reactrouter.com/start/declarative/navigating)
</details>

<details>
<summary>What are route guards and how can you implement them in React?</summary>

### What are route guards and how can you implement them in React?

**Definition:**

A route guard stops a navigation that should not continue. In current React Router that check is route middleware which throws `redirect("/login")` when the session is missing.

**How it works:**

#### Middleware

- Middleware runs in order before the loaders and actions on that navigation. Call `next()` to continue down the chain.
- If there is no user id, `throw redirect("/login")` cancels the protected navigation and sends the user to login.
- Put the middleware on a layout route so every child route inherits the check.
- Add a `loader` on that layout, even one that returns `null`, so the middleware also runs on client-side navigations.

**Examples:**

```tsx
import { redirect } from "react-router";

async function authMiddleware({ request }) {
  const session = await getSession(request);
  if (!session.get("userId")) {
    throw redirect("/login");
  }
}

export const middleware = [authMiddleware];

export async function loader() {
  return null;
}
```

**Sources:**

- [React Router — Middleware](https://reactrouter.com/how-to/middleware)
- [React Router — Route module](https://reactrouter.com/start/framework/route-module)
</details>

### React Patterns

<details>
<summary>What are higher-order components (HOCs)?</summary>

### What are higher-order components (HOCs)?

**Definition:**

A higher-order component is a function that takes a component and returns a component. Current React docs share that kind of logic with a custom Hook, and the `component-hook-factories` lint rejects a factory that defines a nested component or Hook.

**How it works:**

#### What the docs say now

- A custom Hook’s name starts with `use` and a capital letter. It shares stateful logic, not the state value itself.
- Define components and Hooks at module scope. A function that returns a new component, or a component declared inside another component, is the pattern the lint flags.
- The parent still passes data with props or context. The wrapper does not have to hide that data inside a generated component type.

**Examples:**

```js
import { useState } from "react";

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);
  function handleChange(e) {
    setValue(e.target.value);
  }
  return { value, onChange: handleChange };
}
```

**Sources:**

- [React — Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [React — component-hook-factories](https://react.dev/reference/eslint-plugin-react-hooks/lints/component-hook-factories)
</details>

<details>
<summary>Explain the container/presenter (smart/dumb) component pattern.</summary>

### Explain the container/presenter (smart/dumb) component pattern.

**Definition:**

A container reads state and passes plain data into a presenter. The presenter returns JSX from props and does not own that state.

**How it works:**

#### Split

- The container calls `useState`, `useReducer`, or `useContext`, then renders the presenter with the values and event handlers.
- The presenter is a function of those props. The same presenter can render a task row, a preview, or a story without knowing where the data came from.
- React’s scaling guide puts the shared state in a provider and lets each child read what it needs. That is the same split: one module owns the updates, the row component only renders.

**When to use:**

- Use a presenter when the markup is reused with different data.
- Keep the state in the parent when only that parent should update it. Pass props down instead of hiding the data behind a generated wrapper.

**Examples:**

```jsx
function TaskRow({ task, onToggle }) {
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => onToggle(task.id, e.target.checked)}
      />
      {task.text}
    </label>
  );
}
```

**Sources:**

- [React — Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [React — Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)
</details>

<details>
<summary>How would you implement a compound component pattern in React?</summary>

### How would you implement a compound component pattern in React?

**Definition:**

A compound component is a parent that owns shared state and renders named children inside it. The children read and update that state with context, so the caller does not thread the same props through every level.

**How it works:**

#### Provider and hooks

- `TasksProvider` holds the list with `useReducer` and puts the list and `dispatch` on two contexts.
- `useTasks` and `useTasksDispatch` call `useContext` for those values.
- `AddTask` and `TaskList` sit inside the provider as children. They do not receive the task array as a prop.

**Examples:**

```jsx
export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

**Sources:**

- [React — Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [React — useContext](https://react.dev/reference/react/useContext)
</details>

<details>
<summary>Explain the use of custom hooks in React.</summary>

### Explain the use of custom hooks in React.

**Definition:**

A custom Hook is a function whose name starts with `use` and that calls other Hooks. It shares stateful logic between components. Each call has its own state.

**How it works:**

#### Rules from the docs

- The name is `use` plus a capital letter, for example `useOnlineStatus` or `useFormInput`.
- Hooks run on every render of the component that called them. Call them at the top level of the function, not inside a condition.
- The Hook returns data and functions. It does not share the state value with another component that calls the same Hook.
- Keep the Hook’s purpose specific. The docs say not to invent a Hook such as `useMount` whose only job is a lifecycle label.

**Examples:**

```js
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? "Online" : "Disconnected"}</h1>;
}
```

**Sources:**

- [React — Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
</details>

<details>
<summary>What is a render prop pattern?</summary>

### What is a render prop pattern?

**Definition:**

A render prop is an ordinary function prop that tells a component what to render. The component calls that function and can pass it data such as an index or an id.

**How it works:**

#### Call the function

- There is nothing special about the prop name. `renderRow` or `children` can both be the function.
- The parent decides the markup. The child decides when to call the function and which arguments to pass.
- This is cooperation through props. The child does not rewrite the parent’s elements.

**Examples:**

```jsx
function RowList({ items, renderRow }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={item.id}>{renderRow(item, index)}</li>
      ))}
    </ul>
  );
}
```

**Sources:**

- [React — Children](https://react.dev/reference/react/Children)
- [React — Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
</details>

### Form Handling

<details>
<summary>How do you handle forms in React?</summary>

### How do you handle forms in React?

**Definition:**

Handle a form by keeping the field values in state, or by reading `FormData` from the submit event. A React 19 action can take that `FormData` and return an error message through `useActionState`.

**How it works:**

#### State or the submit event

- A controlled field stores the string in `useState` and sets it from `onChange`. The reset button sets the state back to `""`.
- On submit, call `event.preventDefault()` so the browser does not reload the page. `new FormData(event.target)` includes every control that has a `name`.
- You can pass that `FormData` straight to `fetch(url, { method: form.method, body: formData })`.
- `useActionState(action, null)` returns the latest message and an action to put on `<form action={...}>`. The action receives the previous state and the `FormData`.

**Examples:**

```jsx
export default function MyForm() {
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    fetch("/some-api", { method: e.target.method, body: formData });
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <input name="myInput" defaultValue="Some initial value" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Sources:**

- [React — <input>](https://react.dev/reference/react-dom/components/input)
- [React — <form>](https://react.dev/reference/react-dom/components/form)
</details>

<details>
<summary>What is controlled and uncontrolled components?</summary>

### What is controlled and uncontrolled components?

**Definition:**

A controlled input’s displayed value is React state: you pass `value` and `onChange`, or `checked` and `onChange`. An uncontrolled input keeps its own DOM value; you pass `defaultValue` or `defaultChecked` and read it later from the form.

**How it works:**

#### Which props

- Passing `value` without `onChange` freezes a text input. The handler must call the state setter with `event.target.value`.
- `checked` does the same for a checkbox or radio. `value` on a radio names the option that goes into the form data.
- `defaultValue` and `defaultChecked` set only the initial DOM value. They are the uncontrolled props.
- On submit, an uncontrolled form is still readable with `new FormData(event.target)` as long as each control has a `name`.

**When to use:**

- Use a controlled input when the render depends on the text, for example a heading that repeats the name or a button disabled while the answer is empty.
- Use an uncontrolled input when you only need the value at submit and the screen does not mirror every keystroke.

**Examples:**

```jsx
const [firstName, setFirstName] = useState("");

<input
  value={firstName}
  onChange={(e) => setFirstName(e.target.value)}
/>
```

**Sources:**

- [React — <input>](https://react.dev/reference/react-dom/components/input)
- [React — State: A Component's Memory](https://react.dev/learn/state-a-components-memory)
</details>

<details>
<summary>How do you validate forms in React?</summary>

### How do you validate forms in React?

**Definition:**

Validate a React form by checking the values before submit and by showing the error in state. The check can disable the button, reject in the submit handler, or return a message from an action.

**How it works:**

#### Where the check runs

- A controlled form can disable the button while `answer.length === 0` or while `status === "submitting"`.
- The submit handler sets a status such as `"typing"`, `"submitting"`, or `"success"`, and stores the thrown error so the next render shows `error.message`.
- An action used with `useActionState` can `return err.toString()` after a failed request. The component renders that message. The `<form>` example works before the client JavaScript loads when the action is a Server Function.
- Native constraints still apply. The context examples put `required` on the inputs that must be filled.

**Examples:**

```jsx
<button
  disabled={answer.length === 0 || status === "submitting"}
>
  Submit
</button>
{error !== null && <p className="Error">{error.message}</p>}
```

**Sources:**

- [React — Managing State](https://react.dev/learn/managing-state)
- [React — <form>](https://react.dev/reference/react-dom/components/form)
</details>

<details>
<summary>What is Formik and how is it used in React forms?</summary>

### What is Formik and how is it used in React forms?

**Definition:**

Formik keeps form values, errors, and submit state for you. You pass `initialValues`, a `validate` function or a `validationSchema`, and `onSubmit`.

**How it works:**

#### Hook or components

- `useFormik({ initialValues, validate, onSubmit })` returns `values`, `errors`, `handleChange`, and `handleSubmit`. Put `handleSubmit` on `<form onSubmit>` and wire each input with `name`, `value`, and `onChange`.
- `validate` returns an object whose keys match `initialValues`. It runs on change, blur, and submit.
- `<Formik>`, `<Form>`, `<Field name="email" />`, and `<ErrorMessage name="email" />` cover the same flow. `<ErrorMessage>` renders the message only when that field is touched and has an error.

**Examples:**

```jsx
const formik = useFormik({
  initialValues: { email: "" },
  validate: (values) => {
    const errors = {};
    if (!values.email) errors.email = "Required";
    return errors;
  },
  onSubmit: (values) => {
    alert(JSON.stringify(values, null, 2));
  },
});
```

**Sources:**

- [Formik — Tutorial](https://formik.org/docs/tutorial)
- [Formik — ErrorMessage](https://formik.org/docs/api/errormessage)
</details>

<details>
<summary>How do you handle file uploads in React?</summary>

### How do you handle file uploads in React?

**Definition:**

A file upload is an `<input type="file" name="..." />` inside a form. On submit, read a `FormData` object and send it as the `fetch` body. Do not copy the file into React state just to submit it.

**How it works:**

#### The file input

- `accept` limits which file types the picker offers, for example `image/*`.
- The control needs a `name` so `FormData` includes the file.
- `event.preventDefault()` keeps the page from navigating. `fetch("/upload", { method: "post", body: formData })` sends the file with the other named fields.
- `capture` can request the microphone, video, or camera for that file input.

**Examples:**

```jsx
function UploadForm() {
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    fetch("/upload", { method: "post", body: formData });
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <input type="file" name="attachment" accept="image/*" />
      <button type="submit">Upload</button>
    </form>
  );
}
```

**Sources:**

- [React — <input>](https://react.dev/reference/react-dom/components/input)
</details>

### React with TypeScript

<details>
<summary>What are the benefits of using TypeScript with React?</summary>

### What are the benefits of using TypeScript with React?

**Definition:**

</details>

<details>
<summary>How do you define types for props and state in TypeScript with React?</summary>

### How do you define types for props and state in TypeScript with React?

**Definition:**

</details>

<details>
<summary>Explain how to use interfaces with React components and TypeScript.</summary>

### Explain how to use interfaces with React components and TypeScript.

**Definition:**

</details>

<details>
<summary>How do TypeScript generics enhance React components?</summary>

### How do TypeScript generics enhance React components?

**Definition:**

</details>

### Testing in React

<details>
<summary>Why is testing important in React?</summary>

### Why is testing important in React?

**Definition:**

</details>

<details>
<summary>What are some common testing libraries for React?</summary>

### What are some common testing libraries for React?

**Definition:**

</details>

<details>
<summary>How do you test a React component with Jest?</summary>

### How do you test a React component with Jest?

**Definition:**

</details>

<details>
<summary>Can you explain the difference between shallow rendering and mount rendering in Enzyme?</summary>

### Can you explain the difference between shallow rendering and mount rendering in Enzyme?

**Definition:**

</details>

<details>
<summary>What is react-testing-library and how is it different from Enzyme?</summary>

### What is react-testing-library and how is it different from Enzyme?

**Definition:**

</details>

### Advanced React Topics

<details>
<summary>What are React fragments and why are they useful?</summary>

### What are React fragments and why are they useful?

**Definition:**

</details>

<details>
<summary>What is React portal and when would you use it?</summary>

### What is React portal and when would you use it?

**Definition:**

</details>

<details>
<summary>How does error boundary work in React?</summary>

### How does error boundary work in React?

**Definition:**

</details>

<details>
<summary>What is server-side rendering and how is it done with React?</summary>

### What is server-side rendering and how is it done with React?

**Definition:**

</details>

<details>
<summary>Can you explain the concept of suspense and lazy loading in React?</summary>

### Can you explain the concept of suspense and lazy loading in React?

**Definition:**

</details>

### React and SEO

<details>
<summary>How does React affect SEO?</summary>

### How does React affect SEO?

**Definition:**

</details>

<details>
<summary>What strategies would you use to make a React application SEO-friendly?</summary>

### What strategies would you use to make a React application SEO-friendly?

**Definition:**

</details>

<details>
<summary>How can server-side rendering improve SEO with React applications?</summary>

### How can server-side rendering improve SEO with React applications?

**Definition:**

</details>

### React Native

<details>
<summary>What is React Native and how is it different from React?</summary>

### What is React Native and how is it different from React?

**Definition:**

</details>

<details>
<summary>How do you bridge native modules in React Native?</summary>

### How do you bridge native modules in React Native?

**Definition:**

</details>

<details>
<summary>Can you describe the layout system in React Native?</summary>

### Can you describe the layout system in React Native?

**Definition:**

</details>

### State Management Libraries & GraphQL

<details>
<summary>What is Apollo Client and how does it integrate with React?</summary>

### What is Apollo Client and how does it integrate with React?

**Definition:**

</details>

<details>
<summary>How do you manage local state in Apollo Client?</summary>

### How do you manage local state in Apollo Client?

**Definition:**

</details>

<details>
<summary>What is Redux and how does it contrast with the Context API?</summary>

### What is Redux and how does it contrast with the Context API?

**Definition:**

</details>

<details>
<summary>Can you detail the Redux workflow?</summary>

### Can you detail the Redux workflow?

**Definition:**

</details>

<details>
<summary>How do you handle side effects in Redux applications?</summary>

### How do you handle side effects in Redux applications?

**Definition:**

</details>

### React Development Environment & Tooling

<details>
<summary>How do you set up a React project from scratch?</summary>

### How do you set up a React project from scratch?

**Definition:**

</details>

<details>
<summary>What is Babel and why do we use it with React?</summary>

### What is Babel and why do we use it with React?

**Definition:**

</details>

<details>
<summary>What is Webpack and what role does it play in React development?</summary>

### What is Webpack and what role does it play in React development?

**Definition:**

</details>

<details>
<summary>How does hot module replacement work in React?</summary>

### How does hot module replacement work in React?

**Definition:**

</details>

<details>
<summary>What are the features of create-react-app and how do you eject from it?</summary>

### What are the features of create-react-app and how do you eject from it?

**Definition:**

</details>

### Integrations and API Handling

<details>
<summary>How do you handle API calls in React?</summary>

### How do you handle API calls in React?

**Definition:**

</details>

<details>
<summary>What is Axios and how is it used over fetch in React applications?</summary>

### What is Axios and how is it used over fetch in React applications?

**Definition:**

</details>

<details>
<summary>How would you handle WebSocket connections in a React application?</summary>

### How would you handle WebSocket connections in a React application?

**Definition:**

</details>

<details>
<summary>What are some strategies used to connect a React front end to a backend server?</summary>

### What are some strategies used to connect a React front end to a backend server?

**Definition:**

</details>

### Deployment and Optimization

<details>
<summary>How would you deploy a React application?</summary>

### How would you deploy a React application?

**Definition:**

</details>

<details>
<summary>How do you optimize the performance of a React application for production?</summary>

### How do you optimize the performance of a React application for production?

**Definition:**

</details>

<details>
<summary>What are service workers and how can they benefit a React application?</summary>

### What are service workers and how can they benefit a React application?

**Definition:**

</details>

<details>
<summary>How do you configure HTTPS in a React app?</summary>

### How do you configure HTTPS in a React app?

**Definition:**

</details>

### Accessibility in React

<details>
<summary>Why is accessibility important in web development?</summary>

### Why is accessibility important in web development?

**Definition:**

</details>

<details>
<summary>How can you make a React application accessible?</summary>

### How can you make a React application accessible?

**Definition:**

</details>

<details>
<summary>What is ARIA and how it is used in React?</summary>

### What is ARIA and how it is used in React?

**Definition:**

</details>

### Internationalization and Localization

<details>
<summary>What is internationalization (i18n) in React?</summary>

### What is internationalization (i18n) in React?

**Definition:**

</details>

<details>
<summary>How do you implement localization (l10n) in a React app?</summary>

### How do you implement localization (l10n) in a React app?

**Definition:**

</details>

### React Code Structure & Best Practices

<details>
<summary>How do you structure large React applications?</summary>

### How do you structure large React applications?

**Definition:**

</details>

<details>
<summary>What are some best practices when writing React code?</summary>

### What are some best practices when writing React code?

**Definition:**

</details>

<details>
<summary>How do you ensure code quality and maintainability in a React project?</summary>

### How do you ensure code quality and maintainability in a React project?

**Definition:**

</details>

### React and Git Workflows

<details>
<summary>How do you manage feature branches in React development with Git?</summary>

### How do you manage feature branches in React development with Git?

**Definition:**

</details>

<details>
<summary>What are your strategies for resolving merge conflicts in React projects?</summary>

### What are your strategies for resolving merge conflicts in React projects?

**Definition:**

</details>

### React Interviews Problem Solving and Scenarios

<details>
<summary>How would you handle a feature request or bug report in an ongoing React project?</summary>

### How would you handle a feature request or bug report in an ongoing React project?

**Definition:**

</details>

<details>
<summary>Describe your process for optimizing a component that has complex state logic and several child components.</summary>

### Describe your process for optimizing a component that has complex state logic and several child components.

**Definition:**

</details>
