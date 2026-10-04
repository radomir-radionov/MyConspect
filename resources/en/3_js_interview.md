# JS — Interview

JavaScript interview questions. Answers are filled for the published subset; the rest are still empty.

[← Back to JS hub](./3_js.md)

### Related docs

- [Language](./3_js_core.md) · [Operators & Loops](./3_js_operators.md) · [Arrays](./3_js_array.md) · [Functions](./3_js_functions.md) · [Classes & Objects](./3_js_oop.md)
- [Document](./3_js_browser.md) · [Events](./3_js_events.md) · [Browser APIs](./3_js_browser_extra.md) · [Async](./3_js_async.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — JavaScript](https://devinterview.io/questions/web-and-mobile-development/javascript-interview-questions/).

### JavaScript Fundamentals

<details>
<summary>What are the data types present in JavaScript?</summary>

### What are the data types present in JavaScript?

**Definition:**

JavaScript values are primitives or objects. A primitive is not an object and has no properties of its own; an object is a collection of properties, and functions are objects you can call.

**How it works:**

- The primitives are `undefined`, `null`, boolean, number, bigint, string, and symbol.
- `typeof null` is `"object"`. That is a long-standing mistake in the operator, not a reason to treat `null` as an object.
- Number is IEEE-754 double precision. Integers past `Number.MAX_SAFE_INTEGER` are not exact; bigint covers arbitrary-size integers and does not mix with number without an explicit conversion.
- Symbol values are unique. Two `Symbol("id")` calls are never equal.
- Ordinary objects, arrays, and dates are all objects. An array is an object with indexed properties and a `length`.
- Functions are callable objects. `typeof function () {}` is `"function"`.
- The language is dynamically typed. A binding can hold a number now and a string later.
- Operators coerce values. `"5" - 1` becomes a number; `"5" + 1` becomes a string.

**Examples:**

```js
typeof 1n;          // "bigint"
typeof Symbol("id"); // "symbol"
typeof null;        // "object"
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures

</details>

<details>
<summary>What is the difference between null and undefined?</summary>

### What is the difference between null and undefined?

**Definition:**

`undefined` means no value was given. `null` means a value was given and that value is intentionally empty. They compare equal with `==` and not with `===`.

**How it works:**

- A `let` or `var` binding with no initializer is `undefined`. A missing argument is `undefined`. A missing property read is `undefined`.
- Assign `null` when you want to say “there is nothing here” on purpose, such as “this search has no match yet.”
- `typeof undefined` is `"undefined"`. `typeof null` is `"object"`.
- `null == undefined` is true. `null === undefined` is false. Prefer `===` unless you mean both empties.
- Setting a property to `null` keeps the key. `delete` removes the key. After either, a read of a missing key is `undefined`.
- Default parameters trigger on `undefined`, not on `null`. `f(null)` does not apply a default of the form `function f(x = 1)`.
- JSON has `null` and no `undefined`. `JSON.stringify` omits `undefined` in objects and turns it into `null` in arrays.

**Examples:**

```js
let pending;
const match = null;
pending == match;   // true
pending === match;  // false
({ a: undefined }).hasOwnProperty("a"); // true, key exists
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined

</details>

<details>
<summary>How does JavaScript handle type coercion?</summary>

### How does JavaScript handle type coercion?

**Definition:**

Coercion is a conversion of a value to another type. Explicit coercion is a function you call. Implicit coercion is what an operator does because it needs a number, a string, or a boolean.

**How it works:**

- Explicit: `Number("5")`, `String(5)`, `Boolean(1)`, `parseInt("10px", 10)`.
- `+` with a string concatenates, so `1 + "2"` is `"12"`. Other arithmetic coerces to number, so `"5" - 1` is `4`.
- `==` coerces when the types differ. `"4" == 4` is true. `===` does not coerce.
- `if`, `while`, and the condition of `?:` use ToBoolean. Falsy values are `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN`.
- `&&` and `||` return an operand, not necessarily a boolean. `"pier" && 0` is `0`. `"" || "tide"` is `"tide"`.
- `Object.is` and `===` still treat `NaN` as not equal to itself. Number coercion of a non-numeric string is `NaN`.
- Prefer explicit conversion at the boundary and `===` in comparisons, so the coercion is visible.

**Examples:**

```js
Number("5");   // 5
"5" - 1;       // 4
1 + "2";       // "12"
"4" == 4;      // true
"4" === 4;     // false
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality
- https://developer.mozilla.org/en-US/docs/Glossary/Type_coercion

</details>

<details>
<summary>Explain the concept of hoisting in JavaScript.</summary>

### Explain the concept of hoisting in JavaScript.

**Definition:**

Hoisting is the rule that a declaration is created for the whole scope before that scope runs. Only the declaration moves, in that sense. The initializer stays on its line.

**How it works:**

- A `function` declaration is created and initialized at the top of its scope, so a call above the declaration works.
- `var` is created at the top of the function (or script) and initialized to `undefined`. The assignment runs where it is written. A read before that line sees `undefined`, not a `ReferenceError`.
- `let` and `const` are hoisted too, but they stay uninitialized until their line. The gap is the temporal dead zone. A read there throws `ReferenceError`.
- `const` must be initialized on the declaration line. `let` may be declared and assigned later.
- A function expression assigned with `var` follows `var` rules: the name exists early, the function does not, until the assignment.
- Class declarations are also in the temporal dead zone. They are not available above the declaration the way a `function` declaration is.
- Declare bindings before use. Hoisting explains old code; it is not a style to rely on.

**Examples:**

```js
sayPier(); // "Pier 4"
function sayPier() { return "Pier 4"; }

console.log(label); // undefined
var label = "north";

// console.log(code); ReferenceError
let code = "NB";
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let

</details>

<details>
<summary>What is the scope in JavaScript?</summary>

### What is the scope in JavaScript?

**Definition:**

Scope is the region of code where a binding can be used. JavaScript has global scope, function scope, module scope, and block scope.

**How it works:**

- A binding outside every function and block, in a classic script, is global. In a browser that means a property of the global object for `var` and `function`. `let` and `const` at the top of a script are global bindings but do not become properties of `window`.
- A module (`type="module"`) has its own scope. Top-level bindings are not global unless you put them on `globalThis`.
- `var` is function-scoped. A `var` inside an `if` or `for` is visible to the whole function.
- `let`, `const`, and `class` are block-scoped. A binding inside `{ }` is not visible outside that block, and not before its line.
- An inner scope can read an outer binding. An outer scope cannot read an inner one. That lookup is lexical: it follows where the function was written, not where it was called.
- A parameter belongs to the function scope.

**Examples:**

```js
const pier = "4";
function shift() {
  const tide = "flood";
  if (tide) {
    let note = "gate open";
    var flag = true;
  }
  return flag; // true, var ignores the block
  // note is not visible here
}
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Glossary/Scope
- https://javascript.info/closure

</details>

<details>
<summary>What is the difference between == and ===?</summary>

### What is the difference between == and ===?

**Definition:**

`===` is strict equality: same value and no type conversion. `==` is abstract equality: if the types differ, it coerces, then compares.

**How it works:**

- `5 === "5"` is false. `5 == "5"` is true because the string becomes a number.
- `null == undefined` is true. `null === undefined` is false. Neither equals `0` or `false` under `==`.
- `0 == false` is true. `0 === false` is false.
- `NaN === NaN` is false. Use `Number.isNaN` or `Object.is` when NaN is the question.
- `===` skips the coercion steps, so it is the default for application code. The comparison is also easier to read.
- `==` is a deliberate tool when you mean “null or undefined”: `value == null`. Anywhere else, the coercion table is too easy to get wrong.
- Object equality is by reference for both operators, once the values are objects. Two distinct `{ a: 1 }` objects are not equal.

**Examples:**

```js
0 == false;          // true
0 === false;         // false
null == undefined;   // true
null === undefined;  // false
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality

</details>

<details>
<summary>Describe closure in JavaScript. Can you give an example?</summary>

### Describe closure in JavaScript. Can you give an example?

**Definition:**

A closure is a function together with the bindings of the scope where it was created. Those bindings stay available after the outer function has returned.

**How it works:**

- The outer function creates local bindings. The inner function reads or writes them. Returning the inner function (or registering it as a handler) keeps that environment alive.
- Each call of the outer function makes a new environment. Two counters from two calls do not share a `count`.
- Closures are how JavaScript hides state: the binding is not a property of the returned object, so outside code cannot read it by name.
- Timers and event handlers close over the variables they use. A loop variable is a classic trap: `var` is one binding for every iteration; `let` in `for` is one binding per iteration.
- A closure can keep a large object alive. Drop the reference to the inner function when the state should be collected.
- If the closed-over binding is reassigned later, the inner function sees the new value. It captured the binding, not a frozen copy, unless you copied the value into a `const`.

**Examples:**

```js
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const next = makeCounter();
next(); // 1
next(); // 2
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures
- https://javascript.info/closure

</details>

<details>
<summary>What is the 'this' keyword and how does its context change?</summary>

### What is the 'this' keyword and how does its context change?

**Definition:**

`this` is set by how a function is called, not by where a plain function is written. An arrow function does not have its own `this`; it uses the `this` of the surrounding scope.

**How it works:**

- A method call `obj.shift()` sets `this` to `obj`.
- A plain call `shift()` sets `this` to `undefined` in strict mode and modules. In a classic non-strict script it is the global object.
- `new Shift()` sets `this` to the new object.
- `fn.call(obj, arg)`, `fn.apply(obj, args)`, and `fn.bind(obj)` set `this` explicitly. `bind` returns a new function with that `this` fixed.
- An arrow function ignores `call`, `apply`, and `bind` for `this`. It keeps the `this` from where the arrow was created.
- A listener registered as a method reference (`el.addEventListener("click", obj.save)`) is a plain call, so `this` is not `obj`. Pass `obj.save.bind(obj)` or an arrow that calls `obj.save()`.
- Classes and modules are strict. Do not rely on `this` being `window`.

**Examples:**

```js
const berth = {
  name: "Pier 4",
  label() { return this.name; },
};
const loose = berth.label;
berth.label(); // "Pier 4"
loose();       // undefined in strict mode
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
- https://javascript.info/object-methods

</details>

<details>
<summary>What are arrow functions and how do they differ from regular functions?</summary>

### What are arrow functions and how do they differ from regular functions?

**Definition:**

An arrow function is a function expression written with `=>`. It has a shorter form and it does not get its own `this`, `arguments`, or `new.target`.

**How it works:**

- One parameter and one expression need no parentheses or braces: `n => n + 1`. The expression’s value is the return value.
- A block body uses braces and an explicit `return`.
- `this` is lexical. An arrow inside a method sees the method’s `this`, which is why arrows are useful as callbacks there.
- An arrow used as an event handler does not receive the element as `this`. The element is `event.currentTarget`.
- Arrows cannot be constructors. `new` on an arrow throws.
- They have no `prototype` and no own `arguments` object. Rest parameters cover the argument list.
- They fit `map`, `filter`, and short callbacks. A method that should use the call-site `this` is still a regular method, not an arrow property, unless you want lexical `this` on purpose.

**Examples:**

```js
const twice = (n) => n * 2;
const berth = {
  name: "Pier 4",
  titles() {
    return ["a", "b"].map((item) => `${this.name}:${item}`);
  },
};
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

</details>

<details>
<summary>What are template literals in JavaScript?</summary>

### What are template literals in JavaScript?

**Definition:**

A template literal is a string written in backticks. It may span lines, and `${expression}` inserts the value of an expression.

**How it works:**

- `` `Pier ${id}` `` converts the expression with the ordinary ToString rules and builds one string.
- Newlines in the literal are part of the string. You do not need `\n` for a line break you actually typed.
- Any expression is allowed inside `${}`, including a call or a conditional. Keep it small; a large block inside the braces is hard to read.
- A tagged template calls a function with the string parts and the interpolated values. Libraries use that to escape HTML or build queries. An untagged literal does not escape HTML.
- They are ordinary strings after evaluation. There is no special runtime type.
- Older engines without template support need a transpile step. Current browsers implement them.

**Examples:**

```js
const pier = 4;
const line = `Berth at pier ${pier}`;
const board = `North
South`;
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals

</details>

### JavaScript Functions and Higher-Order Functions

<details>
<summary>What is a higher-order function in JavaScript?</summary>

### What is a higher-order function in JavaScript?

**Definition:**

A higher-order function takes a function as an argument, returns a function, or both. That works because functions are values.

**How it works:**

- `map`, `filter`, and `reduce` take a function and return a new array (or a folded value). They do not need a hand-written loop at the call site.
- `setTimeout`, `addEventListener`, and `Promise.prototype.then` take callbacks. The caller decides what happens later.
- A function can return a function that closes over an argument, which is how you specialize behavior: `const twice = multiplyBy(2)`.
- The returned function keeps the lexical environment of the factory. That is the closure, not a separate feature of `map`.
- Higher-order functions are the usual way to share a repeated step (retry, log, authorize) without copying the step into every call.
- They are still ordinary calls. There is no extra runtime type called “higher-order.”

**Examples:**

```js
const multiplyBy = (factor) => (n) => n * factor;
const twice = multiplyBy(2);
[1, 2, 3].map(twice); // [2, 4, 6]
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Glossary/First-class_function
- https://javascript.info/array-methods

</details>

<details>
<summary>Can functions be assigned as values to variables in JavaScript?</summary>

### Can functions be assigned as values to variables in JavaScript?

**Definition:**

Yes. Functions are values, so a function can be stored in a binding, passed as an argument, returned, or placed in an array or object.

**How it works:**

- A function declaration creates a binding in its scope. A function expression or an arrow produces a value you assign: `const greet = function () {}`.
- Assigning a function copies the reference. `const say = greet` does not clone the function. Calling `say()` calls the same function.
- Reassigning the binding points it at a different function. Other bindings that still hold the old reference are unchanged.
- Callbacks, event listeners, and module exports are this mechanism. You pass the function; the other side calls it.
- A method is a function stored as a property. Pulling it off the object (`const fn = obj.save`) loses the method call, so `this` changes.
- Names of function expressions help stack traces. Anonymous arrows do not name themselves.

**Examples:**

```js
function greet() { return "hello"; }
const say = greet;
say(); // "hello"
const later = () => "ahoy";
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Glossary/First-class_function
- https://javascript.info/function-expressions

</details>

<details>
<summary>How do functional programming concepts apply in JavaScript?</summary>

### How do functional programming concepts apply in JavaScript?

**Definition:**

JavaScript can be written in a functional style because functions are values. Purity, immutable updates, and higher-order functions are conventions on top of that, not a separate runtime.

**How it works:**

- First-class functions let you pass `map` a transformer instead of writing the loop.
- A pure function’s result depends only on its arguments and it does not change outside state. `n => n * 2` is pure. A function that writes `document.title` is not.
- Prefer new arrays and objects (`map`, spread, `filter`) over mutating a shared list when many readers hold it.
- Declarative array methods say what the result is. A `for` loop says how to build it. Both are valid; the methods shine when the step is “keep, drop, or reshape each item.”
- JavaScript does not enforce immutability. `const` freezes the binding, not the object. A pure style is something you keep, or you use a library that helps.
- Side effects belong at the edges: reading input, writing the DOM, calling the network. The calculation in the middle stays a function of its data.

**Examples:**

```js
const open = [{ id: 1, free: true }, { id: 2, free: false }];
const freeIds = open.filter((b) => b.free).map((b) => b.id);
```

**Sources:**

- https://javascript.info/array-methods
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map

</details>

<details>
<summary>What are IIFEs (Immediately Invoked Function Expressions)?</summary>

### What are IIFEs (Immediately Invoked Function Expressions)?

**Definition:**

An IIFE is a function expression that runs at once. Parentheses turn the function into an expression, and the trailing `()` calls it.

**How it works:**

- `(function () { const secret = 1; })();` creates a scope, runs it, and leaves `secret` unreachable outside.
- That was the usual way to avoid global variables before modules and `let`.
- A named IIFE can call itself for a small recursive job, and the name shows up in stack traces.
- `!function () {}()` and `void function () {}()` are other ways to force an expression. The parentheses form is the one people recognize.
- An arrow works too: `(() => { /* setup */ })();`
- Today a module, or a plain block with `let` and `const`, gives you the scope without the ceremony. An IIFE still fits a one-off scope inside a classic script.
- The function’s return value can be stored: `const api = (function () { return { open() {} }; })();`. That is the old module pattern.
- Minifiers rename locals inside the IIFE. They do not leak those names unless the code assigned them to the global object.

**Examples:**

```js
const pierId = (function () {
  const seed = 4;
  return `pier-${seed}`;
})();
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Glossary/IIFE
- https://javascript.info/function-expressions

</details>

<details>
<summary>How do you create private variables in JavaScript?</summary>

### How do you create private variables in JavaScript?

**Definition:**

A binding is private when only the functions that close over it can see it. Modern classes can also use `#` fields, which are private per instance at runtime.

**How it works:**

- A factory closes over `let` bindings and returns only the functions that should be public. Callers never receive the binding itself.
- A constructor can do the same: locals in the constructor are visible to methods defined in that constructor, and not on the prototype as data.
- Methods created inside the constructor are per instance. A prototype method cannot see those constructor locals. `#` fields fix that: every method in the class body can read `#secret`, and outside code cannot.
- `#` access from outside the class is a syntax error. TypeScript `private` is different: it is erased, and the property still exists at runtime.
- An IIFE module returns a public object and keeps the rest closed over. ES modules replace that pattern: a binding that is not exported is already private to the module.
- WeakMap keyed by the instance is the older way to attach private data to objects you do not control. New class code should prefer `#` fields.
- Privacy here is visibility, not security against a modified environment. Do not treat it as a place to hide a secret from the page’s own scripts.

**Examples:**

```js
function makeLocker(secret) {
  return {
    check(guess) { return guess === secret; },
  };
}

class Locker {
  #secret;
  constructor(secret) { this.#secret = secret; }
  check(guess) { return guess === this.#secret; }
}
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures

</details>

### JavaScript Objects and Prototypes

<details>
<summary>How do you create an object in JavaScript?</summary>

### How do you create an object in JavaScript?

**Definition:**

</details>

<details>
<summary>What are prototypes in JavaScript?</summary>

### What are prototypes in JavaScript?

**Definition:**

</details>

<details>
<summary>Explain prototypal inheritance.</summary>

### Explain prototypal inheritance.

**Definition:**

</details>

<details>
<summary>What is the difference between object literals and constructor functions?</summary>

### What is the difference between object literals and constructor functions?

**Definition:**

</details>

<details>
<summary>How do you add or remove properties from an object?</summary>

### How do you add or remove properties from an object?

**Definition:**

</details>

### Asynchronous JavaScript

<details>
<summary>What is the event loop in JavaScript?</summary>

### What is the event loop in JavaScript?

**Definition:**

</details>

<details>
<summary>Explain how callbacks work in JavaScript.</summary>

### Explain how callbacks work in JavaScript.

**Definition:**

</details>

<details>
<summary>What are promises and how do they manage asynchronous code?</summary>

### What are promises and how do they manage asynchronous code?

**Definition:**

</details>

<details>
<summary>Explain async/await in JavaScript and how it differs from Promises.</summary>

### Explain async/await in JavaScript and how it differs from Promises.

**Definition:**

</details>

<details>
<summary>What is the Job Queue (or Microtask Queue)?</summary>

### What is the Job Queue (or Microtask Queue)?

**Definition:**

</details>

### DOM Manipulation and Browser APIs

<details>
<summary>How do you select DOM elements using JavaScript?</summary>

### How do you select DOM elements using JavaScript?

**Definition:**

</details>

<details>
<summary>Explain event propagation in the DOM.</summary>

### Explain event propagation in the DOM.

**Definition:**

</details>

<details>
<summary>How do you prevent a form from submitting using JavaScript?</summary>

### How do you prevent a form from submitting using JavaScript?

**Definition:**

</details>

<details>
<summary>What are Web APIs in the context of JavaScript?</summary>

### What are Web APIs in the context of JavaScript?

**Definition:**

</details>

<details>
<summary>How can you manipulate the browser history using JavaScript?</summary>

### How can you manipulate the browser history using JavaScript?

**Definition:**

</details>

### ES2015+ and Modern JavaScript Features

<details>
<summary>What are the new features introduced in ES6?</summary>

### What are the new features introduced in ES6?

**Definition:**

</details>

<details>
<summary>How do you use destructuring assignments in ES6?</summary>

### How do you use destructuring assignments in ES6?

**Definition:**

</details>

<details>
<summary>Explain the use of const and let keywords.</summary>

### Explain the use of const and let keywords.

**Definition:**

</details>

<details>
<summary>What are default parameters in JavaScript functions?</summary>

### What are default parameters in JavaScript functions?

**Definition:**

</details>

<details>
<summary>Explain the concept of modules in ES6.</summary>

### Explain the concept of modules in ES6.

**Definition:**

</details>

### Event Handling

<details>
<summary>How do you handle events in JavaScript?</summary>

### How do you handle events in JavaScript?

**Definition:**

</details>

<details>
<summary>What is event delegation and why is it useful?</summary>

### What is event delegation and why is it useful?

**Definition:**

</details>

<details>
<summary>How do you add and remove an event listener from an element?</summary>

### How do you add and remove an event listener from an element?

**Definition:**

</details>

<details>
<summary>Can you explain how "this" works in event handlers?</summary>

### Can you explain how "this" works in event handlers?

**Definition:**

</details>

<details>
<summary>What is the difference between event.preventDefault() and event.stopPropagation()?</summary>

### What is the difference between event.preventDefault() and event.stopPropagation()?

**Definition:**

</details>

### Web Storage and Security

<details>
<summary>What is the difference between localStorage, sessionStorage, and cookies?</summary>

### What is the difference between localStorage, sessionStorage, and cookies?

**Definition:**

</details>

<details>
<summary>Can you explain Cross-Site Scripting (XSS) and how to prevent it?</summary>

### Can you explain Cross-Site Scripting (XSS) and how to prevent it?

**Definition:**

</details>

<details>
<summary>What is Cross-Origin Resource Sharing (CORS) and how does it work?</summary>

### What is Cross-Origin Resource Sharing (CORS) and how does it work?

**Definition:**

</details>

<details>
<summary>How does content security policy (CSP) help in preventing security attacks?</summary>

### How does content security policy (CSP) help in preventing security attacks?

**Definition:**

</details>

### JavaScript Debugging

<details>
<summary>What tools and techniques do you use for debugging JavaScript code?</summary>

### What tools and techniques do you use for debugging JavaScript code?

**Definition:**

</details>

<details>
<summary>How do you debug a JavaScript application in the browser?</summary>

### How do you debug a JavaScript application in the browser?

**Definition:**

</details>

<details>
<summary>Explain the concept and use of breakpoints.</summary>

### Explain the concept and use of breakpoints.

**Definition:**

</details>

<details>
<summary>How do you handle exceptions in JavaScript?</summary>

### How do you handle exceptions in JavaScript?

**Definition:**

</details>

### Performance and Optimization

<details>
<summary>What techniques can be used to improve JavaScript performance?</summary>

### What techniques can be used to improve JavaScript performance?

**Definition:**

</details>

<details>
<summary>How does JavaScript minification and bundling contribute to performance?</summary>

### How does JavaScript minification and bundling contribute to performance?

**Definition:**

</details>

<details>
<summary>Discuss the importance of web page loading time and performance.</summary>

### Discuss the importance of web page loading time and performance.

**Definition:**

</details>

<details>
<summary>Explain how lazy loading works in JavaScript.</summary>

### Explain how lazy loading works in JavaScript.

**Definition:**

</details>

### JavaScript Testing

<details>
<summary>What are some JavaScript testing frameworks you know?</summary>

### What are some JavaScript testing frameworks you know?

**Definition:**

</details>

<details>
<summary>How can you write unit tests for JavaScript code?</summary>

### How can you write unit tests for JavaScript code?

**Definition:**

</details>

<details>
<summary>What is Test-Driven Development (TDD) in JavaScript?</summary>

### What is Test-Driven Development (TDD) in JavaScript?

**Definition:**

</details>

<details>
<summary>Can you explain the difference between unit and integration testing?</summary>

### Can you explain the difference between unit and integration testing?

**Definition:**

</details>

### Networking with JavaScript

<details>
<summary>How do you make HTTP requests in JavaScript?</summary>

### How do you make HTTP requests in JavaScript?

**Definition:**

</details>

<details>
<summary>What is the difference between XMLHttpRequest and Fetch API?</summary>

### What is the difference between XMLHttpRequest and Fetch API?

**Definition:**

</details>

<details>
<summary>What is AJAX, and how does it work?</summary>

### What is AJAX, and how does it work?

**Definition:**

</details>

<details>
<summary>How do you use WebSockets in a web application?</summary>

### How do you use WebSockets in a web application?

**Definition:**

</details>

### JavaScript Patterns and Best Practices

<details>
<summary>What is a design pattern in JavaScript?</summary>

### What is a design pattern in JavaScript?

**Definition:**

</details>

<details>
<summary>Can you explain the module pattern?</summary>

### Can you explain the module pattern?

**Definition:**

</details>

<details>
<summary>What is the Singleton pattern in JavaScript?</summary>

### What is the Singleton pattern in JavaScript?

**Definition:**

</details>

<details>
<summary>Explain the Revealing Module pattern.</summary>

### Explain the Revealing Module pattern.

**Definition:**

</details>

<details>
<summary>What are some best practices for coding in JavaScript?</summary>

### What are some best practices for coding in JavaScript?

**Definition:**

</details>

### JavaScript Algorithms and Data Structures

<details>
<summary>How do you implement a stack and a queue in JavaScript?</summary>

### How do you implement a stack and a queue in JavaScript?

**Definition:**

</details>

<details>
<summary>Explain how to sort an array in JavaScript.</summary>

### Explain how to sort an array in JavaScript.

**Definition:**

</details>

<details>
<summary>How do you check if a string is a palindrome?</summary>

### How do you check if a string is a palindrome?

**Definition:**

</details>

<details>
<summary>Describe a recursive function and provide an example.</summary>

### Describe a recursive function and provide an example.

**Definition:**

</details>

<details>
<summary>What is the time complexity of JavaScript operations?</summary>

### What is the time complexity of JavaScript operations?

**Definition:**

</details>

### JavaScript Libraries and Frameworks

<details>
<summary>What is the difference between a library and a framework in JavaScript?</summary>

### What is the difference between a library and a framework in JavaScript?

**Definition:**

</details>

<details>
<summary>Explain the Virtual DOM in React.</summary>

### Explain the Virtual DOM in React.

**Definition:**

</details>

<details>
<summary>How does data binding work in Angular?</summary>

### How does data binding work in Angular?

**Definition:**

</details>

<details>
<summary>What is Vue.js and what sets it apart from other frameworks?</summary>

### What is Vue.js and what sets it apart from other frameworks?

**Definition:**

</details>

<details>
<summary>Can you describe the jQuery library and its applications?</summary>

### Can you describe the jQuery library and its applications?

**Definition:**

</details>

### JavaScript ES2017+ and Beyond

<details>
<summary>What are async iterators and generators?</summary>

### What are async iterators and generators?

**Definition:**

</details>

<details>
<summary>What is the purpose of the async keyword?</summary>

### What is the purpose of the async keyword?

**Definition:**

</details>

<details>
<summary>Can you explain the use of Object.entries() and Object.values()?</summary>

### Can you explain the use of Object.entries() and Object.values()?

**Definition:**

</details>

<details>
<summary>How does JavaScript handle big integers (BigInt)?</summary>

### How does JavaScript handle big integers (BigInt)?

**Definition:**

</details>

<details>
<summary>What are dynamic imports in JavaScript?</summary>

### What are dynamic imports in JavaScript?

**Definition:**

</details>

### Browser Compatibility and Transpilation

<details>
<summary>How do you ensure your JavaScript code is cross-browser compatible?</summary>

### How do you ensure your JavaScript code is cross-browser compatible?

**Definition:**

</details>

<details>
<summary>What is Babel and how is it used in JavaScript development?</summary>

### What is Babel and how is it used in JavaScript development?

**Definition:**

</details>

<details>
<summary>What are polyfills, and when would you use them?</summary>

### What are polyfills, and when would you use them?

**Definition:**

</details>

### JavaScript and the DOM

<details>
<summary>What is the Document Object Model (DOM)?</summary>

### What is the Document Object Model (DOM)?

**Definition:**

</details>

<details>
<summary>How do you create, append, or remove an element from the DOM?</summary>

### How do you create, append, or remove an element from the DOM?

**Definition:**

</details>

<details>
<summary>Describe different ways to find or access HTML elements in the DOM.</summary>

### Describe different ways to find or access HTML elements in the DOM.

**Definition:**

</details>

<details>
<summary>Explain the difference between innerHTML and textContent.</summary>

### Explain the difference between innerHTML and textContent.

**Definition:**

</details>

<details>
<summary>How do you handle DOM events in a memory-efficient way?</summary>

### How do you handle DOM events in a memory-efficient way?

**Definition:**

</details>

### Tooling and Build Systems

<details>
<summary>What is npm, and how do you use it?</summary>

### What is npm, and how do you use it?

**Definition:**

</details>

<details>
<summary>Discuss the role of Webpack in modern JavaScript development.</summary>

### Discuss the role of Webpack in modern JavaScript development.

**Definition:**

</details>

<details>
<summary>What is a source map?</summary>

### What is a source map?

**Definition:**

</details>

<details>
<summary>How do you use ESLint for maintaining JavaScript code quality?</summary>

### How do you use ESLint for maintaining JavaScript code quality?

**Definition:**

</details>

<details>
<summary>What is continuous integration/continuous deployment (CI/CD) in the context of JS development?</summary>

### What is continuous integration/continuous deployment (CI/CD) in the context of JS development?

**Definition:**

</details>

### JavaScript and the Web Platform

<details>
<summary>What is the Window object and its significance?</summary>

### What is the Window object and its significance?

**Definition:**

</details>

<details>
<summary>Explain the Document object.</summary>

### Explain the Document object.

**Definition:**

</details>

<details>
<summary>What new features does HTML5 bring to JavaScript development?</summary>

### What new features does HTML5 bring to JavaScript development?

**Definition:**

</details>

<details>
<summary>Discuss the role of JavaScript in Progressive Web Apps (PWAs).</summary>

### Discuss the role of JavaScript in Progressive Web Apps (PWAs).

**Definition:**

</details>

### JavaScript and Mobile Development

<details>
<summary>Explain how to use JavaScript for mobile development.</summary>

### Explain how to use JavaScript for mobile development.

**Definition:**

</details>

<details>
<summary>What is React Native and how does it differ from traditional web apps?</summary>

### What is React Native and how does it differ from traditional web apps?

**Definition:**

</details>

<details>
<summary>How does JavaScript interact with native mobile components?</summary>

### How does JavaScript interact with native mobile components?

**Definition:**

</details>
