# React Native — Interview

Answers are filled for the published subset; the rest are still empty.


### Related docs

- [React Native — Interview](./4_react_native_interview.md)

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

React Native uses React’s component model to build iOS and Android apps whose interface is native views. React on the web renders DOM nodes; React Native renders platform views such as `View` and `Text`.

**How it works:**

- Props, state, and hooks are the same ideas. A component is still a function of state that returns a tree.
- On the web that tree becomes `div` and `button`. In React Native it becomes native views (`UIView` on iOS, Android views) through the renderer.
- There is no browser DOM and no CSS file. Layout is a Flexbox style object, and text has to live in `Text`.
- Device features (camera, storage, notifications) come from native modules, not from `window` or the DOM.
- The JavaScript thread describes the UI. Native code owns the actual pixels and gestures.

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

The phrase means you learn React once and reuse that model on each platform. It does not mean one UI binary with no platform differences.

**How it works:**

- Shared components and hooks hold the business logic. The same `useState` screen can render on iOS and Android.
- `Platform.OS` and `Platform.select` branch when a behavior really differs, such as a permission prompt or a file path.
- Files named `Button.ios.js` and `Button.android.js` replace each other at bundle time. The import stays `./Button`.
- Navigation chrome, fonts, and safe areas often need a platform-specific tweak even when the screen structure is shared.
- Push, auth sheets, and background rules stay platform APIs. Hiding every difference produces a UI that feels wrong on both.
- Keep the shared path large and the branches small, at the edge where the platform actually differs.

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

You scaffold a project with Expo or the React Native Community CLI, then run it in Expo Go, a simulator, or a device. The entry file renders a root component.

**How it works:**

- Install a current Node.js. `npx create-expo-app` is the short path: it starts a JavaScript or TypeScript app without creating native projects first.
- `npx @react-native-community/cli@latest init` generates the `ios` and `android` directories when you need custom native code from the start.
- The UI lives in a component built from `View` and `Text`. Expo’s entry is typically `App.js` or the file named in `package.json`.
- `npx expo start` opens a dev server. A simulator, a device, or Expo Go loads the bundle.
- `package.json` lists dependencies. Native folders, when they exist, are the Xcode and Gradle projects, not the place you write most screens.

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

Components are the reusable pieces of the UI. Core components map to native controls, and your components compose those primitives into screens.

**How it works:**

- `View`, `Text`, and `Image` are the usual building blocks. They are not HTML elements.
- A function component takes props and returns more components. A class component still works; new code uses functions.
- Nesting forms a tree. A screen is that tree, not a separate kind of object.
- Local state lives in the component that owns the data. Children receive what they need as props.
- A component re-renders when its state or props change, and the renderer updates the matching native views.

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

In a class component, `render()` returns the element tree for the current props and state. It must stay pure: no network calls and no `setState` during that return.

**How it works:**

- React calls `render` on the first mount and again after `setState` or new props. The result is a description, not a native view yet.
- Reconciliation diffs the new tree against the previous one and applies the difference to native views. There is no browser DOM.
- Conditional rendering is ordinary JavaScript in that return: a flag chooses which child to include.
- Side effects belong in lifecycle methods or, in function components, in `useEffect`. `render` that fetches data runs the fetch on every update.
- A function component has no `render` method. The function body is the render. Hooks are called at the top of that function, not inside a condition.

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

JSX is syntax that looks like XML inside JavaScript and describes a component tree. A transform turns each tag into a call that creates a React element.

**How it works:**

- `<Text>Hi</Text>` becomes an element of type `Text` with the child `"Hi"`. You can write the same tree with `React.createElement` and usually should not.
- Children nest by nesting tags. A JavaScript expression goes in braces: `<Text>{name}</Text>`.
- Props are attributes. `style` is an object, and `onPress` is a function. There is no `class` or `className`.
- Text cannot be a raw child of `View`. It has to be inside `Text`, because the native text node is explicit.
- The file is still JavaScript. A syntax error in JSX fails the bundle, not the phone at runtime.

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

