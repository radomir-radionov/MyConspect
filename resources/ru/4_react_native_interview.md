# React Native — собеседование

Ответы заполнены для опубликованной части, остальные пустые.


### Related docs

- [React Native — собеседование](./4_react_native_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — React Native](https://devinterview.io/questions/web-and-mobile-development/react-native-interview-questions/).

### React Native Fundamentals

<details>
<summary>What is React Native and how does it differ from React?</summary>

### What is React Native and how does it differ from React?

**Definition:**

React Native использует компонентную модель React, чтобы собирать приложения iOS и Android, чей интерфейс — нативные виды. React в вебе рисует узлы DOM; React Native рисует платформенные виды вроде `View` и `Text`.

**How it works:**

- Пропсы, состояние и хуки — те же идеи. Компонент по-прежнему функция состояния, которая возвращает дерево.
- В вебе это дерево становится `div` и `button`. В React Native оно становится нативными видами (`UIView` на iOS, виды Android) через отрисовщик.
- Нет ни DOM браузера, ни CSS-файла. Раскладка — объект стиля Flexbox, а текст обязан жить в `Text`.
- Возможности устройства (камера, хранилище, уведомления) приходят из нативных модулей, а не из `window` или DOM.
- Поток JavaScript описывает интерфейс. Нативный код владеет настоящими пикселями и жестами.

**Examples:**

```jsx
import { Text, View } from "react-native";

export function Hello() {
  return (
    <View>
      <Text>Hello</Text>
    </View>
  );
}
```

**Sources:**

- [React Native — Core Components](https://reactnative.dev/docs/intro-react-native-components)
</details>

<details>
<summary>Can you explain the concept of "Learn once, write anywhere" in the context of React Native?</summary>

### Can you explain the concept of "Learn once, write anywhere" in the context of React Native?

**Definition:**

Фраза значит, что React учат один раз и переиспользуют эту модель на каждой платформе. Она не значит один бинарник интерфейса без платформенных различий.

**How it works:**

- Общие компоненты и хуки держат деловую логику. Один и тот же экран на `useState` может отрисоваться на iOS и Android.
- `Platform.OS` и `Platform.select` ветвятся, когда поведение правда различается, например запрос разрешения или путь к файлу.
- Файлы `Button.ios.js` и `Button.android.js` подменяют друг друга при сборке бандла. Импорт остаётся `./Button`.
- Хром навигации, шрифты и безопасные зоны часто нуждаются в платформенной правке, даже если структура экрана общая.
- Push, листы аутентификации и фоновые правила остаются API платформы. Если спрятать каждое различие, интерфейс будет чужим на обеих системах.
- Общий путь держите большим, а ветки маленькими, на краю, где платформа реально отличается.

**Examples:**

```js
import { Platform } from "react-native";

const paddingTop = Platform.select({ ios: 12, android: 0, default: 0 });
```

**Sources:**

- [React Native — Platform-specific code](https://reactnative.dev/docs/platform-specific-code)
</details>

<details>
<summary>How do you create a basic React Native application?</summary>

### How do you create a basic React Native application?

**Definition:**

Проект создают через Expo или React Native Community CLI, затем запускают в Expo Go, симуляторе или на устройстве. Файл входа отрисовывает корневой компонент.

**How it works:**

- Поставьте текущий Node.js. `npx create-expo-app` — короткий путь: он поднимает приложение на JavaScript или TypeScript, не создавая нативные проекты сразу.
- `npx @react-native-community/cli@latest init` генерирует каталоги `ios` и `android`, когда свой нативный код нужен с самого начала.
- Интерфейс живёт в компоненте из `View` и `Text`. Точка входа Expo — обычно `App.js` или файл, названный в `package.json`.
- `npx expo start` открывает сервер разработки. Симулятор, устройство или Expo Go грузят бандл.
- `package.json` перечисляет зависимости. Нативные папки, когда они есть, — проекты Xcode и Gradle, а не место, где пишут большинство экранов.

**Examples:**

```bash
npx create-expo-app notes-app
cd notes-app
npx expo start
```

**Sources:**

- [React Native — Environment setup](https://reactnative.dev/docs/environment-setup)
</details>

<details>
<summary>What are components in React Native?</summary>

### What are components in React Native?

**Definition:**

Компоненты — повторно используемые части интерфейса. Базовые компоненты соответствуют нативным элементам управления, а ваши компоненты собирают из этих примитивов экраны.

**How it works:**

- `View`, `Text` и `Image` — обычные кирпичи. Это не элементы HTML.
- Функциональный компонент принимает пропсы и возвращает другие компоненты. Классовый всё ещё работает; новый код пишут функциями.
- Вложенность образует дерево. Экран — это дерево, а не отдельный вид объекта.
- Локальное состояние живёт в компоненте, который владеет данными. Дети получают нужное как пропсы.
- Компонент перерисовывается, когда меняются его состояние или пропсы, а отрисовщик обновляет соответствующие нативные виды.

**Examples:**

```jsx
function Greeting({ name }) {
  return <Text>Hello {name}</Text>;
}
```

**Sources:**

- [React Native — Core Components](https://reactnative.dev/docs/intro-react-native-components)
</details>

<details>
<summary>Explain the purpose of the `render()` function in a React Native component.</summary>

### Explain the purpose of the `render()` function in a React Native component.

**Definition:**

В классовом компоненте `render()` возвращает дерево элементов для текущих пропсов и состояния. Он должен оставаться чистым: никаких сетевых вызовов и никакого `setState` во время этого возврата.

**How it works:**

- React вызывает `render` при первом монтировании и снова после `setState` или новых пропсов. Результат — описание, ещё не нативный вид.
- Согласование сравнивает новое дерево с предыдущим и применяет разницу к нативным видам. DOM браузера нет.
- Условная отрисовка — обычный JavaScript в этом возврате: флаг выбирает, какого ребёнка включить.
- Побочные эффекты принадлежат методам жизненного цикла или, в функциональных компонентах, `useEffect`. `render`, который сам ходит в сеть, делает это на каждое обновление.
- У функционального компонента нет метода `render`. Тело функции и есть отрисовка. Хуки вызывают в начале этой функции, не внутри условия.

**Examples:**

```jsx
class Badge extends React.Component {
  render() {
    return <Text>{this.props.label}</Text>;
  }
}
```

**Sources:**

- [React — render](https://react.dev/reference/react/Component#render)
</details>

<details>
<summary>What is JSX and how is it used in React Native?</summary>

### What is JSX and how is it used in React Native?

**Definition:**

JSX — синтаксис, похожий на XML внутри JavaScript, который описывает дерево компонентов. Преобразование превращает каждый тег в вызов, создающий элемент React.

**How it works:**

- `<Text>Hi</Text>` становится элементом типа `Text` с ребёнком `"Hi"`. То же дерево можно записать через `React.createElement`, и обычно не стоит.
- Дети вкладываются вложенными тегами. Выражение JavaScript идёт в фигурных скобках: `<Text>{name}</Text>`.
- Пропсы — это атрибуты. `style` — объект, `onPress` — функция. Нет ни `class`, ни `className`.
- Текст не может быть голым ребёнком `View`. Он должен быть внутри `Text`, потому что нативный текстовый узел явный.
- Файл по-прежнему JavaScript. Синтаксическая ошибка JSX ломает бандл, а не телефон во время выполнения.

**Examples:**

```jsx
<Pressable onPress={() => setOn((v) => !v)}>
  <Text>{on ? "On" : "Off"}</Text>
</Pressable>
```

**Sources:**

- [React Native — Introduction](https://reactnative.dev/docs/introduction)
</details>

<details>
<summary>Can you list some of the core components in React Native?</summary>

### Can you list some of the core components in React Native?

**Definition:**

Базовые компоненты — встроенные виды, из которых собирают интерфейс вместо HTML. Постоянно нужны `View`, `Text`, `Image`, `TextInput`, `ScrollView`, `Pressable` и `FlatList`.

**How it works:**

- `View` — блок раскладки. `Text` — единственное место, где рисуется строка. `Image` грузит локальную или удалённую картинку.
- `ScrollView` прокручивает всех своих детей. `FlatList` оконно показывает длинный список, чтобы внеэкранные строки не монтировались все сразу.
- `TextInput` собирает ввод с клавиатуры. `Pressable` (и более старый `Button`) обрабатывает нажатия. `Switch` и `ActivityIndicator` — переключатель и индикатор.
- `Modal`, `StatusBar` и `KeyboardAvoidingView` решают оверлей, строку состояния и перекрытие клавиатурой.
- Старые имена вроде `ListView`, `TabBarIOS` и `ToolbarAndroid` — не текущий набор. Предпочитайте `FlatList` и библиотеку навигации.
- Строки по-прежнему нельзя класть прямо в `View`.

**Examples:**

```jsx
<FlatList
  data={notes}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <Text>{item.title}</Text>}
/>
```

**Sources:**

- [React Native — Core Components and APIs](https://reactnative.dev/docs/components-and-apis)
</details>

<details>
<summary>How do you handle state management in React Native?</summary>

### How do you handle state management in React Native?

**Definition:**

Начинайте с состояния React в компоненте, который владеет данными. Поднимайте его или добавляйте хранилище, только когда несколько далёких экранов нуждаются в одних и тех же значениях.

**How it works:**

- `useState` и `useReducer` держат локальное состояние интерфейса: переключатель, текст в поле, выбранный id.
- Контекст передаёт значение поддереву, не прокидывая пропсы через каждый слой. Каждый потребитель перерисовывается, когда значение меняется, поэтому держите значение узким.
- Данные сервера — другая куча, не состояние интерфейса. Кэш запросов (TanStack Query, RTK Query или похожее) хранит ответы, повторную загрузку и флаги загрузки.
- Redux, Zustand или другое хранилище подходит клиентскому состоянию, которое правят много экранов, например сессии. Не кладите туда каждое текстовое поле.
- Состояние навигации принадлежит навигатору. Копия текущего маршрута в своём хранилище разъезжается.
- На телефоне обычная цена — перерисовка огромного списка. Состояние строки держите в строке, а не в одном большом объекте экрана.

**Examples:**

```jsx
const [query, setQuery] = useState("");
```

**Sources:**

- [React — useState](https://react.dev/reference/react/useState)
</details>

<details>
<summary>What are props in React Native and how are they used?</summary>

### What are props in React Native and how are they used?

**Definition:**

Пропсы — входы, которые родитель передаёт ребёнку. Ребёнок их читает и не присваивает им значения; чтобы попросить изменение, он вызывает функцию, которую родитель передал вниз.

**How it works:**

- `<Weather temp={21} onRefresh={load} />` задаёт `props.temp` и `props.onRefresh` внутри `Weather`.
- Данные текут вниз. События текут вверх через callback. Этот односторонний поток делает владельца состояния очевидным.
- Значения по умолчанию могут быть значениями параметров. TypeScript или `prop-types` могут требовать проп и проверять его тип во время разработки.
- Новый объект пропсов перерисовывает ребёнка. Не собирайте этот объект прямо в горячем списке, если ребёнок мемоизирован и вам важна лишняя отрисовка.
- `style`, `onPress` и `source` тоже пропсы. Это не отдельный канал настройки.

**Examples:**

```jsx
function Weather({ temp, unit = "C" }) {
  return <Text>{temp}°{unit}</Text>;
}
```

**Sources:**

- [React — Passing props](https://react.dev/learn/passing-props-to-a-component)
</details>

<details>
<summary>What is the significance of the Flexbox layout in React Native?</summary>

### What is the significance of the Flexbox layout in React Native?

**Definition:**

React Native раскладывает виды через Flexbox, чтобы одно дерево подстраивалось под ширину, высоту и поворот. Значения по умолчанию отличаются от CSS в вебе: `flexDirection` — это `column`, а `flex` — одно число.

**How it works:**

- Родительский `View` раздаёт свободное место детям через `flex`, `justifyContent` (главная ось) и `alignItems` (поперечная ось).
- Поскольку направление по умолчанию — `column`, стопка детей идёт сверху вниз, пока вы не поставите `row`.
- `flex: 1` у ребёнка значит «взять равную долю оставшегося места». `flexShrink` по умолчанию `0`, поэтому дети не сжимаются, пока вы этого не скажете. В вебе `flex-shrink` по умолчанию `1`.
- `Text`, `Image` и `ScrollView` участвуют в этой раскладке. Абсолютные пиксели не переживают новый размер телефона.
- `ScrollView` нужен родитель с ограниченной высотой (часто `flex: 1`), иначе прокручивать нечего.
- Проценты и `Dimensions` — запасной выход для размера, который не «доля свободного места».

**Examples:**

```jsx
<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  <Text>Centered</Text>
</View>
```

**Sources:**

- [React Native — Layout with Flexbox](https://reactnative.dev/docs/flexbox)
</details>

<details>
<summary>How do you debug a React Native application?</summary>

### How do you debug a React Native application?

**Definition:**

JavaScript и нативную сторону отлаживают инструментами сервера разработки: журналами, React Native DevTools и симулятором или устройством. Инспектор DOM веба — неверная картина дерева нативных видов.

**How it works:**

- `console.log` виден в терминале, где запущен Metro. `console.error` — для сбоев, которые иначе пропустите.
- Меню разработки (встряхнуть устройство или Cmd+D / Ctrl+M) перезагружает, открывает DevTools и переключает оверлеи производительности.
- Точки останова цепляются к отладчику Hermes или JavaScript. Шаг по отрисовке показывает пропсы и состояние, не узлы HTML.
- Сначала воспроизведите на симуляторе, затем на устройстве. Ошибки разрешений, клавиатуры и шрифтов часто есть только на железе.
- Fast Refresh применяет правку, сохраняя состояние. Если интерфейс врёт, сделайте полную перезагрузку, прежде чем гнаться за призраком.
- `ReactDOM.findDOMNode` — веб-API и не описывает виды React Native. Смотрите DevTools и стек компонентов.

**Sources:**

- [React Native — Debugging](https://reactnative.dev/docs/debugging)
</details>

<details>
<summary>Explain the concept of hot reloading in React Native.</summary>

### Explain the concept of hot reloading in React Native.

**Definition:**

Fast Refresh подменяет модуль, который вы только что сохранили, и перерисовывает, сохраняя состояние компонента, когда может. Старая «горячая перезагрузка» и полная перезагрузка — другое: полная перезагрузка заново запускает JavaScript и сбрасывает это состояние.

**How it works:**

- Metro следит за файлами. При сохранении он отправляет новый модуль в приложение, а не пересобирает нативный бинарник.
- Если правка внутри компонента, Fast Refresh пытается сохранить значения `useState`, чтобы вы остались на том же экране.
- Добавление или удаление хука либо ошибка в файле откатывается к полному монтированию. Состояние тогда снова начальное.
- Изменения нативного кода (новое разрешение, изменённый файл Gradle) — не обновление. Нативное приложение надо пересобрать.
- Синтаксические ошибки показывают оверлей. Исправьте файл, и сессия продолжится без переустановки.
- Если экран выглядит устаревшим, один раз выберите Reload в меню разработки. Не доверяйте обновлению, которое прошло поверх сломанного модуля.

**Sources:**

- [React Native — Fast Refresh](https://reactnative.dev/docs/fast-refresh)
</details>

<details>
<summary>How do you handle user input in React Native?</summary>

### How do you handle user input in React Native?

**Definition:**

Ввод текста — управляемый или неуправляемый `TextInput`. Выбор — это `Switch`, `Pressable` или список. HTML-формы и `<input type>` нет.

**How it works:**

- `value` плюс `onChangeText` делают управляемое поле: состояние владеет строкой, а нативное поле её показывает.
- `keyboardType`, `autoCapitalize`, `secureTextEntry` и `returnKeyType` лучше подходят к данным (email, пароль, число), чем одна общая клавиатура.
- `onSubmitEditing` выполняется, когда пользователь нажимает клавишу возврата. Сочетайте его с `blurOnSubmit`, когда следующего поля нет.
- `Switch` использует `value` и `onValueChange`. Набор вариантов — обычно строки `Pressable`, а не удалённый из ядра `Picker`.
- Клавиатуру убирают через `Keyboard.dismiss` или нажатие снаружи. `KeyboardAvoidingView` сдвигает поле, когда клавиатура его закрывает.
- Проверяйте при отправке или при потере фокуса. Проверка на каждый символ нормальна для короткого поля и шумна для длинного.

**Examples:**

```jsx
<TextInput
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  autoCapitalize="none"
/>
```

**Sources:**

- [React Native — TextInput](https://reactnative.dev/docs/textinput)
</details>

<details>
<summary>What is a `TouchableHighlight` in React Native?</summary>

### What is a `TouchableHighlight` in React Native?

**Definition:**

`TouchableHighlight` — обёртка нажатия, которая затемняет фон, пока палец прижат, и вызывает `onPress` при отпускании. Новый код обычно берёт `Pressable`, который делает ту же работу функцией стиля.

**How it works:**

- `underlayColor` — цвет под единственным ребёнком во время нажатия. Ребёнок должен читаться на этом цвете.
- `onPress`, `onPressIn` и `onPressOut` — callback. Отключённый элемент задаёт `disabled`.
- Ребёнок один, не ряд соседей. Оберните соседей в `View`, если цель содержит больше одного вида.
- `Pressable` отдаёт `pressed` стилю и детям, поэтому подсветке не нужен отдельный компонент.
- `TouchableOpacity` приглушает ребёнка, а не рисует подложку. Выберите одну обратную связь и держите её одинаковой.
- Доступность: задайте `accessibilityRole` и подпись, если текста ребёнка мало. Цель нажатия должна быть достаточно большой.

**Examples:**

```jsx
<TouchableHighlight onPress={save} underlayColor="#ddd">
  <Text>Save</Text>
</TouchableHighlight>
```

**Sources:**

- [React Native — TouchableHighlight](https://reactnative.dev/docs/touchablehighlight)
</details>

<details>
<summary>Describe the View component and its purpose in React Native.</summary>

### Describe the View component and its purpose in React Native.

**Definition:**

`View` — базовый контейнер. Он соответствует нативному виду, поддерживает Flexbox и пропсы касания или доступности и сам не рисует текст и не прокручивает.

**How it works:**

- На iOS это `UIView`. На Android это `ViewGroup`. Дети — другие компоненты React Native.
- Стиль `View` задаёт размер, отступы, внешние поля, цвет и flex-раскладку. Эти стили не наследуются в `Text` так, как цвет в CSS.
- Строковый ребёнок недопустим. Положите строку в `Text`. Прокрутка принадлежит `ScrollView` или `FlatList`, а не высокому `View`.
- `onStartShouldSetResponder` и пропсы доступности живут здесь, когда интерактивен сам контейнер.
- Вкладывайте виды по раскладке и останавливайтесь. Обёртка на каждое поле делает дерево трудным для чтения и стоит нативных видов.
- `collapsable` на Android может убрать вид, который сам ничего не рисует. Дайте ему фон или отключите схлопывание, если вы его измеряете.

**Examples:**

```jsx
<View style={{ padding: 16, backgroundColor: "white" }}>
  <Text>Notes</Text>
</View>
```

**Sources:**

- [React Native — View](https://reactnative.dev/docs/view)
</details>

<details>
<summary>How would you navigate between screens in a React Native app?</summary>

### How would you navigate between screens in a React Native app?

**Definition:**

</details>

<details>
<summary>Can you explain the use of the useState hook in React Native?</summary>

### Can you explain the use of the useState hook in React Native?

**Definition:**

</details>

<details>
<summary>How do you apply styles in React Native?</summary>

### How do you apply styles in React Native?

**Definition:**

</details>

<details>
<summary>What is the difference between `state` and `props` in React Native?</summary>

### What is the difference between `state` and `props` in React Native?

**Definition:**

</details>

<details>
<summary>How do you fetch and render a list of data using React Native?</summary>

### How do you fetch and render a list of data using React Native?

**Definition:**

</details>

### React Native Intermediate Concepts

<details>
<summary>What are the lifecycle methods of a React Native component?</summary>

### What are the lifecycle methods of a React Native component?

**Definition:**

</details>

<details>
<summary>Explain the use of the useEffect hook in React Native.</summary>

### Explain the use of the useEffect hook in React Native.

**Definition:**

</details>

<details>
<summary>What are higher-order components in React Native?</summary>

### What are higher-order components in React Native?

**Definition:**

</details>

<details>
<summary>How do you use the Context API in React Native?</summary>

### How do you use the Context API in React Native?

**Definition:**

</details>

<details>
<summary>Can you perform deep linking in React Native? If so, how?</summary>

### Can you perform deep linking in React Native? If so, how?

**Definition:**

</details>

<details>
<summary>Explain the significance of keys in a list in React Native.</summary>

### Explain the significance of keys in a list in React Native.

**Definition:**

</details>

<details>
<summary>How do you implement global state in a React Native app without using Redux or Context API?</summary>

### How do you implement global state in a React Native app without using Redux or Context API?

**Definition:**

</details>

<details>
<summary>How do you optimize performance in a React Native app?</summary>

### How do you optimize performance in a React Native app?

**Definition:**

</details>

<details>
<summary>What is the Virtual DOM and how does React Native utilize it?</summary>

### What is the Virtual DOM and how does React Native utilize it?

**Definition:**

</details>

<details>
<summary>Describe how to implement animations in React Native.</summary>

### Describe how to implement animations in React Native.

**Definition:**

</details>

<details>
<summary>How does React Native handle layout for different device sizes and orientations?</summary>

### How does React Native handle layout for different device sizes and orientations?

**Definition:**

</details>

<details>
<summary>What is the difference between `StyleSheet.create` and plain JavaScript objects for styling?</summary>

### What is the difference between `StyleSheet.create` and plain JavaScript objects for styling?

**Definition:**

</details>

<details>
<summary>How do you use Redux for state management in React Native?</summary>

### How do you use Redux for state management in React Native?

**Definition:**

</details>

<details>
<summary>What is the `useCallback` hook and how can it be useful in React Native?</summary>

### What is the `useCallback` hook and how can it be useful in React Native?

**Definition:**

</details>

<details>
<summary>Explain how to use refs in React Native.</summary>

### Explain how to use refs in React Native.

**Definition:**

</details>

<details>
<summary>How would you create a custom hook in React Native?</summary>

### How would you create a custom hook in React Native?

**Definition:**

</details>

<details>
<summary>In what ways can you improve the memory usage of a React Native app?</summary>

### In what ways can you improve the memory usage of a React Native app?

**Definition:**

</details>

<details>
<summary>What is the role of the React Native Bridge?</summary>

### What is the role of the React Native Bridge?

**Definition:**

</details>

<details>
<summary>How can you integrate a React Native app with a backend service?</summary>

### How can you integrate a React Native app with a backend service?

**Definition:**

</details>

<details>
<summary>How do you secure sensitive data such as API keys in a React Native app?</summary>

### How do you secure sensitive data such as API keys in a React Native app?

**Definition:**

</details>

### React Native Styling and Layout

<details>
<summary>How do you use the `StyleSheet` object to create styles?</summary>

### How do you use the `StyleSheet` object to create styles?

**Definition:**

</details>

<details>
<summary>Can you explain how to use Flexbox for responsive layouts in React Native?</summary>

### Can you explain how to use Flexbox for responsive layouts in React Native?

**Definition:**

</details>

<details>
<summary>How do you implement theming in a React Native application?</summary>

### How do you implement theming in a React Native application?

**Definition:**

</details>

<details>
<summary>What consideration should be taken when styling components for different platforms (iOS and Android)?</summary>

### What consideration should be taken when styling components for different platforms (iOS and Android)?

**Definition:**

</details>

<details>
<summary>How can you use third-party styling libraries like Styled Components in React Native?</summary>

### How can you use third-party styling libraries like Styled Components in React Native?

**Definition:**

</details>

### React Native Data Management and Networking

<details>
<summary>How do you handle state persistence in React Native?</summary>

### How do you handle state persistence in React Native?

**Definition:**

</details>

<details>
<summary>Explain how to make network requests using axios or fetch in React Native.</summary>

### Explain how to make network requests using axios or fetch in React Native.

**Definition:**

</details>

<details>
<summary>What is GraphQL and how can it be used in a React Native app?</summary>

### What is GraphQL and how can it be used in a React Native app?

**Definition:**

</details>

<details>
<summary>How do you manage caching of network requests in React Native?</summary>

### How do you manage caching of network requests in React Native?

**Definition:**

</details>

<details>
<summary>What are the best practices for data validation in React Native forms?</summary>

### What are the best practices for data validation in React Native forms?

**Definition:**

</details>

<details>
<summary>How can you integrate a React Native application with Redux Saga?</summary>

### How can you integrate a React Native application with Redux Saga?

**Definition:**

</details>

<details>
<summary>Discuss the different ways to manage application state in React Native.</summary>

### Discuss the different ways to manage application state in React Native.

**Definition:**

</details>

<details>
<summary>How do you handle offline data synchronization in React Native?</summary>

### How do you handle offline data synchronization in React Native?

**Definition:**

</details>

<details>
<summary>What are the benefits of using Apollo Client in React Native applications?</summary>

### What are the benefits of using Apollo Client in React Native applications?

**Definition:**

</details>

### React Native Platform Specifics

<details>
<summary>How does React Native handle platform-specific code?</summary>

### How does React Native handle platform-specific code?

**Definition:**

</details>

<details>
<summary>What are some common platform-specific components in React Native?</summary>

### What are some common platform-specific components in React Native?

**Definition:**

</details>

<details>
<summary>Can you explain how to use the Platform module in React Native?</summary>

### Can you explain how to use the Platform module in React Native?

**Definition:**

</details>

<details>
<summary>How do you build a component that renders differently on iOS and Android?</summary>

### How do you build a component that renders differently on iOS and Android?

**Definition:**

</details>

<details>
<summary>Describe a scenario where you might use `NativeModules` in React Native.</summary>

### Describe a scenario where you might use `NativeModules` in React Native.

**Definition:**

</details>

<details>
<summary>How do you use `Linking` to handle external URLs in React Native?</summary>

### How do you use `Linking` to handle external URLs in React Native?

**Definition:**

</details>

### React Native Performance Optimization

<details>
<summary>What strategies can you employ to optimize the performance of a React Native application?</summary>

### What strategies can you employ to optimize the performance of a React Native application?

**Definition:**

</details>

<details>
<summary>How would you reduce the app bundle size in a React Native project?</summary>

### How would you reduce the app bundle size in a React Native project?

**Definition:**

</details>

<details>
<summary>Explain how to use the `PureComponent` class for performance gains in React Native.</summary>

### Explain how to use the `PureComponent` class for performance gains in React Native.

**Definition:**

</details>

<details>
<summary>Why is it important to avoid unnecessary renders in React Native, and how can you achieve this?</summary>

### Why is it important to avoid unnecessary renders in React Native, and how can you achieve this?

**Definition:**

</details>

<details>
<summary>What is the Hermes engine and how does it benefit React Native performance?</summary>

### What is the Hermes engine and how does it benefit React Native performance?

**Definition:**

</details>

### React Native Testing and Debugging

<details>
<summary>What are some popular testing frameworks for React Native applications?</summary>

### What are some popular testing frameworks for React Native applications?

**Definition:**

</details>

<details>
<summary>How do you write a unit test for a React Native component?</summary>

### How do you write a unit test for a React Native component?

**Definition:**

</details>

<details>
<summary>Describe the process for end-to-end testing in React Native.</summary>

### Describe the process for end-to-end testing in React Native.

**Definition:**

</details>

<details>
<summary>What are some common debugging techniques in React Native?</summary>

### What are some common debugging techniques in React Native?

**Definition:**

</details>

<details>
<summary>What tools would you use for performance profiling in React Native?</summary>

### What tools would you use for performance profiling in React Native?

**Definition:**

</details>

### React Native Navigation and Routing

<details>
<summary>Compare and contrast React Navigation and React Native Navigation.</summary>

### Compare and contrast React Navigation and React Native Navigation.

**Definition:**

</details>

<details>
<summary>How do you pass parameters between screens using React Navigation?</summary>

### How do you pass parameters between screens using React Navigation?

**Definition:**

</details>

<details>
<summary>Explain tab navigation in React Native.</summary>

### Explain tab navigation in React Native.

**Definition:**

</details>

<details>
<summary>How can you implement deep linking with React Navigation?</summary>

### How can you implement deep linking with React Navigation?

**Definition:**

</details>

<details>
<summary>What is the difference between stack navigation and modal navigation in React Native?</summary>

### What is the difference between stack navigation and modal navigation in React Native?

**Definition:**

</details>

### React Native Build and Deployment

<details>
<summary>What is the process to build and package a React Native app for production?</summary>

### What is the process to build and package a React Native app for production?

**Definition:**

</details>

<details>
<summary>How do you configure app signing for deploying a React Native app to the Google Play Store or Apple App Store?</summary>

### How do you configure app signing for deploying a React Native app to the Google Play Store or Apple App Store?

**Definition:**

</details>

<details>
<summary>Explain the steps to update a React Native app already deployed on the app stores.</summary>

### Explain the steps to update a React Native app already deployed on the app stores.

**Definition:**

</details>

<details>
<summary>What is CodePush and how can it be used in React Native apps?</summary>

### What is CodePush and how can it be used in React Native apps?

**Definition:**

</details>

<details>
<summary>How do you manage different app environments (development, staging, production) in React Native?</summary>

### How do you manage different app environments (development, staging, production) in React Native?

**Definition:**

</details>

### React Native Ecosystem and Libraries

<details>
<summary>List some common libraries that you would consider essential for React Native development.</summary>

### List some common libraries that you would consider essential for React Native development.

**Definition:**

</details>

<details>
<summary>How do you integrate a navigation library like React Navigation into a React Native app?</summary>

### How do you integrate a navigation library like React Navigation into a React Native app?

**Definition:**

</details>

<details>
<summary>What is Expo, and what are its pros and cons?</summary>

### What is Expo, and what are its pros and cons?

**Definition:**

</details>

<details>
<summary>How would you integrate push notifications into a React Native app?</summary>

### How would you integrate push notifications into a React Native app?

**Definition:**

</details>

<details>
<summary>Describe how you would use a library like React Native Elements to enhance the UI of your app.</summary>

### Describe how you would use a library like React Native Elements to enhance the UI of your app.

**Definition:**

</details>

### Advanced React Native Topics

<details>
<summary>What is the Flipper tool and how does it help in React Native development?</summary>

### What is the Flipper tool and how does it help in React Native development?

**Definition:**

</details>

<details>
<summary>Can you explain the use of Turbo Modules in React Native?</summary>

### Can you explain the use of Turbo Modules in React Native?

**Definition:**

</details>

<details>
<summary>Describe the process of linking native modules in a React Native app.</summary>

### Describe the process of linking native modules in a React Native app.

**Definition:**

</details>

<details>
<summary>What is Reanimated, and when would you use it in a React Native app?</summary>

### What is Reanimated, and when would you use it in a React Native app?

**Definition:**

</details>

<details>
<summary>How do you create a bridge for a native module in React Native?</summary>

### How do you create a bridge for a native module in React Native?

**Definition:**

</details>

<details>
<summary>Explain the concept of shared element transitions in React Native.</summary>

### Explain the concept of shared element transitions in React Native.

**Definition:**

</details>

<details>
<summary>How would you go about writing native code in Swift or Kotlin for React Native?</summary>

### How would you go about writing native code in Swift or Kotlin for React Native?

**Definition:**

</details>

<details>
<summary>What is "Fast Refresh" in React Native?</summary>

### What is "Fast Refresh" in React Native?

**Definition:**

</details>

<details>
<summary>How does React Native compile to native code?</summary>

### How does React Native compile to native code?

**Definition:**

</details>

<details>
<summary>Can you integrate a React Native application into an existing native iOS or Android app?</summary>

### Can you integrate a React Native application into an existing native iOS or Android app?

**Definition:**

</details>

### React Native Best Practices

<details>
<summary>What are the best practices for structuring a large React Native codebase?</summary>

### What are the best practices for structuring a large React Native codebase?

**Definition:**

</details>

<details>
<summary>How should you handle sensitive data in a React Native app?</summary>

### How should you handle sensitive data in a React Native app?

**Definition:**

</details>

<details>
<summary>What are the best practices for API interaction and data fetching in React Native?</summary>

### What are the best practices for API interaction and data fetching in React Native?

**Definition:**

</details>

<details>
<summary>Discuss the importance of accessibility in React Native apps.</summary>

### Discuss the importance of accessibility in React Native apps.

**Definition:**

</details>

<details>
<summary>How do you ensure that your React Native application is maintainable and scalable over time?</summary>

### How do you ensure that your React Native application is maintainable and scalable over time?

**Definition:**

</details>
