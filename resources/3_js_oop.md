# JS OOP — Objects & Classes

Covers objects, prototypes, classes, property descriptors, Proxy/Reflect, `this`, and garbage collection.

### Related docs

* [JS Core](./3_js_core.md) · [JS Browser](./3_js_browser.md) · [JS Async](./3_js_async.md)
* [Special — OOP & SOLID](./7_special.md#2-oop--fp) · [TypeScript classes](./5_ts.md#classes) · [System design — SOLID](./0_system_design.md#7-principles--patterns)

[← Back to JS hub](./3_js.md)

### Main concepts

| Area | Topics |
|------|--------|
| **Objects** | Literals, references, copying, keys/values |
| **Prototypes** | Chain, `Object.create`, built-in prototypes |
| **Classes** | Syntax, inheritance, static, private `#` |
| **Advanced** | Descriptors, Proxy/Reflect, mixins, factory/module patterns |
| **Memory** | GC, mark-and-sweep, leaks, `WeakRef` |

### Sections

> Theory `<details>` blocks follow: **Definition** · **How it works** · **When to use** · **Pluses and minuses** · **Examples** · **Thoughts** · **Sources**. **Definition** is required; other sections are optional.

- [Objects & references](#objects-references)
- [Prototypes](#prototypes)
- [Classes](#classes)
- [Objects & classes](#obj-classes)
- [Prototypes (full)](#prototypes-full)
- [Classes (full)](#classes-full)
- [Advanced topics](#advanced-topics)
- [Interview Practice](#interview-practice)

Topics also covered: **Proxy/Reflect**, **factory & module patterns**, **constructor injection**, **freeze/seal/preventExtensions**.

<a name="objects-references"></a>

### Objects & references

**Definition:** Primitives are copied by value; objects are copied by reference — the variable holds a pointer to shared memory, not the object itself.

**When to use:**

Understand before `Object.assign`, spread, or passing config objects.

When you need an independent copy — use spread/`Object.assign` (shallow) or `structuredClone` (deep).

**Pluses and minuses:**

| + (reference semantics) | − |
|----------------------------|------|
| Efficient passing of large structures | Mutations visible across aliases |
| Shared state when intended | Accidental mutation bugs |

**Examples:**

```js
const a = { x: 1 };
const b = a;
b.x = 2;
console.log(a.x); // 2 — same object

const c = { ...a };
c.x = 3;
console.log(a.x); // 2 — shallow copy, top-level independent
```

**Sources:** [javascript.info/object-copy](https://learn.javascript.ru/object-copy)

<a name="prototypes"></a>

### Prototypes

**Definition:** Every object has an internal `[[Prototype]]` link. Property lookup walks the chain until the property is found or the chain ends at `null`.

**When to use:** Shared behavior without duplicating methods; `Object.create` for delegation.

**Pluses and minuses:**

| + | − |
|------|------|
| Memory-efficient shared methods | Lookup cost grows with chain depth |
| Flexible runtime extension | Single inheritance only |

**Examples:**

```js
const animal = { eats: true };
const rabbit = Object.create(animal);
rabbit.jumps = true;

console.log(rabbit.eats);  // true — inherited
console.log(rabbit.jumps); // true — own
```

**Sources:** [javascript.info/prototypes](https://learn.javascript.ru/prototypes)

<a name="classes"></a>

### Classes

**Definition:** ES6 `class` is syntactic sugar over prototype inheritance — a **blueprint**: fields hold data, methods hold behavior, `constructor` runs when you `new` an instance.

**How it works:** `this` inside a method is the instance the method was called on — so two `History` objects each keep their own `records`. Call without `new` → `TypeError`. Methods live on the prototype (shared); fields are per instance.

**When to use:**

Domain models, several instances of the same entity, methods that must not leak (`addRecord`).

Simple data bags — plain objects, factories, or composition may be simpler.

**Pluses and minuses:**

| + | − |
|------|------|
| Familiar OOP syntax | Still prototype-based under the hood |
| `extends` / `super` built-in | TDZ until class is defined |
| Strict mode by default | Cannot be called without `new` |

**Examples:**

```js
class User {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return `Hi, ${this.name}`;
  }
}

const u = new User('Alice');
console.log(u.greet()); // 'Hi, Alice'
```

**Sources:**

[javascript.info/class](https://learn.javascript.ru/class) · [Doka — OOP](https://doka.guide/tools/oop/) · [MDN Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

---

<a name="obj-classes"></a>

## Objects & classes

<details>
  <summary>`this` binding — four rules</summary>

### `this` binding — four rules

**Definition:** `this` is determined by **how** a function is called, not where it is defined (except arrow functions, which inherit `this` lexically).

**How it works:**

- Engine evaluates call site: `new` → bound object; `call`/`apply`/`bind` → explicit arg; `obj.method()` → `obj`; bare call → default binding.
- Arrow functions ignore these rules — `this` is captured from enclosing lexical scope at creation time.
- `bind` creates a new function with permanently fixed `this` (and optional partial args).

**When to use:**

Class methods as event handlers → arrow class fields or `bind`; borrowing methods → `fn.call(ctx)`; constructors → `new`.

Debug class methods passed as callbacks — bind or use arrow class fields.

#### Common pitfalls

`const g = obj.method; g()` loses receiver; nested object `obj.inner.method()` binds to `inner`, not `outer`; `setTimeout(obj.method)` without bind.

| Priority | Rule | `this` value |
|----------|------|--------------|
| 1 | `new` call | newly created object |
| 2 | Explicit `call` / `apply` / `bind` | first argument |
| 3 | Method call `obj.method()` | `obj` |
| 4 | Plain call / lost context | `undefined` (strict) or `globalThis` |

**Pluses and minuses:**

| + | − |
|------|------|
| Explicit rules once learned | Easy to lose context in callbacks |
| `bind`/`call` fix context | Arrow `this` surprises in class methods if misused |

**Examples:**

```js
const user = {
  name: 'Alice',
  greet() { return this.name; },
};

const g = user.greet;
g(); // undefined (strict)

user.greet(); // 'Alice'
g.call(user); // 'Alice'
```

**Thoughts:** `this` follows the call site, except arrows which close over the outer `this`. Classes need `this` so `addRecord` updates *this* instance when several exist — see [Constructor injection](#constructor-injection).

**Sources:** [javascript.info/bind](https://learn.javascript.ru/bind)

</details>

<details>
  <summary>Objects</summary>

### Objects

**Definition:** An object stores keyed collections (`key: value` pairs). Arrays are a specialized object for ordered, indexed collections.

**How it works:**

- Object literals create plain objects with `[[Prototype]]` = `Object.prototype` (unless `Object.create(null)`).
- Property access: own keys first, then prototype chain lookup for reads; writes always create/change own properties.
- Keys are strings or symbols; array indices are string keys `"0"`, `"1"`, …

**When to use:**

Config/state objects; method bags on prototypes; `Object.create(null)` for pure dictionaries (no `toString` pollution).

#### Common pitfalls

Shallow copy still shares nested objects; `delete` only removes own properties; comparing `{a:1} === {a:1}` is always false.

| Objects | Arrays |
|---------|--------|
| Named keys (strings/symbols) | Numeric indices + `length` |
| General-purpose records | Ordered collections with array methods |
| Not iterable by default | Iterable (`for...of`) |

**Pluses and minuses:**

| + | − |
|------|------|
| Flexible key-value records | Reference semantics — aliases share mutations |
| Prototype sharing for methods | No built-in deep equality |
| `Object.*` static helpers | `for...in` includes inherited enumerable keys |

**Examples:**

```js
const user = { name: 'John', age: 30 };

// Object literal
const admin = user;
admin.name = 'Jane';
console.log(user.name); // 'Jane' — same reference

delete user.age; // remove property
```

**Thoughts:** Objects are stored and copied **by reference**; primitives are copied **by value**.

**Sources:**

[javascript.info/object](https://learn.javascript.ru/object)

#### Object types in JavaScript

**Definition:**

Objects fall into several categories depending on their origin.

| Type | Examples |
|------|----------|
| **Native / built-in** | `Object`, `Array`, `Date`, `Error` |
| **Host** | `window`, `document` (browser); `fs`, `http` (Node.js) |
| **Custom** | Created via literals, constructors, or classes |
| **Prototype** | Template objects shared via the prototype chain |

**When to use:** Avoid extending native prototypes (`Array.prototype.myMethod = ...`) except for polyfills — risks naming collisions.

**Sources:**

[javascript.info/object](https://learn.javascript.ru/object)

#### Property existence: `in` vs `hasOwnProperty`

**Definition:**

The `in` operator checks the full prototype chain; `hasOwnProperty` / `Object.hasOwn()` check only own properties.

| Method | Checks prototype chain? |
|--------|-------------------------|
| `'key' in obj` | Yes |
| `obj.hasOwnProperty('key')` | No (own only) |
| `Object.hasOwn(obj, 'key')` | No (own only, modern) |

**Examples:**

```js
const obj = { a: 1 };

console.log('a' in obj);           // true (own)
console.log('toString' in obj);    // true (inherited)
console.log(obj.hasOwnProperty('a'));        // true
console.log(obj.hasOwnProperty('toString')); // false
```

**Sources:**

[javascript.info/object-keys](https://learn.javascript.ru/object-keys)

#### Object static methods

**Definition:**

`Object.keys`, `Object.values`, `Object.entries`, and `Object.is` operate on own enumerable properties.

| Method | Returns |
|--------|---------|
| `Object.keys(obj)` | Array of own keys |
| `Object.values(obj)` | Array of own values |
| `Object.entries(obj)` | Array of `[key, value]` pairs |
| `Object.is(a, b)` | Strict equality; `NaN === NaN` is `true` |

**Examples:**

```js
const user = { name: 'Ann', age: 25 };

for (const [key, value] of Object.entries(user)) {
  console.log(key, value);
}

console.log(Object.is(NaN, NaN)); // true
```

**Thoughts:** Unlike `for...in`, these methods skip inherited properties.

**Sources:**

[javascript.info/object-keys](https://learn.javascript.ru/object-keys)

#### Object comparison

**Definition:**

`==` and `===` compare objects by reference — two objects are equal only if they are the same object in memory.

| Approach | Use case |
|----------|----------|
| `===` / `==` | Same reference check |
| `Object.is(a, b)` | Strict compare with correct `NaN` handling |
| Custom function | Compare specific fields (id, name, etc.) |

**Examples:**

```js
const a = { x: 1 };
const b = { x: 1 };
const c = a;

console.log(a === b); // false — different objects
console.log(a === c); // true — same reference
```

**Sources:**

[javascript.info/object-copy](https://learn.javascript.ru/object-copy)

#### Global object

**Definition:** The global object holds variables and built-ins available everywhere. Use `globalThis` for cross-environment access (`window` in browsers, `global` in Node.js).

**When to use:** Rarely — prefer modules. In non-module scripts, `var` declarations become global properties.

**Examples:**

```js
console.log(globalThis === window); // true in browser
```

**Sources:** [javascript.info/global-object](https://learn.javascript.ru/global-object)

</details>

<details>
  <summary>Ways to create objects</summary>

### Ways to create objects

**Definition:** JavaScript offers multiple patterns for object creation, from literals to classes.

**How it works:**

- Literals `{}` and `new Object()` produce equivalent plain objects.
- `Object.create(proto)` sets `[[Prototype]]` without running a constructor.
- `new Fn()` runs constructor, links `[[Prototype]]` to `Fn.prototype`, returns instance.
- `class` desugars to constructor + prototype methods.

**When to use:**

Literals for DTOs; `Object.create` for inheritance without constructors; classes for domain models; factory functions for conditional creation.

#### Common pitfalls

Forgetting `new` on constructor pollutes global or returns `undefined`; `Object.assign` mutates target — use `{}` as first arg for copy.

| # | Pattern | Notes |
|---|---------|-------|
| 1 | Object literal `{ }` | Most common |
| 2 | `new Object()` | Equivalent to `{}` |
| 3 | `Object.create(proto)` | Explicit prototype |
| 4 | Constructor function + `new` | Pre-ES6 OOP |
| 5 | Constructor + `.prototype` | Shared methods |
| 6 | ES6 `class` | Syntactic sugar over prototypes |
| 7 | Singleton IIFE | One instance only |
| 8 | `Object.assign(target, ...sources)` | Copy properties to target |

**Pluses and minuses:**

| + | − |
|------|------|
| Many patterns for different needs | Inconsistent style across codebase if mixed |
| `Object.create` for pure delegation | Constructors easy to forget `new` (classes fix this) |
| Factory functions avoid `new` | Singleton IIFE harder to test |

**Examples:**

```js
// Literal
const literal = { name: 'John' };

// Object.create
const proto = { greet() { return this.name; } };
const created = Object.create(proto);
created.name = 'Ann';

// Constructor
function Person(name) {
  this.name = name;
}
const p = new Person('Bob');

// Class
class Employee {
  constructor(role) { this.role = role; }
}
const e = new Employee('dev');

// Shallow copy
const copy = Object.assign({}, literal);
```

**Sources:** [javascript.info/object](https://learn.javascript.ru/object) · [javascript.info/object-copy](https://learn.javascript.ru/object-copy)

</details>

<details>
  <summary>Objects to primitives</summary>

### Objects to primitives

**Definition:** When an object is used in a primitive context (`+`, `==`, `alert`), JavaScript calls `Symbol.toPrimitive`, or falls back to `valueOf` / `toString` depending on the hint.

**How it works:**

- `Symbol.toPrimitive(hint)` runs first if defined on the object.
- Otherwise engine tries `valueOf` then `toString` (order swaps for `hint === 'string'`).
- In `if (obj)` any object is truthy regardless of content.

**When to use:**

Value objects (Money, Date-like); debugging with meaningful `toString`; avoid custom coercion unless necessary.

#### Common pitfalls

`{} + 1` → `"[object Object]1"`; relying on `valueOf` for string concat; `==` between object and primitive uses `default` hint.

| Hint | Conversion order |
|------|------------------|
| `number` | `valueOf` → `toString` |
| `string` | `toString` → `valueOf` |
| `default` | `valueOf` → `toString` |

**Pluses and minuses:**

| + | − |
|------|------|
| Custom coercion for value objects | Easy to create surprising `+` / `==` behavior |
| `Symbol.toPrimitive` centralizes logic | Default `toString` often `[object Object]` |

**Examples:**

```js
const obj = {
  value: 42,
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.value;
    return `value: ${this.value}`;
  },
};

console.log(+obj);       // 42
console.log(`${obj}`);   // 'value: 42'
console.log(obj + '');   // 'value: 42' (hint: default)
```

**Thoughts:**

In boolean context, any object is `true`. `alert(obj)` coerces to string.

`obj1 + obj2` converts both with `hint: 'default'`. `==` uses `hint: 'default'` for objects.

**Sources:** [javascript.info/object-toprimitive](https://learn.javascript.ru/object-toprimitive)

</details>

<details>
  <summary>`this` and call context</summary>

### `this` and call context

**Definition:** The call context (`this`) is the object a function was called on. It changes with each invocation based on call site, not definition site.

**How it works:**

- Each function invocation gets its own `this` binding determined at call time.
- Method syntax `obj.fn()` sets `this` to `obj`; extracted reference loses that link.
- Arrow functions close over outer `this` from lexical environment — no own binding.

**When to use:**

DOM handlers (often `this` = element); class instance methods; module-level arrows for stable `this` in React class components (legacy).

Understand before debugging lost context in callbacks, event handlers, and class methods.

#### Common pitfalls

`map(user.getName)` loses `user`; `this` in nested function inside method is `undefined` (strict) unless arrow or bind.

| Context | `this` refers to |
|---------|------------------|
| Object method | The object |
| Nested object method | The immediate object (not outer) |
| Arrow function | Lexical `this` from enclosing scope |
| Global (non-strict) | `globalThis` |
| Global (strict) | `undefined` |
| Constructor (`new`) | Newly created instance |

**Pluses and minuses:**

| + | − |
|------|------|
| Flexible receiver for shared functions | Context loss is a top JS bug source |
| Explicit `call`/`bind` when needed | Arrow in object literal does not bind to object |

**Examples:**

```js
const obj = {
  value: 42,
  getValue() { return this.value; },
  getValueArrow: () => this?.value, // lexical — not obj
};

const fn = obj.getValue;
fn(); // undefined (strict) — context lost

obj.getValue(); // 42
```

#### Lost context scenarios

| Scenario | Risk |
|----------|------|
| Detached method `const f = obj.m` | `this` is not `obj` |
| Callbacks (`setTimeout`, `map`) | Context changes |
| Event handlers | `this` may be the DOM element |
| Class methods as callbacks | Need bind or arrow fields |

**Sources:** [javascript.info/object-methods](https://learn.javascript.ru/object-methods) · [javascript.info/bind](https://learn.javascript.ru/bind)

</details>

<details>
  <summary>call, apply, bind</summary>

### call, apply, bind

**Definition:** `call`, `apply`, and `bind` explicitly set `this` for a function. `call` and `apply` invoke immediately; `bind` returns a new function.

**How it works:**

- All three use `Function.prototype`; first arg sets `this`, rest are call arguments.
- `apply` takes args as array-like; `call` spreads them.
- `bind` returns new function; bound `this` cannot be overridden by further `bind`/`call`.

**When to use:**

`Array.prototype.slice.call(arguments)` (legacy); method borrowing; fixing handler context; `Math.max.apply(null, arr)`.

`bind` for callbacks needing stable context; `call`/`apply` for immediate invocation with a specific `this`.

#### Common pitfalls

Forgetting bound functions cannot be used as constructors; assuming `bind` copies method — still shared on prototype.

| Method | Invokes now? | Arguments |
|--------|--------------|-----------|
| `fn.call(ctx, a, b)` | Yes | Comma-separated |
| `fn.apply(ctx, [a, b])` | Yes | Array-like |
| `fn.bind(ctx, a)` | No — returns bound fn | Partial application supported |

**Pluses and minuses:**

| + | − |
|------|------|
| Borrow methods across objects | `bind` creates new function each time (memory) |
| Partial application via `bind` | Easy to overuse instead of arrows/closures |
| `apply` for spread-before-`...` legacy | `null`/`undefined` first arg → global (non-strict) |

**Examples:**

```js
function greet(greeting, punct) {
  return `${greeting}, ${this.name}${punct}`;
}

const user = { name: 'Alice' };

greet.call(user, 'Hi', '!');       // 'Hi, Alice!'
greet.apply(user, ['Hello', '.']); // 'Hello, Alice.'

const bound = greet.bind(user, 'Hey');
bound('?'); // 'Hey, Alice?'
```

**Thoughts:** Passing `null`/`undefined` to `call`/`apply`/`bind` falls back to default binding. A function bound with `bind()` cannot be re-bound.

**Sources:** [javascript.info/bind](https://learn.javascript.ru/bind)

</details>

---

<a name="prototypes-full"></a>

## Prototypes (full)

<details>
  <summary>Prototype chain</summary>

### Prototype chain

**Definition:** JavaScript is prototype-based. Each object has `[[Prototype]]` (accessed via `__proto__` or `Object.getPrototypeOf`). Lookup walks the chain until `null`.

**How it works:**

- Every object has internal `[[Prototype]]` (null at chain end).
- Read: walk chain until key found or `null`; write/delete: always affect own object only.
- Functions have `.prototype` used only when called with `new`.

**When to use:**

Shared behavior via `Constructor.prototype`; `Object.create` for classical inheritance; built-in types (`Array.prototype`).

#### Common pitfalls

Setting `Child.prototype = Parent.prototype` breaks `instanceof`; modifying `__proto__` at runtime is slow; shadowing inherited property hides but does not remove prototype value.

| Term | Meaning |
|------|---------|
| `[[Prototype]]` | Internal slot — link to parent object |
| `__proto__` | Legacy getter/setter on `Object.prototype` |
| `.prototype` | Property on **functions** — used by `new` |
| Prototype object | The object referenced by `[[Prototype]]` |

**Pluses and minuses:**

| + | − |
|------|------|
| Shared methods — memory efficient | Deeper chains = slower lookup |
| Runtime extension of behavior | Single inheritance only |
| `Object.create` for delegation | `__proto__` is legacy — prefer `getPrototypeOf` |

**Examples:**

```js
const animal = { eats: true };
const rabbit = { jumps: true };

Object.setPrototypeOf(rabbit, animal);

console.log(rabbit.eats);  // true — found on animal
console.log(rabbit.jumps); // true — own property
```

**Thoughts:** Prototypes are for **reading** only. Write/delete operations apply to the object itself.

**Sources:**

[javascript.info/prototypes](https://learn.javascript.ru/prototypes)

#### `F.prototype` and `new`

**Definition:** When a function is called with `new`, the new object's `[[Prototype]]` is set to `Function.prototype` (if it is an object).

**How it works:**

1. Create empty object
2. Set `[[Prototype]]` to `Constructor.prototype`
3. Call constructor with `this` = new object
4. Return object (or constructor's return value if it's an object)

**Examples:**

```js
function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function () {
  return `Hi, ${this.name}`;
};

const p = new Person('Ann');
console.log(p.sayHi()); // 'Hi, Ann'
console.log(p.__proto__ === Person.prototype); // true
```

**Sources:**

[javascript.info/function-prototype](https://learn.javascript.ru/function-prototype)

#### Prototype limitations

| Rule | Detail |
|------|--------|
| No circular links | `__proto__` in a loop throws |
| Type restriction | `[[Prototype]]` must be object or `null` |
| Single parent | Only one `[[Prototype]]` per object |
| Read-only chain | Writes never go up the prototype chain |

[javascript.info/prototypes](https://learn.javascript.ru/prototypes)

#### Built-in prototypes

**Definition:** Native constructors (`Array`, `Date`, `Object`, etc.) store methods on their `.prototype`. Primitives use wrapper prototypes (`String.prototype`, etc.).

**When to use:** Polyfilling — the only approved case for modifying native prototypes.

**Examples:**

```js
const arr = [1, 2, 3];
console.log(arr.push === Array.prototype.push); // true

const obj = {};
console.log(obj.toString()); // '[object Object]'
```

**Thoughts:**

`{ }` is shorthand for `new Object()` — inheriting from `Object.prototype` (`toString`, `hasOwnProperty`, etc.).

| Object stores | Prototype stores |
|---------------|------------------|
| Data (array items, properties) | Methods (`push`, `toString`, etc.) |

**Sources:**

[javascript.info/native-prototypes](https://learn.javascript.ru/native-prototypes)

#### Borrowing from prototypes

**Definition:** Any object can use a method from another prototype by assigning it directly.

**Examples:**

```js
const pseudo = { 0: 'Hello', 1: 'world!', length: 2 };
pseudo.join = Array.prototype.join;

console.log(pseudo.join(',')); // 'Hello,world!'
```

**Sources:** [javascript.info/prototypes](https://learn.javascript.ru/prototypes)

</details>

<details>
  <summary>Object.create, getPrototypeOf, setPrototypeOf</summary>

### Object.create, getPrototypeOf, setPrototypeOf

**Definition:** Static methods to create objects with a given prototype and to read/write `[[Prototype]]`.

**How it works:**

- `Object.create(proto)` allocates object with `[[Prototype]]` = `proto`; optional second arg defines own properties with descriptors.
- `getPrototypeOf` / `setPrototypeOf` read/write the link; `setPrototypeOf` deoptimizes engines — avoid in hot loops.

**When to use:**

`Object.create(null)` for map-like dicts; prototype-based inheritance; test doubles with custom proto chain.

`Object.create` for clean delegation without constructors; `Object.create(null)` for dictionary objects without inherited keys.

#### Common pitfalls

Using `setPrototypeOf` on every instance in constructor; confusing `Object.create(Fn.prototype)` with `new Fn()`.

| Method | Purpose |
|--------|---------|
| `Object.create(proto, descriptors?)` | New object with `[[Prototype]]` = `proto` |
| `Object.getPrototypeOf(obj)` | Read `[[Prototype]]` |
| `Object.setPrototypeOf(obj, proto)` | Write `[[Prototype]]` (slow — avoid in hot paths) |

**Pluses and minuses:**

| + | − |
|------|------|
| Clean delegation without constructors | `setPrototypeOf` hurts performance |
| `Object.create(null)` — no inherited pollution | Descriptors in second arg verbose |
| Explicit prototype in tests/mocks | Changing proto breaks `instanceof` assumptions |

**Examples:**

```js
const animal = {
  eats: true,
  walk() { console.log('walking'); },
};

const rabbit = Object.create(animal, {
  jumps: { value: true, enumerable: true },
});

rabbit.walk(); // 'walking' — inherited
```

**Sources:** [javascript.info/prototype-methods](https://learn.javascript.ru/prototype-methods)

</details>

<details>
  <summary>`instanceof`</summary>

### `instanceof`

**Definition:** `obj instanceof Constructor` walks `obj.__proto__` and checks if any link equals `Constructor.prototype`.

**How it works:**

- Walk `obj.[[Prototype]]` chain; return `true` if any link `=== Constructor.prototype`.
- `Symbol.hasInstance` on constructor can customize behavior.
- `null` prototype objects only `instanceof Object` if chain reaches `Object.prototype`.

**When to use:**

Type checks in polymorphic code; verifying API response shapes; custom `@@hasInstance` for branded types.

#### Common pitfalls

`instanceof` with arrow functions (no `.prototype`); checking plain object literals — always `instanceof Object`; cross-frame `Array` checks fail.

**Pluses and minuses:**

| + | − |
|------|------|
| Works across inheritance | Breaks if `prototype` is changed |
| Checks prototype chain | Not reliable across realms (iframes) |

| + | − |
|------|------|
| Works with subclass chains | Fails across iframes/realms (different prototypes) |
| Duck typing alternative | Breaks if `prototype` replaced |
| Familiar OOP check | Not for primitive values |

**Examples:**

```js
class Animal {}
class Rabbit extends Animal {}

const r = new Rabbit();
console.log(r instanceof Rabbit);  // true
console.log(r instanceof Animal);  // true — chain includes Animal.prototype
console.log(r instanceof Object);  // true
```

**Sources:** [javascript.info/instanceof](https://learn.javascript.ru/instanceof)

</details>

<details>
  <summary>Extending built-in classes</summary>

### Extending built-in classes

**Definition:** ES6 allows `class MyArray extends Array` to inherit built-in behavior while adding methods.

**How it works:**

- `class MyArr extends Array` creates subclass whose instances delegate to `Array` internal slots when constructed properly.
- `super` in derived class must be called before `this` use in constructor.
- Some builtins (e.g. certain DOM types) cannot be subclassed reliably.

**When to use:**

`class ValidationError extends Error`; `class TypedArray extends Array` for typed collections; framework element subclasses.

Custom `Error` subclasses, extended `Array`/`Map` with domain methods.

Modifying `Array.prototype` globally (polyfill only).

#### Common pitfalls

Forgetting `super()` in derived constructor; assuming `JSON.stringify` handles custom classes; mutating built-in `.prototype` globally.

**Pluses and minuses:**

| + | − |
|------|------|
| Reuse native behavior | Easy to break internal slots if misused |
| Custom error types | Some builtins cannot be subclassed reliably |

| + | − |
|------|------|
| Domain-specific array/map types | Wrong subclassing breaks `length` / iterators |
| Custom `Error` with stack/status | Engine-specific edge cases |
| Native methods still work | `Array.from` on subclass needs care |

**Examples:**

```js
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

class FilteredArray extends Array {
  filterPositive() {
    return this.filter(n => n > 0);
  }
}

const arr = new FilteredArray(-1, 2, 3);
console.log(arr.filterPositive()); // [2, 3]
```

**Sources:** [javascript.info/extend-natives](https://learn.javascript.ru/extend-natives)

</details>

---

<a name="classes-full"></a>

## Classes (full)

<details>
  <summary>Class syntax</summary>

### Class syntax

**Definition:** `class` declares a constructor function and puts methods on its `.prototype`. `typeof MyClass === 'function'`.

**How it works:**

- `class Name {}` creates function `Name` in TDZ until line runs; body always strict.
- Instance methods live on `Name.prototype` (non-enumerable); static methods on `Name` itself.
- Calling class without `new` throws `TypeError`.

1. Creates function `User` from `constructor` (or empty if missing)
2. Stores methods like `sayHi` on `User.prototype`

**When to use:**

Domain entities; React class components (legacy); service classes with instance state.

#### Common pitfalls

Using class before declaration (TDZ); expecting `class` to hoist like `function`; thinking private `#` fields are on prototype (they are per-instance).

| Feature | Behavior |
|---------|----------|
| Strict mode | Always on inside class bodies |
| Methods | Non-enumerable by default |
| Call without `new` | TypeError |
| Hoisting | Hoisted but in TDZ until definition |

**Pluses and minuses:**

| + | − |
|------|------|
| Familiar syntax, `extends`/`super` | Still prototypes underneath — surprises in debugging |
| Strict by default | TDZ — cannot use before declaration |
| Clear constructor/method split | Not hoisted like `function` declarations |

**Examples:**

```js
// ES5 constructor
function Bike(model, color) {
  this.model = model;
  this.color = color;
}
Bike.prototype.getDetails = function () {
  return `${this.model} bike has ${this.color} color`;
};

// ES6 class — equivalent pattern
class BikeClass {
  constructor(model, color) {
    this.model = model;
    this.color = color;
  }
  getDetails() {
    return `${this.model} bike has ${this.color} color`;
  }
}
```

**Thoughts:** Classes are prototype inheritance with cleaner syntax — not a new object model.

**Sources:**

[javascript.info/class](https://learn.javascript.ru/class)

#### Class declarations vs expressions

**Definition:**

Classes can be declared or expressed, named or anonymous — similar to functions.

| Form | Example |
|------|---------|
| Declaration | `class Foo {}` |
| Expression | `const Foo = class {}` |
| Named expression | `const Foo = class Bar {}` — `Bar` visible inside body only |

**How it works:** Classes are hoisted but uninitialized — `new Rectangle()` before `class Rectangle {}` throws `ReferenceError`.

**Examples:**

```js
// Named expression
const Rect = class Rectangle {
  constructor(w, h) {
    this.w = w;
    this.h = h;
  }
};
console.log(Rect.name); // 'Rectangle'
```

**Sources:** [javascript.info/class](https://learn.javascript.ru/class)

</details>

<details>
  <summary>Static methods and properties</summary>

### Static methods and properties

**Definition:** Static members belong to the class itself, not instances. Called as `ClassName.method()`.

**How it works:**

- `static` keyword defines properties on the constructor function object, not on instances.
- Accessed as `ClassName.method()`; inherited statics available on subclasses via prototype chain of constructor.

**When to use:**

Comparison/sort helpers; named constructors; parsing factories; constants scoped to type.

Comparison utilities, factories, constants — anything not tied to a single instance.

#### Common pitfalls

Calling static method on instance (`user.createGuest()` — undefined); static block (ES2022) runs once — side effects persist.

| Static | Instance |
|--------|----------|
| `User.createGuest()` | `user.sayHi()` |
| Class-level utilities | Per-object behavior |
| Factory methods, counters | Instance state |

**Pluses and minuses:**

| + | − |
|------|------|
| Namespace for utilities | Can become grab-bag if overused |
| Factory methods (`User.createGuest()`) | Harder to mock than instance methods in tests |
| Counters/constants on class | Static-only state is global-like |

**Examples:**

```js
class Article {
  constructor(title) {
    this.title = title;
  }

  static compare(a, b) {
    return a.title.localeCompare(b.title);
  }

  static createToday(title) {
    return new Article(title);
  }
}

Article.compare(new Article('A'), new Article('B'));
```

**Sources:** [javascript.info/static-properties-methods](https://learn.javascript.ru/static-properties-methods)

</details>

<details>
  <summary>Private fields</summary>

### Private fields

**Definition:** Fields prefixed with `#` are accessible only inside the class body (ES2022).

**How it works:**

- `#field` is stored per instance in a private slot — only accessible inside class body syntactically.
- Truly private at runtime (not just naming convention); `#` in object literal outside class is syntax error.

**When to use:**

Internal state (`#balance`); hiding implementation details; preventing external mutation.

#### Common pitfalls

Trying to access `#x` from outside or from a subclass that did not declare it; expecting `#` on plain objects; serializing class instances drops private fields.

Chrome DevTools (and some other consoles) may **read `#` fields for debugging** — that is a DevTools exception, not a language feature. App code still throws `SyntaxError`.

**Pluses and minuses:**

| + | − |
|------|------|
| Real encapsulation | SyntaxError if accessed outside — no runtime undefined |
| No `_prefix` convention | Cannot access from subclasses in separate files without getters |
| Works with getters for controlled exposure | DevTools support varies |

**Examples:**

```js
class Account {
  #balance = 0;

  deposit(amount) {
    this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }
}

const acc = new Account();
acc.deposit(100);
console.log(acc.getBalance()); // 100
// acc.#balance — SyntaxError
```

**Sources:** [javascript.info/private-protected-properties-methods](https://learn.javascript.ru/private-protected-properties-methods) · [MDN — private elements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements)

</details>

<details>
  <summary>Inheritance and `super`</summary>

### Inheritance and `super`

**Definition:** `class Child extends Parent` sets `Child.prototype.__proto__` to `Parent.prototype`. `super` calls parent constructor or methods.

**How it works:**

- `extends` sets up prototype chain: `Child.prototype.__proto__` → `Parent.prototype`.
- `super()` in constructor calls `Parent` as constructor with current `this`.
- `super.method()` uses home object mechanism to call parent version.

**When to use:**

`Dog extends Animal`; extending built-ins; overriding with `super.method()` for extension not replacement.

#### Common pitfalls

Using `this` before `super()` in derived constructor; forgetting `super()` when derived class has constructor; diamond problem — JS has no multiple inheritance.

| Use case | Syntax |
|----------|--------|
| Call parent constructor | `super(args)` in child constructor |
| Call parent method | `super.method()` in override |
| Static inheritance | `super` in static methods |

**Pluses and minuses:**

| + | − |
|------|------|
| Built-in `extends`/`super` | Single inheritance only |
| `instanceof` works through chain | Deep hierarchies fragile |
| Method override with parent call | Must call `super()` before `this` in derived constructor |

**Examples:**

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  speak() {
    return `${super.speak()} (${this.breed})`;
  }
}

const d = new Dog('Rex', 'lab');
console.log(d.speak());
```

**Thoughts:**

In a derived constructor, `this` is inaccessible before `super()` — runtime error.

JavaScript has single inheritance. For multiple behavior sources, use composition or mixins.

**Sources:** [javascript.info/class-inheritance](https://learn.javascript.ru/class-inheritance)

</details>

<details>
  <summary>Getters and setters</summary>

### Getters and setters

**Definition:** Accessor properties use `get` / `set` to control read/write access — they look like normal properties in external code.

**How it works:**

- Defined with `get prop()` / `set prop(v)` on object or class; accessed like normal properties.
- Descriptor form: `{ get, set, enumerable, configurable }` — no `value`/`writable` with accessors.
- Setters often validate and store in private `#field` or `_field`.

**When to use:**

Lazy computed values; input validation; exposing read-only derived state; compatibility when renaming internal field.

#### Common pitfalls

`get name() { return this.name }` — infinite loop; forgetting setter when adding getter for writable API; enumerable getters show in `for...in`.

**Pluses and minuses:**

| + | − |
|------|------|
| Validation on set | Slight overhead vs plain properties |
| Computed values on get | Can complicate debugging |
| Encapsulation with private `#` fields | Overuse adds boilerplate |

| + | − |
|------|------|
| Validation on assignment | Harder to trace in debugger than methods |
| Computed read-only properties | Infinite recursion if setter calls itself |
| Backward-compatible API evolution | Slight perf cost vs data properties |

**Examples:**

```js
class User {
  constructor(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    if (typeof value !== 'string' || !value.trim()) {
      throw new TypeError('Invalid name');
    }
    this._name = value.trim();
  }
}

const u = new User('Ann');
u.name = '  Bob  ';
console.log(u.name); // 'Bob'
```

**Sources:** [javascript.info/property-accessors](https://learn.javascript.ru/property-accessors)

</details>

<details>
  <summary>Mixins</summary>

### Mixins

**Definition:** A mixin is a class whose methods are copied into other classes without inheritance — JavaScript supports single inheritance only.

**How it works:**

- Copy method objects onto `Class.prototype` via `Object.assign` or helper function.
- No `super` chain between mixin and class — methods merge flatly; name collisions last wins.

**When to use:**

Cross-cutting concerns (serialization, event emitter); legacy code sharing; when `extends` is wrong semantically.

#### Common pitfalls

Two mixins defining same method; mixin assuming `this` shape without contract; prefer composition (`has-a`) for new code.

| Approach | When |
|----------|------|
| `extends` | True `is-a` subtype |
| Mixin (`Object.assign` to prototype) | Share behavior across unrelated classes |
| Composition | `has-a` — preferred for flexibility |

**Pluses and minuses:**

| + | − |
|------|------|
| Share behavior without inheritance | Method name collisions |
| Multiple behaviors on one class | No `super` to mixin |
| Works with unrelated classes | Harder to trace than composition |

**Examples:**

```js
const sayHi = {
  sayHi() { return `Hi, ${this.name}`; },
};

const sayBye = {
  sayBye() { return `Bye, ${this.name}`; },
};

class User {
  constructor(name) { this.name = name; }
}

Object.assign(User.prototype, sayHi, sayBye);

const u = new User('Ann');
console.log(u.sayHi()); // 'Hi, Ann'
```

**Thoughts:** Without interfaces, mixins are untyped feature bags. TypeScript `implements` makes composition readable.

**Sources:**

[javascript.info/mixins](https://learn.javascript.ru/mixins) · [Doka — OOP](https://doka.guide/tools/oop/)

---

</details>

<a name="constructor-injection"></a>

<details>
  <summary>Constructor injection</summary>

### Constructor injection

**Definition:** Pass collaborators into `constructor` and store them on `this`, instead of constructing them inside the class. The class that *needs* others is the dependent.

**How it works:**

- `DailyAmount` needs Budget and History — receive them, don't `new` them inside.
- Dependency arrows stay one-way (matches a UML diagram) and avoid **cycles** (A constructs B constructs A).
- Tests pass fakes: `new DailyAmount(budgetStub, historyStub)`.
- This is manual DIP. JS has no interfaces, so the "abstraction" is a duck-typed shape unless you add TypeScript.

**When to use:**

Domain services that combine entities (`DailyAmount`); any class that would otherwise `import` a concrete logger/DB.

#### Common pitfalls

Constructing deps inside the class (hidden coupling); circular `new` between two classes; injecting concretions when a small interface would do (TS).

**Pluses and minuses:**

| + | − |
|------|------|
| Testable; swap implementations | Wiring at the composition root |
| Clear ownership of collaborators | Easy to pass too many deps (god constructor) |
| Matches domain relation direction | Without types, nothing checks the shape |

**Examples:**

```js
class DailyAmount {
  constructor(budget, history) {
    this.budget = budget;
    this.history = history;
  }
  get valueOf() {
    return this.budget.perDay - this.history.spentToday;
  }
}

const daily = new DailyAmount(new Budget(10000, 10), new History());
```

**Thoughts:** High-level policy receives tools; it does not build them.

**Sources:** [Doka — OOP](https://doka.guide/tools/oop/) · [7_special.md — DIP](./7_special.md#9-solid--principles)

</details>

---

<a name="advanced-topics"></a>

## Advanced topics

<details>
  <summary>Property descriptors</summary>

### Property descriptors

**Definition:** Descriptors are metadata controlling how a property behaves — writable, enumerable, configurable, plus optional getter/setter.

**How it works:**

- Every property has a descriptor: data (`value`, `writable`) or accessor (`get`, `set`), plus `enumerable` and `configurable`.
- `Object.defineProperty` / `defineProperties` set descriptors explicitly; assignment uses defaults (`writable: true`, etc.).
- `Object.getOwnPropertyDescriptor` reads current descriptor.

**When to use:**

Read-only `id`; non-enumerable internal slots; library defining non-writable global polyfills.

#### Common pitfalls

Assuming `const obj` makes properties immutable; `writable: false` still allows change if `configurable: true` (redefine); shallow freeze only top level.

| Descriptor | Type | Controls |
|------------|------|----------|
| `value` | Data | Stored value |
| `writable` | Data | Can value be changed? |
| `enumerable` | Data / Accessor | Shows in `for...in` / `Object.keys`? |
| `configurable` | Data / Accessor | Can delete or redefine? |
| `get` / `set` | Accessor | Read/write functions |

**Pluses and minuses:**

| + | − |
|------|------|
| Fine-grained control (immutable id) | Verbose API |
| Hide internal props (`enumerable: false`) | Easy to forget `configurable: false` for true lock |
| Accessors for computed/validated fields | Mixing data and accessor descriptors on same key forbidden |

**Examples:**

```js
const obj = {};

Object.defineProperty(obj, 'id', {
  value: 1,
  writable: false,
  enumerable: true,
  configurable: false,
});

obj.id = 2;
console.log(obj.id); // 1 — not writable
```

**Sources:**

[javascript.info/property-descriptors](https://learn.javascript.ru/property-descriptors) · [MDN defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

#### `Object.preventExtensions`, `Object.seal`, `Object.freeze`

**Definition:** Three escalating levels of object immutability — all **shallow** (nested objects still mutable unless recursively frozen).

**How it works:**

- `Object.preventExtensions(obj)` — cannot add new properties; existing props still writable/deletable.
- `Object.seal(obj)` — `preventExtensions` + set all existing properties `configurable: false` (cannot delete or reconfigure); values still writable unless already read-only.
- `Object.freeze(obj)` — `seal` + set all data properties `writable: false`; strict mode assignment throws.
- Check state: `Object.isExtensible`, `Object.isSealed`, `Object.isFrozen`.

| Method | Add | Delete | Write values | Reconfigure descriptors |
|--------|-----|--------|--------------|-------------------------|
| `preventExtensions()` | No | Yes | Yes | Yes |
| `seal()` | No | No | Yes | No |
| `freeze()` | No | No | No | No |

**When to use:**

`freeze` exported config; `seal` prevent shape changes; `preventExtensions` harden object before passing to untrusted code.

#### Common pitfalls

Assuming `freeze` deep-clones; mutating nested object after parent freeze; `const obj = freeze({})` — binding frozen but could reassign variable if `let`.

**Pluses and minuses:**

| + | − |
|------|------|
| Simple runtime immutability | Shallow only |
| `freeze` for config constants | Cannot unfreeze |
| No library needed for basic cases | Deep freeze needs recursion or Immer |

**Examples:**

```js
const sealed = Object.seal({ a: 1, nested: { b: 2 } });
sealed.a = 2;           // OK
sealed.c = 3;           // fails silently / strict throw
delete sealed.a;        // fails
sealed.nested.b = 99;   // nested still mutable!

const frozen = Object.freeze({ x: 1 });
frozen.x = 2;           // fails
console.log(Object.isFrozen(frozen)); // true
```

**Sources:** [javascript.info/property-descriptors](https://learn.javascript.ru/property-descriptors)

</details>

<details>
  <summary>Shallow vs deep copy</summary>

### Shallow vs deep copy

**Definition:** A shallow copy duplicates top-level properties; nested objects remain shared. A deep copy recursively clones all levels.

**How it works:**

- Shallow: new object, but nested object references copied as pointers — shared nested state.
- Deep: recursively clone reachable own properties; `structuredClone` uses structured clone algorithm.
- `JSON` round-trip drops non-JSON types and breaks on cycles.

| Type | `JSON.stringify` behavior |
|------|---------------------------|
| `undefined`, functions, symbols | Removed |
| `BigInt` | Throws |
| `NaN`, `Infinity` | `null` |
| Circular references | Throws |
| `Date` | ISO string |
| `Map`, `Set` | `{}` |

**When to use:**

Immutable updates (shallow + replace nested); API payload clone; state snapshot before mutation.

#### Common pitfalls

`{...obj}` then mutating `copy.nested` affects original; `structuredClone` on DOM nodes throws; JSON clone turns `Date` to string.

| Strategy | Nested objects | Methods / symbols |
|----------|----------------|-----------------|
| Spread / `Object.assign` | Shared (shallow) | Copied (enumerable own) |
| `structuredClone()` | Cloned (deep) | Most types; no functions |
| `JSON.parse(JSON.stringify())` | Cloned | Loses functions, `undefined`, `Date` precision |

**Pluses and minuses:**

| + | − |
|------|------|
| Spread/`assign` fast for flat clones | Shallow copies hide nested sharing bugs |
| `structuredClone` native deep clone | No functions, symbols in clone |
| JSON clone simple for plain data | JSON loses `Date`, `undefined`, `BigInt` |

**Examples:**

```js
const original = { a: 1, nested: { b: 2 } };

const shallow = { ...original };
shallow.nested.b = 99;
console.log(original.nested.b); // 99 — shared

const deep = structuredClone(original);
deep.nested.b = 0;
console.log(original.nested.b); // 99 — independent
```

**Sources:** [javascript.info/object-copy](https://learn.javascript.ru/object-copy) · [MDN structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)

</details>

<details>
  <summary>`in` operator and `for...in`</summary>

### `in` operator and `for...in`

**Definition:** `for...in` iterates all **enumerable** properties, including inherited ones. Use `Object.keys` or `hasOwnProperty` for own properties only.

**How it works:**

- `key in obj` checks entire prototype chain for property existence (own or inherited).
- `for...in` enumerates **enumerable** keys on object and prototypes — order: own string keys (insertion), then inherited.
- `Object.keys` / `hasOwn` / `Object.hasOwn` restrict to own properties.

It is inherited from `Object.prototype` with `{ enumerable: false }`.

**When to use:**

`'length' in arr`; prototype polling; own-key iteration → `Object.keys` or `for...of` on entries.

#### Common pitfalls

`for...in` on arrays iterates indices + maybe inherited; object without `hasOwn` check lists prototype keys; `obj.hasOwnProperty` fails if null prototype without `Object.hasOwn`.

**Pluses and minuses:**

| + | − |
|------|------|
| `in` detects inherited methods | `for...in` pulls inherited enumerable props |
| `for...in` simple iteration | Must filter with `hasOwn` |
| `Object.hasOwn` modern own check | `hasOwnProperty` can be shadowed |

**Examples:**

```js
const obj = { a: 1, b: 2 };

for (const key in obj) {
  if (Object.hasOwn(obj, key)) {
    console.log(key, obj[key]);
  }
}
```

**Sources:** [javascript.info/object-keys](https://learn.javascript.ru/object-keys)

</details>

<details>
  <summary>Garbage collection</summary>

### Garbage collection

**Definition:** JavaScript automatically frees memory for values that are no longer **reachable** from roots (global variables, current call stack, etc.).

**How it works:**

- Mark-and-sweep: start from roots (global, stack, registers); mark reachable; sweep unmarked.
- Generational GC assumes most objects die young — nursery collected more often.
- Closures keep outer variables alive while inner function is reachable.

**When to use:**

Drop references (`obj = null`) when done; avoid global caches without bounds; `WeakMap` for metadata on DOM nodes.

#### Common pitfalls

Closures holding large outer scope; detached DOM nodes still referenced by JS; `setInterval` holding callback forever; forgetting event listener removal.

| Phase | Action |
|-------|--------|
| **Mark** | Traverse from roots; mark reachable objects |
| **Sweep** | Delete unmarked (unreachable) objects |

**Pluses and minuses:**

| + | − |
|------|------|
| Automatic memory management | Pauses (mitigated by incremental GC) |
| No manual free() | Memory leaks still possible |
| WeakRef/WeakMap for caches | Unpredictable collection timing |

**Examples:**

```js
let user = { name: 'John' };
// user is reachable — object stays in memory

user = null;
// { name: 'John' } is unreachable — GC will reclaim it
```

#### GC optimizations

| Technique | Purpose |
|-----------|---------|
| Generational collection | Young objects collected more often |
| Incremental collection | Spread GC across small steps |
| Idle-time collection | Run GC when CPU is idle |

**Thoughts:** Outgoing references do not keep an object alive — only **incoming** references from reachable objects matter.

**Sources:** [javascript.info/garbage-collection](https://learn.javascript.ru/garbage-collection)

</details>

<details>
  <summary>WeakRef and FinalizationRegistry</summary>

### WeakRef and FinalizationRegistry

**Definition:** `WeakRef` holds a weak reference without preventing GC; `FinalizationRegistry` runs a callback after an object is collected.

**How it works:**

- `WeakRef` wraps object weakly — `deref()` returns object or `undefined` if collected.
- `FinalizationRegistry` registers cleanup callback when target is GC'd — timing not guaranteed.
- Do not rely on finalizers for critical cleanup — use explicit `dispose()`.

**When to use:**

Image/asset cache; native handle wrappers; memory profiling.

Large-object caches, native addon wrappers, advanced memory management.

Normal app logic — use `WeakMap` for metadata keyed by objects.

#### Common pitfalls

Using WeakRef as only lifecycle management; assuming finalizer runs promptly; strong references in finalizer callback preventing GC.

**Pluses and minuses:**

| + | − |
|------|------|
| Cache without memory leaks | Non-deterministic cleanup timing |
| External metadata for objects | Overkill for most apps |

| + | − |
|------|------|
| Cache large objects without leaking | `deref()` may return undefined anytime |
| Observe GC for diagnostics | Finalization order non-deterministic |
| Complements `WeakMap` | Overkill for typical apps |

**Examples:**

```js
const registry = new FinalizationRegistry((heldValue) => {
  console.log(`Object with id ${heldValue} was garbage-collected`);
});

let obj = { data: 'large' };
const ref = new WeakRef(obj);
registry.register(obj, 'session-1');
obj = null; // eventually GC + callback
```

**Sources:** [javascript.info/weakref-finalizationregistry](https://learn.javascript.ru/weakref-finalizationregistry)

</details>

---

<details>
  <summary>Proxy and Reflect</summary>

### Proxy and Reflect

**Definition:** `Proxy` wraps a target object and intercepts operations via handler traps; `Reflect` provides methods that mirror those operations with sensible return values for use inside traps.

**How it works:**

- `new Proxy(target, handler)` — reads/writes/deletes route through traps (`get`, `set`, `has`, `deleteProperty`, `apply`, `construct`, …).
- Trap must return expected type (e.g. `set` → boolean) or throw; otherwise runtime errors.
- `Reflect.get(target, prop, receiver)` forwards to target with correct `this` for getters.
- Default: no trap → operation forwarded to target unchanged.

**When to use:**

Input validation; observable state; negative array index wrapper; mocking in tests; `Proxy.revocable` for capability security.

#### Common pitfalls

Forgetting `return true` from `set` trap (strict mode error); proxying arrays — some methods use internal slots; deep reactivity needs nested proxies; `JSON.stringify` on proxy serializes target.

**Pluses and minuses:**

| + | − |
|------|------|
| Validation, logging, reactivity (Vue 3) | Slight overhead; mental overhead |
| Virtual properties without storage | Hard to debug stack traces |
| Revocable proxies (`Proxy.revocable`) | Cannot proxy all internal slots equally |

**Examples:**

```js
const user = new Proxy({}, {
  set(target, prop, value) {
    if (prop === 'age' && (typeof value !== 'number' || value < 0)) {
      throw new RangeError('age must be non-negative number');
    }
    return Reflect.set(target, prop, value);
  },
  get(target, prop, receiver) {
    if (prop === 'fullName') {
      return `${target.first ?? ''} ${target.last ?? ''}`.trim();
    }
    return Reflect.get(target, prop, receiver);
  },
});

user.first = 'Ann';
user.last = 'Lee';
user.age = 30;
console.log(user.fullName); // 'Ann Lee'
```

**Sources:** [javascript.info/proxy](https://learn.javascript.ru/proxy) · [MDN Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)

</details>

<details>
  <summary>Factory and module patterns</summary>

### Factory and module patterns

**Definition:** A **factory** returns new objects (or functions) without requiring `new`; a **module pattern** uses closures/IIFE or ES modules to hide private state and expose a public API.

**How it works:**

- Factory function: `function createSpending(amount) { return { amount, dateTime: Date.now() }; }` — no `prototype` required; one place for defaults so you don't copy-paste literals.
- Module pattern (IIFE): `(function () { let secret = 0; return { inc() { secret++; } }; })()` — private `secret`.
- ES modules: `export` public API; top-level scope is module-private by default.
- Grow from factory → `class` when you need `this` (several instances) or methods that must stay on the entity (`addRecord`).

**When to use:**

Factory when creation logic branches; module for singleton config, counters, private caches; ES modules for all new app code.

#### Common pitfalls

Factory returning new function each call breaks `===` identity checks; IIFE module state is singleton — test pollution; confusing factory with constructor (`new` not needed).

**Pluses and minuses:**

| + | − |
|------|------|
| Factory flexible — plain objects, no `new` | No `instanceof` without shared prototype |
| Module hides implementation | IIFE modules harder to tree-shake |
| ES modules standard, static analysis | Over-factorying simple literals |

**Examples:**

```js
// Factory — same-shaped objects without `new`
function createSpending(amount) {
  return { amount, dateTime: Date.now(), kind: 'spending' };
}

function createCounter(start = 0) {
  let n = start;
  return {
    next() { return ++n; },
    reset() { n = start; },
  };
}

// Module pattern (legacy IIFE)
const authModule = (() => {
  let token = null;
  return {
    login(t) { token = t; },
    logout() { token = null; },
    isLoggedIn() { return token !== null; },
  };
})();

// ES module — auth.js
// let token = null;
// export function login(t) { token = t; }
```

**Sources:** [javascript.info/modules-intro](https://learn.javascript.ru/modules-intro) · [MDN modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) · [Doka — OOP](https://doka.guide/tools/oop/)

</details>

---

<a name="interview-practice"></a>

<details>
  <summary>Interview Practice</summary>

### Interview Practice

Questions from [0_interview.md](0_interview.md). Try answering before opening solutions.

### Question index

| Topic | Answer |
|-------|--------|
| Four OOP principles | Q&A |
| What are classes? | Q&A |
| Prototype chain, `new` | Q&A |
| Class vs constructor | Q&A |
| Composition vs inheritance | Q&A |
| Descriptors, immutability | Q&A |
| Proxy | Q&A |

---

## Questions & Answers

<details>
  <summary>Four OOP principles in JavaScript?</summary>

### Four OOP principles in JavaScript?

**Definition:**

Classic OOP pillars map to JS patterns — not all via `class`.

| Principle | In JS | Example |
|-----------|-------|---------|
| **Encapsulation** | Closures, private `#fields`, ES modules | `#balance` only inside class |
| **Abstraction** | Hide internals behind small public API | `fetch(url)` hides HTTP details |
| **Inheritance** | Prototype chain, `class extends` | `Dog extends Animal` |
| **Polymorphism** | Same method name, different behavior per object | `shapes.forEach(s => s.area())` |

**How it works:** JS uses prototypes under the hood; classes are syntax sugar. Encapsulation is often closures/modules rather than access modifiers alone.

**When to use:** Use inheritance for true `is-a`; encapsulation via modules + private fields; polymorphism via shared method interface (duck typing).

**Examples:**

```js
class Shape {
  area() { throw new Error('implement'); }
}
class Circle extends Shape {
  constructor(r) { super(); this.r = r; }
  area() { return Math.PI * this.r ** 2; }
}
[ new Circle(2), new Circle(3) ].forEach(s => console.log(s.area()));
```

**Sources:** [javascript.info/class](https://learn.javascript.ru/class) · [Doka — OOP](https://doka.guide/tools/oop/)

</details>

<details>
  <summary>What are classes?</summary>

### What are classes?

**Definition:** A class is a **schema** for creating and using objects — fields (data) + methods (actions) + `constructor` (init on `new`).

**How it works:** `class History { ... }` creates a constructor function and puts methods on `History.prototype`. Each `new History()` is an instance; methods use `this` so they mutate *that* instance. Factories (`createSpending`) are enough for small same-shaped objects; classes win when behavior and several instances matter.

**When to use:** Interview opener for OOP. Follow with prototype sugar, `this` rules, and why JS still lacks interfaces.

**Examples:**

```js
class Record {
  constructor(amount) {
    this.amount = amount;
    this.dateTime = Date.now();
  }
}

const spending = new Record(100);
console.log(spending.amount); // 100 — instance is a normal object
```

**Thoughts:** Class = blueprint; instance = house. In JS the blueprint is still a prototype chain.

**Sources:** [Doka — OOP](https://doka.guide/tools/oop/) · [MDN Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

</details>

<details>
  <summary>How does prototype inheritance work?</summary>

### How does prototype inheritance work?

**Definition:** Objects link to a prototype object; property lookup walks the chain until found or `null`.

**How it works:**

1. Every object has `[[Prototype]]` (`Object.getPrototypeOf(obj)`).
2. Read `obj.prop`: check own properties → walk prototype chain.
3. `new Fn()` sets instance `[[Prototype]]` to `Fn.prototype` and runs constructor.
4. Methods on `Fn.prototype` are shared by all instances.

**When to use:**

ES5 `Animal.prototype.method`; ES6 `class` desugars to same model; `Object.create(proto)` without constructor.

#### Common pitfalls

Setting `Child.prototype = Parent.prototype` (no `Child` in chain); confusing `__proto__` with `prototype` on functions.

**Examples:**

```js
function Animal(name) { this.name = name; }
Animal.prototype.speak = function () { return this.name; };

const a = new Animal('Cat');
console.log(a.speak()); // 'Cat' — from Animal.prototype
console.log(Object.getPrototypeOf(a) === Animal.prototype); // true
```

`new` steps: create object → link prototype → call constructor with `this` → return object (unless constructor returns object).

**Sources:** [javascript.info/prototypes](https://learn.javascript.ru/prototypes)

</details>

<details>
  <summary>Class vs constructor function?</summary>

### Class vs constructor function?

**Definition:**

Both create objects with shared prototype methods; `class` is syntactic sugar with stricter rules.

| | Constructor function | ES6 class |
|---|---------------------|-----------|
| Call without `new` | Often breaks silently | `TypeError` |
| Strict mode | Optional | Always |
| Methods | On `.prototype` manually | Inside class body |
| Inheritance | Manual prototype linking | `extends` / `super` |
| Hoisting | Function hoisted | TDZ until declaration |
| `arguments` in methods | Available | Not in class methods |

**How it works:** `class User {}` creates function `User` and puts methods on `User.prototype` — same as writing constructor + `User.prototype.method`.

**When to use:**

Legacy codebases use constructors; new code prefers `class` for clarity and `extends`; factory functions when `new` is undesirable.

#### Common pitfalls

Calling class without `new`; expecting class hoisting like `function`; `typeof MyClass === 'function'` surprises newcomers.

**Examples:**

```js
// ES5
function UserES5(name) { this.name = name; }
UserES5.prototype.greet = function () { return this.name; };

// ES6 — equivalent intent
class UserES6 {
  constructor(name) { this.name = name; }
  greet() { return this.name; }
}
```

**Sources:** [javascript.info/class](https://learn.javascript.ru/class)

</details>

<details>
  <summary>Composition vs inheritance?</summary>

### Composition vs inheritance?

**Definition:**

**Inheritance** — `is-a` (subtype shares prototype chain). **Composition** — `has-a` (object embeds or receives behavior from other objects/functions).

| | Inheritance | Composition |
|---|-------------|-------------|
| Relationship | `Dog extends Animal` | `car.engine = createEngine()` |
| Flexibility | Rigid tree | Mix behaviors at runtime |
| JS fit | Single inheritance limit | Idiomatic in modern JS |

**How it works:** Composition favors injecting dependencies or merging capability objects; inheritance sets fixed prototype chain at class definition time.

**When to use:**

Inheritance when subtype truly substitutes parent; composition for feature mixing, testing (mock dependencies), avoiding deep hierarchies.

#### Common pitfalls

Deep inheritance trees in JS; "god object" composing too many unrelated traits; using `extends` for code reuse only (prefer composition).

**Examples:**

```js
// Composition
const canFly = { fly() { return 'flying'; } };
const bird = { name: 'Eagle', ...canFly };

// Inheritance
class Animal { speak() { return 'sound'; } }
class Dog extends Animal { speak() { return 'woof'; } }
```

**Sources:** [javascript.info/mixins](https://learn.javascript.ru/mixins)

</details>

<details>
  <summary>Immutable object techniques?</summary>

### Immutable object techniques?

**Definition:** Prevent mutation at binding, property, or object-shape level — JS has no built-in deep immutability.

**How it works:**

- `const x = obj` — prevents rebinding `x`, not mutating `obj`.
- `Object.preventExtensions` / `seal` / `freeze` — escalating shallow locks (see **Property descriptors**).
- `Object.defineProperty` — `writable: false` per property.
- Copy-then-replace: `structuredClone` + new object instead of mutate (React/Redux style).
- Libraries: Immer produces immutable updates from draft mutations.

| Technique | Depth | Reversible |
|-----------|-------|------------|
| `const` | binding only | reassign variable |
| `freeze` | shallow | no |
| `defineProperty` | one property | if `configurable` |
| `structuredClone` + replace | deep copy new tree | old tree unchanged |
| Immer | logical immutability | produces new state |

**When to use:**

Redux state; frozen config; read-only API response exposure; defensive copies before passing to untrusted code.

#### Common pitfalls

`freeze` does not freeze nested objects; `const` ≠ immutable object; thinking `JSON.parse(JSON.stringify(o))` preserves all types.

**Examples:**

```js
const config = Object.freeze({ api: 'https://api.example.com' });
// config.api = 'x'; // fails in strict

const next = structuredClone(state);
next.user.name = 'Bob'; // new tree, state unchanged
```

Deep freeze requires recursive `Object.freeze` on nested objects or use Immer.

**Sources:** [javascript.info/property-descriptors](https://learn.javascript.ru/property-descriptors)

</details>

<details>
  <summary>What is Proxy for?</summary>

### What is Proxy for?

**Definition:** `Proxy` intercepts operations on a target object — validation, logging, virtual properties, reactivity.

**How it works:** Handler traps (`get`, `set`, `has`, …) run before default behavior; use `Reflect` inside traps for correct forwarding.

**When to use:** Validate assignments; implement `negativeIndex` array wrapper; Vue 3 reactivity; test mocks.

**Examples:**

```js
const arr = new Proxy([], {
  get(target, prop) {
    if (typeof prop === 'string' && prop.startsWith('-')) {
      return target[target.length + Number(prop)];
    }
    return Reflect.get(target, prop);
  },
});
arr.push(10, 20, 30);
console.log(arr[-1]); // 30
```

See **Advanced topics → Proxy and Reflect** for full trap list and pitfalls.

**Sources:** [javascript.info/proxy](https://learn.javascript.ru/proxy)

</details>

---

### Tasks

### Task 1 — Object.create inheritance

Create `vehicle` with `describe`, `car` inherits and adds `wheels`.

<details><summary>Solution</summary>

```js
const vehicle = {
  describe() { return `${this.brand}`; },
};
const car = Object.create(vehicle);
car.brand = 'Toyota';
car.wheels = 4;
```

</details>

### Task 2 — instanceof without built-in

How does `obj instanceof Constructor` work?

<details><summary>Answer</summary>

Walks `obj.__proto__` chain checking if any equals `Constructor.prototype`.

</details>

### Task 3 — Define read-only property

```js
const obj = {};
// add `id` that cannot be changed
```

<details><summary>Solution</summary>

```js
Object.defineProperty(obj, 'id', { value: 1, writable: false, enumerable: true });
```

</details>

### Task 4 — Proxy validation

Proxy that rejects negative `age` assignments.

<details><summary>Solution</summary>

```js
const user = new Proxy({}, {
  set(target, prop, value) {
    if (prop === 'age' && value < 0) throw new RangeError('age');
    target[prop] = value;
    return true;
  },
});
```

</details>

---

<details>
  <summary>Coding tasks (legacy)</summary>

### Coding tasks (legacy)

//// 0 Name four OOP principles

// 4 Object.create — Create vehicle/car with inheritance and describe method

/// 8 **proto**, prototype, [[Prototype]]

/// 9 What is this? Solve the task

</details>

<details>
  <summary>Middle — JS Core (OOP)</summary>

### Middle — JS Core (OOP)

14. Describe how JS implements encapsulation, polymorphism, and abstraction.

15. What is a prototype? How does prototype inheritance work in JS? Explain with code.

16. What is the difference between composition and inheritance?

20. What behavioral differences exist between ES5 constructor functions and ES2015 classes?

31. What are property descriptors? Describe practical use cases.

32. Name several ways to create an immutable object in JavaScript.

33. How do you create a property that cannot be changed?

34. What is the Proxy constructor for? Give an example.

</details>

<details>
  <summary>JS Core (OOP)</summary>

### JS Core (OOP)

8. Implement the Class Free OOP pattern (https://observablehq.com/@bratter/class-free-oop).

</details>

</details>
