# TypeScript — Unions & Literals

Объединения (`A | B`) и литеральные типы.

[← Назад к хабу](./5_ts.md)

### Related docs

* [TypeScript — hub](./5_ts.md) · [Интервью](./5_ts_interview.md)

### Sections

- [Unions and literals](#unions-and-literals)

---

## Unions and literals

<details>
  <summary>Unions and literals</summary>

### Union Types

**Definition:**

Значение, которое может быть **одним из** нескольких типов, записанных с помощью `|`: `string | number`.

| Когда использовать | Заметки |
|-------------|-------|
| Модель данных «или/или» (идентификатор в виде строки или числа, варианты статуса). **Уточняйте** перед использованием методов, специфичных для типа (`typeof`, `in`, дискриминант). | Объединение позволяет использовать только свойства/методы, **общие для всех участников**. `string \| number` не могу позвонить `.toUpperCase()` пока вы не сузите его. Как ни странно, *разрешёнными операциями* объединения являются |

**Examples:**

```typescript
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}

printId(101);    // OK
printId("202");  // OK
printId({ myID: 1 }); // Error
```

```typescript
function printId(id: number | string) {
  // console.log(id.toUpperCase()); // Error — number has no toUpperCase

  if (typeof id === "string") {
    console.log(id.toUpperCase()); // OK — narrowed to string
  } else {
    console.log(id); // OK — narrowed to number
  }
}

function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    console.log("Hello, " + x.join(" and "));
  } else {
    console.log("Welcome lone traveler " + x);
  }
}

// Shared method — no narrowing needed
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3); // both arrays and strings have .slice()
}
```

**Sources:** [Справочник по TypeScript — повседневные типы] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Literal Types

**Definition:**

Типы, которые являются точными значениями: `"left"`, `42`, `true` - не просто `string` or `number`.

| Когда использовать | Заметки |
|-------------|-------|
| Создавать профсоюзы: `type Dir = "up" \| "down"`. Использовать `as const` на объектах/массивах, чтобы сохранить литералы вместо расширения до `string`. | Переменная, типизированная как `"hello"` может быть только когда-либо `"hello"` — бесполезно в одиночку. Сила исходит от **союзов литералов**. Также посмотрите **буквальный вывод**: `const obj = { method: "GET" }` дает `метод: stri |

**Examples:**

```typescript
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}

printText("Hello", "left");    // OK
printText("Hello", "centre");  // Error — typo caught at compile time

function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```

```typescript
declare function handleRequest(url: string, method: "GET" | "POST"): void;

const req = { url: "https://example.com", method: "GET" };
// handleRequest(req.url, req.method); // Error — method inferred as string

const req2 = { url: "https://example.com", method: "GET" } as const;
handleRequest(req2.url, req2.method); // OK — method is "GET"
```

**Sources:** [Справочник по TypeScript — повседневные типы] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

</details>


