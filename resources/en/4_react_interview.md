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

React is a JavaScript library for user interfaces built from components. You describe the UI for a given state, and React updates the DOM to match.

**How it works:**

- A component is a function of props (and, if it needs them, state) that returns elements. The UI is the result of that function, not a list of imperative DOM edits.
- Data flows down through props. A child does not reach up and rewrite a parent’s variables.
- JSX is the usual syntax. A build step turns it into element calls. The runtime does not understand JSX.
- React keeps an in-memory tree, diffs it against the previous one, and writes the difference to the host (the DOM, or a native renderer).
- Function components and Hooks are the current style: `useState` for state, `useEffect` for synchronizing with something outside React.
- Concurrent rendering can prepare an update without blocking input. Server Components render on the server and can ship no client JavaScript for the parts that stay there.
- React is a UI library. Routing, data loading, and a full framework are choices you add, often through Next.js or a similar host.
- TypeScript fits it directly: props are a type on the function argument.

**Examples:**

```jsx
function Berth({ name }) {
  return <p>{name}</p>;
}
```

**Sources:**

- https://react.dev/learn
- https://react.dev/learn/describing-the-ui

</details>

<details>
<summary>How is React different from Angular or Vue?</summary>

### How is React different from Angular or Vue?

**Definition:**

React is a UI library: you compose functions that return elements. Angular is a full platform with its own compiler, injector, and template language. Vue is a progressive framework whose templates and reactivity are part of the core.

**How it works:**

- React leaves routing, HTTP, and folder layout to you or to a meta-framework. Angular ships those opinions. Vue sits between them: the core is small, and the router and Pinia are official add-ons.
- React UI is JSX, which is JavaScript. Angular and Vue templates are HTML-like languages with their own control-flow syntax (`@if` / `@for` in modern Angular, directives and `v-if` in Vue).
- React updates by rendering the component and comparing the result. Vue tracks which reactive properties a render read. Angular’s newer signal model tracks dependencies too; the older zone-based detection rendered more broadly.
- Shared client state in React is `useState`, lifted state, or Context, and a store such as Redux or Zustand when the update graph gets large. Angular uses services and signals. Vue’s usual store is Pinia.
- React Hooks and composition replace inheritance. Vue’s Composition API is the same idea. Angular composes with dependency injection and standalone components.
- TypeScript is the default in Angular and common in React and Vue. The learning cost in React is the ecosystem (routing, data, server components), not a single mandated stack.

**Examples:**

```jsx
function Pier({ name }) {
  return <h1>{name}</h1>;
}
```

A Vue or Angular version of the same heading would be a template binding, not a JavaScript expression inside the markup.

**Sources:**

- https://react.dev/learn/thinking-in-react
- https://angular.dev/overview
- https://vuejs.org/guide/introduction.html

</details>

<details>
<summary>What is a React component?</summary>

### What is a React component?

**Definition:**

A component is a function that takes props and returns UI. It can own state. Together, components form a tree whose root is mounted with `createRoot`.

**How it works:**

- The name starts with a capital letter so JSX treats it as a component, not a host tag.
- Props are the input. The function should not change them. State is data the component can replace by calling a setter, which schedules a new render.
- Hooks (`useState`, `useEffect`, `useContext`) are how a function keeps state and talks to the outside world. They are called at the top level, in the same order every render.
- Class components (`extends React.Component`) still run. New code uses functions. Classes need `this`, a `render` method, and lifecycle methods that Hooks fold into effects.
- A Server Component runs on the server and cannot use state or effects. A Client Component, marked with `"use client"` in a React Server Components host, can.
- One component renders many children. Reuse is composition: pass elements as `children` or as named props, rather than subclassing a component.
- A render must be pure. Do not subscribe, fetch, or mutate the DOM during render. Effects and event handlers are the places for that.

**Examples:**

```jsx
function Tide({ height }) {
  return <p>Height {height} m</p>;
}
```

**Sources:**

- https://react.dev/learn/your-first-component