The core components are the built-in views you compose instead of HTML. The ones you reach for constantly are `View`, `Text`, `Image`, `TextInput`, `ScrollView`, `Pressable`, and `FlatList`.

**How it works:**

- `View` is the layout box. `Text` is the only place a string is drawn. `Image` loads a local or remote picture.
- `ScrollView` scrolls all of its children. `FlatList` windows a long list so off-screen rows are not all mounted.
- `TextInput` collects keyboard input. `Pressable` (and the older `Button`) handles taps. `Switch` and `ActivityIndicator` cover a toggle and a spinner.
- `Modal`, `StatusBar`, and `KeyboardAvoidingView` solve overlay, status bar, and keyboard overlap.
- Older names such as `ListView`, `TabBarIOS`, and `ToolbarAndroid` are not the current toolkit. Prefer `FlatList` and a navigation library.
- Strings still cannot sit directly in a `View`.

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

Start with React state in the component that owns the data. Lift it, or add a store, only when several distant screens need the same values.

**How it works:**

- `useState` and `useReducer` hold local UI state: a toggle, the text in a field, a selected id.
- Context passes a value to a subtree without threading props through every layer. Every consumer re-renders when that value changes, so keep the value narrow.
- Server data is a different pile from UI state. A query cache (TanStack Query, RTK Query, or similar) stores responses, refetch, and loading flags.
- Redux, Zustand, or another store fits client state that many screens edit, such as a session. Do not put every text field there.
- Navigation state belongs to the navigator. Duplicating the current route in your own store drifts.
- On a phone, re-rendering a huge list is the usual cost. Keep row state in the row, not in the screen’s one big object.

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

Props are the inputs a parent passes to a child. The child reads them and does not assign to them; to ask for a change it calls a function the parent passed down.

**How it works:**

- `<Weather temp={21} onRefresh={load} />` sets `props.temp` and `props.onRefresh` inside `Weather`.
- Data flows down. Events flow up through callbacks. That one-way flow is what makes the owner of the state obvious.
- Default values can be parameter defaults. TypeScript or `prop-types` can require a prop and check its type during development.
- A new prop object re-renders the child. Do not build that object inline in a hot list if the child is memoized and you care about the extra render.
- Style, `onPress`, and `source` are props too. They are not a separate configuration channel.

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

React Native lays out views with Flexbox so the same tree adapts to width, height, and rotation. The defaults differ from CSS on the web: `flexDirection` is `column`, and `flex` is a single number.

**How it works:**

- A parent `View` distributes free space to children with `flex`, `justifyContent` (main axis), and `alignItems` (cross axis).
- Because the default direction is `column`, a stack of children runs top to bottom until you set `row`.
- `flex: 1` on a child means “take an equal share of leftover space”. `flexShrink` defaults to `0`, so children do not shrink unless you say so. On the web, `flex-shrink` defaults to `1`.
- `Text`, `Image`, and `ScrollView` participate in that layout. Absolute pixel positions do not survive a new phone size.
- A `ScrollView` needs a bounded parent (often `flex: 1`) or it has nothing to scroll inside.
- Percentages and `Dimensions` are the escape hatch for a size that is not “share the free space”.

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

You debug the JavaScript and the native sides with the tools the dev server exposes: logs, React Native DevTools, and a simulator or a device. The web DOM inspector is the wrong picture of a native view tree.

**How it works:**

- `console.log` shows in the terminal that is running Metro. `console.error` is for failures you would otherwise miss.
- The dev menu (shake the device, or Cmd+D / Ctrl+M) reloads, opens DevTools, and toggles performance overlays.
- Breakpoints attach to the Hermes or JavaScript debugger. Stepping a render shows props and state, not HTML nodes.
- Reproduce on a simulator first, then on a device. Permission, keyboard, and font bugs often exist only on hardware.
- Fast Refresh applies an edit while keeping state. If the UI lies, do a full reload before chasing a ghost.
- `ReactDOM.findDOMNode` is a web API and does not describe React Native views. Inspect with DevTools and the component stack.

