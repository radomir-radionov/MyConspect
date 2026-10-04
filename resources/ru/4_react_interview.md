# React — Interview

Вопросы для собеседования по React. Ответы заполнены для опубликованной части, остальные пустые.

[← Вернуться в центр](./4_react.md)

### Related docs

- [React — Core](./4_react_core.md) · [React — Hooks](./4_react_hooks.md) · [React — React 19](./4_react_server.md) · [React — Ecosystem](./4_react_ecosystem.md) · [React — Redux](./4_react_redux.md) · [React — TanStack](./4_react_tanstack.md) · [React — Интервью](./4_react_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Вопросы из [Devinterview.io — React](https://devinterview.io/questions/web-and-mobile-development/react-interview-questions/).

### React Basics

<details>
<summary>What is React and why is it used?</summary>

### What is React and why is it used?

**Definition:**

React — библиотека JavaScript для интерфейсов из компонентов. Вы описываете UI для данного состояния, а React приводит DOM к этому описанию.

**How it works:**

- Компонент — функция от props (и, если нужно, от состояния), которая возвращает элементы. UI — результат этой функции, а не список императивных правок DOM.
- Данные текут вниз через props. Ребёнок не лезет наверх переписывать переменные родителя.
- JSX — обычный синтаксис. Шаг сборки превращает его в вызовы создания элементов. Среда выполнения JSX не понимает.
- React держит дерево в памяти, сравнивает его с предыдущим и записывает разницу в хозяина (DOM или нативный рендерер).
- Функциональные компоненты и хуки — текущий стиль: `useState` для состояния, `useEffect` для синхронизации с тем, что вне React.
- Параллельный рендеринг может готовить обновление, не блокируя ввод. Серверные компоненты рисуются на сервере и могут не отправлять клиентский JavaScript для частей, которые там и остаются.
- React — библиотека UI. Маршруты, загрузка данных и полноценный каркас — выбор, который добавляют, часто через Next.js или похожий хост.
- TypeScript ложится прямо: props — это тип аргумента функции.

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

React — библиотека UI: вы собираете функции, которые возвращают элементы. Angular — целая платформа со своим компилятором, инжектором и языком шаблонов. Vue — прогрессивный фреймворк, у которого шаблоны и реактивность входят в ядро.

**How it works:**

- React оставляет маршруты, HTTP и раскладку папок вам или мета-фреймворку. Angular поставляет эти решения сам. Vue между ними: ядро небольшое, а маршрутизатор и Pinia — официальные дополнения.
- UI в React — это JSX, то есть JavaScript. Шаблоны Angular и Vue — языки, похожие на HTML, со своим синтаксисом ветвления (`@if` / `@for` в современном Angular, директивы и `v-if` во Vue).
- React обновляет экран, заново вызывая компонент и сравнивая результат. Vue отслеживает, какие реактивные свойства прочитало рисование. Новая сигнальная модель Angular тоже следит за зависимостями; старое обнаружение через зоны рисовало шире.
- Общее клиентское состояние в React — `useState`, поднятое состояние или Context, а ещё хранилище вроде Redux или Zustand, когда граф обновлений разрастается. В Angular — сервисы и сигналы. Обычное хранилище Vue — Pinia.
- Хуки и композиция в React заменяют наследование. Composition API во Vue — та же идея. Angular собирает приложение внедрением зависимостей и автономными компонентами.
- TypeScript в Angular стоит по умолчанию и обычен в React и Vue. Цена входа в React — экосистема (маршруты, данные, серверные компоненты), а не один обязательный стек.

**Examples:**

```jsx
function Pier({ name }) {
  return <h1>{name}</h1>;
}
```

Та же шапка во Vue или Angular была бы привязкой в шаблоне, а не выражением JavaScript внутри разметки.

**Sources:**

- https://react.dev/learn/thinking-in-react
- https://angular.dev/overview
- https://vuejs.org/guide/introduction.html

</details>

<details>
<summary>What is a React component?</summary>

### What is a React component?

**Definition:**

Компонент — функция, которая принимает props и возвращает UI. У неё может быть своё состояние. Вместе компоненты образуют дерево, корень которого монтируют через `createRoot`.

**How it works:**

- Имя начинается с заглавной буквы, чтобы JSX считал его компонентом, а не тегом хозяина.
- Props — вход. Функция не должна их менять. Состояние — данные, которые компонент заменяет вызовом сеттера, и это планирует новый рендер.
- Хуки (`useState`, `useEffect`, `useContext`) — способ функции хранить состояние и говорить с внешним миром. Их вызывают на верхнем уровне, в одном и том же порядке на каждом рендере.
- Классовые компоненты (`extends React.Component`) всё ещё работают. Новый код пишут функциями. Классам нужны `this`, метод `render` и методы жизненного цикла, которые хуки складывают в эффекты.
- Серверный компонент выполняется на сервере и не может пользоваться состоянием или эффектами. Клиентский компонент, помеченный `"use client"` в хосте с серверными компонентами React, может.
- Один компонент рисует много детей. Переиспользование — композиция: элементы передают как `children` или как именованные props, а не через подкласс компонента.
- Рендер должен быть чистым. Не подписывайтесь, не запрашивайте сеть и не меняйте DOM во время рендера. Для этого есть эффекты и обработчики событий.

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

Пишут функцию с именем с заглавной буквы, принимают props и возвращают JSX. Рендерят её как `<Tide height={2} />`.

**How it works:**

- Props приходят одним объектом. Деструктурируйте нужное. Значения по умолчанию — обычные умолчания JavaScript.
- Локальное состояние — `useState`. Подписка или таймер — `useEffect` с очисткой. Не копируйте методы жизненного цикла класса один к одному.
- Общую логику выносят в свой хук (`useTide`), который вызывает другие хуки. Это замена примесям и большинству компонентов высшего порядка.
- Props типизируют через `type` или `interface`. PropTypes — прежний способ проверки во время выполнения; при проверке TypeScript они необязательны.
- Файл может экспортировать один главный компонент. Держите его узким; делите, когда у части своё состояние или её переиспользуют.
- В схеме с серверными компонентами `"use client"` ставят только на модули, которым нужны состояние, эффекты или API браузера.
- Родитель рендерит ребёнка. В JSX функцию сами не вызывают (`Tide()`); используют форму элемента, чтобы React мог отслеживать компонент.

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

JSX — расширение синтаксиса, похожее на HTML внутри JavaScript. Компилятор превращает `<Tide height={2} />` в вызов, который создаёт элемент React. Это не строка HTML.

**How it works:**

- Современное преобразование порождает `jsx` / `jsxs` из `react/jsx-runtime`. `React` не импортируют только ради `React.createElement`, если инструмент ещё не на старом преобразовании.
- Фигурные скобки вставляют выражение: текст, число, элемент или массив элементов. Инструкция (`if`, `for`) — не выражение; значение считают выше `return` или используют условное выражение.
- Имена атрибутов в camelCase (`className`, `htmlFor`, `onClick`), потому что они становятся свойствами JavaScript, а часть имён HTML — зарезервированные слова.
- Компонент возвращает один родительский узел или фрагмент (`<>...</>`), который узел DOM не создаёт.
- JSX проверяется при компиляции. Незакрытый тег или, с TypeScript, пропущенный обязательный prop ломают сборку.
- Тот же синтаксис служит и клиентским, и серверным компонентам. Директива и импорты решают, где он выполняется, а не другой язык разметки.
- `createElement` можно вызвать вручную. JSX — форма, которую можно пробежать глазами, потому что вложенность совпадает с деревом.

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

Виртуальный DOM — это описание UI, которое React держит в памяти. После обновления состояния React строит новое дерево, сравнивает его с предыдущим и применяет разницу к настоящему DOM.

**How it works:**

- Рендер порождает объекты элементов (тип, props, дети). Это дёшево рядом с касанием документа.
- Согласование обходит новое дерево. Тот же тип компонента на том же месте обновляет существующий экземпляр. Другой тип размонтирует старое поддерево и монтирует новое.
- Спискам нужны устойчивые props `key`, чтобы React сопоставлял строки, а не переиспользовал чужой узел DOM.
- Работа режется на единицы — файберы. Параллельный рендеринг может приостановить эту работу, продолжать показывать текущий экран и сначала закончить срочное обновление.
- Фаза фиксации — когда выполняются мутации DOM, эффекты макета и пассивные эффекты. Обновления в одном событии пакетируются, поэтому несколько вызовов `setState` становятся одной отрисовкой.
- Если новое значение состояния равно старому по `Object.is`, React отказывается от повторного рендера этого компонента.
- `react-dom` — рендерер для браузера. React Native и другие хосты переиспользуют то же согласование и дают свой host config. DOM всё равно не правят как источник правды; ref — запасной выход.

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

Функциональный компонент — функция от props. Классовый — экземпляр `React.Component` с методом `render`. Хуки дают функциям состояние и эффекты, которые раньше жили в классах.

**How it works:**

- У функций нет `this` и нет `render`. Возвращаемое значение и есть UI. Классы хранят состояние в `this.state` и обновляют его через `this.setState`, который сливает объект поверхностно.
- `useState` заменяет поле состояния. Сеттер заменяет это поле; объекты он не сливает, пока вы не сольёте их сами.
- Жизненные циклы класса (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`) разносят одну задачу по методам. `useEffect` держит установку и очистку одной задачи вместе.
- Метод класса, переданный как колбэк, теряет `this`, если его не привязать. У функции этой проблемы нет. Обработчик может быть внутренней функцией или `useCallback`, когда ребёнок мемоизирован.
- Класс читает один контекст через `contextType` или через consumer. Функция вызывает `useContext` столько раз, сколько нужно.
- Серверные компоненты и текущие API хуков сделаны для функций. Классы остаются для существующего кода; с них новую возможность не начинают.
- `PureComponent` и `memo` оба пропускают рендер, когда props поверхностно равны. Они не делают два стиля равнозначными.

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

Props событий — функции в camelCase, например `onClick` и `onChange`. React слушает корень и отдаёт синтетическое событие, которое оборачивает нативное.

**How it works:**

- Передают функцию, а не строку кода. `onClick={save}` передаёт функцию. `onClick={save()}` вызывает её во время рендера.
- Обработчик получает `SyntheticEvent`. `preventDefault` работает. Пул событий убрали в React 17, поэтому `event.target` можно читать после `await` без вызова `persist`.
- `onChange` на поле ввода срабатывает на каждую правку, не только на blur. Значение — `event.target.value`. Управляемое поле ещё и задаёт `value` из состояния.
- Обработчики — обычные замыкания, поэтому они видят props и состояние того рендера. Если обновление считается от предыдущего состояния, используют функциональную форму сеттера.
- React вешает слушатели на корневой контейнер, а не по одному нативному слушателю на строку, и всё же проводит событие компонента по дереву.
- `useCallback` полезен, когда мемоизированный ребёнок не должен рисоваться только потому, что родитель передал новую функцию. На каждом обработчике он не обязателен.
- Несрочную работу, которая начинается с события, можно обернуть в `startTransition`, чтобы ввод оставался отзывчивым, пока медленный рендер догоняет.

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

Props — вход, который передаёт родитель. Состояние — данные, которыми владеет компонент и которые он может менять. Рендер — результат того и другого.

**How it works:**

- Props только для чтения. Если ребёнку нужно новое значение, он просит родителя через колбэк, либо родитель на следующем рендере передаёт другой prop.
- `useState(initial)` возвращает текущее значение и сеттер. Вызов сеттера планирует рендер. Начальное значение используется только при первом монтировании, если вы не передали функцию, чтобы посчитать его лениво.
- Обновления состояния пакетируются. Несколько сеттеров в одном событии становятся одним рендером.
- Смена состояния заменяет этот кусок состояния. Вложенные объекты не сливаются. Копируйте поля, которые оставляете.
- Props меняются, когда родитель рисуется с новыми значениями. Состояние переживает эти рендеры, пока компонент не размонтируют или смена `key` не смонтирует его заново.
- Серверный компонент не может вызвать `useState`. Состояние живёт в клиентских компонентах.
- Не копируйте prop в состояние, если вы намеренно не делаете снимок. Prop и так является входом рендера.

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

От родителя к ребёнку данные идут prop. От ребёнка к родителю — prop-функция, которую ребёнок вызывает. Соседи делят данные, поднимая их к родителю, который рисует обоих, или читая контекст, который этот родитель даёт.

**How it works:**

- `<Tide height={2} />` передаёт prop. Ребёнок получает `{ height: 2 }`.
- Prop события вроде `onChange` позволяет ребёнку вернуть значение. Родитель кладёт его в состояние и передаёт новое значение вниз.
- `children` и именованные props-элементы (`icon={<Icon />}`) передают UI, не только данные, так что родителю не нужно знать разметку ребёнка.
- Prop drilling — боль протаскивания значения через компоненты, которые его не используют. Context убирает это протаскивание для значения, которое читают многие потомки.
- Context плохо подходит для значения, которое меняется на каждое нажатие, если провайдер стоит высоко: каждый потребитель перерисовывается. Хранилище с селекторами или состояние ниже по дереву этого избегают.
- Серверные данные не «передают по кругу» второй копией кэша. Библиотека данных или серверный компонент владеет запросом; компоненты получают результат как props.

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

Компонент с состоянием хранит данные, которые могут измениться после первого рендера, например текст в поле или открыта ли панель. Компонент без состояния рисуется только из props.

**How it works:**

- `useState` или `useReducer` делают функцию обладающей состоянием. Значения живут вместе с экземпляром компонента в файбере React, а не в локальной переменной, которую рендер сбросил бы.
- Обновление состояния планирует новый рендер этого компонента и, по умолчанию, его детей.
- Состояние используют для взаимодействия, которое сервер ещё не решил: переключатель, черновик, выбранная строка.
- Производные данные в состояние не кладут. Отфильтрованный список можно посчитать во время рендера из исходного списка и запроса.
- Компонент с состоянием должен владеть как можно меньшим. Если значение нужно двум детям, состояние принадлежит их родителю.
- Мемоизация детей (`memo`) ограничивает, как далеко обновление состояния перерисовывает дерево, когда их props не менялись.
- Состояние класса (`this.state`) — старая форма той же идеи. Новые компоненты используют хуки.

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

`useState(initial)` возвращает текущее значение этого экземпляра компонента и сеттер, который планирует обновление. React сопоставляет каждый вызов со слотом по порядку вызовов хуков.

**How it works:**

- Начальное значение читается только на первом рендере. Передавайте функцию, `useState(() => expensive())`, когда считать его дорого; React вызовет эту функцию один раз.
- Тождество сеттера устойчиво между рендерами. Его можно передать вниз, не оборачивая в `useCallback` только ради устойчивости.
- `setValue(next)` сохраняет `next`. `setValue(prev => prev + 1)` считает от последнего значения; эту форму берут, когда следующее значение зависит от предыдущего, особенно при параллельном рендеринге.
- React отказывается от обновления, когда `Object.is` говорит, что следующее значение равно текущему. Для объектов новая ссылка — это изменение, даже если поля совпали.
- Все вызовы в одном событии, таймере или промисе пакетируются. Отдельного рендера на каждый сеттер нет.
- Хуки должны вызываться безусловно и в одном порядке. `useState` внутри `if` сдвигает слоты и портит состояние.
- Состояние привязано к месту в дереве. Два элемента `<Counter />` имеют каждый свой слот `useState`.

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

Состоянием владеет родитель и передаёт сеттер или функцию, которая вызывает сеттер, вниз как prop. Ребёнок вызывает эту функцию. Напрямую состояние родителя он не пишет.

**How it works:**

- `function Child({ onPick })` и `<Child onPick={setId} />` — базовая форма. `setId` из `useState` уже устойчивая функция.
- Затем родитель рисуется с новым состоянием, и новое значение возвращается вниз как prop. Поток данных по-прежнему односторонний.
- Когда несколько далёких детей должны обновлять одно состояние, значение и dispatch дают через контекст, часто из `useReducer`, чтобы не протаскивать колбэк через каждый слой.
- `useImperativeHandle` открывает метод на ref. Это для императивных случаев вроде `focus()`, а не для обычного состояния формы.
- Клиентское хранилище (Redux, Zustand) — шаг после контекста, когда много обновлений должны уведомлять только компоненты, выбравшие свой срез.
- Серверные данные принадлежат мутации, которая инвалидирует запрос, а не родительскому `useState`, который пытается быть кэшем.
- Держите состояние у самого нижнего родителя, которому оно нужно, чтобы обновление не перерисовывало всю страницу.

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

Подъём состояния переносит состояние из ребёнка к ближайшему родителю, которого видит каждый заинтересованный ребёнок. Родитель держит значение и передаёт его вниз; дети сообщают об изменениях через колбэки.

**How it works:**

- Два поля, которые должны оставаться согласованными, не могут владеть каждый своей копией. Родитель владеет одним значением или одним объектом, и оба поля становятся управляемыми.
- Производные значения (площадь, сумма) считают в родителе во время рендера и передают как props. Это не второй кусок состояния.
- Поток остаётся односторонним: состояние вниз, события вверх. Это проще проследить, чем соседей, которые пишут друг другу.
- Управляемые поля — обычный результат. Родитель может проверить значение, прежде чем сохранить следующее.
- Слишком высокий подъём становится prop drilling. Если промежуточные компоненты только пробрасывают props, передайте `children`, чтобы родитель с состоянием сам рисовал листья, или используйте контекст для чего-то вроде темы.
- Ориентир: поднимайте, когда два компонента должны совпадать. Останавливайтесь, когда компоненты, которым всё равно, вынуждены принимать эти props.
- Сброс ребёнка сменой `key` — другой инструмент. Он монтирует ребёнка заново и состояние не разделяет.

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

Context передаёт значение многим потомкам без протаскивания props. Redux держит хранилище приложения, которое меняют действия и редьюсеры, а компоненты подписываются на его срезы. Большая часть состояния всё равно должна оставаться в `useState`.

**How it works:**

- Context подходит значению, которое читают многие компоненты и которое меняется редко: тема, локаль, id текущего пользователя. Обновление значения провайдера перерисовывает каждого потребителя этого контекста.
- Разделяйте контексты, которые меняются по разному расписанию, и мемоизируйте объект значения, иначе переключатель темы перерисует всё дерево.
- Context не даёт журнала действий, middleware и стандартного способа выбрать срез. Это в той же мере внедрение зависимости, что и состояние.
- Redux через Redux Toolkit подходит клиентскому состоянию, которое обновляют многие далёкие части, которое нужно проследить в DevTools или у которого явные переходы. `useSelector` перерисовывает компонент, только когда выбранное значение изменилось.
- RTK Query — для серверного кэша. Не собирайте этот кэш вручную в слайсе, если библиотека уже это делает.
- Сначала локальное состояние, затем поднятое, затем контекст, затем хранилище. Хранилище для одной формы — церемония.
- `useReducer` вместе с контекстом закрывает умеренный общий автомат без зависимости. К Redux переходят, когда проблемой становятся граф обновлений, middleware или инструменты отладки.

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