</details>

<details>
<summary>How do you create a component in React?</summary>

### How do you create a component in React?

**Definition:**

Write a function whose name starts with a capital letter, accept props, and return JSX. Render it as `<Tide height={2} />`.

**How it works:**

- Props arrive as one object. Destructure what you need. Default values use normal JavaScript defaults.
- Local state is `useState`. A subscription or a timer is `useEffect` with a cleanup. Do not copy class lifecycle methods one-for-one.
- Shared logic moves into a custom Hook (`useTide`) that calls other Hooks. That is the replacement for mixins and most higher-order components.
- Type the props with a `type` or an `interface`. PropTypes are the runtime predecessor and are optional once TypeScript checks the call.
- A file may export one main component. Keep it focused; split when a piece has its own state or is reused.
- In a Server Components setup, add `"use client"` only on the modules that need state, effects, or browser APIs.
- The parent renders the child. You do not call the function yourself in JSX (`Tide()`); you use the element form so React can track the component.

**Examples:**

```jsx
function Tide({ height = 0 }) {
  return <p>Height {height} m</p>;
}
```

**Sources:**

- https://react.dev/learn/your-first-component
- https://react.dev/learn/passing-props-to-a-component

</details>

<details>
<summary>What is JSX and why do we use it in React?</summary>

### What is JSX and why do we use it in React?

**Definition:**

JSX is a syntax extension that looks like HTML inside JavaScript. A compiler turns `<Tide height={2} />` into a call that creates a React element. It is not a string of HTML.

**How it works:**

- The modern transform emits `jsx` / `jsxs` from `react/jsx-runtime`. You do not import `React` only to satisfy `React.createElement`, unless a tool still uses the classic transform.
- Curly braces insert an expression: text, a number, an element, or an array of elements. A statement (`if`, `for`) is not an expression; compute the value above the `return` or use a conditional expression.
- Attribute names are camelCase (`className`, `htmlFor`, `onClick`) because they become JavaScript properties, and some HTML names are reserved words.
- A component must return one parent node, or a fragment (`<>...</>`), which does not create a DOM node.
- JSX is checked as it compiles. A missing closing tag or, with TypeScript, a missing required prop fails the build.
- The same syntax is used for client components and server components. The directive and the imports decide where it runs, not a different markup language.
- You could call `createElement` by hand. JSX is the form people can scan, because the nesting matches the tree.

**Examples:**

```jsx
const height = 2;
const node = <p className="tide">Height {height} m</p>;
```

**Sources:**

- https://react.dev/learn/writing-markup-with-jsx

</details>

<details>
<summary>Can you explain the virtual DOM in React?</summary>

### Can you explain the virtual DOM in React?

**Definition:**

The virtual DOM is React’s in-memory description of the UI. After a state update, React renders a new tree, compares it with the previous one, and applies the difference to the real DOM.

**How it works:**

- Render produces element objects (type, props, children). That is cheap next to touching the document.
- Reconciliation walks the new tree. Same component type in the same place updates the existing instance. A different type unmounts the old subtree and mounts a new one.
- Lists need stable `key` props so React can match rows instead of reusing the wrong DOM node.
- The work is split into units called fibers. Concurrent rendering can pause that work, keep showing the current screen, and finish an urgent update first.
- The commit phase is when DOM mutations, layout effects, and passive effects run. Updates in one event are batched, so several `setState` calls become one paint.
- If a new state value is `Object.is` equal to the old one, React bails out of re-rendering that component.
- `react-dom` is the renderer for the browser. React Native and other hosts reuse the same reconciliation and supply their own host config. You still do not edit the DOM as the source of truth; a ref is the escape hatch.

**Examples:**

```jsx
{tides.map((tide) => (
  <li key={tide.id}>{tide.height}</li>
))}
```

**Sources:**

- https://react.dev/learn/preserving-and-resetting-state
- https://react.dev/learn/rendering-lists

</details>

<details>
<summary>What are the differences between a class component and a functional component?</summary>