**Sources:**

- [React Native — Debugging](https://reactnative.dev/docs/debugging)
</details>

<details>
<summary>Explain the concept of hot reloading in React Native.</summary>

### Explain the concept of hot reloading in React Native.

**Definition:**

Fast Refresh replaces the module you just saved and re-renders, keeping component state when it can. The older “hot reload” and a full reload are different: a full reload restarts the JavaScript and drops that state.

**How it works:**

- Metro watches files. On save it sends the new module to the app instead of rebuilding the native binary.
- If the edit is inside a component, Fast Refresh tries to keep `useState` values so you stay on the same screen.
- Adding or removing a hook, or an error in the file, falls back to a full remount. State is then initial again.
- Native code changes (a new permission, a changed Gradle file) are not a refresh. Rebuild the native app.
- Syntax errors show an overlay. Fix the file and the session continues without reinstalling.
- If the screen looks stale, use the dev menu Reload once. Do not trust a refresh that ran over a broken module.

**Sources:**

- [React Native — Fast Refresh](https://reactnative.dev/docs/fast-refresh)
</details>

<details>
<summary>How do you handle user input in React Native?</summary>

### How do you handle user input in React Native?

**Definition:**

Text input is a controlled or uncontrolled `TextInput`. Choices are `Switch`, `Pressable`, or a list. There is no HTML form and no `<input type>`.

**How it works:**

- `value` plus `onChangeText` makes a controlled field: state owns the string, and the native field shows it.
- `keyboardType`, `autoCapitalize`, `secureTextEntry`, and `returnKeyType` match the data (email, password, number) better than one generic keyboard.
- `onSubmitEditing` runs when the user presses the return key. Pair it with `blurOnSubmit` when there is no next field.
- A `Switch` uses `value` and `onValueChange`. A set of options is usually `Pressable` rows, not the removed `Picker` from core.
- Dismiss the keyboard with `Keyboard.dismiss` or a tap outside. `KeyboardAvoidingView` shifts the field when the keyboard covers it.
- Validate on submit or on blur. Validating every keystroke is fine for a short field and noisy for a long one.

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

`TouchableHighlight` is a pressable wrapper that darkens its background while the finger is down and calls `onPress` on release. New code usually uses `Pressable`, which can do the same job with a style function.

**How it works:**

- `underlayColor` is the color shown under the single child during the press. The child should be able to sit on that color.
- `onPress`, `onPressIn`, and `onPressOut` are the callbacks. A disabled control sets `disabled`.
- It is one child, not a row of siblings. Wrap siblings in a `View` if the target contains more than one view.
- `Pressable` exposes `pressed` to its style and children, so the highlight does not need a separate component.
- `TouchableOpacity` fades the child instead of painting an underlay. Pick one feedback style and keep it consistent.
- Accessibility: set `accessibilityRole` and a label if the child text is not enough. The press target should be large enough to hit.

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

`View` is the basic container. It maps to a native view, supports Flexbox and touch or accessibility props, and does not draw text or scroll by itself.

**How it works:**

- On iOS it is a `UIView`. On Android it is a `ViewGroup`. Children are other React Native components.
- Style on a `View` sets size, padding, margin, color, and flex layout. Those styles do not cascade to `Text` the way CSS color can.
- A string child is invalid. Put the string in `Text`. Scrolling belongs to `ScrollView` or `FlatList`, not to a tall `View`.
- `onStartShouldSetResponder` and accessibility props live here when the container itself is the interactive object.
- Nest views to match the layout, then stop. A wrapper per margin makes the tree hard to read and costs native views.
- `collapsable` on Android may remove a view that has no drawing of its own. Give it a background or turn collapsing off if you measure it.

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
