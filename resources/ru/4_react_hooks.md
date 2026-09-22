# React — Hooks

Крюки опорные и аварийные люки.

[ ← Вернуться в центр](./4_react.md)

### Related docs

* [React — Core](./4_react_core.md) · [React — Hooks](./4_react_hooks.md) · [React — React 19](./4_react_server.md) · [React — Ecosystem](./4_react_ecosystem.md) · [React — Интервью](./4_react_interview.md)

### Sections

- [5. Hooks reference](#5-hooks-reference)
- [6. Escape hatches](#6-escape-hatches)

---

## 5. Hooks reference

Каталог встроенных крючков

<details>
  <summary>Built-in hooks catalog</summary>

### Built-in hooks catalog

**Definition:** Указатель встроенных перехватчиков React, сгруппированных по ответственности — состояние, эффекты, ссылки, производительность и API React 19.

**How it works:**

1. **Изменяемые данные пользовательского интерфейса?** → `useState` or `useReducer`
2. **Синхронизировать с внешней системой?** → `useEffect` / `useLayoutEffect`
3. **DOM или значение без повторного рендеринга?** → `useRef`
4. **Общие данные без детализации?** → `useContext`
5. **Отложить дорогостоящий рендеринг?** → `useTransition` / `useDeferredValue`
6. **Вычисление кэша или стабильный обратный вызов?** → `useMemo` / `useCallback` (сначала профиль)

| Категория | Крючки |
| --------------- | ------------------------------------------------------------------------------------ |
| **Штат** | `useState`, `useReducer`, `useActionState` (Р19) |
| **Контекст** | `useContext`                                                                         |
| **Ссылка** | `useRef`, `useImperativeHandle`                                                      |
| **Эффект** | `useEffect`, `useLayoutEffect`, `useInsertionEffect`, `useEffectEvent` (Р19.2) |
| **Производительность** | `useMemo`, `useCallback`, `useTransition`, `useDeferredValue`                        |
| **Другое** | `useId`, `useSyncExternalStore`, `useDebugValue`, `use` (R19), `useOptimistic` (Р19) |
| **ДОМ** | `useFormStatus` (реакция-дом) |

**Examples:**

```tsx
const [n, setN] = useState(0);           // UI data
const ref = useRef<HTMLInputElement>(null); // no re-render
useEffect(() => { document.title = String(n); }, [n]); // after paint
```

**Sources:**

[react.dev/reference/react/hooks](https://react.dev/reference/react/hooks)

Правила крючков

</details>

<details>
  <summary>Rules of Hooks</summary>

### Rules of Hooks

**Definition:** Два инвариантных правила, которые обеспечивают единообразие состояния связанного списка React при рендеринге. Один из трех сегментов [Rules of React](./4_react_core.md#rules-of-react).

**How it works:**

React хранит перехватчики на волокне в виде **связанного списка** — сначала `useState` это слот 0, первый `useEffect` это слот 1 и т. д. Каждый рендер проходит по списку в **одном и том же порядке**. Условные перехваты смещают слоты → состояние привязывается к неправильному перехватчику → сбои или тихие ошибки.

1. Вызывайте хуки только на **верхнем уровне**, а не внутри условий, циклов, вложенных функций и т. д. `try`/`catch`/`finally`, или после раннего `return`
2. Вызывайте перехватчики только из **компонентов функций React** или **пользовательских перехватчиков** (`use`*)

**When to use:** Всегда. Давать возможность `eslint-plugin-react-hooks` (`rules-of-hooks` + `exhaustive-deps`). Продолжение интервью: * «Если мне нужен хук только при входе в систему, я все равно вызываю его при каждом рендеринге и ставлю `if (loggedIn)` внутри эффекта — я никогда не пропускаю вызов».*

**Examples:**

```tsx
// Bad — conditional hook
if (loggedIn) useEffect(() => {}, []);

// Good — condition inside effect
useEffect(() => { if (loggedIn) subscribe(); }, [loggedIn]);
```

**Thoughts:** *Одинаковые хуки, тот же порядок, при каждом рендеринге.*

**See also:** [Правила React](./4_react_core.md#rules-of-react) · [Пользовательские перехватчики](#custom-hooks) · [React Fiber](./4_react_core.md#react-fiber)

**Sources:**

[react.dev/reference/rules/rules-of-hooks](https://react.dev/reference/rules/rules-of-hooks)

useState

</details>

<details>
  <summary>useState</summary>

### useState

**Definition:** `useState(initial)` объявляет переменную состояния и `set` функция. Установщик планирует создание **следующего снимка** — он не изменяет значение в текущем рендеринге.

**How it works:**

— React сохраняет значение в волокне. Первый рендер использует `initial`; позже игнорирует `initial`.
- Передайте **функцию** в качестве начальной (`useState(createTodos)`, нет `createTodos()`) для **lazy init** — React вызывает его только при первом монтировании. В строгом режиме (dev) инициализатор может запускаться дважды; держите его **чистым**.
- `setX(next)` or `setX(prev => next)`. Программы обновления ставятся в очередь и применяются по порядку при следующем рендеринге — это необходимо, когда несколько обновлений происходят в **одном событии** (`setN(n => n + 1)` дважды → +2).
- `set` **не** изменяет локальную переменную в работающем обработчике: после `setCount(1)`, `count` остается старым снимком до следующего рендеринга.
- Если `Object.is(next, current)`, React **пропускает** повторный рендеринг. Мутация тогда `setItems(items)` это не операция.
- `set` идентичность **стабильна** (можно исключить из описания эффектов). React [batches](./4_react_core.md#batching) обновляется после обработчиков событий.
- Чтобы **сохранить функцию** в состоянии, оберните ее: `useState(() => fn)` / `setFn(() => otherFn)` — в противном случае React рассматривает его как инициализатор/обновитель.

*"Состояние — это снимок каждого рендеринга. Я обновляю неизменно, поэтому `Object.is` видит новую ссылку. Я использую средство обновления, когда следующее значение зависит от предыдущего в том же событии».*

**When to use:**

Локальный пользовательский интерфейс — переключатели, ввод, выбор, модальные окна. **Не** производные данные отображения (вычисления при рендеринге) или кэш сервера (запрос/RSC).

| API | Использование |
| --------------------------- | ------------------------------------------- |
| `useState(initial)`         | Дешевая первоначальная стоимость |
| `useState(createTodos)`     | Дорогой init — передать функцию, нет `()` |
| `setN(n => n + 1)`          | Следующее состояние от предыдущего в том же событии |
| `setN(count + 1)`           | Прекрасно, если у вас уже есть снимок |

#### Common pitfalls

`onClick={fn()}` (вызовы во время рендеринга → «Слишком много повторных рендеров»). Ведение журнала `count` сразу после `setCount` все еще показывает старое значение. `useState(expensive())` пересчитывает `expensive` каждый рендер.

**Pluses and minuses:**

| + | − |
| ----------------------------------------- | ------------------------------------------------- |
| Простая ментальная модель, стабильный сеттер | Легко изменять объекты и пропускать обновления |
| Ленивая инициализация + очередь обновлений | Множество связанных полей → `useReducer` яснее |
| В пакете с другими `set`в одном мероприятии | Функции хранения требуют дополнительных `() =>` упаковка |

**Examples:**

```tsx
const [user, setUser] = useState<User | null>(null);
setUser(u => (u ? { ...u, name: 'Ada' } : null));

// Interview trap — same reference, UI may not update
// items.push(x); setItems(items);
setItems(prev => [...prev, x]);
```

**Thoughts:** *`set` ставит в очередь следующий снимок; переменные текущего рендеринга никогда не меняются.*

**See also:** [Состояние как снимок](./4_react_core.md#state-as-snapshot) · [useReducer](#usereducer-1) · [Пакетная обработка](./4_react_core.md#batching)

**Sources:**

[react.dev/reference/react/useState](https://react.dev/reference/react/useState)

useReducer

</details>

<details>
  <summary>useReducer</summary>

### useReducer

**Definition:** Государственный крюк, управляемый `(state, action) => newState`. То же хранилище волокон, что и `useState`, но **все переходы** выполняются через одну функцию. `dispatch` **стабилен** — передайте его без `useCallback`.

**How it works:**

`dispatch(action)` ставит обновление в очередь; при следующем рендеринге запускается React `reducer(prev, action)` (чистый). Ленивая инициализация: `useReducer(reducer, initArg, initFn)` — `initFn(initArg)` запускается один раз. Предпочитаю бросаться на неизвестные действия, чтобы опечатки не были громкими.

*“`useReducer` когда обновления являются конечным автоматом. `useState` когда это одно значение. `dispatch` стабилен, поэтому детям не нужны запоминаемые обратные вызовы, чтобы просто позвонить».*

**When to use:** Многополевые формы, мастера, «следующее состояние зависит от нескольких полей». **Ни** ни одного логического значения/счетчика.

**Pluses and minuses:**

| + | − |
| ----------------------------------------- | ------------------------------------- |
| Централизованные переходы, легко тестируемые | Шаблон для крошечного государства |
| Стабильный `dispatch`                         | Оверкилл против двоих `useState`s |
| Та же идея, что и у Redux, локально для дерева | Все еще не глобальный магазин |

**Examples:**

```tsx
type Action = { type: 'increment' } | { type: 'set'; value: number };

function reducer(state: { count: number }, action: Action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'set':
      return { count: action.value };
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: 'increment' });
```

**See also:** [useReducer в разделе 4](#usereducer) · [useState](#usestate)

**Sources:**

[react.dev/reference/react/useReducer](https://react.dev/reference/react/useReducer)

использоватьконтекст

</details>

<details>
  <summary>useContext</summary>

### useContext

**Definition:** Считывает ближайшее значение поставщика, указанное выше в дереве. Компонент **перерисовывается всякий раз, когда это значение изменяется** (`Object.is`).

**How it works:**

`createContext(default)` — значение по умолчанию используется только в том случае, если поставщика **нет**. `useContext(Ctx)` направляет волокна вверх. Реакция 19: `<ThemeContext value={theme}>` (no `.Provider` необходимый). Контекст — это **не** высокочастотное хранилище: каждый потребитель выполняет повторный рендеринг при изменении значения.

*"Контекст для редких, древовидных значений. Если многие компоненты перерисовываются при каждом нажатии клавиши, значение слишком горячее — разделите или используйте хранилище".*

**When to use:**

Тема, локаль, сеанс аутентификации, DI клиента. **Не** корзина для покупок, которая обновляется при каждом клике — используйте Zustand/Redux или поднимите состояние.

#### Common pitfalls

`value={{ user, theme }}` создает новый объект при каждом родительском рендеринге → все потребители обновляются. Разделите контексты или запомните. Не используйте контекст для данных сервера (Query/RSC).

**Pluses and minuses:**

| + | − |
| ---------------------------- | --------------------------------------------- |
| Избегает винтового бурения | Все потребители повторно выполняют рендеринг `value` изменить |
| Встроенная, без дополнительной библиотеки | Легко поместить слишком много в один объект |

**Examples:**

```tsx
const ThemeContext = createContext<'light' | 'dark'>('light');

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}

<ThemeContext value={theme}><App /></ThemeContext>
```

**See also:** [Контекст](./4_react_core.md#context) · [Реквизит](./4_react_core.md#props)

**Sources:**

[react.dev/reference/react/useContext](https://react.dev/reference/react/useContext)

использованиеЭффект

</details>

<details>
  <summary>useEffect</summary>

### useEffect

**Definition:** Объявляет **синхронизацию** с внешней системой (сеть, DOM API, подписки, сторонние виджеты). React запускает установку после фиксации компонента; это **не** класс `componentDidMount` клон. Возврат `undefined`. Эффекты выполняются **только на клиенте** — никогда во время SSR.

**How it works:**

1. После фиксации запускается React. `setup`. `setup` может вернуть **очистку**.
2. При следующем коммите, если **любая** зависимость изменилась (`Object.is`), React запускает **очистку со старыми значениями**, а затем **настройку с использованием новых значений**.
3. При размонтировании React запускает очистку.
4. Зависимости должны представлять собой **встроенный массив** каждого **реактивного** значения, используемого при настройке (свойства, состояние и локальные значения из тела компонента). Опустите массив → запускайте после **каждого** коммита. `[]` → только после **первого** коммита (плюс дополнительный цикл строгого режима в разработке).
5. Очистка **не** «только при размонтировании». Он также запускается перед повторным запуском эффекта при изменении глубины.
6. **Строгий режим (для разработчиков):** дополнительная настройка → очистка → настройка при монтировании. Производство монтируется один раз. Если вы видите двойное получение/подписку, ваша очистка должна отменить настройку (отключиться, `abort()`, чистый интервал).
7. Время по умолчанию: после **paint**, чтобы браузер мог сначала отобразить пользовательский интерфейс. Визуальный размер/положение, которое будет мерцать → [`useLayoutEffect`](#uselayouteffect).

| Вы пишете | При запуске установки |
| ---------------- | ---------------------------------------------------- |
| нет второго аргумента | После каждого коммита |
| `[]`             | После первого коммита (переподключение только в случае перемонтирования) |
| `[roomId, url]`  | После первого коммита, а затем, когда эти значения изменяются |

Отсутствуют deps → **устаревшее закрытие** (эффект видит старое `count` / `user`). Дополнительные зависимости объекта/функции, созданные при рендеринге → эффект каждый раз запускается повторно (`{} !== {}`). Исправление: зависьте от примитивов или **создавайте объект/функцию внутри** эффекта (предпочтительнее, чем заключать все в `useCallback`).

* «Я использую `useEffect` для подключения к чему-то, чем не владеет React. В массиве зависимостей перечислены реактивные значения, которые должны перезапустить это соединение. Очистка отключается, поэтому строгий режим и изменения реквизита не просачиваются. Если я только получаю данные пользовательского интерфейса или обрабатываю клик, я не использую эффект».*

**When to use:**

Подписаться на WebSocket/`matchMedia`, запустите таймер, прикрепите виджет, не относящийся к React, синхронизируйте `document.title`, запишите «просмотренная страница». Извлечение **может** жить здесь с флагом игнорирования / `AbortController`, но документы React предпочитают RSC, загрузчики или TanStack Query.

Производные значения (`fullName = first + last`), реагирование на клик (обработчик событий), сброс состояния (`key={userId}`), уведомление родителя о клике (вызов обратного вызова в обработчике), связывание `setA` затем `setB` от А.

#### Common pitfalls

- Никакой уборки `setInterval` / слушатели → Двойные галочки в строгом режиме, утечки при размонтировании.
- Объект/функция в деталях воссоздается при каждом рендеринге → цикле или повторном подключении шторма.
- `useEffect(() => { setX(f(y)); }, [y])` когда `f(y)` можно вычислить в рендере.
- Внесение `useLayoutEffect` — Блокирует краску.
- Очистка рассматривается как «только размонтирование» — она также запускается, когда `roomId` изменения.

**Pluses and minuses:**

| + | − |
| ----------------------------------------- | ------------------------------------------------------------ |
| Очистка пар с настройкой (без утечек сабвуферов) | Чрезмерно используется как «свалка жизненного цикла» || Deps делает повторную синхронизацию явной | Устаревшие замыкания/бесконечные циклы, если значения неверны |
| В поверхностях строгого режима отсутствует очистка | Только для клиента; fetch-in-effect требует обработки гонок |

**Examples:**

```tsx
useEffect(() => {
  const conn = createConnection(serverUrl, roomId);
  conn.connect();
  return () => conn.disconnect();
}, [serverUrl, roomId]);
```

**Пример — выборка без гонок** (шаблон документации: флаг игнорирования):

```tsx
useEffect(() => {
  let ignore = false;
  setBio(null);
  fetchBio(person).then((result) => {
    if (!ignore) setBio(result);
  });
  return () => {
    ignore = true;
  };
}, [person]);
```

**Не** выполнять обратный вызов эффекта `async` — возвращенный промис не является очисткой. Используйте внутренний `async` функция или IIFE; прервать/игнорировать в возвращенной очистке. См. [Задачу 4](./4_react_interview.md#task-4--async-fetch-in-useeffect).

**Thoughts:** *Эффекты синхронизируются с внешним миром. Deps = когда выполнять повторную синхронизацию. Очистка = отменить последнюю синхронизацию.*

**See also:** [Возможно, вам не понадобится эффект](#вам-может-не-нужен-эффект) · [useLayoutEffect](#uselayouteffect) · [useEffectEvent](#useeffectevent-react-192) · [Строгий режим](./4_react_core.md#strict-mode)

**Sources:**

[react.dev/reference/react/useEffect](https://react.dev/reference/react/useEffect) · [Возможно, вам не понадобится эффект](https://react.dev/learn/you-might-not-need-an-effect)

использоватьLayoutEffect

</details>

<details>
  <summary>useLayoutEffect</summary>

### useLayoutEffect

**Definition:** Та же подпись, что и `useEffect` но срабатывает **синхронно после мутаций DOM, перед отрисовкой браузера**.

**How it works:**

| Крюк | Когда | Блокирует краску? |
| -------------------- | -------------------------------- | ------------- |
| `useInsertionEffect` | До мутации DOM | Да |
| `useLayoutEffect`    | После мутации DOM, до отрисовки | Да |
| `useEffect`          | После покраски | Нет |

**When to use:**

Измерьте геометрию DOM, синхронизируйте положение прокрутки, наведите фокус без вспышки, расположите всплывающие подсказки. По умолчанию `useEffect` для получения/подписок.

#### Common pitfalls

Получение данных в `useLayoutEffect` — Блокирует краску. Разбивка макета из-за повторяющихся циклов измерения/записи.

**Examples:**

```tsx
useLayoutEffect(() => {
  const height = ref.current?.getBoundingClientRect().height;
  setTooltipTop(height);
}, [items]);
```

**Thoughts:** *Используйте, когда пользователь не должен видеть неправильный кадр.*

**See also:** [Конвейер рендеринга](./4_react_core.md#render-pipeline) · [useEffect](#useeffect) · [useInsertionEffect](#useinsertioneffect)

**Sources:**

[react.dev/reference/react/useLayoutEffect](https://react.dev/reference/react/useLayoutEffect)

использоватьInsertionEffect

</details>

<details>
  <summary>useInsertionEffect</summary>

### useInsertionEffect

**Definition:** Хук эффекта, который запускается **синхронно после рендеринга, до того, как React применит мутации DOM** — самый ранний из трёх хуков эффектов.

**How it works:** Заказ на фиксацию: рендер → `useInsertionEffect` → Мутации DOM → `useLayoutEffect` → краска → `useEffect`. React запускает эффекты вставки, поэтому библиотеки внедрения стилей могут вставлять `<style>` теги перед тем, как браузер прочитает макет из обновленного DOM. Очистка выполняется перед следующим эффектом вставки на том же компоненте.

**When to use:** Библиотеки CSS-in-JS (Emotion, стилизованные компоненты, среда выполнения ванильного экстракта). **Нет** для побочных эффектов на уровне приложения, получения данных или измерения DOM — используйте `useLayoutEffect` or `useEffect`.

**Pluses and minuses:**

| + | − |
| --------------------------------------------- | -------------------------------------------------- |
| Правильный порядок внедрения CSS-in-JS | Блокирует макет при неправильном использовании в коде приложения |
| Выделенный API — без борьбы `useLayoutEffect` | Невозможно прочитать макет из DOM (запускается до мутаций) |
| Очистка пар с удалением стилей | Почти никогда не требуется в компонентах приложений |

**Examples:**

```tsx
useInsertionEffect(() => {
  insertStyles(key, styles);
  return () => removeStyles(key);
}, [key, styles]);
```

**Thoughts:** Разработчикам приложений практически никогда не следует использовать этот крючок. Если вы не создаете библиотеку стилей, предпочитайте `useLayoutEffect` (измерить DOM) или `useEffect` (все остальное).

**Sources:**

[react.dev/reference/react/useInsertionEffect](https://react.dev/reference/react/useInsertionEffect)

useEffectEvent (React 19.2)

</details>

<details>
  <summary>useEffectEvent (React 19.2)</summary>

### useEffectEvent (React 19.2)

**Definition:** `useEffectEvent(fn)` создает стабильную функцию, которая всегда видит последние реквизиты/состояние без зависимости от эффекта.

**How it works:** Поместите *реактивные* значения (`roomId`) в эффектах, поэтому эффект повторно подписывается при их изменении. Поместите логику *event* (`muted`, `theme`) внутри `useEffectEvent` поэтому эти ценности остаются актуальными без повторного подключения.

**When to use:**

Повторное подключение к чату включено `roomId` только; аналитика, которая читает последних пользователей без повторной привязки прослушивателей.

#### Common pitfalls

Размещение идентификатора соединения (`roomId`) внутри события эффекта, чтобы эффект никогда не запускался повторно. Вызов `useEffectEvent` условно (Правила хуков все еще применяются).

**Pluses and minuses:**

| + | − |
| ---------------------------------------- | ------------------------------------------------------- |
| Исправляет устаревшие замыкания без оттока | По духу все еще экспериментатор — команда должна знать раскол |
| Разделяет реактивную и нереактивную логику | Не вызывать события эффектов из рендеринга |

**Examples:**

```tsx
const onConnected = useEffectEvent(() => {
  showNotification('Connected!', theme); // always latest theme
});

useEffect(() => {
  const conn = createConnection(roomId);
  conn.on('connected', onConnected);
  return () => conn.disconnect();
}, [roomId]); // theme not needed in deps
```

**Thoughts:** Эффект deps = «когда повторно подписаться». События эффекта = «что делать с последними значениями».

**Sources:**

[react.dev/reference/react/useEffectEvent](https://react.dev/reference/react/useEffectEvent)

использоватьRef

</details>

<details>
  <summary>useRef</summary>

### useRef

**Definition:** Изменяемый `{ current }` box, который **выдерживает повторный рендеринг**. Письмо `.current` **не** планирует рендеринг.

**How it works:**

Одна и та же идентичность объекта при каждом рендеринге (в отличие от `createRef()` в теле функции). После фиксации React устанавливает `ref.current` к узлу DOM, когда вы передаете `ref={el}` на главном элементе. Чтение/запись `.current` в **эффектах и ​​обработчиках событий**, а не во время рендеринга (за исключением однократной отложенной инициализации `.current`).

*“`useRef` является переменной экземпляра. `useState` предназначен для всего, что пользователь должен видеть. Я не читаю рефы во время рендера».*

**When to use:**

| Дело | Узор |
| ----------------- | -------------------------------------------------------- |
| Доступ к DOM | `inputRef.current?.focus()` в обработчике кликов или эффекте |
| Поля экземпляра | Идентификатор таймера, WebSocket, предыдущая опора (`prev.current = x`) |
| Избегайте повторного рендеринга | Значение, которое пользовательский интерфейс не отображает |

#### Common pitfalls

Использование ссылки для отображаемых данных. `createRef()` внутри функционального компонента (новый объект при каждом рендеринге).

**Pluses and minuses:**

| + | − |
| ----------------------------------------- | ----------------------------------------- |
| Никаких дополнительных рендеров для таймеров/DOM | Изменение `.current` не будет обновлять пользовательский интерфейс |
| Стабильный объект — можно пропустить в некоторых разделах | Не замена государству |

**Examples:**

```tsx
const inputRef = useRef<HTMLInputElement>(null);
useEffect(() => { inputRef.current?.focus(); }, []);

const prevCount = useRef<number>(undefined);
useEffect(() => { prevCount.current = count; }, [count]);
```

**See also:** [Refs (React 19: ref as prop)](#refs-react-19-ref-as-prop) · [useRef vs createRef?](./4_react_interview.md#useref-vs-createref)

**Sources:**

[react.dev/reference/react/useRef](https://react.dev/reference/react/useRef)

использоватьMemo/useCallback

</details>

<details>
  <summary>useMemo / useCallback</summary>

### useMemo / useCallback

**Definition:** Кэшируйте **вычисленное значение** (`useMemo`) или **функциональное удостоверение** (`useCallback`) между рендерами. `useCallback(fn, deps)` is `useMemo(() => fn, deps)` — React **не** вызывает `fn`.

**How it works:**

Депс по сравнению с `Object.is`. Если не изменилось, верните предыдущее кэшированное значение/функцию. Если вы опустите массив deps, вы получите **новую** функцию/значение при каждом рендеринге. Кэш можно удалить (HMR, приостановить при первом подключении) — воспринимайте его как **подсказку**, а не как хранилище.

1. Реквизит для ребенка, завернутый в `memo` — пропустить повторный рендеринг, если реквизит является той же ссылкой.
2. Зависимость другого крючка (`useEffect`, вложенный `useCallback`).
3. Дорогостоящие вычисления во время рендеринга (сначала профиль).

Обертывание каждого обработчика «на всякий случай». Предпочитаю: дочерние элементы в формате JSX, не поднимайте состояние слишком высоко, сохраняйте чистоту рендеринга, **перемещайте функции внутри эффектов** вместо того, чтобы запоминать их как зависимости эффектов. Компилятор React может многое из этого сделать автоматически.

*"Все не заворачиваю. Запоминаю, когда размеренный ребенок заворачивается в `memo` выполняет повторный рендеринг из-за новой функции или когда вычисления требуют больших затрат. `useCallback(fn, deps)` запоминает функцию, а не запускает ее».*

**When to use:**

Сортированные/фильтрованные списки, которые оказались медленными; стабильный `onSubmit` для мемоизированной формы; функции **возвращаются из пользовательских перехватчиков** (чтобы вызывающие могли запоминать).

#### Common pitfalls

`useCallback` в `.map` цикл (Правила хуков — извлечь дочерний элемент). Забываем массив deps. Запоминание обратного вызова, но передача нового `style={{}}` рядом с ним — ребенок еще перерисовывается.

**Pluses and minuses:**

| + | − |
| ----------------------------------------- | --------------------------------------------- |
| Пропустить дорогую работу / оставить `memo` работаю | Ручные настройки легко ошибиться |
| Стабилизировать личность ребенка `memo`     | Компилятор/дети-как-JSX достаточно часто |

**Examples:**

```tsx
const sorted = useMemo(() => items.slice().sort(compare), [items]);
const onSave = useCallback(() => save(user), [user]);

// Fewer deps — updater instead of closing over `todos`
const add = useCallback((text: string) => {
  setTodos(todos => [...todos, { id: nextId++, text }]);
}, []);
```

**Thoughts:** *`useMemo` кэширует результат; `useCallback` кэширует функцию. Профиль сначала; Компилятор может заменить оба.*

**See also:** [Компилятор React](./4_react_server.md#react-compiler) · [useEffect](#useeffect)

**Sources:**

[react.dev/reference/react/useMemo](https://react.dev/reference/react/useMemo) · [useCallback](https://react.dev/reference/react/useCallback)

useTransition/useDeferredValue

</details>

<details>
  <summary>useTransition / useDeferredValue</summary>

### useTransition / useDeferredValue

**Definition:** Параллельные API для пометки обновлений или значений как **несрочных**, чтобы ввод и клики оставались отзывчивыми во время интенсивной отрисовки.

**How it works:**

| Крюк | Вы контролируете | Откладывает |
| ------------------ | ----------------------------- | ----------------------------------------- |
| `useTransition`    | Само обновление состояния | `startTransition(() => setState(...))`    |
| `useDeferredValue` | Вы получаете только реквизит/ценность | Повторный рендеринг дочерних элементов с использованием отложенного копирования |

**When to use:**

`useTransition` когда у тебя есть дорогой `setState`. `useDeferredValue` когда родитель передает быстро меняющуюся опору, а ребенок стоит дорого (в паре с `memo`).

#### Common pitfalls

`useDeferredValue` один без `memo` на дочернем элементе — дочерний элемент все равно может повторно отображать каждый родительский рендеринг. Требует `createRoot`.

**Examples:**

```tsx
const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query);
const [isPending, startTransition] = useTransition();

function onChange(e: React.ChangeEvent<HTMLInputElement>) {
  setQuery(e.target.value); // urgent
  startTransition(() => setResults(filter(e.target.value))); // deferred
}

// Child receives deferredQuery — lags behind query during fast typing
<SearchResults query={deferredQuery} />
```

**Thoughts:** *Переход откладывает работу по вашему графику; отложенное значение отстает от передаваемого вами значения.*

**See also:** [Параллельный рендеринг](./4_react_core.md#concurrent-rendering) · [React Fiber](./4_react_core.md#react-fiber)

**Sources:**

[react.dev/reference/react/useTransition](https://react.dev/reference/react/useTransition) · [useDeferredValue](https://react.dev/reference/react/useDeferredValue)

Реагировать на 19 хуков

</details>

<details>
  <summary>React 19 hooks</summary>

### React 19 hooks

**Definition:** Новые перехватчики в React 19 для асинхронных мутаций, оптимистичного пользовательского интерфейса, чтения обещаний/контекста при рендеринге и состояния ожидания формы.

**How it works:**

| Нужна | Крюк |
| ------------------------------------ | ---------------- |
| Отправка формы с состоянием загрузки/ошибки | `useActionState` |
| Мгновенный пользовательский интерфейс во время выполнения асинхронного действия | `useOptimistic`  |
| Отключить отправку с помощью вложенной кнопки | `useFormStatus`  |
| Чтение обещания или контекста в рендере | `use()`          |

| Крюк | Раздел |
| ---------------- | --------------------------------------------- |
| `useActionState` | [Раздел 7 — useActionState](./4_react_server.md#useactionstate) |
| `useOptimistic`  | [Раздел 7 — useOptimistic](./4_react_server.md#useoptimistic) |
| `use()`          | [Раздел 7 — use()](./4_react_server.md#use) |
| `useFormStatus`  | [Раздел 7 — useFormStatus](./4_react_server.md#useformstatus) |

**Examples:**

```tsx
const [error, submitAction, isPending] = useActionState(updateName, null);
return (
  <form action={submitAction}>
    <input name="name" />
    <button disabled={isPending}>Save</button>
    {error && <p role="alert">{error}</p>}
  </form>
);
```

`action` получает `(prevState, formData)` - нет `formData` первый.

**Thoughts:** *Шаблон действий — React отслеживает асинхронный жизненный цикл форм/мутаций, поэтому вы этого не делаете.*

**See also:** [Действия](./4_react_server.md#actions) · [Обзор](./4_react_server.md#overview)

**Sources:**

[react.dev/blog/2024/12/05/react-19](https://react.dev/blog/2024/12/05/react-19)

идентификатор использования

</details>

<details>
  <summary>useId</summary>

### useId

**Definition:** Генерирует **стабильный уникальный идентификатор** для каждого экземпляра компонента, который согласуется между рендерингом сервера и гидратацией клиента.

**How it works:** React назначает идентификаторы, используя внутренний счетчик с префиксом `:r` (e.g. `:r1:`). Один и тот же экземпляр компонента получает один и тот же идентификатор на сервере и клиенте, что позволяет избежать несоответствий гидратации. Идентификаторы уникальны среди одноуровневых элементов в дереве, а не глобально уникальны, как UUID. Вызов `useId()` один раз для каждого логического идентификатора; получить связанные идентификаторы с суффиксами (`${id}-description`).

**When to use:** `htmlFor` / `id` на входах, `aria-labelledby`, `aria-describedby`, связывая сообщения об ошибках с полями.

**Pluses and minuses:**

| + | − |
| --------------------------------------- | -------------------------------------------------- |
| ССР/безопасность для гидратации — нет `Math.random()` | Не для списка `key` реквизит |
| Метки пар, входные данные, атрибуты ARIA | Идентификаторы содержат `:` — при необходимости экранируйте селекторы CSS |
| Один вызов перехватчика на группу полей формы |                                                     |

**Examples:**

```tsx
function Field({ label }: { label: string }) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-describedby={errorId} />
      <span id={errorId} role="alert">Required</span>
    </>
  );
}
```

**Thoughts:** **не** используйте `useId` для `key` в списках — ключи должны быть стабильными на протяжении всего существования списка, а не для каждого слота рендеринга. **Не** разрезайте и не хешируйте идентификатор.

**Sources:**

[react.dev/reference/react/useId](https://react.dev/reference/react/useId)

использоватьSyncExternalStore

</details>

<details>
  <summary>useSyncExternalStore</summary>

### useSyncExternalStore

**Definition:** Подписывается на **внешний источник данных** вне состояния React и считывает снимок безопасным способом при **параллельном рендеринге** (без разрывов).

**How it works:** Вы предоставляете три функции: `subscribe(onStoreChange)` регистрирует обратный вызов, который вызывает React при изменении хранилища; `getSnapshot()` возвращает текущее значение (должно быть неизменяемым или кэшированным — та же ссылка, если данные не изменились); `getServerSnapshot()` возвращает значение во время SSR (обязательно, если хранилище отличается на сервере и на клиенте, например `window`). React повторно отображает подписанные компоненты при изменении снимка. Авторы библиотек (Redux, Zustand) используют это внутри себя; код приложения использует перехватчик библиотеки.

**When to use:** Глобальные клиентские магазины (Redux, Zustand), `window.matchMedia`, `navigator.onLine`, стороннее состояние, не связанное с React. Требуется, когда библиотека интегрируется с параллельными функциями React 18+.

**Pluses and minuses:**

| + | − |
| --------------------------------------------- | ---------------------------------------------- |
| Предотвращает разрыв во время одновременных обновлений | Подробный API — предпочитаете хуки Zustand/Redux в приложениях |
| Официальный шаблон подписки на API браузера | `getSnapshot` должен быть ссылочно стабильным, когда данные не изменяются |
| Безопасность SSR с `getServerSnapshot`              | Излишество для простого `useState`                                 |

**Examples:**

```tsx
function useWindowWidth() {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener('resize', onChange);
      return () => window.removeEventListener('resize', onChange);
    },
    () => window.innerWidth,
    () => 0, // SSR fallback
  );
}
```

**Thoughts:** `getSnapshot` не должен возвращать новую ссылку на объект/массив при каждом вызове, если данные фактически не изменились — React будет бесконечно перерисовываться. Предпочитайте существующие библиотеки, а не интеграцию собственного магазина.

**Sources:**

[react.dev/reference/react/useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore)

использоватьImperativeHandle

</details>

<details>
  <summary>useImperativeHandle</summary>

### useImperativeHandle

**Definition:** Настраивает **значение экземпляра**, которое родительский элемент получает при присоединении `ref` для вашего компонента — вместо узла DOM вы предоставляете курируемый объект API.

**How it works:** Сопряжение с `ref` (React 19 prop или `forwardRef`). При фиксации React вызывает вашу фабрику `() => ({ focus, scroll, ... })` и присваивает результат `ref.current`. Необязательный массив зависимостей управляет моментом воссоздания дескриптора. Внутренние ссылки DOM остаются конфиденциальными через `useRef` внутри ребенка.

**When to use:** Сфокусируйте ввод внутри компонента составного поля, выставьте `play()`/`pause()` в обертке видео интегрируйте виджеты, не относящиеся к React. **Предпочитаю** декларативные реквизиты (`isOpen`, `onSubmit`) и `autoFocus` первый.

**Pluses and minuses:**

| + | − |
| -------------------------------------------------- | -------------------------------------------------- |
| Инкапсулирует императивные операции DOM в стабильном API | Нарушает декларативную модель React || Полезно для ловушек фокуса, медиаплееров, виджетов карт | Сложнее тестировать и рассуждать, чем о реквизите |
| Ограничивает то, что родитель может вызывать (по сравнению с необработанной ссылкой на DOM) | Злоупотребление, когда `autoFocus` или реквизита обратного вызова достаточно |

**Examples:**

```tsx
type InputHandle = { focus: () => void; clear: () => void };

function TextField({ ref, label }: { ref?: Ref<InputHandle>; label: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => { if (inputRef.current) inputRef.current.value = ''; },
  }), []);
  return <><label>{label}</label><input ref={inputRef} /></>;
}
```

**Sources:**

[react.dev/reference/react/useImperativeHandle](https://react.dev/reference/react/useImperativeHandle)

использоватьDebugValue

</details>

<details>
  <summary>useDebugValue</summary>

### useDebugValue

**Definition:** Добавляет **собственную метку** для настраиваемого перехватчика в React DevTools, видимую при проверке перехватчика в дереве компонентов.

**How it works:** Вызов `useDebugValue(value)` or `useDebugValue(value, formatFn)` внутри специального крючка. React DevTools показывает отформатированное значение рядом с именем хука. Тело хука по-прежнему работает в рабочей среде, но в оптимизированных производственных сборках отображение DevTools удалено — чтобы вычисления значений были дешевыми. Необязательный `formatFn` откладывает дорогостоящее форматирование до тех пор, пока DevTools фактически не проверит перехватчик.

**When to use:** Пользовательские перехватчики, возвращающие непрозрачные объекты — показать `"Online"` / `"Offline"`, количество товаров в корзине, роль авторизации. Пропустите тривиальные однострочные зацепки.

**Pluses and minuses:**

| + | − |
| ------------------------------------------------------- | --------------------------------------------- |
| Ускоренная отладка общих перехватчиков (`useAuth`, `useCart`) | Преимущество только для разработчиков — никакой пользовательской ценности во время выполнения |
| Дополнительный ленивый форматтер позволяет избежать затрат на производство | Работает только внутри пользовательских хуков, а не компонентов |
| Краткий обзор состояния документов |                                                |

**Examples:**

```tsx
function useOnlineStatus() {
  const online = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  useDebugValue(online ? 'Online' : 'Offline');
  return online;
}

function useFriendStatus(friendId: string) {
  const status = useFriendStatusImpl(friendId);
  useDebugValue(status, s => s === 'online' ? '🟢 Online' : '⚫ Offline');
  return status;
}
```

**Sources:**

[react.dev/reference/react/useDebugValue](https://react.dev/reference/react/useDebugValue)

Пользовательские крючки

</details>

<details>
  <summary>Custom hooks</summary>

### Custom hooks

**Definition:** Функция, имя которой начинается с `use` и это **вызывает другие хуки**. Это не функция React, выходящая за рамки соглашения об именах — ESLint использует `use` префикс для обеспечения соблюдения [Правил хуков](#rules-of-hooks).

**How it works:**

Каждый **сайт вызова** получает свое собственное изолированное состояние (два `useOnlineStatus()` звонки → две подписки). Хуки разделяют **логику**, а не одноэлементное хранилище, если только вы не разместите хранилище позади него. `useSyncExternalStore` /контекст специально. Возвращайте запоминаемые обратные вызовы из перехватчиков, которые предоставляют функции, чтобы потребители могли от них зависеть.

Одинаковый `useState` + `useEffect` комбо появляется в 2+ компонентах. **Не** для совместного использования JSX (составляющие компоненты) или для помощников, которые никогда не вызывают перехватчики.

*"Пользовательские перехватчики заменяют большинство HOC для многократного использования. Они не разделяют состояние между компонентами, если я не помещаю общее состояние в контекст или внешнее хранилище".*

**Pluses and minuses:**

| + | − |
| ------------------------------------- | -------------------------------- |
| Повторное использование логики без адской оболочки HOC | `use` требуется префикс |
| Испытайте крючок изолированно | Чрезмерная экстракция добавляет хмель |

**Thoughts:**

*Извлекайте поведение, а не разметку. Каждый вызов имеет свое состояние.*

**Пример —** `useClickOutside`**:**

```tsx
function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutside: () => void,
) {
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOutside();
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [ref, onOutside]);
}
```

**Sources:**

[react.dev/learn/reusing-logic-with-custom-hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

Возможно, вам не нужен эффект

</details>

<details>
  <summary>You might not need an effect</summary>

### You might not need an effect

**Definition:** Многие разработчики шаблонов стремятся `useEffect` лучше обрабатываются при рендеринге, обработчиках событий или загрузчиках данных платформы. Эффекты предназначены для **синхронизации с внешними системами**, а не для преобразования данных или реагирования на пользовательские события.

**How it works:**

Спросите: «Нужно ли это запускать *потому что компонент был отображен* и трогать что-то за пределами React?» Если нет → вероятно, нет эффекта.

| Нужна | Делайте вместо эффекта |
| ------------------------------ | ----------------------------------------- |
| Преобразование данных для отображения | Вычисления во время рендеринга || Ответ на событие пользователя | Обработчик событий |
| Кэш дорогой калькулятор | `useMemo`                                  |
| Сбросить все состояние при смене опоры | `key={id}` на компоненте |
| Уведомить родителя об изменении состояния | Вызов родительского обратного вызова в обработчике событий |
| Получить данные | Загрузчик фреймворка, RSC, TanStack Query |
| Обновления состояния цепочки | Один обработчик событий с несколькими `setState` |

Подписки, таймеры, сторонние виджеты, вход в аналитику, синхронизация `document.title` (или используйте метаданные платформы).

**Examples:**

```tsx
// Bad — effect for derived data
useEffect(() => setFullName(first + ' ' + last), [first, last]);
// Good — compute during render
const fullName = `${first} ${last}`;
```

**Thoughts:** *Эффекты синхронизируются с внешним миром, а не с вашим собственным состоянием.*

**See also:** [useEffect](#useeffect) · [Чистота](./4_react_core.md#purity)

**Sources:**

[react.dev/learn/you-might-not-need-an-effect](https://react.dev/learn/you-might-not-need-an-effect)

---

</details>

## 6. Escape hatches

Ссылки (React 19: ссылка как реквизит)

<details>
  <summary>Refs (React 19: ref as prop)</summary>

### Refs (React 19: ref as prop)

**Definition:** **ref** содержит изменяемую ссылку на узел DOM или императивный дескриптор. В React 19 функциональные компоненты принимают `ref` как **обычный реквизит** — нет `forwardRef` требуется обертка.

**How it works:** `useRef(initial)` возвращает `{ current }` это сохраняется во время рендеринга; обновление `.current` не вызывает повторный рендеринг. Проходить `ref` к родному элементу (`<input ref={ref} />`) или дочернему компоненту, который его пересылает. Реагировать 19 угощений `ref` как и любая другая опора функциональных компонентов. `createRef()` создает новую ссылку при каждом рендеринге в функциональных компонентах — используйте только в компонентах класса.

**When to use:** Сосредоточьте ввод на монтировании, интегрируйте библиотеки jQuery/D3/chart, измерьте размер элемента (предпочитайте `useLayoutEffect` + ссылка). **Избегайте** ссылок на данные, которые должны управлять пользовательским интерфейсом — используйте состояние.

**Pluses and minuses:**

| + | − |
| ------------------------------------------------------- | ---------------------------------------------------------------------- |
| Императивный фокус, прокрутка, измерение, сторонние библиотеки DOM | Ускользает от декларативной модели — сложнее тестировать || React 19 упрощает переадресацию ссылок | Чтение/письмо `ref.current` во время рендера запрещено (кроме init) |
| `useRef` также хранит таймеры и предыдущие значения | Не заменяет состояние, когда пользовательский интерфейс должен обновиться |

**Examples:**

```tsx
function MyInput({ ref, ...props }: { ref?: Ref<HTMLInputElement> } & InputHTMLAttributes<HTMLInputElement>) {
  return <input ref={ref} {...props} />;
}

function Form() {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <MyInput ref={inputRef} />
      <button type="button" onClick={() => inputRef.current?.focus()}>Focus</button>
    </>
  );
}
```

**Thoughts:** `forwardRef` все еще работает для обратной совместимости. Не читать `ref.current` во время рендеринга, за исключением ленивой инициализации.

**Sources:**

[react.dev/reference/react/useRef](https://react.dev/reference/react/useRef) · [ссылка на React 19 как реквизит](https://react.dev/blog/2024/12/05/react-19)

Порталы

</details>

<details>
  <summary>Portals</summary>

### Portals

**Definition:** `createPortal(child, domNode)` визуализирует дочерние элементы React в **другой узел DOM**, сохраняя их в том же дереве компонентов React для контекста и всплытия событий.

**How it works:** React по-прежнему управляет дочерними элементами портала в виртуальном дереве — обработчики контекста, состояния и событий работают нормально. DOM-узлы монтируются под `domNode` (часто `document.body`). События перемещаются по **дереву React** (родительские обработчики по-прежнему срабатывают), а не только по дереву DOM. Используйте для пользовательского интерфейса, который должен избегать CSS. `overflow: hidden`, `z-index` стекирование контекстов или `position` ограничения предков.

**When to use:** Модальные диалоги, всплывающие уведомления, плавающие меню, полноэкранные наложения. В сочетании с ловушкой фокусировки и `aria-modal` для доступности.

**Pluses and minuses:**

| + | − |
| ---------------------------------------------------- | --------------------------------------------- |
| Модальные окна, всплывающие подсказки, раскрывающиеся списки отображаются над страницей Chrome | Нужна выделенная точка монтирования в HTML (`#modal-root`) |
| Сохраняет контекст React из родителя | SSR: убедитесь, что цель портала существует, или отображайте значение null до тех пор, пока оно не будет установлено |
| Всплеск событий следует иерархии React | Управление фокусом и a11y требуют дополнительной работы (ловушка фокуса) |

**Examples:**

```tsx
function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return createPortal(
    <div role="dialog" aria-modal="true" className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')!,
  );
}
```

**Thoughts:** Дочерние элементы портала по-прежнему участвуют в согласовании — отключение родительского элемента отключает портал. Для SSR отложите рендеринг портала до тех пор, пока `useEffect` или используйте структуру, которая это обрабатывает.

**Sources:**

[react.dev/reference/react-dom/createPortal](https://react.dev/reference/react-dom/createPortal)

Границы ошибок

</details>

<details>
  <summary>Error boundaries</summary>

### Error boundaries

**Definition:**

Компоненты класса, реализующие `static getDerivedStateFromError` + `componentDidCatch` которые улавливают ошибки рендеринга в дочерних элементах и ​​отображают резервный пользовательский интерфейс.

| Уловы | НЕ ловит |
| ------------------ | ------------------------------ |
| Ошибки рендеринга | Ошибки обработчика событий |
| Ошибки жизненного цикла | Асинхронный (`setTimeout`, обещает) |
| Ошибки конструктора | Ошибки рендеринга на стороне сервера |
|                    | Ошибки в самой границе |

**How it works:**

1. Дочерний объект выбрасывает во время рендеринга → React приближается к ближайшей границе ошибки
2. `getDerivedStateFromError` возвращает состояние → перерисовка границ с резервным пользовательским интерфейсом
3. `componentDidCatch(error, info)` запускается для регистрации (здесь побочные эффекты в порядке)
4. Братья, сестры и родители **за** границами продолжают работать

**When to use:**

Обертывание сегментов маршрута, рискованные сторонние виджеты, ленивые загружаемые фрагменты. Сопряжение с входом в систему `componentDidCatch`.

Ошибки обработчика событий (используйте `try/catch`), асинхронные ошибки (обработка в обещании), замена пользовательского интерфейса проверки формы.

**Examples:**

```tsx
class ErrorBoundary extends React.Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
```

**Thoughts:**

Эквивалента хука пока нет — используйте `react-error-boundary` библиотека или класс. React 19 не меняет этого.

*Границы ошибок улавливают сбои во время рендеринга в дочерних элементах, а не ошибки событий или асинхронные ошибки.*

**Sources:**

[react.dev/reference/react/Component#ching-rendering-errors-with-an-error-boundary](https://react.dev/reference/react/Component#ching-rendering-errors-with-an-error-boundary)

React.lazy + Приостановка

</details>

<details>
  <summary>React.lazy + Suspense</summary>

### React.lazy + Suspense

**Definition:** `lazy(() => import('./Page'))` **разбивает код** компонента — загружается только при первом рендеринге. `<Suspense fallback={...}>` показывает резервный пользовательский интерфейс во время загрузки ленивого фрагмента.

**How it works:**

1. `const Chart = lazy(() => import('./Chart'))` **еще** не загружается. Он регистрирует функцию **load**. React **не** вызывает `load` до тех пор, пока он не **попытается визуализировать** этот компонент в первый раз.
2. `{show && <Chart />}` - пока `show` ложно, `<Chart />` отсутствует в дереве → **нет сети**.
3. Когда `show` становится истинным, React выполняет рендеринг `<Chart />`. Загрузчик работает `import('./Chart')` — сборщик генерирует **отдельный фрагмент JS**; браузер извлекает этот файл.
4. Пока Промис не разрешится, React **выдает** это Промис (тот же канал, что и Приостановка). Ближайший `<Suspense fallback={...}>` ловит и показывает `fallback`.
5. Когда обещание разрешается, React читает `.default` как компонент, **кэширует** и Promise, и модуль — `load` не вызывается повторно — тогда **повторяет** рендеринг с реальным компонентом.
6. Если обещание **отклоняется**, React выдает ошибку до ближайшей **границы ошибки** (не в приостановке).

**When to use:**

Страница настроек, панель администратора, обширная библиотека диаграмм, пакеты для конкретных локали. Фреймворки (Next.js) автоматически разделяются по маршрутам.

#### Common pitfalls

Предполагая `lazy()` извлекается во время оценки модуля — он ожидает **первого рендеринга**. Отсутствует саспенс над ленивым элементом. Потребность в именованном экспорте `.then(m => ({ default: m.Foo }))`.

**Pluses and minuses:**

| + | − |
| ----------------------------------------- | ----------------------------------------- |
| Меньший первоначальный пакет, более быстрый TTI | Загрузка флэш-памяти, если резервный вариант не предусмотрен |
| Разделение на основе маршрутов является автоматическим шаблоном | Вложенные ленивцы без планирования → водопад || Интегрируется с Suspense для данных + код | Требуется граница ошибок при сбоях в сети |

**Examples:**

```tsx
const Settings = lazy(() => import('./Settings'));

function App({ openSettings }: { openSettings: boolean }) {
  return (
    <ErrorBoundary fallback={<p>Failed to load</p>}>
      <Suspense fallback={<Spinner />}>
        {openSettings ? <Settings /> : <Home />}
      </Suspense>
    </ErrorBoundary>
  );
}
```

**Thoughts:**

*Чанк загружается при первом рендеринге ленивого компонента; Приостановка показывает запасной вариант, пока* `import()` *ожидается; После этого React кэширует модуль.*

`lazy` поддерживает только экспорт по умолчанию. Для именованного экспорта: `lazy(() => import('./Foo').then(m => ({ default: m.Foo })))`.

**Sources:**

[react.dev/reference/react/lazy](https://react.dev/reference/react/lazy) · [Приостановка](https://react.dev/reference/react/Suspense)

---

</details>