### What are the differences between a class component and a functional component?

**Definition:**

A function component is a function of props. A class component is an instance of `React.Component` with a `render` method. Hooks give functions the state and effects that classes used to own.

**How it works:**

- Functions have no `this` and no `render`. The return value is the UI. Classes store state on `this.state` and update it with `this.setState`, which shallow-merges.
- `useState` replaces a state field. The setter replaces that field; it does not merge objects unless you merge them yourself.
- Class lifecycles (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`) split one concern across methods. `useEffect` keeps setup and cleanup for one concern together.
- A class method passed as a callback loses `this` unless you bind it. A function does not have that problem. An event handler can be an inner function or a `useCallback` when a child is memoized.
- Classes read one context through `contextType`, or through a consumer. Functions call `useContext` as many times as they need.
- Server Components and the current hook APIs are built for functions. Classes remain for existing code; they are not the place to start a feature.
- `PureComponent` and `memo` both skip a render when props are shallowly equal. They do not make the two styles equivalent.

**Examples:**

```jsx
function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}
```

**Sources:**

- https://react.dev/reference/react/Component
- https://react.dev/reference/react/useState

</details>

<details>
<summary>How do you handle events in React?</summary>

### How do you handle events in React?

**Definition:**

Event props are camelCase functions, such as `onClick` and `onChange`. React listens on the root and dispatches a synthetic event that wraps the native one.

**How it works:**

- You pass a function, not a string of code. `onClick={save}` passes the function. `onClick={save()}` calls it during render.
- The handler receives a `SyntheticEvent`. `preventDefault` works. Pooling was removed in React 17, so you may read `event.target` after an `await` without calling `persist`.
- `onChange` on an input fires on every edit, not only on blur. The value is `event.target.value`. A controlled input also sets `value` from state.
- Handlers are ordinary closures, so they see the props and state of that render. If you update from the previous state, use the setter’s function form.
- React attaches listeners at the root container, not one native listener per row, and still gives you the component’s event as `currentTarget` logic through the tree.
- `useCallback` is useful when a memoized child should not render only because the parent passed a new function. It is not required on every handler.
- Non-urgent work that starts from an event can be wrapped in `startTransition`, so typing stays responsive while a slow render catches up.

**Examples:**

```jsx
function Search() {
  const [q, setQ] = useState("");
  return (
    <input value={q} onChange={(event) => setQ(event.target.value)} />
  );
}
```

**Sources:**

- https://react.dev/learn/responding-to-events

</details>

<details>
<summary>What are state and props in React?</summary>

### What are state and props in React?

**Definition:**

Props are inputs a parent passes in. State is data the component owns and can change. A render is the result of both.

**How it works:**

- Props are read-only. If a child needs a new value, it asks the parent through a callback, or the parent passes a different prop on the next render.
- `useState(initial)` returns the current value and a setter. Calling the setter schedules a render. The initial value is used only on the first mount, unless you pass a function to compute it lazily.
- State updates are batched. Several setters in one event become one render.
- Changing state replaces that piece of state. Nested objects are not merged. Copy the fields you keep.
- Props change when the parent renders with new values. State survives those renders until the component unmounts, or until a `key` change remounts it.
- A Server Component cannot call `useState`. State lives in Client Components.
- Do not mirror a prop into state unless you are intentionally snapshotting it. The prop is already an input to render.

**Examples:**

```jsx
function Meter({ unit }) {
  const [value, setValue] = useState(0);
  return <p>{value} {unit}</p>;
}
```

**Sources:**

- https://react.dev/learn/state-a-components-memory
- https://react.dev/learn/passing-props-to-a-component

</details>

<details>
<summary>How do you pass data between components in React?</summary>

### How do you pass data between components in React?

**Definition:**

Parent to child is a prop. Child to parent is a function prop the child calls. Siblings share data by lifting it to the parent that renders both, or by reading a context that parent provides.

**How it works:**

- `<Tide height={2} />` passes a prop. The child receives `{ height: 2 }`.
- An event prop such as `onChange` lets the child hand a value back. The parent stores it in state and passes the new value down.
- `children` and named element props (`icon={<Icon />}`) pass UI, not only data, so the parent does not have to know the child’s markup.
- Prop drilling is the pain of forwarding a value through components that do not use it. Context removes that forwarding for a value many descendants read.
- Context is a poor fit for a value that changes every keystroke if the provider sits high: every consumer rerenders. A store with selectors, or state kept lower in the tree, avoids that.
- Server data is not “passed around” as a second copy of the cache. A data library or a server component owns the request; components receive the result as props.

**Examples:**

```jsx
function Editor({ value, onChange }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />;
}
```

**Sources:**

- https://react.dev/learn/passing-props-to-a-component
- https://react.dev/learn/sharing-state-between-components

</details>

### React State Management

<details>
<summary>What is a stateful component?</summary>

### What is a stateful component?

**Definition:**

A stateful component keeps data that can change after the first render, such as the text in a field or whether a panel is open. A stateless component renders only from props.

**How it works:**

- `useState` or `useReducer` is what makes a function stateful. The values live with the component instance in React’s fiber, not in a local variable that render would reset.
- Updating state schedules a new render of that component and, by default, its children.
- Use state for interaction that the server did not already decide: a toggle, a draft, a selected row.
- Do not put derived data in state. A filtered list can be computed during render from the source list and the query.
- A component with state should own as little as possible. If two children need the same value, the state belongs to their parent.
- Memoizing children (`memo`) limits how far a state update repaints, when their props did not change.
- Class state (`this.state`) is the older form of the same idea. New components use Hooks.

**Examples:**

```jsx
function Panel() {
  const [open, setOpen] = useState(false);
  return <button onClick={() => setOpen((v) => !v)}>{open ? "Hide" : "Show"}</button>;
}
```

**Sources:**

- https://react.dev/learn/state-a-components-memory

</details>

<details>
<summary>Can you explain how useState works?</summary>

### Can you explain how useState works?

**Definition:**

`useState(initial)` returns the current value for this component instance and a setter that schedules an update. React matches each call to a slot by the order of Hook calls.

**How it works:**

- The initial value is read on the first render only. Pass a function, `useState(() => expensive())`, when computing it is costly; React calls that function once.
- The setter identity is stable across renders. You can pass it down without wrapping it in `useCallback` for stability alone.
- `setValue(next)` stores `next`. `setValue(prev => prev + 1)` computes from the latest value and is the form to use when the next value depends on the previous one, especially under concurrent rendering.
- React bails out when `Object.is` says the next value is the current one. For objects, a new reference is a change even if the fields match.
- All calls in one event, timeout, or promise are batched. You do not get one render per setter.
- Hooks must run unconditionally and in the same order. A `useState` inside an `if` shifts the slots and corrupts state.
- State is per position in the tree. Two `<Counter />` elements each have their own `useState` slot.

**Examples:**

```jsx
const [count, setCount] = useState(0);
setCount((n) => n + 1);
```

**Sources:**

- https://react.dev/reference/react/useState

</details>

<details>
<summary>How do you update the state of a parent component from a child component?</summary>

### How do you update the state of a parent component from a child component?

**Definition:**

The parent owns the state and passes the setter, or a function that calls the setter, down as a prop. The child calls that function. The child does not write the parent’s state directly.

**How it works:**

- `function Child({ onPick })` and `<Child onPick={setId} />` is the basic shape. `setId` from `useState` is already a stable function.
- The parent then renders with the new state, and the new value comes back down as a prop. That is still one-way data flow.
- When several distant children must update the same state, provide the value and the dispatch through context, often from `useReducer`, so you do not thread the callback through every layer.
- `useImperativeHandle` exposes a method on a ref. That is for imperative cases such as `focus()`, not for ordinary form state.
- A client store (Redux, Zustand) is the step after context when many updates must notify only the components that selected a slice.
- Server data belongs in a mutation that invalidates a query, not in a parent `useState` that tries to be the cache.
- Keep the state at the lowest parent that needs it, so an update does not rerender the whole page.

**Examples:**

```jsx
function Parent() {
  const [id, setId] = useState(null);
  return <Child selected={id} onPick={setId} />;
}
```

**Sources:**

- https://react.dev/learn/sharing-state-between-components

</details>

<details>
<summary>What is lifting state up in React?</summary>

### What is lifting state up in React?

**Definition:**

Lifting state up moves state from a child to the closest parent that every interested child can see. The parent holds the value and passes it down; the children report changes through callbacks.

**How it works:**

- Two inputs that must stay in sync cannot each own a copy. The parent owns one value, or one object, and both inputs become controlled.
- Derived values (an area, a total) are computed in the parent during render and passed as props. They are not a second piece of state.
- The flow stays one-way: state down, events up. That is easier to trace than siblings writing to each other.
- Controlled inputs are the usual result. The parent can validate before it stores the next value.
- Lifting too far becomes prop drilling. If intermediate components only forward the props, pass `children` so the stateful parent renders the leaves itself, or use context for something like a theme.
- A rule of thumb: lift when two components must agree. Stop when components that do not care are forced to accept the props.
- Resetting a child by changing its `key` is a different tool. It remounts the child; it does not share state.

**Examples:**

```jsx
function Converter() {
  const [meters, setMeters] = useState(0);
  return (
    <>
      <Field value={meters} onChange={setMeters} />
      <p>{meters * 100} cm</p>
    </>
  );
}
```

**Sources:**

- https://react.dev/learn/sharing-state-between-components

</details>

<details>
<summary>When do you use Redux or Context API for state management?</summary>

### When do you use Redux or Context API for state management?

**Definition:**

Context passes a value to many descendants without threading props. Redux keeps an application store updated by actions and reducers, and components subscribe to slices of it. Most state should stay in `useState` anyway.

**How it works:**

- Context fits a value that many components read and that changes rarely: theme, locale, the current user id. Updating the provider value rerenders every consumer of that context.
- Split contexts that change on different schedules, and memoize the value object, or a theme toggle will repaint the whole tree.
- Context does not give you action logs, middleware, or a standard way to select a slice. It is dependency injection as much as it is state.
- Redux, through Redux Toolkit, fits client state that many distant features update, that you want to trace in DevTools, or that has explicit transitions. `useSelector` rerenders a component only when its selected value changes.
- RTK Query is for server cache. Do not hand-roll that cache in a slice if the library already does it.
- Prefer local state, then lifted state, then context, then a store. A store for a single form is ceremony.
- `useReducer` plus context covers a moderate shared state machine without a dependency. Move to Redux when the update graph, the middleware, or the devtools become the problem.

**Examples:**

```jsx
const Theme = createContext("light");
function App() {
  return (
    <Theme value="dark">
      <Panel />
    </Theme>
  );
}
```

**Sources:**

- https://react.dev/learn/passing-data-deeply-with-context
- https://redux.js.org/tutorials/essentials/part-1-overview-concepts

</details>

### React Lifecycle & Hooks

<details>
<summary>Explain the lifecycle methods of a React class component.</summary>

### Explain the lifecycle methods of a React class component.

**Definition:**

</details>

<details>
<summary>How do hooks work in React?</summary>

### How do hooks work in React?

**Definition:**

</details>

<details>
<summary>Can you describe the useEffect hook and its purpose?</summary>

### Can you describe the useEffect hook and its purpose?

**Definition:**

</details>

<details>
<summary>How do you fetch data with hooks in React?</summary>

### How do you fetch data with hooks in React?

**Definition:**

</details>

<details>
<summary>What rules do you have to follow when using hooks?</summary>

### What rules do you have to follow when using hooks?

**Definition:**

</details>

### Component Communication

<details>
<summary>How do props work in React?</summary>

### How do props work in React?

**Definition:**

</details>

<details>
<summary>What is prop drilling and how can you avoid it?</summary>

### What is prop drilling and how can you avoid it?

**Definition:**

</details>

<details>
<summary>Explain the Context API and its use cases.</summary>

### Explain the Context API and its use cases.

**Definition:**

</details>

<details>
<summary>How do you use render props?</summary>

### How do you use render props?

**Definition:**

</details>

<details>
<summary>What is the children prop?</summary>

### What is the children prop?

**Definition:**

</details>

### Performance Optimization

<details>
<summary>Why is performance optimization important in React?</summary>

### Why is performance optimization important in React?

**Definition:**

</details>

<details>
<summary>What is React.memo and when would you use it?</summary>

### What is React.memo and when would you use it?

**Definition:**

</details>

<details>
<summary>How does PureComponent differ from Component in React?</summary>

### How does PureComponent differ from Component in React?

**Definition:**

</details>

<details>
<summary>Can you explain the concept of reconciliation in React?</summary>

### Can you explain the concept of reconciliation in React?

**Definition:**

</details>

<details>
<summary>How can you prevent unnecessary re-renders in React?</summary>

### How can you prevent unnecessary re-renders in React?

**Definition:**

</details>

### Styling in React

<details>
<summary>How do you apply styles in a React application?</summary>

### How do you apply styles in a React application?

**Definition:**

</details>

<details>
<summary>What is CSS-in-JS and how do you implement it in React?</summary>

### What is CSS-in-JS and how do you implement it in React?

**Definition:**

</details>

<details>
<summary>Can you describe how Styled-Components work?</summary>

### Can you describe how Styled-Components work?

**Definition:**

</details>

<details>
<summary>What are the advantages of using Sass or LESS in a React project?</summary>

### What are the advantages of using Sass or LESS in a React project?

**Definition:**

</details>

<details>
<summary>How do you use inline styles in React?</summary>

### How do you use inline styles in React?

**Definition:**

</details>

### React Routing

<details>
<summary>What is React Router?</summary>

### What is React Router?

**Definition:**

</details>

<details>
<summary>How do you create dynamic routes in React?</summary>

### How do you create dynamic routes in React?

**Definition:**

</details>

<details>
<summary>How would you pass data to routes in React Router v5+?</summary>

### How would you pass data to routes in React Router v5+?

**Definition:**

</details>

<details>
<summary>How do you programmatically navigate using React Router?</summary>

### How do you programmatically navigate using React Router?

**Definition:**

</details>

<details>
<summary>What are route guards and how can you implement them in React?</summary>

### What are route guards and how can you implement them in React?

**Definition:**

</details>

### React Patterns

<details>
<summary>What are higher-order components (HOCs)?</summary>

### What are higher-order components (HOCs)?

**Definition:**

</details>

<details>
<summary>Explain the container/presenter (smart/dumb) component pattern.</summary>

### Explain the container/presenter (smart/dumb) component pattern.

**Definition:**

</details>

<details>
<summary>How would you implement a compound component pattern in React?</summary>

### How would you implement a compound component pattern in React?

**Definition:**

</details>

<details>
<summary>Explain the use of custom hooks in React.</summary>

### Explain the use of custom hooks in React.

**Definition:**

</details>

<details>
<summary>What is a render prop pattern?</summary>

### What is a render prop pattern?

**Definition:**

</details>

### Form Handling

<details>
<summary>How do you handle forms in React?</summary>

### How do you handle forms in React?

**Definition:**

</details>

<details>
<summary>What is controlled and uncontrolled components?</summary>

### What is controlled and uncontrolled components?

**Definition:**

</details>

<details>
<summary>How do you validate forms in React?</summary>

### How do you validate forms in React?

**Definition:**

</details>

<details>
<summary>What is Formik and how is it used in React forms?</summary>

### What is Formik and how is it used in React forms?

**Definition:**

</details>

<details>
<summary>How do you handle file uploads in React?</summary>

### How do you handle file uploads in React?

**Definition:**

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
