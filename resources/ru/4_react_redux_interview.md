# React — Redux interview

Вопросы по Redux. Ответы заполнены для опубликованной части, остальные пустые.

[ ← Вернуться в хаб](./4_react.md)

### Related docs

- [React — Redux](./4_react_redux.md) · [Redux — Интервью](./4_react_redux_interview.md) · [React — Интервью](./4_react_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Вопросы с [Devinterview.io — Redux](https://devinterview.io/questions/web-and-mobile-development/redux-interview-questions/).

### Redux Fundamentals

<details>
<summary>What is Redux and how is it used in web development?</summary>

### What is Redux and how is it used in web development?

**Definition:**

Redux хранит состояние приложения в одном хранилище и меняет его только отправкой действий. Редьюсеры — чистые функции, которые из текущего состояния и действия делают следующее.

**How it works:**

- Хранилище держит дерево состояния и функцию `dispatch`. `getState()` читает дерево. `subscribe` узнаёт о заменах.
- Действие — простой объект со строкой `type` и, обычно, с payload. Оно описывает, что случилось, а не как мутировать.
- Редьюсер ведёт один срез. При тех же состоянии и действии он возвращает то же следующее состояние и не трогает сеть или DOM.
- UI подписывается, часто через React-Redux. Dispatch запускает корневой редьюсер, хранилище заменяет дерево, и подписанные компоненты рисуются из новых значений.
- Цикл односторонний: вид, действие, редьюсер, хранилище, вид. Поэтому журнала действий достаточно, чтобы воспроизвести ошибку.
- Сам Redux не привязан к React. `react-redux` — связка, которую использует большинство приложений. Angular, Vue и обычный JavaScript тоже могут держать хранилище.
- Redux Toolkit (`configureStore`, `createSlice`) — сегодняшний способ это писать. Ручные константы действий — старый стиль.

**Examples:**

```js
const next = counterReducer(0, { type: "increment" });
```

**Sources:**

- https://redux.js.org/tutorials/essentials/part-1-overview-concepts

</details>

<details>
<summary>Can you describe the three principles that Redux is based upon?</summary>

### Can you describe the three principles that Redux is based upon?

**Definition:**

Redux формулирует три правила. Одно хранилище держит дерево состояния. Это дерево только для чтения. Оно меняется, только когда чистый редьюсер возвращает следующее дерево.

**How it works:**

- Единый источник правды: одно хранилище, один объект (или карта срезов). Факт вроде «выбранный пирс» живёт в одном месте, поэтому два экрана не расходятся из-за того, что каждый хранил копию.
- Состояние только для чтения. Виды и middleware вызывают `dispatch`. Они не пишут `state.lane = "north"`. Хранилище заменяет ссылку, когда редьюсер возвращает результат.
- Изменения — чистые функции. `reducer(state, action)` не читает часы, не пишет в глобальную переменную и не мутирует `state`. Следующее значение — новый объект для тех частей, что изменились.
- Поскольку действия — данные, а редьюсеры детерминированы, DevTools могут проиграть список заново. Это отладка с путешествием во времени.
- Чистота ещё и причина, почему редьюсер — модульный тест без моков: передаёте состояние и действие, проверяете результат.
- Асинхронная работа — не четвёртый способ менять состояние. Middleware делает работу, затем отправляет обычное действие, которое редьюсер видит.

**Examples:**

```js
function reducer(state = { n: 0 }, action) {
  if (action.type === "increment") return { n: state.n + 1 };
  return state;
}
```

**Sources:**

- https://redux.js.org/understanding/thinking-in-redux/three-principles

</details>

<details>
<summary>What is an action in Redux?</summary>

### What is an action in Redux?

**Definition:**

Действие — простой объект, который описывает событие. У него обязано быть поле `type`, обычно строка. Остальные поля — payload, который прочитает редьюсер.

**How it works:**

- `{ type: "berth/selected", id: 4 }` — действие. `type` — ветка, по которой переключается редьюсер. `id` — данные, не функция.
- Создатель действия — функция, которая возвращает этот объект: `const selectBerth = (id) => ({ type: "berth/selected", id })`. Места вызова остаются короткими, а форма живёт в одном месте.
- `createSlice` из Redux Toolkit порождает создателя и строку типа (`"berth/selected"`) из имени редьюсера и имени ветки.
- Действия сериализуемы. В них не кладут экземпляр класса, промис или узел DOM. От этого зависят DevTools и сохранение состояния.
- Отправка действия сама состояние не меняет. Тип должен обработать редьюсер. Неизвестный тип оставляет состояние как было.
- TypeScript сужает payload по `type`, поэтому несовпавшее поле — ошибка компиляции, а не `undefined` в редьюсере.

**Examples:**

```js
const selectBerth = (id) => ({ type: "berth/selected", id });
dispatch(selectBerth(4));
```

**Sources:**

- https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow#actions

</details>

<details>
<summary>How are actions used to change the state in a Redux application?</summary>

### How are actions used to change the state in a Redux application?

**Definition:**

Код вызывает `dispatch` с действием. Хранилище передаёт текущее состояние и это действие корневому редьюсеру, сохраняет возвращённое дерево и уведомляет подписчиков. Больше ничто дерево не пишет.

**How it works:**

- Код UI вызывает создателя действия, затем `dispatch`. В React это `useDispatch()`.
- Middleware видит действие до редьюсера. Thunk-middleware позволяет «действию» быть функцией; эта функция может сделать `await` запроса и затем `dispatch` простого объекта. Редьюсер по-прежнему видит только простые действия.
- Редьюсер переключается по `action.type` и возвращает следующий срез. Immer в Redux Toolkit позволяет писать в ветке `state.n += 1`, а библиотека собирает следующее неизменяемое дерево.
- Хранилище подставляет возвращённую ссылку. Компоненты, которые выбрали изменившееся значение, рисуются снова. Компоненты, которые выбрали неизменившуюся ссылку, — нет.
- Обновления внутри редьюсера синхронны. Асинхронный промежуток живёт в middleware, между двумя отправками (`pending`, затем `fulfilled`).
- Если мутировать существующий объект состояния и вернуть его, подписчики видят ту же ссылку и пропускают обновление. Возвращайте новое дерево или пользуйтесь Immer.

**Examples:**

```js
store.dispatch({ type: "counter/increment" });
store.getState(); // { counter: { n: 1 } }
```

**Sources:**

- https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow

</details>

<details>
<summary>What is a reducer in Redux and what role does it play?</summary>

### What is a reducer in Redux and what role does it play?

**Definition:**

Редьюсер — чистая функция `(state, action) => nextState`. Это единственное место, которое решает следующее значение своего среза.

**How it works:**

- Первый вызов получает состояние `undefined`. Редьюсер обязан вернуть начальное состояние, обычно через параметр по умолчанию.
- Он смотрит на `action.type`. Известный тип возвращает новый объект. Любой другой тип возвращает текущий `state` без изменений, чтобы ссылка осталась устойчивой.
- Один редьюсер владеет одним срезом: `counter`, `berths`, `session`. В большом приложении он не обрабатывает всё в одном switch.
- `combineReducers` (или карта `reducer` в `configureStore`) вызывает каждый срез с его куском состояния и тем же действием.
- Immer, которым пользуется `createSlice`, отслеживает мутации внутри ветки и выдаёт новое дерево. Снаружи функция всё ещё чистая.
- Редьюсер не делает dispatch, не вызывает `fetch` и не читает `getState` у хранилища, которое он замкнул. Это побочные эффекты.
- Тесты вызывают функцию напрямую. Хранилище не нужно.

**Examples:**

```js
function counter(state = { n: 0 }, action) {
  switch (action.type) {
    case "increment":
      return { n: state.n + 1 };
    default:
      return state;
  }
}
```

**Sources:**

- https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers

</details>

<details>
<summary>How does Redux differ from local component state in React?</summary>

### How does Redux differ from local component state in React?

**Definition:**

Локальное состояние живёт в одном компоненте и обновляется через `useState`. Redux живёт вне дерева, и любой компонент может отправить действие или выбрать значение, не получая его через props.

**How it works:**

- Локальное состояние — верный выбор по умолчанию для переключателя, поля или черновика, которым пользуются один компонент и его дети. Оно исчезает, когда компонент размонтируют.
- Протаскивание этого состояния через много слоёв — prop drilling. Подъём к родителю закрывает двух или трёх соседей. Он становится неудобным, когда читатели далеко друг от друга.
- Срез Redux переживает навигацию, пока живо хранилище. Далёкие экраны читают один и тот же выбранный пирс, и общему родителю не нужно его держать.
- Локальное обновление — вызов сеттера. Обновление Redux — действие, поэтому изменение названо и его можно записать в журнал.
- Redux добавляет зависимость, провайдер хранилища и дисциплину сериализуемых действий. Эта цена впустую для виджета.
- Локальное состояние — для локального UI. Redux (или другое хранилище) — когда много частей делят клиентское состояние или нужен журнал действий. Серверный кэш принадлежит библиотеке запросов, а не тому и другому случайно.

**Examples:**

```jsx
const [open, setOpen] = useState(false);          // one panel
const pier = useSelector((s) => s.berth.id);      // any screen
```

**Sources:**

- https://react.dev/learn/sharing-state-between-components
- https://redux.js.org/tutorials/essentials/part-2-app-structure

</details>

<details>
<summary>Define "store" in the context of Redux.</summary>

### Define "store" in the context of Redux.

**Definition:**

Хранилище — объект, который держит текущее дерево состояния и принимает действия. У приложения одно хранилище.

**How it works:**

- `getState()` возвращает текущее дерево. Считайте его доступным только для чтения.
- `dispatch(action)` запускает middleware, затем корневой редьюсер, затем заменяет дерево.
- `subscribe(listener)` вызывает слушателя после dispatch, который заменил дерево. React-Redux пользуется этим; компоненты редко подписываются руками.
- `replaceReducer` подменяет корневой редьюсер; этим пользуется горячая перезагрузка. В обычном коде приложения этого нет.
- `configureStore({ reducer })` создаёт хранилище, подключает thunk-middleware и включает DevTools. `createStore` — старая функция, которую он заменяет.
- Хранилище создают один раз при старте и передают в `<Provider store={store}>`. Вызов `configureStore` внутри компонента создаёт новое дерево на каждый рендер.
- Второго хранилища «только для этой страницы» в обычном приложении нет. Срез — способ разделить заботы внутри одного дерева.

**Examples:**

```js
const store = configureStore({ reducer: { berth: berthReducer } });
store.getState();
```

**Sources:**

- https://redux.js.org/tutorials/fundamentals/part-4-store
- https://redux.js.org/tutorials/essentials/part-2-app-structure

</details>

<details>
<summary>Can you describe the concept of "single source of truth" in Redux?</summary>

### Can you describe the concept of "single source of truth" in Redux?

**Definition:**

Единый источник правды значит, что одно дерево состояния держит состояние приложения, и каждый факт хранится один раз. Компоненты выводят то, что показывают, из этого дерева, а не держат частную копию.

**How it works:**

- Селектор читает id пирса из `state.berth.id`. Каждый экран, который его выбирает, видит то же число после dispatch.
- Отладка начинается с одного снимка. Не нужно искать, какой компонент последним записал дубликат.
- Дерево всё равно может быть большим. Селекторы берут срез, нужный компоненту, чтобы он не перерисовывался, когда меняется чужой срез.
- Цена одного дерева — конкуренция за него: плохо нормализованная форма заставляет каждое обновление переписывать огромный объект. Списки нормализуют по id.
- «Единый» не значит «класть черновик textarea в Redux». Локальное состояние — источник правды для локального UI. Принцип в том, чтобы не хранить один факт в двух местах, которые могут разъехаться.
- У серверных данных свой кэш. Копирование результата запроса в срез создаёт второй источник. Кэш оставляют в библиотеке запросов.

**Examples:**

```js
const id = useSelector((state) => state.berth.id);
```

**Sources:**

- https://redux.js.org/understanding/thinking-in-redux/three-principles#single-source-of-truth

</details>

<details>
<summary>How do you create a Redux store?</summary>

### How do you create a Redux store?

**Definition:**

Определяют редьюсеры, затем создают одно хранилище при старте приложения. `configureStore({ reducer })` — текущая точка входа.

**How it works:**

- Редьюсер среза — это `createSlice({ name, initialState, reducers })`. Экспортируемый `slice.reducer` обрабатывает этот ключ.
- Карту передают, когда срезов несколько: `reducer: { berth: berthReducer, session: sessionReducer }`. Каждый ключ — ветка дерева. Эту карту обрабатывает `combineReducers`.
- `preloadedState` — необязательная вторая забота, для тестов или для восстановления сохранённого дерева. Боевой код обычно позволяет редьюсерам дать `initialState`.
- Middleware уже включён: thunk, проверки неизменяемости в разработке и проверки сериализуемости. Ещё добавляют через `middleware: (getDefault) => getDefault().concat(extra)`.
- `createStore(rootReducer, preloadedState, applyMiddleware(thunk))` — старая форма с тремя аргументами. Новое приложение с неё не начинают.
- `<Provider store={store}>` рисуют один раз вокруг дерева. `useDispatch` и `useSelector` читают этот контекст.
- Одно хранилище на среду JavaScript. Тесты собирают своё хранилище, чтобы случаи не текли состоянием.

**Examples:**

```js
const store = configureStore({
  reducer: { berth: berthReducer },
});
```

**Sources:**

- https://redux.js.org/tutorials/essentials/part-2-app-structure#creating-the-redux-store

</details>

<details>
<summary>What is meant by "immutable state," and why is it important in Redux?</summary>

### What is meant by "immutable state," and why is it important in Redux?

**Definition:**

Неизменяемое обновление значит, что редьюсер возвращает новый объект для того, что изменилось, и не трогает объект, который получил. Redux по смене ссылки понимает, что обновление было.

**How it works:**

- `useSelector` и `connect` сравнивают выбранное значение через `===`. Новый объект вызывает перерисовку. Та же ссылка — отказ от неё. Мутация поля внутри старого объекта и его возврат пропускает рендер и оставляет DevTools с неправдой.
- История следует из того же правила. Каждый dispatch может сохранить предыдущее дерево — так работают путешествие во времени и отмена, потому что старое дерево не правили на месте.
- Поверхностной копии достаточно, если копировать каждый уровень, который меняете: `{ ...state, berth: { ...state.berth, id: 4 } }`. Глубокое клонирование всего дерева — лишняя работа.
- `const state = getState()` не делает объект неизменяемым. `const` запрещает только переприсваивание привязки.
- Immer (внутри `createSlice`) позволяет ветке выглядеть как мутация и всё равно выдаёт новое дерево. Immutable.js — старая библиотека устойчивых коллекций; она спорит с остальным JavaScript, поэтому новый код берёт Immer.
- Дело не в потоках. Редьюсеры JavaScript выполняются на одном обороте цикла событий. Выигрыш — предсказуемое обнаружение изменений, а не блокировка.

**Examples:**

```js
return { ...state, id: action.id };
```

**Sources:**

- https://redux.js.org/usage/structuring-reducers/immutable-update-patterns

</details>

<details>
<summary>Explain the significance of the combineReducers function.</summary>

### Explain the significance of the combineReducers function.

**Definition:**

`combineReducers` принимает карту редьюсеров срезов и возвращает один корневой редьюсер. Каждый ключ становится ключом дерева состояния, и каждый срез видит только свою ветку.

**How it works:**

- `combineReducers({ notes, ui, session })` порождает состояние `{ notes, ui, session }`. Корень вызывает каждый срез с тем же действием.
- Срез возвращает прежнюю ветку, когда действие его не касается. Ссылка этой ветки остаётся той же, поэтому селекторы других срезов не срабатывают.
- Такое деление делает большое приложение читаемым. Редьюсер заметок не содержит switch для входа.
- Срезы можно переиспользовать или тестировать отдельно. Корень — только карта.
- `configureStore({ reducer: { notes, ui, session } })` вызывает `combineReducers` за вас. Функцию пишут сами, когда собирают хранилище по-старому или когда одному ключу нужна своя обёртка.
- Срез обязан вернуть состояние по умолчанию, когда полученная ветка равна `undefined`. Иначе корень бросит ошибку на старте.
- Не лезьте из редьюсера в состояние другого среза. Если переход нуждается в обоих, отправьте одно действие и дайте каждому срезу ответить, либо положите общий факт в один срез.

**Examples:**

```js
const root = combineReducers({ notes: notesReducer, ui: uiReducer });
```

**Sources:**

- https://redux.js.org/api/combinereducers

</details>

<details>
<summary>What are pure functions and side effects in the context of Redux?</summary>

### What are pure functions and side effects in the context of Redux?

**Definition:**

Результат чистой функции зависит только от аргументов, и она ничего снаружи себя не меняет. Редьюсеры обязаны быть чистыми. Побочные эффекты — HTTP, таймеры, журналы, случайные числа — принадлежат middleware, а не редьюсеру.

**How it works:**

- `reducer(state, action)` может читать `state` и `action` и обязан вернуть следующее состояние. Два вызова с теми же входами возвращают тот же выход, и входы не изменены.
- Редьюсер, который пушит в массив, пишет в `localStorage` или вызывает `Date.now()`, нечист. Воспроизведение и тесты перестают совпадать с боем.
- Действие — данные. Его отправка — эффект вызывающего, не редьюсера. Редьюсер не делает dispatch.
- Middleware `redux-thunk` принимает действие-функцию. Эта функция получает `dispatch` и `getState`, выполняет запрос и отправляет результирующие действия (`pending`, `fulfilled`, `rejected`).
- `redux-saga` запускает воркеры-генераторы, которые слушают действия и отдают эффекты (`call`, `put`). Это подходит длинным отменяемым потокам. Thunk подходит одному запросу.
- RTK Query и `createAsyncThunk` — текущие обёртки над стилем thunk, чтобы три статусных действия не писать руками каждый раз.
- Редьюсер остаётся чистым ядром, даже когда middleware вокруг него занят.

**Examples:**

```js
const loadBerth = (id) => async (dispatch) => {
  dispatch({ type: "berth/pending" });
  const berth = await fetchBerth(id);
  dispatch({ type: "berth/loaded", berth });
};
```

**Sources:**

- https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#reducers
- https://redux.js.org/tutorials/essentials/part-5-async-logic

</details>


### Redux Core Concepts

<details>
<summary>How do you handle asynchronous actions in Redux?</summary>

### How do you handle asynchronous actions in Redux?

**Definition:**

Редьюсеры остаются синхронными. Асинхронная работа идёт через middleware. С redux-thunk создатель действия возвращает функцию, и middleware вызывает её с `dispatch` и `getState`.

**How it works:**

- `configureStore` добавляет thunk по умолчанию. `applyMiddleware(thunk)` вызывают, только если вы на старом пути `createStore`.
- Функция отправляет стартовое действие, делает `await` запроса, затем отправляет успех или ошибку. Редьюсер хранит статус, чтобы UI показал индикатор или ошибку.
- `createAsyncThunk("berth/load", async (id) => fetchBerth(id))` порождает эти три типа действий. `extraReducers` в слайсе их обрабатывает.
- Не делайте `await` внутри редьюсера. Он не может вернуть промис как следующее состояние.
- Гонки реальны: медленный ответ по пирсу 4 может прийти после того, как пользователь выбрал пирс 5. Игнорируйте результат, чей id уже не выбран, или отменяйте предыдущий запрос.
- Саги — альтернатива, когда поток — длинный автомат (debounce, отмена, ожидание двух действий). Одной загрузке сага не нужна.
- RTK Query убирает рукописный thunk для серверного кэша: endpoint запроса сам загружает, кэширует и обновляет.

**Examples:**

```js
export const loadBerth = createAsyncThunk("berth/load", async (id) => {
  const res = await fetch(`/api/berths/${id}`);
  return res.json();
});
```

**Sources:**

- https://redux.js.org/tutorials/essentials/part-5-async-logic
- https://redux.js.org/usage/writing-logic-thunks

</details>

<details>
<summary>What is a "selector" in Redux and what is its purpose?</summary>

### What is a "selector" in Redux and what is its purpose?

**Definition:**

Селектор — функция от состояния к значению, которое нужно UI. Компоненты вызывают её, а не лезут в дерево, и мемоизированный селектор пропускает повторную работу, когда входы не менялись.

**How it works:**

- `const selectId = (state) => state.berth.id` — селектор. `useSelector(selectId)` подписывает компонент на этот результат.
- Производные данные живут здесь, не в хранилище: открытые причалы — это `state.list.filter((b) => b.open)`. Хранить этот массив ещё и в сторе — завести второй источник.
- `createSelector` из Reselect мемоизирует вывод. Он пересчитывает, когда меняются входные срезы, а не на каждый dispatch в приложении.
- `useSelector` использует `===`. Селектор, который каждый раз возвращает новый объект (`(s) => ({ id: s.berth.id })`), перерисовывает каждый раз. Выбирайте устойчивое значение или мемоизируйте объект.
- Один модуль селекторов — API чтения среза. Переименование поля ломает тогда один файл, а не каждый компонент.
- Селекторы остаются чистыми. Они не делают dispatch и не замыкают меняющийся глобал.

**Examples:**

```js
const selectOpen = createSelector(
  (state) => state.berths,
  (berths) => berths.filter((b) => b.open),
);
```

**Sources:**

- https://redux.js.org/usage/deriving-data-selectors

</details>

<details>
<summary>How does Redux handle the flow of data and actions?</summary>

### How does Redux handle the flow of data and actions?

**Definition:**

Данные движутся в одном направлении. UI отправляет действие, middleware может его перехватить, редьюсер возвращает следующее состояние, и подписчики читают это состояние.

**How it works:**

- Обработчик клика вызывает `dispatch(action)`. Действие — описание (`{ type, payload }`), а не заплатка дерева.
- Сначала по порядку выполняется middleware. Журнал записывает действие. Thunk запускает функцию. Всё, что вызывает `next(action)`, передаёт простое действие дальше к редьюсеру.
- Корневой редьюсер отдаёт действие каждому срезу. Каждый срез возвращает следующую ветку или ту же ветку.
- Хранилище сохраняет возврат корня и вызывает слушателей. `useSelector` сравнивает прошлый результат и рисует компонент, когда он изменился.
- Компонент не пишет в `state` и не передаёт новое дерево родителю. Следующий рендер забирает новое значение из хранилища.
- Из-за этого направления след — список действий плюс состояние после каждого. Не нужно спрашивать, какой ребёнок мутировал поле.
- Пропуск слоя (компонент пишет в объект хранилища, редьюсер ходит в сеть) ломает след. Запрос кладут в thunk, а смену поля — в редьюсер.

**Examples:**

```text
click → dispatch({ type: "berth/selected", id: 4 })
      → reducer returns { id: 4 }
      → selector updates the label
```

**Sources:**

- https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow

</details>

<details>
<summary>Can you explain the difference between a Container and Presentational component in Redux?</summary>

### Can you explain the difference between a Container and Presentational component in Redux?

**Definition:**

</details>

<details>
<summary>What is middleware in Redux and when would you use it?</summary>

### What is middleware in Redux and when would you use it?

**Definition:**

</details>

<details>
<summary>How do you access the Redux store in a React component?</summary>

### How do you access the Redux store in a React component?

**Definition:**

</details>

<details>
<summary>What is the purpose of the dispatch function in Redux?</summary>

### What is the purpose of the dispatch function in Redux?

**Definition:**

</details>

<details>
<summary>What arguments does createStore receive in Redux?</summary>

### What arguments does createStore receive in Redux?

**Definition:**

</details>

<details>
<summary>Describe the subscribe function in Redux.</summary>

### Describe the subscribe function in Redux.

**Definition:**

</details>


### Working with Redux Actions

<details>
<summary>How do you structure action creators in Redux?</summary>

### How do you structure action creators in Redux?

**Definition:**

</details>

<details>
<summary>What is an action type and how is it used in Redux?</summary>

### What is an action type and how is it used in Redux?

**Definition:**

</details>

<details>
<summary>Can you give an example of a synchronous action creator?</summary>

### Can you give an example of a synchronous action creator?

**Definition:**

</details>

<details>
<summary>How do you handle complex state logic in actions?</summary>

### How do you handle complex state logic in actions?

**Definition:**

</details>

<details>
<summary>Explain the concept of action creators returning a function for asynchronous operations.</summary>

### Explain the concept of action creators returning a function for asynchronous operations.

**Definition:**

</details>


### Reducers and State Management

<details>
<summary>How do reducers handle state changes in response to different action types?</summary>

### How do reducers handle state changes in response to different action types?

**Definition:**

</details>

<details>
<summary>What is meant by a "slice reducer"?</summary>

### What is meant by a "slice reducer"?

**Definition:**

</details>

<details>
<summary>Describe how to properly update the state based on an action.</summary>

### Describe how to properly update the state based on an action.

**Definition:**

</details>

<details>
<summary>How would you reset the state of a Redux store?</summary>

### How would you reset the state of a Redux store?

**Definition:**

</details>

<details>
<summary>Can you discuss reducer composition and its benefits?</summary>

### Can you discuss reducer composition and its benefits?

**Definition:**

</details>

<details>
<summary>What is the significance of immutability in reducer functions?</summary>

### What is the significance of immutability in reducer functions?

**Definition:**

</details>

<details>
<summary>How do you handle initial state in Redux reducers?</summary>

### How do you handle initial state in Redux reducers?

**Definition:**

</details>

<details>
<summary>What are common pitfalls when writing reducers?</summary>

### What are common pitfalls when writing reducers?

**Definition:**

</details>


### Redux Middleware and Side Effects

<details>
<summary>What is redux-thunk and how does it work?</summary>

### What is redux-thunk and how does it work?

**Definition:**

</details>

<details>
<summary>Can you explain the purpose of redux-saga and how it compares to redux-thunk?</summary>

### Can you explain the purpose of redux-saga and how it compares to redux-thunk?

**Definition:**

</details>

<details>
<summary>What is a "side effect" and how do middlewares handle them in Redux?</summary>

### What is a "side effect" and how do middlewares handle them in Redux?

**Definition:**

</details>

<details>
<summary>How do you write a custom middleware for Redux?</summary>

### How do you write a custom middleware for Redux?

**Definition:**

</details>

<details>
<summary>Discuss how middlewares can enhance the capabilities of a Redux store.</summary>

### Discuss how middlewares can enhance the capabilities of a Redux store.

**Definition:**

</details>


### Redux and UI Integration

<details>
<summary>How do you connect a React component to a Redux store?</summary>

### How do you connect a React component to a Redux store?

**Definition:**

</details>

<details>
<summary>What are the advantages of using React-Redux's connect function?</summary>

### What are the advantages of using React-Redux's connect function?

**Definition:**

</details>

<details>
<summary>Can you describe the mapStateToProps and mapDispatchToProps functions?</summary>

### Can you describe the mapStateToProps and mapDispatchToProps functions?

**Definition:**

</details>

<details>
<summary>Explain the Provider component from React-Redux.</summary>

### Explain the Provider component from React-Redux.

**Definition:**

</details>

<details>
<summary>How do you use hooks like useDispatch and useSelector in React functional components?</summary>

### How do you use hooks like useDispatch and useSelector in React functional components?

**Definition:**

</details>

<details>
<summary>What performance considerations should be taken into account when connecting components to Redux?</summary>

### What performance considerations should be taken into account when connecting components to Redux?

**Definition:**

</details>

<details>
<summary>How can you optimize the performance of Redux-connected components?</summary>

### How can you optimize the performance of Redux-connected components?

**Definition:**

</details>


### Advanced Redux Patterns

<details>
<summary>What are Higher Order Reducers (HORs) and how are they used?</summary>

### What are Higher Order Reducers (HORs) and how are they used?

**Definition:**

</details>

<details>
<summary>Can you implement a feature toggle mechanism using Redux?</summary>

### Can you implement a feature toggle mechanism using Redux?

**Definition:**

</details>

<details>
<summary>How do you normalize a state shape in Redux?</summary>

### How do you normalize a state shape in Redux?

**Definition:**

</details>

<details>
<summary>What is a Redux "slice" and how is it used?</summary>

### What is a Redux "slice" and how is it used?

**Definition:**

</details>

<details>
<summary>Explain the "Ducks" pattern in Redux.</summary>

### Explain the "Ducks" pattern in Redux.

**Definition:**

</details>


### Redux State Normalization

<details>
<summary>Why is state normalization recommended in Redux?</summary>

### Why is state normalization recommended in Redux?

**Definition:**

</details>

<details>
<summary>How do you structure a normalized state?</summary>

### How do you structure a normalized state?

**Definition:**

</details>

<details>
<summary>What are the benefits of state denormalization?</summary>

### What are the benefits of state denormalization?

**Definition:**

</details>

<details>
<summary>Can you explain how to manage entity relations in a normalized Redux state?</summary>

### Can you explain how to manage entity relations in a normalized Redux state?

**Definition:**

</details>


### Redux Ecosystem and Utilities

<details>
<summary>What is Immutable.js and how can it be used with Redux?</summary>

### What is Immutable.js and how can it be used with Redux?

**Definition:**

</details>

<details>
<summary>Discuss the Redux DevTools extension and its features.</summary>

### Discuss the Redux DevTools extension and its features.

**Definition:**

</details>

<details>
<summary>How do reselect and memoized selectors work in Redux?</summary>

### How do reselect and memoized selectors work in Redux?

**Definition:**

</details>

<details>
<summary>What are common utilities and libraries used in conjunction with Redux?</summary>

### What are common utilities and libraries used in conjunction with Redux?

**Definition:**

</details>

<details>
<summary>Describe the significance of the Redux Toolkit and how it helps Redux development.</summary>

### Describe the significance of the Redux Toolkit and how it helps Redux development.

**Definition:**

</details>


### Testing Redux Applications

<details>
<summary>How do you test Redux reducers?</summary>

### How do you test Redux reducers?

**Definition:**

</details>

<details>
<summary>What is the recommended approach to test Redux actions?</summary>

### What is the recommended approach to test Redux actions?

**Definition:**

</details>

<details>
<summary>How can you test a Redux-connected React component?</summary>

### How can you test a Redux-connected React component?

**Definition:**

</details>

<details>
<summary>Describe the process of testing asynchronous action creators.</summary>

### Describe the process of testing asynchronous action creators.

**Definition:**

</details>

<details>
<summary>What tools can you use to facilitate testing in Redux applications?</summary>

### What tools can you use to facilitate testing in Redux applications?

**Definition:**

</details>


### Redux with Other Frameworks and Libraries

<details>
<summary>How do you integrate Redux with a framework other than React, like Angular or Vue?</summary>

### How do you integrate Redux with a framework other than React, like Angular or Vue?

**Definition:**

</details>

<details>
<summary>Can Redux be used with server-side rendering frameworks like Next.js?</summary>

### Can Redux be used with server-side rendering frameworks like Next.js?

**Definition:**

</details>

<details>
<summary>Discuss the use of Redux with React Native.</summary>

### Discuss the use of Redux with React Native.

**Definition:**

</details>

<details>
<summary>What adaptations are needed to use Redux outside of a UI environment (e.g., in a Node.js backend)?</summary>

### What adaptations are needed to use Redux outside of a UI environment (e.g., in a Node.js backend)?

**Definition:**

</details>


### Scaling Redux for Large Applications

<details>
<summary>How do you organize your files and folders in a large Redux application?</summary>

### How do you organize your files and folders in a large Redux application?

**Definition:**

</details>

<details>
<summary>What strategies can be used to scale Redux actions and reducers?</summary>

### What strategies can be used to scale Redux actions and reducers?

**Definition:**

</details>

<details>
<summary>Can you explain the concept of "domain-driven design" in the context of a Redux state tree?</summary>

### Can you explain the concept of "domain-driven design" in the context of a Redux state tree?

**Definition:**

</details>

<details>
<summary>How do feature modules and code splitting affect Redux state management?</summary>

### How do feature modules and code splitting affect Redux state management?

**Definition:**

</details>

<details>
<summary>Discuss strategies for managing complex application state with Redux.</summary>

### Discuss strategies for managing complex application state with Redux.

**Definition:**

</details>


### Redux Performance Optimization

<details>
<summary>How do you prevent unnecessary renders in Redux-connected components?</summary>

### How do you prevent unnecessary renders in Redux-connected components?

**Definition:**

</details>

<details>
<summary>What techniques are available to reduce the size of the Redux store?</summary>

### What techniques are available to reduce the size of the Redux store?

**Definition:**

</details>

<details>
<summary>How do you optimize Redux action dispatch and payload size?</summary>

### How do you optimize Redux action dispatch and payload size?

**Definition:**

</details>

<details>
<summary>What are best practices for ensuring a scalable Redux state management with large datasets or frequent updates?</summary>

### What are best practices for ensuring a scalable Redux state management with large datasets or frequent updates?

**Definition:**

</details>


### Redux and Forms

<details>
<summary>How do you manage form state with Redux?</summary>

### How do you manage form state with Redux?

**Definition:**

</details>

<details>
<summary>Discuss the use of libraries like Redux Form or React Final Form with Redux.</summary>

### Discuss the use of libraries like Redux Form or React Final Form with Redux.

**Definition:**

</details>

<details>
<summary>What are the trade-offs of keeping form state in the Redux store?</summary>

### What are the trade-offs of keeping form state in the Redux store?

**Definition:**

</details>


### Redux and Authentication

<details>
<summary>How do you manage user authentication and session state in Redux?</summary>

### How do you manage user authentication and session state in Redux?

**Definition:**

</details>

<details>
<summary>What considerations should be made for security when storing tokens or sensitive information in Redux?</summary>

### What considerations should be made for security when storing tokens or sensitive information in Redux?

**Definition:**

</details>

<details>
<summary>How do you manage login and logout workflows with Redux actions and reducers?</summary>

### How do you manage login and logout workflows with Redux actions and reducers?

**Definition:**

</details>


### Migrating to Redux and State Hydration

<details>
<summary>How do you approach migrating a legacy application state management to Redux?</summary>

### How do you approach migrating a legacy application state management to Redux?

**Definition:**

</details>

<details>
<summary>Can you explain the concept of "state hydration" in the context of SSR and Redux?</summary>

### Can you explain the concept of "state hydration" in the context of SSR and Redux?

**Definition:**

</details>

<details>
<summary>What challenges might arise when integrating Redux into an existing application and how would you address them?</summary>

### What challenges might arise when integrating Redux into an existing application and how would you address them?

**Definition:**

</details>


### Redux Future and Community

<details>
<summary>Describe the current trends and community practices around Redux.</summary>

### Describe the current trends and community practices around Redux.

**Definition:**

</details>

<details>
<summary>How has Redux evolved to fit into the modern React ecosystem with hooks?</summary>

### How has Redux evolved to fit into the modern React ecosystem with hooks?

**Definition:**

</details>

<details>
<summary>What do you believe is the future of Redux given the context of emerging state management libraries?</summary>

### What do you believe is the future of Redux given the context of emerging state management libraries?

**Definition:**

</details>


### Advanced State Modeling in Redux

<details>
<summary>How do you model complex state dependencies and computations in Redux?</summary>

### How do you model complex state dependencies and computations in Redux?

**Definition:**

</details>

<details>
<summary>Discuss your approach to type checking and ensuring state consistency.</summary>

### Discuss your approach to type checking and ensuring state consistency.

**Definition:**

</details>

<details>
<summary>How do you tackle transactional updates in Redux?</summary>

### How do you tackle transactional updates in Redux?

**Definition:**

</details>

<details>
<summary>What strategies would you use for undo/redo functionality in a Redux application?</summary>

### What strategies would you use for undo/redo functionality in a Redux application?

**Definition:**

</details>


### Redux Interoperability

<details>
<summary>How does Redux interact with WebSockets or external data sources?</summary>

### How does Redux interact with WebSockets or external data sources?

**Definition:**

</details>

<details>
<summary>Discuss the integration of GraphQL in a Redux-managed application.</summary>

### Discuss the integration of GraphQL in a Redux-managed application.

**Definition:**

</details>

<details>
<summary>How would you manage local vs. server state in a Redux application?</summary>

### How would you manage local vs. server state in a Redux application?

**Definition:**

</details>


### Redux API Requests and Caching

<details>
<summary>How do you structure API requests in Redux actions?</summary>

### How do you structure API requests in Redux actions?

**Definition:**

</details>

<details>
<summary>Discuss methods for caching API responses in the Redux store.</summary>

### Discuss methods for caching API responses in the Redux store.

**Definition:**

</details>

<details>
<summary>What patterns or libraries do you use to manage RESTful or GraphQL API interactions with Redux?</summary>

### What patterns or libraries do you use to manage RESTful or GraphQL API interactions with Redux?

**Definition:**

</details>
