20 TypeScript Interview Questions and Answers You Should Prepare For
2025-11-24
27 min read
Written by William Juan
typescript interview questions and answers
Written by
William Juan

Summary:
Use this list of TypeScript interview questions and answers to prepare for your upcoming meeting with a technical recruiter or lead engineer!

Looking to hire a TypeScript developer or hoping to land a job as a TypeScript developer? These TypeScript interview questions and answers can help you put together a comprehensive interview guide.

TypeScript is closely related to JavaScript. You can refer to our JavaScript interview questions guide if you need to review interview questions specifically about JavaScript.

In this guide, we break down the important TypeScript interview questions to know into three groups:`

Basic TypeScript Interview Questions
Intermediate TypeScript Interview Questions
Advanced TypeScript Interview Questions
You can expect to learn about what questions you should ask, what answers to expect, and what to focus on evaluating for each answer. Additionally, we’ll explain why you should ask these questions, what to look for, and what you want to draw out from your candidates.

And, at the end of the article (as well as a few places throughout), we’ll link you to some other helpful interview advice and job hunting guides.

Let’s get started!

Related Guides: JavaScript Interview Questions • Angular Interview Questions • React Interview Questions • Selenium Interview Questions • Java Interview Questions

Basic TypeScript Interview Questions
The following set of questions should test a job candidate’s basic knowledge of TypeScript and some of its core features.

1. What is TypeScript and how does it differ from JavaScript?
   This is a fundamental question that interviewers typically ask to gauge the candidate’s familiarity with the language and how comfortable they are with its features. Make sure your candidate can describe TypeScript as a language, its core features, and how it relates to JavaScript.

TypeScript is a superset of JavaScript that compiles to plain JavaScript. Conceptually, the relationship between TypeScript and JavaScript is comparable to that of SASS and CSS. In other words, TypeScript is JavaScript’s ES6 version with some additional features.

TypeScript is an object-oriented and statically typed language, similar to Java and C#, whereas JavaScript is a scripting language closer to Python. The object-oriented nature of TypeScript is complete with features such as classes and interfaces, and its static typing allows for better tooling with type inference at your disposal.

From a code perspective, TypeScript is written in a file with a .ts extension whereas JavaScript is written with a .js extension. Unlike JavaScript, TypeScript code is not understandable by the browsers and can’t be executed directly in the browser or any other platform. The .ts files need to be transpiled using TypeScript’s tsc transpiler to plain JavaScript first, which then gets executed by the target platform.

2. What are the benefits of using TypeScript?
   Each programming language has its pros and cons and the reasons behind its applications. You might ask this question to gain insight into the candidate’s experience using TypeScript and how it has affected the developer experience and the project’s workflow.

Instead of just listing out TypeScript’s benefits, make sure to encourage your candidates’ to talk about how a typical project could benefit from TypeScript. This could range from better maintainability in the long run or increased developer productivity because of the features that TypeScript offers.

An immediate advantage of using TypeScript is its tooling. TypeScript is a strongly typed language that uses type inferences. These characteristics open the doors to better tooling and tighter integration with code editors. TypeScript’s strict checks catch your errors early, greatly reducing the chances of typos and other human errors from making their way to production. From an IDE’s perspective, TypeScript provides the opportunity for your IDE to understand your code better allowing it to display better hints, warnings, and errors to the developer. For example, TypeScript’s strict null check throws an error at compile time (and in your IDE) preventing a common JavaScript error of attempting to access a property of an undefined variable at runtime.

A long-run advantage of using TypeScript is its scalability and maintainability. The ability to describe the shape of objects and functions directly in your code makes your codebase easier to understand and more predictable. When used correctly, TypeScript provides a more standardized language resulting in better readability which could save time and effort down the road as the codebase grows.

Read More: Common Non-Technical Interview Questions for Software Developer Jobs

3. What are interfaces in TypeScript?
   Similar to other TypeScript features-related questions, this question tests the candidate’s level of knowledge and familiarity with the language’s feature. An ideal answer should also include its usage and the benefits of using interfaces.

Interfaces are TypeScript’s way of defining the syntax of entities. In other words, interfaces are a way to describe data shapes such as objects or an array of objects.

We declare interfaces with the help of the interface keyword, followed by the interface name and its definition. Let’s look at a simple interface for a user object

interface User {
name: string;
age: number;
}
The interface can then be used to set the type of a variable (similar to how you assign primitive types to a variable). A variable with the User type will then conform to the interface’s properties.

let user: User = {
name: "Bob",
age: 20, // omitting the `age` property or a assigning a different type instead of a number would throw an error
};
Interfaces help drive consistency in your TypeScript project. Furthermore, interfaces also improve your project’s tooling, providing better autocomplete functionality in your IDEs and ensuring the correct values are being passed into constructors and functions.

4. How do you create a new type using a subset of an interface?
   Being able to modify an interface is useful to remove duplicate code and max_Being able to modify an interface is useful to remove duplicate code and maximize the reusability of existing interfaces (where it makes sense). This question covers one of the many features that TypeScript offers to create a new interface from an existing interface.

TypeScript has a utility type called omit that lets you construct a new type by passing a current type/interface and selecting the keys to be excluded from the new type. The example below shows how you create a new type UserPreview based on the User interface, but without the email property.

interface User {
name: string;
description: string;
age: number;
email: string;
}

// removes the `email` property from the User interface
type UserPreview = Omit<User, "email">;

const userPreview: UserPreview = {
name: "Bob",
description: "Awesome guy",
age: 20,
};
Read More: 31 Questions to Ask at an Interview for Software Development Jobs

5. How do “enums” work in TypeScript?
   Enums are a common data structure in most typed languages. Understanding enums and how to use them is essential in organizing code and making code more readable. The candidate should be able to explain enums at a high level, along with their basic features and usage.

Enums or enumerated types are a means of defining a set of named constants. These data structures have a constant length and contain a set of constant values. Enums in TypeScript are commonly used to represent a set number of options for a given value using a set of key/value pairs.

Let’s look at an example of an enum to define a set of user types.

enum UserType {
Guest = "G",
Verified = "V",
Admin = "A",
}

const userType: UserType = UserType.Verified;
Under the hood, TypeScript translates enums into plain JavaScript objects after compilation. This makes the use of enums more favorable compared to using multiple independent const variables. The grouping that enums offer makes your code type-safe and more readable.

6. What are arrow functions in TypeScript?
   Arrow function is a popular feature of ES6 and TypeScript that introduces an alternate shorter way of defining functions. Although shorter, arrow functions come with their pros and cons, which are important to consider when choosing which method to use.

Arrow functions, also known as lambda functions, provide a short and convenient syntax to declare functions. Arrow functions are often used to create callback functions in TypeScript. Array operations such as map, filter, and reduce all accept arrow functions as their arguments.

However, arrow functions’ anonymity also has its downsides. If not careful, the shorter arrow function syntax can be more difficult to understand. Furthermore, arrow functions’ nameless nature also makes it impossible to create self-referencing functions (i.e. recursions).

Let’s take a look at a regular function that accepts two numbers and returns its sum.

function addNumbers(x: number, y: number): number {
return x + y;
}

addNumbers(1, 2); // returns 3
Now let’s convert the function above into an arrow function.

const addNumbers = (x: number, y: number): number => {
return x + y;
};

addNumbers(1, 2); // returns 3
Read More: Time Management Skills for Developers: Best Tips, Tools, and Strategies

7. What are the differences between var, let, and const?
   TypeScript provides three ways to declare a variable, each with its recommended use cases. The ability to differentiate between the three keywords and understanding which to use when plays an important role in writing quality code. As the candidate, make sure that you explain the use case for each of the keywords along with their behavior.

var: Declares a function-scoped or global variable with similar behavior and scoping rules to JavaScript’s var variables. var variables don’t require setting its value during its declaration.
let: Declares a block-scoped local variable. let variables don’t require setting a value of a variable during its declaration. Block-scoped local variable means that the variable can only be accessed within its containing block, such as a function, an if/else block, or a loop. Furthermore, unlike var, let variables cannot be read or written to before they are declared.
// reading/writing before a `let` variable is declared
console.log("age", age); // Compiler Error: error TS2448: Block-scoped variable 'age' used before its declaration
age = 20; // Compiler Error: error TS2448: Block-scoped variable 'age' used before its declaration

let age: number;

// accessing `let` variable outside it's scope
function user(): void {
let name: string;
if (true) {
let email: string;
console.log(name); // OK
console.log(email); // OK
}
console.log(name); // OK
console.log(email); // Compiler Error: Cannot find name 'email'
}
const: Declares a block-scoped constant value that cannot be changed after it’s initialized. const variables require an initialization as part of its declaration. This is ideal for variables that don’t change throughout their lifetime.
// reassigning a `const` variable
const age: number = 20;
age = 30; // Compiler Error: Cannot assign to 'age' because it is a constant or read-only property

// declaring a `const` variable without initialization
const name: string; // Compiler Error: const declaration must be initialized
Sidenote: Linters does a great job in catching these in your IDEs and compilers will throw an error if a rule is violated as a result of misusing these keywords.

8. When do you use a return type of never and how does it differ from void?
   This is a question that showcases the candidate’s understanding of TypeScript’s types and their use cases in the context of defining return types. The candidate should be able to distinguish between the two types and identify the return type of a function by looking at its contents.

Before diving into the differences between never and void, let’s talk about the behavior of a JavaScript function when nothing is returned explicitly.

Let’s take the function in the example below. It doesn’t explicitly return anything to the caller. However, if you assign it to a variable and log the value of the variable, you will see that the function’s value is undefined.

printName(name: string): void {
console.log(name);
}

const printer = printName('Will');
console.log(printer); // logs "undefined"
The above snippet is an example of void functions. Functions with no explicit returns are inferred by TypeScript to have a return type of void.

In contrast, never is a type that represents a value that never occurs. For example, a function with an infinite loop or a function that throws an error are functions that have a never return type.

const error = (): never => {
throw new Error("");
};
In summary, void is used whenever a function doesn’t return anything explicitly whereas never is used whenever a function never returns.

Read More: Problem-Solving Skills for Software Developers: Why & How to Improve

9. What access modifiers are supported by TypeScript?
   Access modifiers and encapsulation go hand-in-hand. A question like this is an opportunity to understand the candidate’s knowledge of the concept of encapsulation and TypeScript’s approach to data access restrictions. You may also be looking for real-world applications of access modifiers, the reasoning behind them, and their advantages.

The concept of “encapsulation” is used in object-oriented programming to control the visibility of its properties and methods. TypeScript uses access modifiers to set the visibility of a class’s contents. Because TypeScript gets compiled to JavaScript, logic related to access modifiers is applied during compile time, not at run time.

There are three types of access modifiers in TypeScript: public, private, and protected.

public: All properties and methods are public by default. Public members of a class are visible and accessible from any location.
protected: Protected properties are accessible from within the same class and its subclass. For example, a variable or method with the protected keyword will be accessible from anywhere within its class and within a different class that extends the class containing the variable or method.
private: Private properties are only accessible from within the class the property or method is defined.
To use any of these access modifiers, add the public, protected, or public (if omitted, TypeScript will default to public) in front of the property or method.

class User {
private username; // only accessible inside the `User` class

// only accessible inside the `User` class and its subclass
protected updateUser(): void {}

// accessible from any location
public getUser() {}
}
Violating the rules of the access modifier, such as attempting to access a class’s private property from a different class will result in the following error during the compilation process.

Property '<property-name>' is private and only accessible within class '<class-name>'.
In conclusion, access modifiers play an important role in arranging your code. They allow you to expose a set of public APIs and hide the implementation details. You can think of access modifiers as a form of entry gates to your class. Effective use of access modifiers reduces the chance of errors from misusing another class’s contents significantly.

10. What are generics and how to use them in TypeScript?
    In addition to the “what”, an interviewer asking this question might also be looking for answers on how generics tie into the code’s flexibility and the reasoning behind using generics over other types. Your candidate should be comfortable discussing what generics are, how it works, and it’s benefits.

Good software engineering practice often encourages reusability and flexibility. The use of generics provides reusability and flexibility by allowing a component to work over a variety of types rather than a single one while preserving its precision (unlike the use of any).

Below is an example of a generic function that lets the caller define the type to be used within the function.

function updateUser<Type>(arg: Type): Type {
return arg;
}
To call a generic function, you can either pass in the type explicitly within angle brackets or via type argument inference, letting TypeScript infer the type based on the type of the argument passed in.

// explicitly specifying the type
let user = updateUser<string>("Bob");

// type argument inference
let user = updateUser("Bob");
Generics allows us to keep track of the type information throughout the function. This makes the code flexible and reusable without compromising on its type accuracy.

Looking to hire the best remote developers? Arc can help you:

⚡️ Get instant candidate matches without searching
⚡️ Identify top applicants from our network of 350,000+
⚡️ Hire 4x faster with vetted candidates (qualified and interview-ready)

Try Arc to hire top developers now →

Intermediate TypeScript Interview Questions
The following set of questions should test the candidate’s intermediate knowledge of TypeScript and some of its widely used features.

1. When should you use the unknown type?
   Knowing the differences between unknown and any and when to use which is important working with TypeScript. unknown is usually the preferred option because of its safer typing. Your candidate should be able to explain what the unknown type is used for and how to use it.

unknown is a special type that is similar to any. Like any, a common use case of the unknown type is when you don’t know the exact type upfront. unknown variables accept any value. However, when trying to operate on an unknown variable, TypeScript requires a type check or a type assertion. This difference makes unknown a

Let’s look at two examples to highlight the differences between any and unknown types.

The snippet below shows a valid TypeScript code where you could pass in any value as the callback parameter, and the invokeCallback method will try to call it. This function doesn’t throw any compile-time error, however, it could lead to a run time error when you pass in a variable that’s not callable as the callback parameter.

invokeCallback(callback: any): void {
callback();
}
The unknown equivalent of the above example requires you to add a type check before calling the callback function. The additional type check prevents the run time error above from happening.

invokeCallback(callback: unknown): void {
if (typeof callback === 'function') {
callback();
}
}
To summarize, you can assign anything to both an any and an unknown type. However, unknown types require a type check or type assertion to perform any operation on the variable.

2. What is noImplicitAny and what is its purpose?
   This is a TypeScript configuration question that would give you insight into the level of familiarity the candidate has when configuring a TypeScript project. Although this is only one property from TypeScript’s list of configurable properties, noImplicitAny plays an important role in larger projects.

noImplicitAny is a property in a TypeScript project’s configuration file (tsconfig.json) that modifies how TypeScript’s compiler handles your project’s implicit any types. The noImplicitAny flag can be set to either true or false and can always be changed later. There is no correct answer as to what this value should be as each project is different. To be able to decide on what the flag should be set to, it is important to understand the differences between when it’s turned on and when it’s off.

When the noImplicitAny flag is false (by default), the compiler doesn’t infer the variable type based on how it’s used. Instead, the compiler defaults the type to any.

On the other hand, when the noImplicitAny flag is true, the compiler will attempt to infer the type, throwing a compile-time error if the compiler isn’t able to infer the type.

Setting the noImplicitAny flag to either true or false doesn’t prevent you from setting a variable’s type to any.

Read More: 10 Ways to Improve Leadership Skills (& Advance Your Developer Career)

3. What are conditional types in TypeScript?
   Sometimes, a variable’s type is dependent on its input. Conditional types help bridge the input and output’s type – transforming a variable’s type based on a set condition. Conditional type is an important TypeScript feature that helps write type-safe framework-like code such as API boundaries. Although the candidate might not use this feature directly every day, they might be using them indirectly when using code from other frameworks or libraries.

Conditional types in TypeScript are similar to ternary operators. As the name suggests, it assigns a type to the variable based on a condition.

The general expression for defining a conditional type in TypeScript is as follows:

A extends B ? X : Y
Type X in the snippet above is applied if the variable fulfills the condition whereas type Y is applied if the variable doesn’t. In the example above, type X is assigned if A extends B, while type Y is assigned if A doesn’t extend B.

4. What is the difference between union and intersection types?
   Union and intersection types are considered advanced types in TypeScript. Understanding this is important when creating types in developer’s TypeScript projects to reduce duplication of types. The candidate should ideally be able to explain what union and intersection types are, their differences, and their use cases.

Unions and intersection types let you compose and combine existing types instead of creating them from scratch. Both union and intersection come with their unique characteristics which make them ideal for different use cases.

A union type is described as a type that can be one of several types. Union type uses the | (vertical bar) symbol to separate the list of types that will be used in the new type. Let’s take a look at an example:

interface B {
name: string,
email: string
}

interface C {
name: string,
age: number
}

type A = B | C;
A in the snippet above can either be of type B or C. Based on B and Cs interfaces, A can either contain name and email (B) or name and age (C), but not email and age.

When accessing type A, TypeScript only lets you access properties that exist in both B and C (name) as those are the only ones that TypeScript can be certain of their existence.

Intersection on the other hand, is described as a type that combines multiple types into one – combining all the properties of each type to create a new type. Intersection uses the & symbol to separate the list of types that will be combined. Let’s look at an example:

interface B {
name: string,
email: string
}

interface C {
name: string,
age: number
}

type A = B & C;
A in the snippet above will contain all the properties from both B and C (name, email, and age).

Read More: Interpersonal Skills: What Developers Need to Know (& How to Improve)

5. What is the difference between extends and implements in TypeScript?
   Inheritance is an important concept in object-oriented programming, specifically for polymorphism and code reusability. There are two main keywords that TypeScript uses for inheritance – extends and implements. This question is a chance to test your candidate’s knowledge of the concept of inheritance and how to do that in TypeScript.

Implements and extends have different uses. Let’s go through each individual and take a look at an example to compare the two.

When a class extends another class, the child class will inherit all the properties and methods of the class it extends. You can override any of the existing properties and methods of its parent and add new ones.

When a class implements another class or interface, the class has to implement all the methods and properties from the implemented class or interface. The implements keyword acts as a contract that the class has to follow, and TypeScript will make sure that the class is of the same shape as the class or interface it implements.

Let’s look at an example of a class and how another class can extend and implement it.

class User {
name: string;
age: number;
}

// John will contain name and age from the User class
class John extends User {}

// this will result in an error as Bob doesn't have all the properties that
// the User class has
class Bob implements User {}

// This is valid as Mike satisfies the "contract" specified by the
// User class
class Mike implements User {
name = 'Mike';
age = 25
}

Advanced TypeScript Interview Questions
The following set of advanced questions for Typescript interviews should test your candidates’ deep knowledge of TS and some of its more expert-level concepts and features.

1. Explain how optional chaining works in TypeScript.
   Optional chaining is a TypeScript feature that allows safer and easier accessing of values inside deep objects. Understanding how and when to use this feature will help developers write more concise code (where it makes sense). A candidate should be able to explain what optional chaining is and also elaborate on its use cases and pros and cons.

Optional chaining allows you to access properties and methods located deep within an object without having to check the validity of each reference in the chain.

Optional chaining uses the question mark followed by a period (?.) as its operator. TypeScript evaluates each reference in the chain and performs a null or undefined check before accessing its children. TypeScript immediately stops the execution when it fails the null or undefined check and returns undefined for the entire chain.

The code snippet below is an example of accessing a property with and without using optional chaining.

const user = {
personalInfo: {
name: 'John'
}
}

// without optional chaining
const name = user && user.personalInfo && user.personalInfo.name || undefined;

// with optional chaining
const name = user?.personalInfo?.name; 2. What are abstract classes?
Abstract class is another feature of TypeScript that ties into the inheritance concept in object-oriented programming (OOP). You may ask this question to get an insight into the candidate’s understanding of OOP and its more advanced features in TypeScript.

Abstract classes specify a contract for the objects without the ability to instantiate them directly. However, an abstract class may also provide implementation details for its members.

An abstract class contains one or more abstract members. Any classes that extend the abstract class will then have to provide an implementation for the superclass’s abstract members.

Let’s look at an example of how an abstract class is written in TypeScript and how another class can extend it. In the example below, both Car and Bike extend the Vehicle class, however, they each have a different implementation of the drive() method.

abstract class Vehicle {

abstract drive(): void;

startEngine(): void {
console.log('Engine starting...');
}
}

class Car extends Vehicle {
drive(): void {
console.log('Driving in a car');
}
}

class Bike extends Vehicle {
drive(): void {
console.log('Driving on a bike');
}
}
Read More: 8 Great Benefits of Working From Home (A Guide for Remote Developers)

3. What are type assertions in TypeScript?
   Type assertions are a way to tell TypeScript the type of a variable. As types are widely used in TypeScript applications, you often run into scenarios where you want to specify a more specific type to a variable. A candidate should be able to explain not only what type assertions are, but also their syntax and the reasons behind why you might use them.

Type assertion allows you to explicitly set the type of a value and tell the compiler not to infer it. This is useful when you know the type of an object more specifically than its current type or current inferred type. In such cases, you can use type assertions to tell TypeScript the current type of the variable.

TypeScript provides two syntaxes for type assertions – as and <>.

// using the `as` keyword
const name: string = person.name as string;

// using `<>`
const name: string = <string>person.name;
Since type assertions are only a way to tell the TypeScript compiler about the type of a variable, there is no runtime penalty of doing this in your TypeScript projects.

4. What is the difference between type inference and contextual typing?
   Type inference is a key feature in TypeScript that helps write type-safe code that is both less error-prone and easier to read. You might ask this question to gauge your candidate’s understanding of both TypeScript’s type inference and their overall familiarity with TypeScript’s type system.

TypeScript can infer the type of a variable usually based on the variable’s initialization or declaration. This process is known as type inference.

The snippet below is an example of type inference where TypeScript infers the type of name as “string” based on the value assigned to it.

let name = 'john'
Contextual typing is a subset of type inference where TypeScript uses the location or context of a variable to infer its type. You can think about this as type inference in the opposite direction.

In the snippet below, TpyeScript uses information from the onmousedown function to infer the type of the mouseEvent parameter.

window.onmousedown = function(mouseEvent) {
console.log(mouseEvent.button); // OK
console.log(mouseEvent.person); // Error
};
Read More: How to Negotiate Your Salary as a Remote Developer

5. How does function overloads work in TypeScript?
   Function overloading helps make functions more flexible and reusable by allowing the same function to behave a different way based on the set of input passed in. In addition to the how, you might be looking for answers on how function overloads tie into the code reusability aspect and any other benefits it provides.

Function overload is when the same function name is used multiple times with a different set of arguments – the number of arguments, types, or return types.

Let’s look at an example of how a print function can accept multiple types as its parameter by using function overloading.

print(message: string): void;
print(message: string[]): void;

print(message: unknown): void {
if (typeof message === 'string') {
console.log(message);
} else if (Array.isArray(message)) {
message.forEach((individualMessage) => {
console.log(individualMessage);
});
} else {
throw new Error('unable to print');
}
}
Based on the code snippet above, we can now call print passing in either a single message string or an array of message strings.

print('Single message');
// Console Output:
// Single message

print(['First message', 'Second message']);
// Console Output
// First message
// Second message
Apart from the reusability of the function, function overloading also comes with autocomplete support. When calling a function (depending on your IDE), you will be provided with a list of all possible overloads that you can choose from for your specific use case, creating a better development experience.

Conclusion
Whether you’re a hiring manager looking for the ideal candidate or a developer preparing for an interview, we hope these TypeScript interview questions help you through the process.

Keep in mind that technical skills and knowledge are only one part of the hiring process. Past experiences and soft skills are equally important to make sure you hire the best candidate (or land the right job).

Ответы на самые популярные вопросы на собеседовании по TypeScript: продвинутые вопросы

Богдан Мирченко

Редактор новостей


  
 
Технический писатель и программист Райан Телин поделился в блоге на dev.to 50 самыми популярными вопросами на собеседовании по TypeScript и ответами на них. Мы разбили подборку на четыре части. Первую часть можно посмотреть здесь, вторую здесь, третью здесь. В четвертую часть вошли четыре продвинутых вопроса с ответами и 20 вопросов для самостоятельного изучения. 

Продвинутые вопросы
 27. Как добиться перегрузки функции в TypeScript? 

Чтобы перегрузить функцию в TypeScript, нужно создать две функции с одним и тем же именем, но с разными типами аргументов/возвращаемых значений. Обе функции должны принимать одинаковое количество аргументов. Это важная часть полиморфизма в TypeScript.

Например, можно создать функцию add, которая суммирует два аргумента, если это числа, и объединяет их, если они являются строками. 

function add(a:string, b:string):string;
function add(a:number, b:number): number;
function add(a: any, b:any): any {
    return a + b;
}
add("Hello ", "Steve"); // returns "Hello Steve" 
add(10, 20); // returns 30
28. Как сделать все свойства интерфейса необязательными?

Чтобы сделать все свойства необязательными, можно воспользоваться частично сопоставленным типом partial. 

29. Когда используется ключевое слово unknown? 

unknown используется, если неизвестно, какой тип ожидать заранее, но нужно назначить его позже, и если ключевое слово any не будет работать. 

30. Что такое декораторы и к чему их можно применить? 

Декоратор — это особый вид объявления, который позволяет изменять классы и члены классов сразу, помечая их аннотацией @name. Каждый декоратор должен ссылаться на функцию, которая будет оцениваться во время выполнения. 

Например, декоратор @sealed будет соответствовать запечатанной функции. Все, что помечено  @sealed, будет использоваться для оценки запечатанной функции. 

function sealed(target) {
  // do something with 'target' ...
}
Декоратор можно прикрепить к: 

  Объявлению классов;
  Методам;
  Аксессорам;
  Характеристикам;
  Параметрам.
По умолчанию декораторы не включены. Чтобы их включить, нужно отредактировать поле experimentalDecorators в параметрах компилятора в файле tsconfig.json или в командной строке. 

Вопросы для самостоятельного изучения 
31. Какой модификатор доступа по умолчанию для переменных-членов и методов в TypeScript?

32. Когда используется ключевое слово declare?

33. Что такое дженерики в TypeScript? Когда они используются?

34. Как и когда используется коллекция enum?

35. Что такое пространства имен и зачем их использовать?

36. Как реализуются необязательные параметры?

37. Назовите три отличия между TypeScript и JavaScript.

38. Является ли TypeScript языком функционального программирования?

39. Какие функции TypeScript были бы полезны для full-stack-разработчика?

40. Назовите преимущества TypeScript Language Service?

41. Как создать повторно используемые компоненты?

42. В чем разница между кортежем и массивом в TypeScript?

43. Какие коллекции поддерживает TypeScript?

44. В чем разница между внутренними и внешними модулями в TypeScript?

45. Для чего используется тип Record?

46. Какие преимущества дает TypeScript стеку технологий?

47. Как сгенерировать файл определения с помощью TypeScript?

48. Поддерживает ли TypeScript абстрактные классы?

49. Как настроить файл TypeScript для компиляции при каждом изменении?

50.Что такое Ambient в TypeScript и когда их использовать? 


Собеседования по TypeScript всё чаще проверяют не только знание синтаксиса, но и умение видеть «узкие места» в уже работающем коде. Задача кандидата - не просто сказать «тут ошибка», а предложить более безопасное, читаемое и поддерживаемое решение.

В этой статье собраны практические вопросы, основанные на реальных принципах рефакторинга TypeScript. Каждый пример показывает типичный код, который можно улучшить, и задаёт направление для размышлений.


🔹 Типы и сужение типов
Вопрос:
«У нас есть код, где TypeScript выводит слишком широкий тип. Как это исправить и зачем это нужно?»

// Было ❌
const users = new Map(); // Map<any, any> — слишком широко
users.set('anna', 28);

type Status = 'active' | 'blocked';
const [status, setStatus] = useState('active'); // выводится как string
Объяснить с
Скрытый текст
// Стало ✅
const users = new Map<string, number>(); // чётко: ключ — строка, значение — число
users.set('anna', 28);

type Status = 'active' | 'blocked';
const [status, setStatus] = useState<Status>('active'); // сужаем до нужных значений
Объяснить с
Зачем:

Ошибки ловятся на этапе компиляции, а не в продакшене

Код становится понятнее: сразу видно, какие данные допустимы

Легче рефакторить: если поменять тип - компилятор покажет все места, где нужно поправить

🔹 Не дублируйте то, что и так очевидно
Вопрос:
«Когда стоит явно указывать тип переменной, а когда можно довериться выводу типов?»

// Избыточно ❌
const role: string = 'admin'; // и так понятно, что это string
const items = new Map<string, number>([['x', 1]]); // тип и так выведется
const [loaded, setLoaded] = useState<boolean>(false); // boolean очевиден
Объяснить с
Скрытый текст
// Достаточно ✅
const ROLE = 'admin'; // выводится как 'admin' (литерал), а не просто string
const items = new Map([['x', 1]]); // выводится Map<string, number>
const [loaded, setLoaded] = useState(false); // выводится boolean
Объяснить с
Правило: Указывайте тип явно только тогда, когда это помогает сузить тип. Во всех остальных случаях - доверяйте TypeScript.

🔹 Неизменяемость данных
Вопрос:
«Как защитить данные от случайных изменений в функции?»

// Опасно ❌ — можно случайно изменить исходной массив
const removeFirst = (list: Array<User>) => {
  if (list.length === 0) return list;
  return list.splice(1); // меняет исходной массив!
};
Объяснить с
Скрытый текст
// Безопасно ✅
const removeFirst = (list: ReadonlyArray<User>)
Объяснить с
Почему важно:

Меньше багов из-за побочных эффектов

Легче тестировать и отлаживать

🔹 Обязательные и опциональные поля
Вопрос:
«Почему не стоит делать все поля в интерфейсе опциональными?»

// Сложно и небезопасно ❌
type Account = {
  id?: number;
  email?: string;
  isAdmin?: boolean;
  permissions?: string[];
  plan?: 'free' | 'pro';
};
// При использовании придётся постоянно писать account?.email?.toLowerCase()...
Объяснить с
Скрытый текст
// Чётко и безопасно ✅ — через объединение с дискриминатором
type AdminAccount = {
  role: 'admin';
  id: number;
  email: string;
  permissions: readonly string[];
};

type GuestAccount = {
  role: 'guest';
  tempToken: string;
};

type Account = AdminAccount | GuestAccount; // компилятор знает, какие поля где есть
Объяснить с
Плюсы:

Ясно, какие данные обязательны в каждом сценарии

Нет лишнего ?. в коде

Ошибки «поля не существует» ловятся сразу

🔹 Дискриминируемые объединения (Discriminated Unions)
Вопрос:
«Что это и зачем нужно? Покажите на примере рефакторинга.»

// Было: много флагов — запутанно ❌
type Request = {
  isLoading?: boolean;
  isError?: boolean;
  data?: any;
  error?: string;
};
Объяснить с
Скрытый текст
// Стало: один явный статус — понятно ✅
type RequestSuccess = { status: 'success'; data: Product[] };
type RequestLoading = { status: 'loading' };
type RequestError = { status: 'error'; message: string };

type Request = RequestSuccess | RequestLoading | RequestError;

// Теперь компилятор проверит, что вы обработали все случаи:
const render = (req: Request) => {
  switch (req.status) {
    case 'success': return <List items={req.data} />; // req.data точно есть
    case 'loading': return <Spinner />;
    case 'error': return <Error msg={req.message} />; // req.message точно есть
    // забыли случай? — компилятор предупредит!
  }
};
Объяснить с
Зачем:

Убирает неопределённость: в каждом состоянии известны точные поля

Exhaustiveness check: если добавили новый статус - компилятор заставит обработать его везде

Код самодокументируется

🔹 as const satisfies - мощный инструмент для констант
Вопрос:
«Как безопасно описать набор констант, чтобы и типы проверялись, и значения не менялись?»

type Role = 'viewer' | 'editor' | 'admin';

// ❌ Широкий тип
const ROLES: readonly Role[] = ['viewer', 'editor'];

// ❌ as const без проверки — можно опечататься в значениях
const ROLES = ['viwer', 'edior'] as const; // опечатки не заметим!
Объяснить с
Скрытый текст
// ✅ Идеально: и значения «заморожены», и типы проверены
const ROLES = ['viewer', 'editor', 'admin'] as const satisfies readonly Role[];
Объяснить с
Что даёт:

as const - делает значения readonly и сужает типы до литералов

satisfies - проверяет, что значения соответствуют ожидаемому типу, но не «расширяет» их

Вместе - максимальная безопасность без потери удобства

🔹 Шаблонные строковые типы (Template Literal Types)
Вопрос:
«Как защититься от опечаток в строках вроде путей API или ключей перевода?»

// Было ❌ — опечатка в строке = ошибка в рантайме
const endpoint = '/api/usrers'; // "usrers" вместо "users" — компилятор молчит
Объяснить с
Скрытый текст
// Стало ✅ — только допустимые значения
type ApiPath = 'users' | 'posts' | 'comments';
type ApiEndpoint = `/api/${ApiPath}`; // "/api/users" | "/api/posts" | "/api/comments"

const endpoint: ApiEndpoint = '/api/users'; // ✅
const bad: ApiEndpoint = '/api/usrers'; // ❌ Ошибка компиляции!
Объяснить с
Где ещё полезно:

Ключи локализации: translation.${Page}.${Key}

CSS-классы: ${Color}-${Shade} => 'blue-400' | 'red-200'

SQL-запросы: SELECT ${Column} FROM ${Table}

🔹 any vs unknown
Вопрос:
«В чём разница и почему any - это зло?»

// ❌ any отключает проверку типов — ошибки пролезут в продакшен
const data: any = apiCall();
const name: string = data.userName; // компилятор молчит, даже если userName нет
Объяснить с
Скрытый текст
// ✅ unknown требует явной проверки перед использованием
const data: unknown = apiCall();

// Вариант 1: тип-гард
if (typeof data === 'object' && data !== null && 'userName' in data) {
  const name = (data as { userName: string }).userName;
}

// Вариант 2: утверждение типа (только если уверены!)
const name = (data as { userName: string }).userName;
Объяснить с
Правило: unknown - безопасная альтернатива any. Всегда сужайте тип перед использованием.

🔹 Утверждения типов: когда можно, а когда нет
Вопрос:
«Можно ли использовать as User или user!.name?»

type User = { name: string; avatar: string | null };

// ❌ Опасно: компилятор верит вам на слово, но в рантайме может упасть
const user = { name: 'Misha' } as User; // avatar отсутствует!
render(user!.avatar); // Runtime error: cannot read property of null
Объяснить с
Скрытый текст
// ✅ Безопасно: проверяем перед использованием
if (user.avatar !== null) {
  render(user.avatar);
}
Объяснить с
Когда допустимо:

Работаете с чужой библиотекой, где типы неточные

Только после явной проверки (type guard)

С комментарием, почему это необходимо

🔹 @ts-expect-error vs @ts-ignore
Вопрос:
«Как правильно заглушить ошибку TypeScript, если иначе нельзя?»

// ❌ @ts-ignore — ошибка может «исчезнуть» после рефакторинга, а комментарий останется
// @ts-ignore
const result = legacyFunc('test');
Объяснить с
Скрытый текст
// ✅ @ts-expect-error — если ошибка уйдёт, компилятор предупредит, что комментарий лишний
// @ts-expect-error: legacyFunc принимает число, а не строку — поправим в v2
const result = legacyFunc('test');
Объяснить с
Почему важно: @ts-expect-error - самодокументирующийся и самопроверяющийся. Не даёт забыть про технический долг.

🔹 type vs interface
Вопрос:
«Что выбрать и почему?»

// ❌ interface не умеет в объединения типов
interface Status = 'ok' | 'error'; // Ошибка!
Объяснить с
Скрытый текст
// ✅ type — универсальнее
type Status = 'ok' | 'error';
type User = { name: string; status: Status };
Объяснить с
Правило: Используйте type по умолчанию. interface- только когда нужно расширение (declaration merging), например, для глобальных типов.

🔹 Массивы: T[] vs Array
Вопрос:
«Есть ли разница и что лучше?»

// ❌ Синтаксис T[] может запутать в сложных случаях
const list: readonly string[] = ['a', 'b'];
Объяснить с
Скрытый текст
// ✅ Generic-синтаксис читается лучше, особенно с readonly
const list: ReadonlyArray<string> = ['a', 'b'];
const matrix: Array<Array<number>> = [[1, 2], [3, 4]];
Объяснить с
Плюсы Array<T>:

Однообразный стиль во всём проекте

Легче читать вложенные типы

Явно видно, что это массив, а не что-то другое

🔹 Импорт типов: import type
Вопрос:
«Зачем отдельно импортировать типы, если можно просто import { X }?»

// ❌ Может попасть в бандл лишний код
import { User } from './types'; // User — только тип, но бандлер может включить файл
Объяснить с
Скрытый текст
// ✅ Чётко: это только тип, в рантайме не нужно
import type { User } from './types';
Объяснить с
Зачем:

Уменьшает размер бандла (tree-shaking)

Явно разделяет «код» и «типы»

Помогает избежать циклических зависимостей

🔹 Функции: один объект вместо кучи аргументов
Вопрос:
«Как сделать функцию удобной для расширения?»

// ❌ Непонятно, что за параметры и в каком порядке
createOrder('client', false, 60, 120, null, true, 2000);
Объяснить с
Скрытый текст
// ✅ Объект с понятными ключами — легко читать и менять
createOrder({
  method: 'client',
  validate: false,
  minLines: 60,
  maxLines: 120,
  default: null,
  log: true,
  timeout: 2000,
});
Объяснить с
Бонус: Можно добавить as const satisfies для проверки допустимых значений параметров.

🔹 Возвращаемые типы функций
Вопрос:
«Стоит ли всегда указывать возвращаемый тип?»

Скрытый текст
Правило:

✅ В публичных API, хуках, утилитах - указывайте явно (защита от случайных изменений)

⚪ Во внутренней логике - можно довериться выводу типов, если код простой

// Публичный хук — тип важен
export const useUsers = (): { users: User[]; loading: boolean } => { ... }

// Внутренняя вспомогательная функция — вывод типов ок
const formatName = (user: User) => `${user.firstName} ${user.lastName}`;
Объяснить с
🔹 Флаги boolean vs объединение типов
Вопрос:
«Почему лучше один статус, чем пять булевых флагов?»

// ❌ Флаги накапливаются, состояния становятся неоднозначными
const isPending = true;
const isProcessing = false;
const isConfirmed = false;
// А если все false? А если два true одновременно?
Объяснить с
Скрытый текст
// ✅ Одно поле — одно значение — никаких сомнений
type OrderState = 'pending' | 'processing' | 'confirmed' | 'cancelled';
const state: OrderState = 'pending';
Объяснить с
Результат:

Невозможно невалидное состояние

Компоненты рендерятся через switch - компилятор проверит полноту

Легче добавлять новые статусы

🔹 null vs undefined
Вопрос:
«В чём разница и когда что использовать?»

Скрытый текст
Простое правило:

null - значение есть, но оно «пустое» (например, аватарка не загружена)

undefined - значения нет вообще (поле не передано, не инициализировано)

type Profile = {
  avatar: string | null; // может быть пустым, но поле всегда есть
  bio?: string; // может вообще отсутствовать в объекте
};
Объяснить с
Зачем: Чёткая семантика помогает избегать багов и делает код самодокументирующимся.

🔹 Именование: простые правила, которые спасают
Вопрос:
«Как называть переменные, функции и типы, чтобы код читался как книга?»

Скрытый текст
Что

Стиль

Пример

Переменные, функции

camelCase

userList, formatPrice

Булевы

с префиксом is/has

isActive, hasPermission

Константы

UPPER_CASE

MAX_RETRIES = 3

Типы, интерфейсы

PascalCase

UserProfile, ApiResponse

Дженерики

T + описание

TData, TResponse (не просто T)

Компоненты React / Vue

PascalCase

ProductCard, CheckoutForm

Пропсы-события

on*

onSubmit, onError

Обработчики

handle*

handleSubmit, handleError

Акронимы: ApiUrl, не APIURL; FaqList, не FAQList.

🔹 Комментарии: когда они нужны?
Вопрос:
«Стоит ли комментировать каждую строку?»

Скрытый текст
Правило:

❌ Не пишите, что делает код - это должно быть видно из имён и структуры

✅ Пишите, почему сделано именно так - если причина неочевидна

// ❌ Бесполезно
// Умножаем на 60, чтобы получить минуты
const minutes = seconds * 60;

// ✅ Полезно
// Используем кэширование, потому что API лимитирует 100 запросов/мин
// См. тикет #4421
const data = await fetchWithCache(endpoint);
Объяснить с
TSDoc: Используйте для публичных API, хуков, утилит - чтобы IDE показывала подсказки.

🔹 Структура проекта: где что хранить?
Вопрос:
«Как организовать файлы, чтобы рефакторинг не превращался в квест?»

Скрытый текст
 modules/
 └──  ProductPage/
     ├──  index.tsx          # Точка входа
     ├──  components/        # Только для этой страницы
     │   ├── ProductCard/
     │   └── PriceBadge/
     ├──  hooks/             # useProductData, useWishlist
     ├──  utils/             # formatProductPrice
     └──  api/               # fetchProduct, updateCart
Объяснить с
Принцип: Группируйте по фичам, а не по типам файлов.

Импорт:

./Component - если файл рядом

@/modules/ProductPage/utils - если из другого модуля

Почему:

Удалили фичу - удалили папку, и всё

Перенесли фичу - не надо править 20 импортов

Новый разработчик быстро находит, где что


1. Что такое TypeScript и чем он отличается от JavaScript?
Это фундаментальный вопрос, который интервьюер обычно задает, чтобы оценить знакомство кандидата с языком и то, насколько ему комфортно с его особенностями. Как кандидат, убедитесь, что вы можете описать TypeScript как язык, его основные функции и то, как он связан с JavaScript.
TypeScript — это надмножество JavaScript, которое компилируется в обычный JavaScript. Концептуально отношения между TypeScript и JavaScript сравнимы с отношениями SASS и CSS. Другими словами, TypeScript — это версия JavaScript ES6 с некоторыми дополнительными функциями.
TypeScript — это объектно-ориентированный и статически типизированный язык, похожий на Java и C#, тогда как JavaScript — это язык сценариев, более близкий к Python. Объектно-ориентированный характер TypeScript дополняется такими функциями, как классы и интерфейсы, а его статическая типизация позволяет лучше использовать инструменты с выводом типов в вашем распоряжении.
С точки зрения кода TypeScript записывается в файл с расширением, .ts тогда как JavaScript записывается с .js расширением. В отличие от JavaScript, код TypeScript не понятен браузерам и не может быть выполнен непосредственно в браузере или на любой другой платформе. Файлы .ts необходимо сначала транспилировать с помощью tsc транспилятора TypeScript в обычный JavaScript, который затем запускается целевой платформой.
2. Каковы преимущества использования TypeScript?
У каждого языка программирования есть свои плюсы и минусы, а также причины его применения. Интервьюер может задать этот вопрос, чтобы получить представление о личном опыте кандидата в использовании TypeScript и о том, как это повлияло на опыт разработчика и рабочий процесс проекта.
Вместо того, чтобы просто перечислять преимущества TypeScript, поговорите также о том, как типичный проект может извлечь выгоду из TypeScript. Это может варьироваться от лучшей ремонтопригодности в долгосрочной перспективе или повышения производительности разработчиков благодаря функциям, которые предлагает TypeScript.
Непосредственным преимуществом использования TypeScript является его инструментарий. TypeScript — это строго типизированный язык, использующий вывод типов. Эти характеристики открывают двери для улучшения инструментов и более тесной интеграции с редакторами кода. Строгие проверки TypeScript выявляют ваши ошибки на ранней стадии, что значительно снижает вероятность того, что опечатки и другие человеческие ошибки попадут в рабочую среду. С точки зрения IDE, TypeScript предоставляет вашей IDE возможность лучше понять ваш код, что позволяет отображать более подсказки, предупреждения и ошибки для разработчика. Например, строгая проверка null в TypeScript выдает ошибку во время компиляции (и в вашей IDE), предотвращая распространенную ошибку JavaScript при попытке доступа к свойству неопределенной переменной во время выполнения.
Долгосрочное преимущество использования TypeScript — его масштабируемость и ремонтопригодность. Возможность описывать форму объектов и функций непосредственно в коде делает кодовую базу более понятной и предсказуемой. При правильном использовании TypeScript предоставляет более стандартизированный язык, обеспечивающий лучшую читаемость, что может сэкономить время и усилия в будущем по мере роста кодовой базы.
3. Что такое интерфейсы в TypeScript?
Подобно другим вопросам, связанным с функциями TypeScript, этот вопрос проверяет уровень знаний кандидата и знакомство с функцией языка. Идеальный ответ должен также включать его использование и преимущества использования интерфейсов.
Интерфейсы — это способ TypeScript для определения синтаксиса сущностей. Другими словами, интерфейсы — это способ описания форм данных, таких как объекты или массивы объектов.
Мы объявляем интерфейсы с помощью ключевого interface слова, за которым следует имя интерфейса и его определение. Давайте посмотрим на простой интерфейс для пользовательского объекта
interface User {
  name: string;
  age: number;
}
Затем интерфейс можно использовать для установки типа переменной (аналогично тому, как вы назначаете примитивные типы переменной). Затем переменная с этим User типом будет соответствовать свойствам интерфейса.
let user: User = {
  name: "Bob",
  age: 20, // omitting the `age` property or a assigning a different type instead of a number would throw an error
};
Интерфейсы помогают обеспечить согласованность в вашем проекте TypeScript. Кроме того, интерфейсы также улучшают инструментарий вашего проекта, обеспечивая лучшую функциональность автозаполнения в ваших IDE и гарантируя передачу правильных значений в конструкторы и функции.
4. Как создать новый тип, используя подмножество интерфейса?
Возможность изменять интерфейс полезна для удаления повторяющегося кода, а max_Being - возможность изменять интерфейс полезна для удаления повторяющегося кода и максимального повторного использования существующих интерфейсов (там, где это имеет смысл). Этот вопрос касается одной из многих функций, которые TypeScript предлагает для создания нового интерфейса из существующего интерфейса.
В TypeScript есть служебный тип omit , который позволяет создавать новый тип, передавая текущий тип/интерфейс и выбирая ключи, которые нужно исключить из нового типа. В приведенном ниже примере показано, как создать новый тип UserPreview на основе User интерфейса, но без email свойства.
interface User {
  name: string;
  description: string;
  age: number;
  email: string;
}

// removes the `email` property from the User interface
type UserPreview = Omit<User, "email">;

const userPreview: UserPreview = {
  name: "Bob",
  description: "Awesome guy",
  age: 20,
};
5. Как работают «перечисления» в TypeScript?
Перечисления являются распространенной структурой данных в большинстве типизированных языков. Понимание перечислений и того, как их использовать, играет важную роль в организации вашего кода и делает его более читабельным. Кандидат должен быть в состоянии объяснить перечисления на высоком уровне, а также их основные функции и использование.
Перечисления или перечисляемые типы — это средство определения набора именованных констант. Эти структуры данных имеют постоянную длину и содержат набор постоянных значений. Перечисления в TypeScript обычно используются для представления набора параметров для заданного значения с использованием набора пар ключ/значение.
Давайте рассмотрим пример перечисления для определения набора типов пользователей.
enum UserType {
  Guest = "G",
  Verified = "V",
  Admin = "A",
}

const userType: UserType = UserType.Verified;
Под капотом TypeScript после компиляции переводит перечисления в простые объекты JavaScript. Это делает использование перечислений более выгодным по сравнению с использованием нескольких независимых const переменных. Группировка, которую предлагают перечисления, делает ваш код типобезопасным и более читабельным.
Помните: когда вы практикуетесь с этими техническими вопросами и ответами на собеседовании по TypeScript, не забывайте понимать причины, лежащие в основе каждого вопроса.
6. Что такое стрелочные функции в TypeScript?
Стрелочная функция — это популярная функция ES6 и TypeScript, которая представляет альтернативный более короткий способ определения функций. Хотя стрелочные функции короче, у них есть свои плюсы и минусы, которые важно учитывать при выборе метода для использования.
Стрелочные функции, также известные как лямбда-функции, обеспечивают короткий и удобный синтаксис для объявления функций. Стрелочные функции часто используются для создания функций обратного вызова в TypeScript. Операции с массивами, такие как map, filterи reduce все, принимают стрелочные функции в качестве аргументов.
Однако анонимность стрелочных функций имеет и свои недостатки. Если не соблюдать осторожность, более короткий синтаксис стрелочной функции может быть труднее понять. Кроме того, безымянный характер стрелочных функций также делает невозможным создание самоссылающихся функций (т.е. рекурсий).
Давайте рассмотрим обычную функцию, которая принимает два числа и возвращает их сумму.
function addNumbers(x: number, y: number): number {
  return x + y;
}

addNumbers(1, 2); // returns 3
Теперь давайте преобразуем функцию выше в функцию стрелки.
const addNumbers = (x: number, y: number): number => {
  return x + y;
};

addNumbers(1, 2); // returns 3
7. В чем разница между var, letи const?
TypeScript предоставляет три способа объявления переменной, каждый из которых имеет свои рекомендуемые варианты использования. Способность различать три ключевых слова и понимание того, какое из них использовать, играет важную роль в написании качественного кода. Как кандидат, убедитесь, что вы объяснили вариант использования каждого из ключевых слов вместе с их поведением.
var : объявляет переменную области действия или глобальную переменную с поведением и правилами области действия, аналогичными переменным JavaScript var . var переменные не требуют установки значения во время объявления.
let : объявляет локальную переменную блочной области. let переменные не требуют установки значения переменной во время ее объявления. Локальная переменная с областью действия блока означает, что доступ к переменной возможен только внутри содержащего ее блока, такого как функция, блок if/else или цикл. Кроме того, в отличие от var, let переменные не могут быть прочитаны или записаны до их объявления.
// reading/writing before a `let` variable is declared
console.log("age", age); // Compiler Error: error TS2448: Block-scoped variable 'age' used before its declaration
age = 20; // Compiler Error: error TS2448: Block-scoped variable 'age' used before its declaration

let age: number;

// accessing `let` variable outside it's scope
function user(): void {
  let name: string;
  if (true) {
    let email: string;
    console.log(name); // OK
    console.log(email); // OK
  }
  console.log(name); // OK
  console.log(email); // Compiler Error: Cannot find name 'email'
}
const : объявляет постоянное значение в области блока, которое нельзя изменить после его инициализации. const переменные требуют инициализации как часть своего объявления. Это идеально подходит для переменных, которые не меняются на протяжении всего их жизненного цикла.
// reassigning a `const` variable
const age: number = 20;
age = 30; // Compiler Error: Cannot assign to 'age' because it is a constant or read-only property

// declaring a `const` variable without initialization
const name: string; // Compiler Error: const declaration must be initialized
Примечание: линтеры отлично справляются с обнаружением таких ошибок в ваших IDE, и компиляторы выдают ошибку, если правило нарушается в результате неправильного использования этих ключевых слов.
8. Когда вы используете возвращаемый тип neverи чем он отличается от void?
Это вопрос, который демонстрирует понимание кандидатом типов TypeScript и вариантов их использования в контексте определения возвращаемых типов. Кандидат должен уметь различать два типа и определять возвращаемый тип функции, глядя на ее содержимое.
Прежде чем углубляться в различия между never и void, давайте поговорим о поведении функции JavaScript, когда ничего не возвращается явно.
Давайте возьмем функцию в примере ниже. Он явно ничего не возвращает вызывающей стороне. Однако, если вы присвоите его переменной и зарегистрируете значение переменной, вы увидите, что значение функции равно undefined.
printName(name: string): void {
  console.log(name);
}

const printer = printName('Will');
console.log(printer); // logs "undefined"
Приведенный выше фрагмент является примером void функций. TypeScript предполагает, что функции без явного возврата имеют возвращаемый тип void.
Напротив, never это тип, представляющий значение, которое никогда не встречается. Например, функция с бесконечным циклом или функция, выдающая ошибку, — это функции, которые имеют возвращаемый never тип.
const error = (): never => {
  throw new Error("");
};
Таким образом, void используется всякий раз, когда функция ничего не возвращает явно, тогда как never используется всякий раз, когда функция никогда не возвращает значение.
9. Какие модификаторы доступа поддерживает TypeScript?
Модификаторы доступа и инкапсуляция идут рука об руку. Подобный вопрос — это возможность понять знания кандидата о концепции инкапсуляции и подходе TypeScript к ограничениям доступа к данным. Интервьюер также может искать реальное применение модификаторов доступа, причины их использования и их преимущества.
Понятие « инкапсуляция » используется в объектно-ориентированном программировании для управления видимостью его свойств и методов. TypeScript использует модификаторы доступа для установки видимости содержимого класса. Поскольку TypeScript компилируется в JavaScript, логика, связанная с модификаторами доступа, применяется во время компиляции, а не во время выполнения.
В TypeScript есть три типа модификаторов доступа: public, private, и protected.
public : все свойства и методы по умолчанию общедоступны. Публичные члены класса видны и доступны из любого места.
protected : защищенные свойства доступны из того же класса и его подкласса. Например, переменная или метод с protected ключевым словом будут доступны из любого места в своем классе и в другом классе, который расширяет класс, содержащий переменную или метод.
private : частные свойства доступны только из класса, в котором определено свойство или метод.
Чтобы использовать любой из этих модификаторов доступа, добавьте public, protectedили public (если он опущен, TypeScript по умолчанию будет общедоступным) перед свойством или методом.
class User {
  private username; // only accessible inside the `User` class
// only accessible inside the `User` class and its subclassprotected updateUser(): void {}
// accessible from any locationpublic getUser() {}
}
Нарушение правил модификатора доступа, например попытка доступа к частному свойству класса из другого класса, приведет к следующей ошибке в процессе компиляции.
Property '<property-name>' is private and only accessible within class '<class-name>'.
В заключение, модификаторы доступа играют важную роль в организации вашего кода. Они позволяют открыть набор общедоступных API и скрыть детали реализации. Вы можете думать о модификаторах доступа как о форме входных ворот в ваш класс. Эффективное использование модификаторов доступа значительно снижает вероятность ошибок из-за неправильного использования содержимого другого класса.
10. Что такое дженерики и как их использовать в TypeScript?
В дополнение к «что», интервьюер, задающий этот вопрос, может также искать ответы о том, как дженерики связаны с гибкостью кода, и о причинах использования дженериков по сравнению с другими типами. Обсудите, что такое дженерики, как они работают и в чем их преимущества.
Хорошая практика разработки программного обеспечения часто способствует повторному использованию и гибкости. Использование дженериков обеспечивает возможность повторного использования и гибкость, позволяя компоненту работать с различными типами, а не с одним, сохраняя при этом свою точность (в отличие от использования any).
Ниже приведен пример универсальной функции, которая позволяет вызывающей стороне определить тип, который будет использоваться внутри функции.
function updateUser<Type>(arg: Type): Type {
  return arg;
}
Чтобы вызвать универсальную функцию, вы можете либо явно передать тип в угловых скобках, либо через вывод аргумента типа , позволяя TypeScript вывести тип на основе типа переданного аргумента.
// explicitly specifying the type
let user = updateUser<string>("Bob");

// type argument inference
let user = updateUser("Bob");
Обобщения позволяют нам отслеживать информацию о типе по всей функции. Это делает код гибким и пригодным для повторного использования без ущерба для точности типов.
Промежуточные вопросы для собеседования по TypeScript
Следующий набор вопросов должен проверить промежуточные знания кандидата о TypeScript и некоторых его широко используемых функциях.
1. Когда следует использовать unknownтип?
Знание различий между unknown и any и когда использовать, что важно при работе с TypeScript. unknown обычно является предпочтительным вариантом из-за более безопасного ввода. Как кандидат убедитесь, что вы можете объяснить, unknown для чего используется тип и как его использовать.
unknown — это особый тип, похожий на any. Например any, распространенный вариант использования этого unknown типа — это когда вы заранее не знаете точный тип. unknown переменные принимают любое значение. Однако при попытке оперировать переменной unknown TypeScript требует проверки типа или утверждения типа. Это различие unknown составляет
Давайте рассмотрим два примера, чтобы подчеркнуть различия между типами any и unknown .
Фрагмент ниже показывает допустимый код TypeScript, в котором вы можете передать любое значение в качестве callback параметра, и invokeCallback метод попытается его вызвать. Эта функция не выдает никаких ошибок времени компиляции, однако может привести к ошибке времени выполнения, когда вы передаете переменную, которую нельзя вызывать в качестве параметра callback .
invokeCallback(callback: any): void {
  callback();
}
Эквивалент unknown приведенного выше примера требует, чтобы вы добавили проверку типа перед вызовом callback функции. Дополнительная проверка типа предотвращает появление описанной выше ошибки времени выполнения.
invokeCallback(callback: unknown): void {
  if (typeof callback === 'function') {
    callback();
  }
}
Подводя итог, можно присвоить что угодно как типу, any так и unknown типу. Однако unknown типы требуют проверки типа или утверждения типа для выполнения любой операции над переменной.
2. Что такое noImplicitAnyи какова его цель?
Это вопрос о конфигурации TypeScript, который даст интервьюеру представление об уровне знакомства кандидата с настройкой проекта TypeScript. Хотя это только одно свойство из списка настраиваемых свойств TypeScript, оно noImplicitAny играет важную роль в крупных проектах.
noImplicitAny — это свойство в файле конфигурации проекта TypeScript ( tsconfig.json), которое изменяет способ обработки компилятором TypeScript неявных типов вашего проекта any . Флаг noImplicitAny может быть установлен как true, так и false, и его всегда можно изменить позже. Нет правильного ответа на вопрос, каким должно быть это значение, поскольку каждый проект индивидуален. Чтобы иметь возможность решить, на что должен быть установлен флаг, важно понимать разницу между тем, когда он включен, и когда он выключен.
Когда noImplicitAny флаг равен false (по умолчанию), компилятор не делает вывод о типе переменной на основе того, как она используется. Вместо этого компилятор по умолчанию устанавливает тип any.
С другой стороны, когда noImplicitAny флаг имеет значение true, компилятор попытается определить тип, выдав ошибку времени компиляции, если компилятор не сможет определить тип.
Установка noImplicitAny флага в значение true или false не мешает вам установить тип переменной в any.
3. Что такое условные типы в TypeScript?
Иногда тип переменной зависит от ее ввода. Условные типы помогают связать тип ввода и вывода — преобразование типа переменной на основе заданного условия. Условный тип — это важная функция TypeScript, которая помогает писать безопасный для типов код, подобный фреймворку, такой как границы API. Хотя кандидат может не использовать эту функцию напрямую каждый день, он может использовать ее косвенно при использовании кода из других фреймворков или библиотек.
Условные типы в TypeScript похожи на тернарные операторы. Как следует из названия, он присваивает тип переменной на основе условия.
Общее выражение для определения условного типа в TypeScript выглядит следующим образом:
A extends B ? X : Y
Тип X в приведенном выше фрагменте применяется, если переменная удовлетворяет условию, тогда как тип Y применяется, если переменная не соответствует. В приведенном выше примере тип X присваивается, если A расширяет B, а тип Y присваивается, если A не расширяется B.
4. В чем разница между типами объединения и пересечения?
Типы объединения и пересечения считаются расширенными типами в TypeScript. Понимание этого важно при создании типов в ваших проектах TypeScript, чтобы уменьшить дублирование типов. В идеале кандидат должен быть в состоянии объяснить, что такое типы объединения и пересечения, их различия и варианты использования.
Объединения и типы пересечения позволяют составлять и комбинировать существующие типы, а не создавать их с нуля. И объединение, и пересечение имеют свои уникальные характеристики, которые делают их идеальными для различных вариантов использования.
Тип объединения описывается как тип, который может быть одним из нескольких типов. Тип объединения использует | символ (вертикальная черта) для разделения списка типов, которые будут использоваться в новом типе. Давайте рассмотрим пример:
interface B {
  name: string,
  email: string
}

interface C {
  name: string,
  age: number
}

type A = B | C;
A в приведенном выше фрагменте может быть либо типа, B либо C. Основанный на интерфейсах B and s, может содержать and ( ) или and ( ), но не and .CAnameemailBnameageCemailage
При доступе к типу ATypeScript позволяет вам получить доступ только к свойствам, которые существуют в обоих B и C ( name), поскольку это единственные свойства, в существовании которых TypeScript может быть уверен.
С другой стороны, пересечение описывается как тип, который объединяет несколько типов в один, объединяя все свойства каждого типа для создания нового типа. Пересечение использует & символ для разделения списка типов, которые будут объединены. Давайте посмотрим на пример:
interface B {
  name: string,
  email: string
}

interface C {
  name: string,
  age: number
}

type A = B & C;
A в приведенном выше фрагменте будут содержать все свойства обоих B и C ( name, email, и age).
5. В чем разница между extendsи implementsв TypeScript?
Наследование является важным понятием в объектно-ориентированном программировании, особенно для полиморфизма и повторного использования кода. Есть два основных ключевых слова, которые TypeScript использует для наследования — extends и implements. Этот вопрос — шанс проверить наши знания о концепции наследования и о том, как это сделать в TypeScript.
Реализует и расширяет имеет различное использование. Давайте рассмотрим каждого человека и посмотрим на пример, чтобы сравнить их.
Когда класс расширяет другой класс, дочерний класс наследует все свойства и методы класса, который он расширяет. Вы можете переопределить любое из существующих свойств и методов его родителя и добавить новые.
Когда класс реализует другой класс или интерфейс, класс должен реализовать все методы и свойства реализованного класса или интерфейса. Ключевое implements слово действует как контракт, которому должен следовать класс, и TypeScript позаботится о том, чтобы класс имел ту же форму, что и класс или интерфейс, который он реализует.
Давайте рассмотрим пример класса и то, как другой класс может расширить и реализовать его.
class User {
  name: string;
  age: number;
}

// John will contain name and age from the User class
class John extends User {}

// this will result in an error as Bob doesn't have all the properties that
// the User class has
class Bob implements User {}

// This is valid as Mike satisfies the "contract" specified by the 
// User class
class Mike implements User {
  name = 'Mike';
  age = 25
}
Продвинутые вопросы на собеседовании по TypeScript
Следующий набор расширенных вопросов для интервью с Typescript должен проверить ваше глубокое знание TS и некоторых его концепций и функций более экспертного уровня.
1. Объясните, как необязательная цепочка работает в TypeScript.
Необязательная цепочка — это функция TypeScript, которая обеспечивает более безопасный и простой доступ к значениям внутри глубоких объектов. Понимание того, как и когда использовать эту функцию, поможет написать более лаконичный код (там, где это имеет смысл). Кандидат должен уметь объяснить, что такое необязательная цепочка, а также подробно рассказать о вариантах ее использования, плюсах и минусах.
Необязательная цепочка позволяет вам получить доступ к свойствам и методам, расположенным глубоко внутри объекта, без необходимости проверять действительность каждой ссылки в цепочке.
?.Необязательная цепочка использует в качестве оператора вопросительный знак, за которым следует точка ( ). TypeScript оценивает каждую ссылку в цепочке и выполняет нулевую или неопределенную проверку перед доступом к своим дочерним элементам. TypeScript немедленно останавливает выполнение, когда он не проходит проверку null или undefined, и возвращает значение undefined для всей цепочки.
Фрагмент кода ниже является примером доступа к свойству с использованием необязательной цепочки и без нее.
const user = {
  personalInfo: {
    name: 'John'
  }
}

// without optional chaining
const name = user && user.personalInfo && user.personalInfo.name || undefined;

// with optional chaining
const name = user?.personalInfo?.name;
2. Что такое абстрактные классы?
Абстрактный класс — еще одна особенность TypeScript, связанная с концепцией наследования в объектно-ориентированном программировании (ООП). Интервьюер может задать этот вопрос, чтобы получить представление о понимании кандидатом ООП и его более продвинутых функций в TypeScript.
Абстрактные классы определяют контракт для объектов без возможности их непосредственного создания. Однако абстрактный класс может также предоставлять сведения о реализации для своих членов.
Абстрактный класс содержит один или несколько абстрактных членов. Любые классы, которые расширяют абстрактный класс, затем должны будут предоставить реализацию для абстрактных членов суперкласса.
Давайте рассмотрим пример того, как абстрактный класс написан на TypeScript и как его можно расширить другим классом. В приведенном ниже примере оба Car и Bike расширяют Vehicle класс, однако каждый из них имеет различную реализацию метода drive() .
abstract class Vehicle {
abstract drive(): void;
  startEngine(): void {
    console.log('Engine starting...');
  }
}

class Car extends Vehicle {
  drive(): void {
    console.log('Driving in a car');
  }
}

class Bike extends Vehicle {
  drive(): void {
    console.log('Driving on a bike');
  }
}
Подробнее : 8 больших преимуществ работы из дома (руководство для удаленных разработчиков)
3. Что такое утверждения типа в TypeScript?
Утверждения Tpye — это способ сообщить TypeScript тип переменной. Поскольку типы широко используются в приложениях TypeScript, вы часто сталкиваетесь со сценариями, когда вам нужно указать более конкретный тип для переменной. Кандидат должен уметь объяснить не только что такое утверждения типов, но и их синтаксис и причины, по которым вы можете их использовать.
Утверждение типа позволяет вам явно установить тип значения и сообщить компилятору, чтобы он не выводил его. Это полезно, когда вы знаете тип объекта более конкретно, чем его текущий тип или текущий предполагаемый тип. В таких случаях вы можете использовать утверждения типа, чтобы указать TypeScript текущий тип переменной.
TypeScript предоставляет два синтаксиса для утверждений типа — as и <>.
// using the `as` keyword
const name: string = person.name as string;

// using `<>`
const name: string = <string>person.name;
Поскольку утверждения типа — это всего лишь способ сообщить компилятору TypeScript о типе переменной, за это в ваших проектах TypeScript не будет штрафа во время выполнения.
4. В чем разница между выводом типа и контекстной типизацией?
Вывод типов — это ключевая функция TypeScript, помогающая писать безопасный для типов код, менее подверженный ошибкам и более удобный для чтения. Интервьюер может задать этот вопрос, чтобы оценить понимание кандидатом как вывода типов TypeScript, так и его общего знакомства с системой типов TypeScript.
TypeScript может определить тип переменной, как правило, на основе инициализации или объявления переменной. Этот процесс известен как вывод типа .
Фрагмент ниже является примером вывода типа, когда TypeScript выводит тип name как «строку» на основе присвоенного ему значения.
let name = 'john'
Контекстная типизация — это подмножество вывода типа, где TypeScript использует местоположение или контекст переменной для вывода ее типа. Вы можете думать об этом как о выводе типов в противоположном направлении.
В приведенном ниже фрагменте TpyeScript использует информацию из onmousedown функции для определения типа mouseEvent параметра.
window.onmousedown = function(mouseEvent) {
   console.log(mouseEvent.button);   // OK
   console.log(mouseEvent.person);   // Error
};
5. Как перегрузки функций работают в TypeScript?
howПерегрузка функций помогает сделать функции более гибкими и пригодными для повторного использования, позволяя одной и той же функции вести себя по-разному в зависимости от переданного набора входных данных. аспект повторного использования кода и любые другие преимущества, которые он предоставляет.
Перегрузка функции — это когда одно и то же имя функции используется несколько раз с другим набором аргументов — количеством аргументов, типов или возвращаемых типов.
Давайте рассмотрим пример того, как print функция может принимать несколько типов в качестве своего параметра, используя перегрузку функций.
print(message: string): void;
print(message: string[]): void;

print(message: unknown): void {if (typeof message === 'string') {
    console.log(message);
  } else if (Array.isArray(message)) {
    message.forEach((individualMessage) => {
      console.log(individualMessage);
    });
  } else {
    throw new Error('unable to print');
  }
}
Основываясь на приведенном выше фрагменте кода, теперь мы можем вызвать print передачу либо одной строки сообщения, либо массива строк сообщения.
print('Single message');
// Console Output:
// Single message

print(['First message', 'Second message']);
// Console Output
// First message
// Second message
Помимо возможности повторного использования функции, перегрузка функций также поддерживает автозаполнение. При вызове функции (в зависимости от вашей IDE) вам будет предоставлен список всех возможных перегрузок, которые вы можете выбрать для своего конкретного варианта использования, что улучшит процесс разработки.


1. Что такое TypeScript и чем он отличается от JavaScript?
TypeScript - это язык программирования, который является надмножеством JavaScript. Он добавляет статическую типизацию и некоторые другие возможности, которых нет в JavaScript.

Основное отличие TypeScript от JavaScript заключается в следующем:

Статическая типизация: TypeScript позволяет указывать типы переменных, параметров функций и возвращаемых значений. В JavaScript типы определяются динамически во время выполнения.

Поддержка классов и модулей: TypeScript поддерживает классы, интерфейсы и модули, что делает код более структурированным и удобным для организации больших проектов. JavaScript имеет ограниченную поддержку классов и модулей.

Дополнительные возможности: TypeScript предоставляет дополнительные возможности, такие как перечисления (enums), кортежи (tuples), типы-алиасы (type aliases) и другие. Это позволяет разработчикам писать более выразительный и понятный код.

Компиляция: TypeScript код компилируется в JavaScript, поэтому он может быть исполнен в любом совместимом с JavaScript окружении. Компилятор TypeScript проверяет синтаксис и типы на этапе компиляции, что помогает выявить ошибки до запуска программы.

2. Какие есть недостатки TypeScript?
Несмотря на множество преимуществ, TypeScript также имеет некоторые недостатки:

Кривая обучения: TypeScript вводит новые концепции и синтаксис, которые могут быть незнакомыми для разработчиков, привыкших к JavaScript. Это может потребовать времени и усилий для изучения и приспособления к новому языку.

Ограничения JavaScript: TypeScript является надмножеством JavaScript и стремится быть обратно совместимым. Однако, иногда некоторые особенности JavaScript могут быть сложнее или невозможно выразить в TypeScript. Это может создать некоторые ограничения при использовании некоторых библиотек или функциональностей JavaScript.

Дополнительные ресурсы: TypeScript требует наличия компилятора TypeScript для преобразования кода в JavaScript. Это означает, что вам нужно установить и поддерживать компилятор TypeScript, чтобы использовать язык. Это может потребовать дополнительных ресурсов и увеличить сложность проекта.

3. Расскажите про компилятор TypeScript.
Компилятор TypeScript (tsc) преобразует код TypeScript в JavaScript, который может быть выполнен в любой среде, поддерживающей JavaScript. Это позволяет использовать преимущества TypeScript на этапе разработки, а затем получить JavaScript-код, который может работать на любой платформе, поддерживающей JavaScript.

4. Перечислите встроенные типы в TypeScript.
В TypeScript существует несколько встроенных типов. Вот некоторые из них:

number - числовой тип переменной;

string - тип переменной, представляющей строку текста;

boolean - логический тип переменной, принимающий значения true или false;

array - тип переменной, представляющей массив значений. Может быть записан как тип[] или Array<тип>;

tuple - тип переменной, представляющей кортеж (упорядоченный набор элементов разных типов);

enum - тип-перечисление, позволяющий определять набор именованных значений;

any - тип переменной, который может принимать значения любого типа;

void - тип, используемый для объявления функций, которые не возвращают значения;

null и undefined - типы переменных, которые могут принимать значения null или undefined;

5. Поддерживаются ли все принципы ООП в TypeScript?
TypeScript полностью совместим с принципами объектно-ориентированного программирования (ООП).

Инкапсуляция: TypeScript поддерживает инкапсуляцию путем использования модификаторов доступа, таких как public, private и protected, для ограничения доступа к членам класса.

Наследование: TypeScript поддерживает наследование, позволяя классам наследовать свойства и методы от других классов с помощью ключевого слова extends.

Полиморфизм: TypeScript поддерживает полиморфизм, что означает, что объекты одного класса могут быть использованы вместо объектов другого класса, если они наследуются от одного и того же базового класса или реализуют один и тот же интерфейс.

Абстракция: TypeScript позволяет создавать абстрактные классы и методы с помощью ключевых слов abstract. Абстрактные классы не могут быть инстанциированы напрямую, а их методы должны быть реализованы в производных классах.

Полноценные классы: TypeScript поддерживает создание классов с конструкторами, методами, свойствами и статическими членами.

Интерфейсы: TypeScript поддерживает интерфейсы, которые определяют контракт для классов, указывая, какие методы и свойства должны быть реализованы. Классы могут реализовывать один или несколько интерфейсов.

Перегрузка методов: TypeScript позволяет определять несколько версий метода с разными параметрами и типами входных и выходных данных.

Хотя TypeScript поддерживает принципы ООП, важно отметить, что TypeScript все еще является расширением JavaScript, и некоторые концепции ООП могут иметь некоторые отличия от традиционных языков, таких как Java или C++.

6. Что такое интерфейс в TypeScript?
В TypeScript интерфейс представляет собой описание структуры объекта. Он определяет, какие свойства и методы должны присутствовать в объекте, а также их типы.

Интерфейсы используются для установления контракта между различными частями кода. Они облегчают работу в команде, поскольку позволяют определить ожидаемую структуру данных, которую должен реализовывать объект.

Пример:

interface Person {
  name: string;
  age: number;
  greet: () => void;
}
Объяснить с
Что классно, то что если объект, соответствующий этому интерфейсу, должен иметь все перечисленные свойства и методы соответствующих типов. Если объект не соответствует интерфейсу, TypeScript выдаст ошибку. Интерфейсы могут быть также использованы для определения типов переменных и функций.

7. Различие между классами и интерфейсами в TypeScript?
В TypeScript классы и интерфейсы используются для определения структуры и поведения объектов, но они имеют разные цели. Вот основные различия между классами и интерфейсами:

В TypeScript классы и интерфейсы используются для определения структуры и поведения объектов, но они имеют разные цели. Вот основные различия между классами и интерфейсами:

Классы:
Классы используются для определения объектов с состоянием (переменные-члены) и поведением (методы).

Они могут иметь конструкторы для инициализации объектов.

Классы поддерживают наследование, что позволяет создавать иерархию наследования и расширять функциональность.

Они могут содержать методы доступа (геттеры и сеттеры) для обеспечения контроля доступа к переменным-членам.

Классы могут быть инициализированы с использованием оператора new, что позволяет создавать экземпляры объектов.

Интерфейсы:
Интерфейсы используются в основном для определения типов данных или контрактов.

Они определяют только структуру объекта, но не содержат реализацию методов или инициализацию переменных-членов.

Интерфейсы не поддерживают наследование. Они могут наследовать другие интерфейсы, но не классы.

Используя интерфейсы, можно определить общие типы данных, которые объекты должны реализовывать.

Интерфейсы обеспечивают возможность множественного наследования типов, позволяя объекту реализовать несколько интерфейсов одновременно.

8. Чем различаются ключевые слова interface и type в TypeScript?
Основные различия между interface и type в TypeScript:

Расширение: Интерфейсы могут быть расширены другими интерфейсами, в то время как типы могут быть объединены с помощью оператора &.

Реализация: Интерфейсы могут быть реализованы классами, в то время как типы не могут быть непосредственно реализованы.

Объединение типов: Типы могут быть объединены с помощью оператора |, что позволяет создавать объединение типов.

Возможности: Интерфейсы обладают некоторыми дополнительными возможностями, такими как объявление методов и наследование интерфейсов.

9. Что такое модули в TypeScript?
В TypeScript модули представляют иерархическую организацию кода, разделяющую его на логические части. Они обеспечивают изоляцию кода и упрощают его повторное использование, управление зависимостями и поддержку больших проектов.

Модули в TypeScript могут быть созданы с помощью ключевых слов import и export. Ключевое слово export позволяет сделать переменные, функции или классы видимыми для других модулей, тогда как import используется для импорта экспортируемых значений из других модулей.

Пример использования модулей в TypeScript:

// Модуль A
export const greeting = "Hello, world!";
export function sayHello() {
  console.log(greeting);
}
// Модуль B
import { greeting, sayHello } from './moduleA';
console.log(greeting); // Выводит "Hello, world!"
sayHello(); // Выводит "Hello, world!"
Объяснить с
Модули также могут иметь директиву export default, которая позволяет экспортировать только одно значение по умолчанию из модуля. Это полезно, когда вы хотите экспортировать только одну сущность из модуля.

10. Как вызвать конструктор базового класса из дочернего класса в TypeScript?
В TypeScript вы можете вызвать конструктор базового класса из дочернего класса с помощью ключевого слова super(). Это позволяет инициализировать унаследованные свойства и выполнить любую логику, присутствующую в конструкторе базового класса.

Пример:

class BaseClass {
  constructor(baseProp: string) {
    console.log("Конструктор базового класса вызван с параметром", baseProp);
  }
}

class ChildClass extends BaseClass {
  constructor(baseProp: string, childProp: number) {
    super(baseProp); // Вызов конструктора базового класса
    console.log("Конструктор дочернего класса вызван с параметром", childProp);
  }
}

const childObj = new ChildClass("Значение базового свойства", 42);
Объяснить с
11. Что такое геттеры и сеттеры?
В TypeScript геттеры (getters) и сеттеры (setters) - это специальные методы, которые позволяют получать и устанавливать значения свойств класса соответственно. Они предоставляют контроль над доступом к свойствам и позволяют выполнять дополнительные действия при получении или установке значений.

Геттеры и сеттеры определяются с использованием ключевых слов get и set перед именем метода.

Пример:

class Person {
  private _name: string;

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }
}

let person = new Person();
person.name = "John"; // Установка значения с помощью сеттера
console.log(person.name); // Получение значения с помощью геттера
Объяснить с
Геттеры и сеттеры могут быть полезными, когда необходимо добавить дополнительную логику при доступе к свойству. Например, можно добавить проверки на корректность входных данных или выполнить дополнительные действия при установке значения.

class Circle {
  private _radius: number;

  get radius(): number {
    return this._radius;
  }

  set radius(value: number) {
    if (value >= 0) {
      this._radius = value;
    } else {
      throw new Error("Радиус не может быть отрицательным");
    }
  }
}

let circle = new Circle();
circle.radius = 10; // Установка корректного значения
console.log(circle.radius); // Получение значения
circle.radius = -5; // Вызовет ошибку
Объяснить с
12. Поддерживает ли TypeScript перегрузку функций?
Да, TypeScript поддерживает перегрузку функций. Компилятор TypeScript будет использовать соответствующую версию функции в зависимости от переданных аргументов.

Пример:

function combine(a: string, b: string): string;
function combine(a: number, b: number): number;
function combine(a: any, b: any): any {
  return a + b;
}

let result1 = combine("Hello", "World");// result1 будет иметь тип string
let result2 = combine(5, 10);// result2 будет иметь тип number
Объяснить с
13. Можно ли создать только для чтения (read-only) массивы в TypeScript?
В TypeScript можно создать только для чтения (read-only) массивы с помощью типа ReadonlyArray<T>. Этот тип предоставляет гарантию, что массив не может быть изменен после его инициализации.

Использование типа ReadonlyArray<T>:

let readonlyArr: ReadonlyArray<number> = [1, 2, 3];
Объяснить с
Использование типа readonly T[]:

let readonlyArr: readonly number[] = [1, 2, 3];
Объяснить с
14. В чем разница между типами объединения и пересечения?
В TypeScript есть два основных способа для комбинирования типов: тип объединения (union type) и тип пересечения (intersection type).

Тип объединения (Union Type):

Обозначается символом |.

Позволяет объединять несколько типов в один.

Значение переменной с типом объединения может быть одним из указанных типов.

Можно применять операции и методы, общие для всех типов в объединении.

Применяется, когда значение может быть одним из нескольких типов.

Пример использования типа объединения:

let value: string | number;
value = "Hello"; // Допустимо
value = 10; // Допустимо
value = true; // Ошибка компиляции
Объяснить с
Тип пересечения (Intersection Type):

Обозначается символом &.

Позволяет создавать новый тип, который объединяет свойства и методы из нескольких типов.

Значение переменной с типом пересечения должно удовлетворять всем указанным типам.

Можно использовать свойства и методы, объединенные из различных типов.

Применяется, когда значение должно удовлетворять нескольким типам одновременно.

Пример использования типа пересечения:

type Person = {
  name: string;
  age: number;
};

type Employee = {
  company: string;
  position: string;
};

type EmployeePerson = Person & Employee;

let employee: EmployeePerson = {
  name: "John",
  age: 30,
  company: "ABC Corp",
  position: "Manager"
};
Объяснить с
В целом, тип объединения используется, когда значение может быть одним из нескольких типов, а тип пересечения используется, когда значение должно удовлетворять нескольким типам одновременно и иметь их свойства и методы.

15. В чем разница между extends и implements в TypeScript?
В TypeScript ключевые слова extends и implements используются для определения отношений между классами и интерфейсами.

extends:

Используется для создания наследования между классами.

Класс может расширять только один другой класс.

Позволяет наследовать свойства и методы базового класса.

Можно переопределить методы базового класса в производном классе.

Можно добавить новые свойства и методы в производный класс.

class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  makeSound() {
    console.log("Animal makes sound");
  }
}

class Dog extends Animal {
  makeSound() {
    console.log("Dog barks");
  }
}

let dog = new Dog("Buddy");
dog.makeSound(); // Выводит "Dog barks"
Объяснить с
implements:

Используется для определения, что класс или объект должен реализовывать определенный интерфейс.

Класс может реализовывать несколько интерфейсов.

Обязывает класс реализовать все методы и свойства, указанные в интерфейсе.

Не поддерживает наследование свойств и методов.

interface Printable {
  print(): void;
}

class Book implements Printable {
  print() {
    console.log("Printing book");
  }
}

let book = new Book();
book.print(); // Выводит "Printing book"
Объяснить с
16. Что такое абстрактные классы?
Абстрактные классы - это классы, которые не могут быть созданы напрямую, а служат только в качестве базовых классов для других классов. Они предоставляют общую реализацию и определение методов, которые могут быть переопределены в производных классах.

В TypeScript абстрактные классы обозначаются с помощью ключевого слова abstract перед объявлением класса. Они могут содержать абстрактные методы, которые не имеют реализации в базовом классе, а должны быть реализованы в производных классах.

abstract class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract makeSound(): void;
}

class Dog extends Animal {
  makeSound() {
    console.log("Dog barks");
  }
}

let dog = new Dog("Buddy");
dog.makeSound(); // Выводит "Dog barks"
Объяснить с
17. Что такое Type Assertions в TypeScript?
Type Assertions в TypeScript позволяют программисту явно указывать компилятору тип данных переменной, когда компилятор не может определить тип автоматически. Утверждения типа позволяют программисту переопределить тип переменной и сообщить компилятору, что программа знает, какой тип данных она ожидает.

С помощью угловых скобок (<тип>):

let someValue: any = "Hello, world!";
let strLength: number = (<string>someValue).length;
Объяснить с
С помощью ключевого слова as:

let someValue: any = "Hello, world!";
let strLength: number = (someValue as string).length;
Объяснить с
Важно отметить, что утверждения типа не изменяют фактический тип переменной во время выполнения. Они используются только на этапе компиляции для подсказки компилятору о типе данных переменной. Поэтому необходимо быть осторожным при использовании утверждений типа и убедиться, что тип, указанный в утверждении, соответствует фактическому типу данных переменной.

18. Для чего используется оператор keyof?
Оператор keyof в TypeScript используется для получения объединения строковых литералов, представляющих имена свойств объекта. Он позволяет получить тип, который содержит все возможные имена свойств объекта.

Синтаксис использования оператора keyof выглядит следующим образом:

type Keys = keyof SomeType;

type Person = {
  name: string;
  age: number;
  email: string;
};

type PersonKeys = keyof Person; // 'name' | 'age' | 'email'
Объяснить с
19. Какие Модификаторы Доступа Поддерживает TypeScript?
TypeScript поддерживает следующие модификаторы доступа для классов и их членов:

public: Это является модификатором доступа по умолчанию и означает, что член класса доступен из любого места в коде.

class MyClass {
  public myProperty: string;

  public myMethod() {
    // ...
  }
}
Объяснить с
private: Этот модификатор ограничивает доступ к члену класса только внутри самого класса. Члены, объявленные как private, не могут быть доступны извне класса.

class MyClass {
  private myProperty: string;

  private myMethod() {
    // ...
  }
}
Объяснить с
protected: Этот модификатор позволяет доступ к члену класса внутри самого класса и его подклассов. Члены, объявленные как protected, не могут быть доступны извне класса или его экземпляров.

class MyBaseClass {
  protected myProperty: string;

  protected myMethod() {
    // ...
  }
}

class MyDerivedClass extends MyBaseClass {
  constructor() {
    super();
    this.myProperty = 'value'; // Доступно в подклассе
  }
}
Объяснить с
readonly: Этот модификатор позволяет только чтение значения свойства. Оно может быть установлено только во время инициализации или в конструкторе класса.

class MyClass {
  readonly myProperty: string;

  constructor() {
    this.myProperty = 'value'; // Можно установить только здесь
  }

  updateProperty() {
    this.myProperty = 'new value'; // Ошибка компиляции: свойство только для чтения
  }
}
Объяснить с
static: Этот модификатор позволяет создавать статические члены класса, которые принадлежат самому классу, а не его экземплярам. Статические члены могут быть доступны без создания экземпляра класса.

class MyClass {
  static myStaticProperty: string;

  static myStaticMethod() {
    // ...
  }
}

MyClass.myStaticProperty = 'value'; // Доступно без создания экземпляра класса
MyClass.myStaticMethod(); // Доступно без создания экземпляра класса
Объяснить с
20. Что такое Generics?
В TypeScript generics позволяют создавать параметризованные типы, которые могут быть использованы для создания переиспользуемых компонентов (функции, классы).

function identity<T>(arg: T): T {
  return arg;
}

let result = identity<string>("Hello, TypeScript!");
console.log(result); // Output: Hello, TypeScript!

// Тип возвращаемого значения выводится автоматически
let result2 = identity(42);
console.log(result2); // Output: 42
Объяснить с
Еще немного примеров.

Функция для вывода длины массива:

function getArrayLength<T>(arr: T[]): number {
  return arr.length;
}

let numbers = [1, 2, 3, 4];
let length = getArrayLength(numbers); 
console.log(length); // Output: 4

let strings = ["Hello", "World"];
length = getArrayLength(strings);
console.log(length); // Output: 2
Объяснить с
класс для создания стека

class Stack<T> {
  private items: T[] = [];

  push(item: T) {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }
}

let stack = new Stack<number>();
stack.push(1);
stack.push(2);
stack.push(3);

console.log(stack.pop()); // Output: 3
console.log(stack.pop()); // Output: 2

let stringStack = new Stack<string>();
stringStack.push("Hello");
stringStack.push("World");

console.log(stringStack.pop()); // Output: World
console.log(stringStack.pop()); // Output: Hello
Объяснить с
интерфейс для сравнения объектов:

interface Comparable<T> {
  compareTo(other: T): number;
}

class Person implements Comparable<Person> {
  constructor(public name: string, public age: number) {}

  compareTo(other: Person): number {
    return this.age - other.age;
  }
}

let person1 = new Person("Alice", 25);
let person2 = new Person("Bob", 30);
console.log(person1.compareTo(person2)); // Output: -5
Объяснить с
21. Ограничения и наследования generics.
В TypeScript можно применять ограничения (constraints) и использовать наследование для более точного управления доступными типами в generics. Использование ограничений позволяет указать, что тип, переданный в generics, должен удовлетворять определенным условиям.

Ограничение по типу через extends:

interface Animal {
  name: string;
}

function getAnimalName<T extends Animal>(animal: T): string {
  return animal.name;
}

let cat = { name: "Whiskers", color: "gray" };
let catName = getAnimalName(cat); // ОК, так как cat имеет свойство `name`
console.log(catName); // Output: Whiskers

let car = { brand: "Tesla", model: "Model 3" };
let carName = getAnimalName(car); // Ошибка, так как car не имеет свойства `name`
Объяснить с
Ограничение по типу с использованием операции keyof:

interface Person {
  name: string;
  age: number;
}

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

let person: Person = { name: "Alice", age: 25 };
let name = getProperty(person, "name"); // ОК, так как у person есть свойство "name"
console.log(name); // Output: Alice

let age = getProperty(person, "age"); // ОК, так как у person есть свойство "age"
console.log(age); // Output: 25

let job = getProperty(person, "job"); // Ошибка, так как у person нет свойства "job"
Объяснить с
Наследование generics:

class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Cat extends Animal {
  meow() {
    console.log(`${this.name} says meow!`);
  }
}

function printAnimalName<T extends Animal>(animal: T) {
  console.log(animal.name);
}

let cat = new Cat("Whiskers");
printAnimalName(cat); // ОК, так как Cat является подтипом Animal
cat.meow(); // Output: Whiskers says meow!
Объяснить с
22. Что такое Mixins?
Mixins в TypeScript представляют собой способ комбинирования функциональности из нескольких классов в один класс. Они позволяют переиспользовать код и добавлять поведение к классам без необходимости наследования от нескольких базовых классов.

Для создания Mixins в TypeScript можно использовать комбинацию наследования и миксиновых функций. Миксиновая функция - это функция, которая принимает класс в качестве аргумента и возвращает расширенную версию этого класса.

Пример:

// Миксиновая функция
function Printable(target: any) {
  target.prototype.print = function() {
    console.log(this);
  };
}

// Базовый класс
class Person {
  constructor(public name: string) {}
}

// Применение миксина к классу
const PrintablePerson = Printable(Person);

// Создание экземпляра класса с добавленным поведением миксина
const person = new PrintablePerson("John");
person.print(); // Выводит объект person в консоль
Объяснить с
23. Для чего используются Enum?
Enum (перечисление) в TypeScript - это специальный тип данных, который позволяет определить набор именованных констант. Перечисления представляют собой удобный способ задания ограниченного набора значений, которые могут быть использованы в коде.

Вот пример определения и использования перечисления в TypeScript:

enum Color {
  Red,
  Green,
  Blue,
}

let myColor: Color = Color.Green;
console.log(myColor); // Выводит 1

if (myColor === Color.Green) {
  console.log("The color is green");
}
Объяснить с
24. Расскажите про условные типы (conditional types) в TypeScript.
Условные типы (conditional types) в TypeScript - это мощный механизм, который позволяет создавать типы, зависящие от условий и других типов. Они позволяют нам задавать условия и определять типы на основе этих условий.

Условные типы используют ключевое слово infer, которое позволяет нам "выводить" типы на основе заданных условий. Они часто используются в комбинации с условными операторами extends и ?.

Пример:

type TypeName<T> =
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends undefined ? "undefined" :
  "object";

let name1: TypeName<string> = "string";
let name2: TypeName<number> = "number";
let name3: TypeName<boolean> = "boolean";
let name4: TypeName<undefined> = "undefined";
let name5: TypeName<object> = "object";
Объяснить с
25. Чем отличается any never unknown
any, never и unknown - это три разных типа в TypeScript, каждый из которых имеет свои особенности и использование.

any: Тип any представляет отсутствие статической типизации. Переменные с типом any могут принимать значения любого типа, и компилятор TypeScript не будет проверять типы во время компиляции. Использование any позволяет обойти проверку типов, но также уменьшает безопасность и надежность кода.

let variable: any = 5;
variable = "Hello";
variable = true;
Объяснить с
never: Тип never представляет недостижимое значение. Он используется для указания, что функция никогда не возвращает значение или что переменная не может иметь никакого значения. Например, функция, которая всегда вызывает ошибку или бесконечный цикл, будет иметь тип never. Тип never также используется в контексте обработки ошибок или в ситуациях, когда программа не может продолжить свое выполнение.

function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {
    // Бесконечный цикл
  }
}
Объяснить с
unknown: Тип unknown представляет значение, о типе которого мы ничего не знаем. Переменные с типом unknown могут хранить значения любого типа, но мы не можем выполнять над ними операции без явного приведения типов или проверки типов. unknown является более безопасной альтернативой типу any, так как требует явного приведения типов перед использованием.

function processValue(value: unknown): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else {
    return "Unknown value";
  }
}

let result1 = processValue("hello"); // Возвращает "HELLO"
let result2 = processValue(10); // Возвращает "Unknown value"
Объяснить с
В целом, any предоставляет полную гибкость, но уменьшает безопасность типов. never используется для недостижимых значений или ситуаций, когда программа не может продолжить выполнение. unknown представляет неизвестные типы, требует явного приведения типов и обеспечивает большую безопасность типов, чем any.

26. Что такое Mapped types?
В TypeScript вы можете использовать отображаемые типы (mapped types) для создания новых типов на основе существующих типов. Они позволяют вам применять определенные преобразования к свойствам существующего типа и создавать новый тип с обновленными свойствами.

Основной синтаксис для создания отображаемых типов выглядит следующим образом:

type NewType = { [Property in ExistingType]: NewValueType };

type Person = {
  name: string;
  age: number;
};

type UpdatedPerson = {
  [Property in keyof Person]: Property extends 'name' ? string : number;
};

const person: UpdatedPerson = {
  name: 'John',
  age: 25,
};
Объяснить с
27. Что такое декораторы?
Декораторы в TypeScript - это специальные функции, которые могут использоваться для изменения классов, методов, свойств и параметров функций во время их объявления. Они предоставляют возможность добавлять метаданные и расширять функциональность существующих элементов кода без изменения их исходного определения.

Декораторы обычно применяются с использованием символа @ перед объявлением элемента кода, к которому они применяются. Они могут быть применены к классам, методам, свойствам и параметрам функций.

Декоратор класса:

function logClass(target: any) {
  console.log('Class decorator');
}

@logClass
class MyClass {
  // ...
}
Объяснить с
Декоратор метода:

function logMethod(target: any, key: string, descriptor: PropertyDescriptor) {
  console.log('Method decorator');
}

class MyClass {
  @logMethod
  myMethod() {
    // ...
  }
}
Объяснить с
Декоратор свойства:

function logProperty(target: any, key: string) {
  console.log('Property decorator');
}

class MyClass {
  @logProperty
  myProperty: string;
}
Объяснить с
Декоратор параметра функции:

function logParameter(target: any, key: string, index: number) {
  console.log('Parameter decorator');
}

class MyClass {
  myMethod(@logParameter param: string) {
    // ...
  }
}
Объяснить с
28. Что такое утилиты в TypeScript
Утилиты в TypeScript - это набор предопределенных обобщенных типов, предоставляемых самим языком TypeScript. Они предназначены для облегчения работы с типами и предоставляют различные полезные функциональности.

Некоторые из наиболее распространенных утилит в TypeScript включают:

Partial<T>: Создает тип, который делает все свойства типа T необязательными. Это позволяет создавать новые типы, частично определенные на основе существующих типов.

interface Person {
  name: string;
  age: number;
}

const partialPerson: Partial<Person> = {
  name: 'John',
};
Объяснить с
Required<T>: Создает тип, который делает все свойства типа T обязательными. Это полезно, когда вы хотите указать, что все свойства должны быть определены.

interface Person {
  name?: string;
  age?: number;
}

const requiredPerson: Required<Person> = {
  name: 'John',
  age: 25,
};
Объяснить с
Readonly<T>: Создает тип, который делает все свойства типа T доступными только для чтения. Это предотвращает изменение свойств объекта после его инициализации.

interface Person {
  name: string;
  age: number;
}

const readonlyPerson: Readonly<Person> = {
  name: 'John',
  age: 25,
};

readonlyPerson.name = 'Jane'; // Ошибка компиляции: свойство доступно только для чтения
Объяснить с
Record<K, T>: Создает тип, который представляет объект с ключами типа K и значениями типа T. Это полезно, когда вы хотите создать объект с определенными ключами и значениями.

const fruits: Record<string, number> = {
  apple: 5,
  banana: 3,
};
Объяснить с
Pick<T, K>: Создает тип, который выбирает только указанные свойства K из типа T. Это позволяет создавать новые типы, содержащие только необходимые свойства.

interface Person {
  name: string;
  age: number;
  email: string;
}

const pickedPerson: Pick<Person, 'name' | 'email'> = {
  name: 'John',
  email: 'john@example.com',
};
Объяснить с
Утилиты в TypeScript облегчают работу с типами, позволяя создавать новые типы на основе существующих и применять различные преобразования. Они помогают улучшить типобезопасность и повысить понятность кода.

29. Что представляют собой .map-файлы в TypeScript?
Файлы с расширением .map в TypeScript представляют собой файлы карты (source map files), которые создаются вместе с скомпилированным JavaScript кодом. Они содержат информацию о соответствии между исходным кодом TypeScript и соответствующим скомпилированным JavaScript кодом.

Карты (source maps) являются инструментом отладки, который позволяет разработчикам отслеживать и отлаживать исходный код TypeScript в инструментах разработчика браузера или других инструментах, которые работают с JavaScript кодом.

Когда TypeScript компилируется в JavaScript, вместе с скомпилированным кодом генерируется файл карты .map. Этот файл содержит информацию о соответствии между строками исходного кода TypeScript и строками скомпилированного JavaScript кода. Это включает информацию о файлах, именах функций, позициях исходного кода и других сопутствующих данных.

При отладке в инструментах разработчика, таких как DevTools в браузере, используя файл карты .map, можно просматривать и отлаживать исходный код TypeScript, а не только скомпилированный JavaScript код. Это значительно упрощает процесс отладки и позволяет разработчикам легко идентифицировать ошибки и проблемы в исходном коде.

Важно отметить, что файлы карты .map не должны быть развернутыми в продакшене, так как они содержат информацию о исходном коде, которая может быть использована злоумышленниками для изучения вашего кода. Поэтому рекомендуется исключить файлы карты .map из конечного билда или опубликованного кода.

На этом все. Надеюсь, эти вопросы и ответы помогут вам в подготовке к техническому собеседованию. Еще у TypeScript есть хорошая дока, почитать можно здесь.

Подписывайтесь на мой канал, там тоже стараюсь выкладывать интересную информацию.

Удачи ✨

Теги:javatypescripttypeсобеседованиесобеседование вопросысобеседование в itразработка
Хабы:JavaScriptAngularReactJSTypeScript
+9

167

14
+14

15
Карма
@altrapeznikov
Fronted Developer в Сбере

Подписаться
Комментарии 14



Spaceoddity
11 янв 2024 в 08:25
В недостатки внесите так же возню с проставлением типов (порой совсем не тривиальную).





mclander
11 янв 2024 в 08:35
Огонь! Всё по полочкам.

Но меня бы сильно насторожил работодатель, который начал бы такой формальный опрос)





altrapeznikov
11 янв 2024 в 08:57
Я обычно по ts спрашиваю три любых вопроса из этого списка )





persii
11 янв 2024 в 09:42
Спасибо за хороший обзорный материал;

однако же кое в чём есть сомнения.




MarineEngineer
11 янв 2024 в 11:01
Отличная подборка, автору благодарность.

В 7ом пункте задвоилось начало.





Safort
11 янв 2024 в 11:54
Не очень. Если материал именно про TS, то половину статьи можно удалить. Всё перемешано, вы часто тут представляете фичи JS как фичи TS. Да и иногда старый синтаксис используете (private vs #).

Вот с ходу в том, что описано в

9. Что такое модули в TypeScript?

10. Как вызвать конструктор базового класса из дочернего класса в TypeScript?

11. Что такое геттеры и сеттеры?

Это же вы по сути JS и описываете? Только в геттерах зачем-то пример с ключевым словом private, хотя пожно было обойтись более коротким #.

19. Какие Модификаторы Доступа Поддерживает TypeScript?

public, private, protected, readonly - ок, это именно из TS, но static тут причём? И почему тогда забыли про модификатор # ? Раз уж всё равно смешиваете оба языка.

28. Что такое декараторы?

Вы используете у себя депрекейтнутые декораторы TS? Иначе зачем про это вообще страшивать. Или тут всё таки про JS-декораторы говорится?





Notactic
15 янв 2024 в 08:48
Когда работаешь только с ts долгие годы, напрочь забываешь о голом js, вероятно вот всё и смешалось. В целом, ответы на вопросы интервьювера вполне корректные. Или как минимум, я бы такие ответы принял и не особо вдавался в подробности :D





movl
11 янв 2024 в 13:47
Про пункт отличия типов и интерфейсов

Реализация: Интерфейсы могут быть реализованы классами, в то время как типы не могут быть непосредственно реализованы.

Если речь про implements, то типы могут быть реализованы в виде класса с некоторыми ограничениями.

Объединение типов: Типы могут быть объединены с помощью оператора |, что позволяет создавать объединение типов.

Объединение интерфейсов ничем не отличается от объединения типов, но на выходе, да, получится тип, вместо интерфейса.

Возможности: Интерфейсы обладают некоторыми дополнительными возможностями, такими как объявление методов и наследование интерфейсов.

Ничто не мешает объявить метод внутри типа.

Касательно наследования и расширения, из данного описания как-будто это суть одного и того же:

interface Foo {}
interface Bar extends Foo {}
Foo расширяет Bar

Bar наследует Foo

Но как и в случае с классами, интерфейс может быть расширен типом или унаследован от типа, с некоторыми ограничениями. Примеры.

В основное отличие я бы выделил возможность расширения одного и того же интерфейса, за счет множественного объявления. А дальше уже начинаются различные тонкости.





We’ll cover a range of topics, including:

Key features of TypeScript
Differences between TypeScript and JavaScript
Integrating TypeScript with other tools and libraries
Type checking and type annotations
Interfaces, classes, and inheritance
Modules and namespaces
Decorators
Generics
Async/await
let and const
var and let
any and unknown
null and undefined
void and never
Type inference
So, let’s get started and see what you know about TypeScript!

TypeScript Interview Questions [2023] | In-Depth Explanation

1. What is TypeScript and why use it?
TypeScript makes your code more serviceable and extensible and provides better tool and editor support.

2. What are the main features of TypeScript?
Static typing
Interfaces
Classes and inheritance
Modules
Namespaces
Decorators
Generics
Async/await
3. How is TypeScript different from JavaScript?
TypeScript also has a stricter type system, allowing errors to be detected at compile time rather than runtime.

4. How does TypeScript integrate with other tools and libraries?
TypeScript code can be compiled into plain JavaScript, making it compatible with any environment that supports JavaScript.

Become an Expert in Typescript: Learn How to Answer Any TypeScript Interview Question with Depth Explanation.

5. How does TypeScript perform type checking?
TypeScript’s type system is optional, so developers can use it however they like.

6. What is the TypeScript interface?
Interfaces can be used to make code reusable and compact or to make code more readable by making the intent of the code clearer.

7. What are TypeScript classes? How are they different from JavaScript classes?
Classes in TypeScript are syntactic sugars over JavaScript’s prototypes and are translated into JavaScript’s constructor functions.

Typescript Interview Questions For Freshers

8. How do you define a class in TypeScript?
Here is an example:

class Person {
  constructor(public name: string) {}  greet() {
    console.log(`Hello, my name is ${this.name}`);
  }
}
9. What are TypeScript modules and why use them?
10. How do you define and import/export modules in TypeScript?
Here is an example:

// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// main.ts
import { add } from './math';

console.log(add(1, 2)); // 3
11. What are TypeScript namespaces? How is it different from modules?
Namespaces allow code to be grouped under common names, thus avoiding name conflicts. However, in TypeScript, namespaces are not as commonly used as modules.

Because modules provide more functionality and are suitable for large projects.

12. How do you define and use namespaces in TypeScript?
You can add code to namespaces using declaration keywords.

Below is an example.

namespace MyApp {
  export function doSomething() {
    console.log('Doing something');
  }
}

MyApp.doSomething(); // Doing something
13. What is a TypeScript Decorator?
Decorators are implemented as functions and can be applied using the @ symbol.

Decorators can be used for things like adding metadata to a class or method or adding functionality.

Typescript Interview Questions For 5 Years Experience

14. How to create and use decorators with TypeScript?
Then, the decorator can be applied by describing the @ symbol before the declaration of the class, method, or property to which the decorator is applied.

Here is an example.

function Logger(target: any, propertyKey: string) {
  console.log(`Calling ${propertyKey}`);
}

class MyClass {
  @Logger
  greet() {
    console.log('Hello');
  }
}

const instance = new MyClass();
instance.greet(); // Calling greet \n Hello
15. What are generics in TypeScript and how are they used?
Generics can be used to achieve type safety and improve the readability and maintainability of code.

16. How are generics defined and used in TypeScript?
Here is an example.

function identity<T>(arg: T): T {
  return arg;
}

const result = identity<string>('Hello');
console.log(result); // Hello
17. What is the difference between TypeScript let and const?
A variable declared const cannot change its value after it is initially assigned.

18. What is the difference between var and let in TypeScript?
Variables declared with let have block scope and can only be accessed within the block in which they are declared.

It is generally recommended to use let instead of var in TypeScript.

Typescript Interview Questions Advanced

19. When is TypeScript any type used?
Any type is useful when dealing with external libraries or code not written in TypeScript, or when it is necessary to disable type-checking for specific variables.

However, it’s generally a good idea to use more specific types whenever possible. This is because using any will likely diminish the benefits of using TypeScript’s type system.

20. What is TypeScript’s unknown type, and when do you use it?
The unknown type has more restrictions than any and is effective when it is necessary to check the value reliably before using it.

21. What is the difference between null and undefined in TypeScript?
The key difference between null and undefined is that undefined is the default value for a variable that is declared but not assigned a value, whereas null is explicitly assigned to indicate no value.

22. What is TypeScript’s void type, and when is it used?
JavaScript Interview Practice Tests

23. What is TypeScript’s never type, and when to use it?
24. How do you use async/await in TypeScript?
the await keyword can be used to wait for the resolution of the promise before continuing with the execution of the code. This allows for asynchronous code to be written in a way that is similar to synchronous code, making it easier to understand and maintain.

Here is an example:

async function fetchData(): Promise<string> {
  const response = await fetch('https://api.example.com');
  const data = await response.json();
  return data;
}

fetchData().then(data => {
  console.log(data);
});
25. How does TypeScript support type inference?
let x = 1;
Type inference can also be used in function return types and in generic types, making it a powerful tool for writing concise and maintainable TypeScript code.

Summary
Remember, TypeScript is a powerful language built on the foundations of JavaScript and used by many of the top companies and developers around the world. Understanding the key features and syntax of TypeScript paves the way to becoming a TypeScript expert.

So don’t be afraid to practice your coding skills, ask questions, and keep learning. With dedication and practice, you’ll easily be able to handle any TypeScript interview question. Good luck.


50 Must-Know TypeScript Interview Questions to Land Your Dream Job!" 🚀
MD ALAMIN KAZI
MD ALAMIN KAZI
Founder of Digitonica | Driving Business Growth through Digital Marketing & Web Solutions


March 2, 2025
TypeScript Interview Questions and Answers
Basic TypeScript Questions
1. What is TypeScript, and how does it differ from JavaScript?
TypeScript is a statically typed superset of JavaScript that compiles to plain JavaScript. It adds optional static typing, interfaces, enums, and other features to improve code quality and maintainability. Unlike JavaScript, TypeScript catches errors at compile time.

2. What are the key features of TypeScript?
Static typing
Interfaces
Enums
Generics
Decorators
Advanced tooling for better IDE support

3. How do you install TypeScript?
Use npm:

npm install -g typescript


4. What is the purpose of the tsconfig.json file?
It configures TypeScript compiler options, such as target JavaScript version, module system, and strict type-checking.

5. How do you compile TypeScript code to JavaScript?
Run the following command in the terminal:

tsc filename.ts
6. What are the basic types in TypeScript?
string
number
boolean
null
undefined
symbol
bigint
array
tuple
enum
object
function
any
void
never
unknown

7. What is the difference between let, var, and const in TypeScript?
var is function-scoped.
let and const are block-scoped.
const cannot be reassigned after declaration.

8. How do you define an array in TypeScript?
let numbers: number[] = [1, 2, 3]; let numbers2: Array<number> = [1, 2, 3];
9. What is a tuple in TypeScript?
A tuple is an array with fixed types at specific positions.

let person: [string, number] = ["John", 30];
10. What is the any type, and when should you use it?
The any type disables type checking. It should be used sparingly when the type is unknown or dynamic.

11. What is the void type, and where is it commonly used?
The void type represents the absence of a value. It is commonly used as the return type of functions that do not return anything.

12. What is the difference between null and undefined in TypeScript?
null represents an intentional absence of a value.
undefined means a variable has been declared but not assigned.

13. What is type inference in TypeScript?
TypeScript automatically infers the type of a variable based on its value.

let x = 10; // TypeScript infers 'x' as 'number'
14. How do you define an object type in TypeScript?
interface Person { name: string; age: number; }
15. What is the purpose of the readonly modifier?
It makes a property immutable after initialization.

readonly id: number;
Intermediate TypeScript Questions


16. What are TypeScript interfaces, and how are they used?
Interfaces define the shape of an object and enforce a specific structure.

interface User { name: string; age: number; }
17. What is the difference between an interface and a type alias?
Interfaces can be extended or implemented.
Type aliases can represent unions, intersections, and primitives.

18. How do you extend an interface in TypeScript?
Use the extends keyword:

interface Animal { name: string; } interface Dog extends Animal { breed: string; }
19. What are optional properties in TypeScript?
Properties marked with ? are optional.

interface User { name: string; age?: number; }
20. What are function types in TypeScript?
Functions can have typed parameters and return values.

type Add = (a: number, b: number) => number;
21. How do you define a function with optional parameters?
Use ? for optional parameters.

function greet(name: string, age?: number) {}
22. What are default parameters in TypeScript?
Parameters with default values.

function greet(name: string = "Guest") {}
23. What are rest parameters in TypeScript?
They collect multiple arguments into an array.

function sum(...numbers: number[]) {}
24. What are union types, and how do you use them?
They allow a variable to hold multiple types.

let value: string | number;
25. What are intersection types, and how do you use them?
They combine multiple types into one.

type Person = { name: string } & { age: number };
26. What is type aliasing in TypeScript?
Creating a custom name for a type.

type StringOrNumber = string | number;
27. What are generics, and why are they useful?
Generics allow reusable components with type safety.

function identity<T>(arg: T): T { return arg; }
28. How do you create a generic function in TypeScript?
Use angle brackets <T> to define a type parameter.

function identity<T>(arg: T): T { return arg; }
29. What are generic constraints, and how do you use them?
They restrict generics to specific types.

function logLength<T extends { length: number }>(arg: T) {}
30. What is the keyof operator in TypeScript?
It returns a union of keys from an object type.

type PersonKeys = keyof Person; // "name" | "age"
Advanced TypeScript Questions
31. What is the typeof type operator in TypeScript?
The typeof operator is used to get the type of a variable or function.

let person = { name: "John", age: 30 }; type PersonType = typeof person; // { name: string; age: number; }
32. What is the in operator in TypeScript?
The in operator checks if a property exists in an object.

type Keys = "name" | "age"; type Person = { [K in Keys]: string | number };
33. What is a mapped type in TypeScript?
Mapped types allow transforming properties of an existing type.

type ReadonlyPerson = { readonly [K in keyof Person]: Person[K] };
34. What is the never type in TypeScript?
The never type represents values that never occur, such as infinite loops or errors.

function throwError(message: string): never { throw new Error(message); }
35. What is the unknown type in TypeScript?
The unknown type is safer than any because it requires type checking before use.

let value: unknown; if (typeof value === "string") { console.log(value.toUpperCase()); }
36. What are utility types in TypeScript?
Utility types help modify existing types. Examples include:

Partial<T> – Makes all properties optional.
Required<T> – Makes all properties required.
Readonly<T> – Makes all properties read-only.
Pick<T, K> – Picks specific properties.
Omit<T, K> – Omits specific properties.

Example:

type Person = { name: string; age: number }; type PartialPerson = Partial<Person>; // { name?: string; age?: number; }
37. What is the difference between Pick<T, K> and Omit<T, K>?
Pick<T, K> selects specific properties.
Omit<T, K> removes specific properties.

type User = { id: number; name: string; email: string }; type UserNameOnly = Pick<User, "name">; // { name: string } type UserWithoutEmail = Omit<User, "email">; // { id: number; name: string }
38. What is the difference between extends and implements in TypeScript?
extends is used for class inheritance.
implements is used to enforce an interface on a class.

class Parent {} class Child extends Parent {} // Inheritance interface Speakable { speak(): void; } class Dog implements Speakable { speak() { console.log("Bark!"); } }
39. What are conditional types in TypeScript?
Conditional types allow defining types based on conditions.

type Check<T> = T extends string ? "String Type" : "Other Type"; type Result = Check<number>; // "Other Type"
40. What is type narrowing in TypeScript?
Type narrowing reduces a broad type to a more specific one using checks.

function checkType(value: string | number) { if (typeof value === "string") { console.log(value.toUpperCase()); } }


41. What is function overloading in TypeScript?
Function overloading allows multiple function signatures.

function add(a: number, b: number): number; function add(a: string, b: string): string; function add(a: any, b: any): any { return a + b; }
42. What is a discriminated union in TypeScript?
A discriminated union uses a common property to differentiate types.

type Car = { type: "car"; speed: number }; type Bike = { type: "bike"; gear: number }; type Vehicle = Car | Bike; function getVehicleInfo(vehicle: Vehicle) { if (vehicle.type === "car") { console.log(vehicle.speed); } else { console.log(vehicle.gear); } }
43. What is a type predicate in TypeScript?
Type predicates help with type narrowing.

function isString(value: unknown): value is string { return typeof value === "string"; }
44. What is an indexed access type in TypeScript?
It extracts a property type from an object type.

type Person = { name: string; age: number }; type NameType = Person["name"]; // string
45. What are template literal types in TypeScript?
They allow constructing types using string literals.

type Status = "success" | "error"; type ResponseType = api_${Status}; // "api_success" | "api_error"
46. What is a keyof constraint in TypeScript?
It restricts a generic type parameter to keys of an object.

function getValue<T, K extends keyof T>(obj: T, key: K) { return obj[key]; }
47. What is module augmentation in TypeScript?
It allows modifying an existing module.

declare module "some-library" { interface SomeType { newProperty: string; } }
48. What are declaration files (.d.ts) in TypeScript?
They define types for JavaScript libraries. Example:

declare module "my-library" { export function myFunction(): void; }
49. What are ambient declarations in TypeScript?
They declare external variables or modules without implementation.

declare var jQuery: any;
50. What are decorators in TypeScript?
Decorators add metadata to classes and their members.

function Log(target: any, key: string) { console.log(`${key} was accessed`); } class User { @Log name: string; }


30 Frontend Interview Questions - TypeScript
#
react
#
typescript
#
programming
#
webdev
Interview Questions (6 Part Series)
1
52 Frontend Interview Questions - JavaScript
2
41 Frontend Interview Questions - CSS
...
2 more parts...
5
30 Frontend Interview Questions - TypeScript
6
12 Interview Questions - Git
TypeScript is one of the core skills for modern frontend developers. Mastering it includes not just basic syntax but deeper concepts like types, interfaces, generics, and how TypeScript interacts with JavaScript libraries. Below is a curated list of 30 interview questions targeting a frontend developer role with a focus on TypeScript.



Basic TypeScript Syntax & Features
1. What are the key differences between TypeScript and JavaScript?
TypeScript is a statically typed superset of JavaScript. It adds types, interfaces, and compile-time type checking, which JavaScript lacks. TypeScript transpiles to plain JavaScript, making it compatible with any JavaScript environment.
2. Why do we need TypeScript?
TypeScript helps catch errors at compile time, offers better tooling (autocomplete, refactoring), and ensures more maintainable and scalable code by enforcing strict typing rules.
3. What types exist in TypeScript?
TypeScript supports primitive types like string, number, boolean, undefined, null, symbol, and bigint. It also supports complex types like arrays, tuples, enums, any, unknown, void, never, objects, and union and intersection types.
4. What is the difference between type and interface?
type and interface both allow you to define custom types, but interface is better suited for defining shapes of objects, while type can handle more complex types such as unions and tuples.
   type CustomType = string | number;
   interface User {
     id: number;
     name: string;
   }
5. What is your opinion on JSDoc as an alternative to TypeScript?
JSDoc is a documentation tool that can annotate types in JavaScript, but it doesn’t offer the same compile-time safety as TypeScript. JSDoc lacks many features TypeScript has, such as static analysis, which ensures code correctness before execution.
6. What are union types in TypeScript? Give an example.
A union type allows a value to be one of several types. It uses the | operator to combine types.
   function printId(id: number | string) {
     console.log(id);
   }
7. How does TypeScript handle type assertions? Why should you use as?
Type assertions (using as or the angle bracket syntax) tell the TypeScript compiler that you know the type better than it does. It's used when you're sure about the type but TypeScript cannot infer it correctly.
   const value: any = "Hello";
   const strLength: number = (value as string).length;
8. What is the difference between the unknown and any types?
unknown is safer than any. While any disables all type-checking, unknown forces you to perform type checks before manipulating the value.
   let data: unknown;
   data = "Hello";
   if (typeof data === "string") {
     console.log(data.toUpperCase());
   }
9. What is the never type, and when would you use it?
The never type represents values that never occur. It's often used for functions that throw errors or infinite loops.
   function throwError(): never {
     throw new Error("This is an error");
   }
10. What is type narrowing, and how does TypeScript implement it?
Type narrowing occurs when TypeScript reduces the type of a variable to a more specific type using type guards, such as typeof or instanceof.
   function padLeft(value: string | number) {
     if (typeof value === "string") {
       return value.padStart(10);
     }
     return value.toString();
   }
Advanced Type Features
11. What are generics in TypeScript, and how do they contribute to reusability?
Generics allow you to create reusable components or functions that work with any type, providing flexibility and type safety.
   function identity<T>(arg: T): T {
     return arg;
   }
Learn More

12. How do generics constraints work? Why are they useful?
You can constrain generics to ensure they meet certain conditions, such as having certain properties.
   function logLength<T extends { length: number }>(arg: T): void {
     console.log(arg.length);
   }
13. Describe conditional types and when they can be utilized.
Conditional types allow you to create types that depend on a condition, enabling advanced type manipulation.
   type IsString<T> = T extends string ? true : false;
14. What is the difference between the utility types Partial<T> and Pick<T, K>?
Partial<T> makes all properties in T optional. Pick<T, K> extracts specific properties from T.
   interface Person {
     name: string;
     age: number;
   }
   type PartialPerson = Partial<Person>;
   type NameOnly = Pick<Person, 'name'>;
15. In TypeScript, what does keyof do?
keyof creates a union of the keys of an object type.
   interface Person {
     name: string;
     age: number;
   }
   type PersonKeys = keyof Person; // 'name' | 'age'
16. How would you handle type-safe error handling with discriminated unions?
Discriminated unions allow you to handle different types in a safe way using a common discriminant property.
   type Success = { status: "success"; data: string };
   type Failure = { status: "failure"; error: string };
   type Response = Success | Failure;

   function handleResponse(response: Response) {
     if (response.status === "success") {
       console.log(response.data);
     } else {
       console.log(response.error);
     }
   }
17. What are template literal types, and how useful are they?
Template literal types allow you to create new string types by combining unions of string literals, increasing flexibility in working with string types.
   type Greeting = `Hello, ${string}!`;
TypeScript and OOP (Object-Oriented Programming)
18. How does TypeScript use classes? How do these differ from ES6 classes?
TypeScript classes extend ES6 classes with additional type annotations, access modifiers, and interfaces.
   class Person {
     private name: string;
     constructor(name: string) {
       this.name = name;
     }
     getName(): string {
       return this.name;
     }
   }
19. What are access modifiers (public, private, protected) in TypeScript?
Access modifiers control the visibility of properties and methods. public means accessible everywhere, private within the class, and protected within the class and subclasses.
20. How do abstract classes work in TypeScript, and when should they be used?
Abstract classes define base classes with incomplete functionality, forcing subclasses to implement specific methods.
   abstract class Animal {
     abstract sound(): void;
     move() {
       console.log("Moving...");
     }
   }
   class Dog extends Animal {
     sound() {
       console.log("Woof!");
     }
   }
21. What is the difference between an Interface and an Abstract Class?
An interface defines a contract (structure) without any implementation, whereas an abstract class can define both abstract methods and concrete methods.
22. How can you describe a class in TypeScript that we create inside a function and return outside?
You can create and return a class from within a function to provide encapsulation.
   function createUser() {
     return class User {
       constructor(public name: string) {}
     };
   }
   const UserClass = createUser();
   const user = new UserClass("John");
TypeScript in React
23. How would you define types for props and state of a React component with TypeScript?
You can define props and state using interfaces or types.
   interface Props {
     title: string;
   }
   interface State {
     count: number;
   }
   class MyComponent extends React.Component<Props, State> {
     state: State = { count: 0 };
     render() {
       return <div>{this.props.title}</div>;
     }
   }
To define types for props and state in a functional React component with TypeScript, you would use interface or type too. Since functional components don't have internal state like class components, you would type the props directly. However, for state managed by hooks like useState, you can also type those.
// Define the props type
interface Props {
  title: string;
}

const MyFunctionalComponent: React.FC<Props> = ({ title }) => {
  // Define the state with useState and give it a type
  const [count, setCount] = React.useState<number>(0);

  return (
    <div>
      <h1>{title}</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
24. What is the difference between using interface vs type for props in React components?
Both are commonly used, but interface is extendable, making it better for props composition, while type can handle more complex unions.
25. How would you type hooks with TypeScript?
Use types directly to hooks.
   const [count, setCount] = useState<number>(0);
26. What's the difference between JSX.Element and React.ReactNode?
JSX.Element refers to a React element returned by a component, while React.ReactNode includes anything renderable by React, like strings, numbers, or fragments.
27. How do you type custom hooks in TypeScript?
Custom hooks are typed using generics, where necessary.
   function useCustomHook<T>(initialValue: T): [T, (value: T) => void] {
     const [state, setState] = useState(initialValue);
     return [state, setState];
   }
TypeScript in Larger Projects
28. How would you manage complex types across multiple files in large-scale TypeScript projects?
Use TypeScript’s module system to split types across files and import them where needed. You can use index.ts for better type exports.
   // types.ts
   export interface User {
     id: number;
     name: string;
   }

   // index.ts
   export * from './types';
29. How does functional programming in TypeScript differ from other approaches in other languages?
TypeScript enables functional programming by supporting higher-order functions, immutability, and strong type inference, similar to languages like Haskell or Scala, but retains the flexibility of JavaScript.
30. How would you ensure type safety when working with external services or REST APIs in TypeScript?
You can use TypeScript’s type system to define the expected API response shape and validate the types when consuming external data.
   interface ApiResponse {
     userId: number;
     id: number;
     title: string;
   }

   async function fetchPost(id: number): Promise<ApiResponse> {
     const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
     return response.json();
   }
Preparing for these questions, studying the topics covered, and reviewing relevant resources can improve your chances of successfully passing the interview.

I look forward to your reactions and comments.💬
Good luck in your interview!🌟



The following set of questions should test a job candidate’s basic knowledge of TypeScript and some of its core features.

1. What is TypeScript and how does it differ from JavaScript?
This is a fundamental question that interviewers typically ask to gauge the candidate’s familiarity with the language and how comfortable they are with its features. Make sure your candidate can describe TypeScript as a language, its core features, and how it relates to JavaScript.

TypeScript is a superset of JavaScript that compiles to plain JavaScript. Conceptually, the relationship between TypeScript and JavaScript is comparable to that of SASS and CSS. In other words, TypeScript is JavaScript’s ES6 version with some additional features.

TypeScript is an object-oriented and statically typed language, similar to Java and C#, whereas JavaScript is a scripting language closer to Python. The object-oriented nature of TypeScript is complete with features such as classes and interfaces, and its static typing allows for better tooling with type inference at your disposal.

From a code perspective, TypeScript is written in a file with a .ts extension whereas JavaScript is written with a .js extension. Unlike JavaScript, TypeScript code is not understandable by the browsers and can’t be executed directly in the browser or any other platform. The .ts files need to be transpiled using TypeScript’s tsc transpiler to plain JavaScript first, which then gets executed by the target platform.

2. What are the benefits of using TypeScript?
Each programming language has its pros and cons and the reasons behind its applications. You might ask this question to gain insight into the candidate’s experience using TypeScript and how it has affected the developer experience and the project’s workflow.

Instead of just listing out TypeScript’s benefits, make sure to encourage your candidates’ to talk about how a typical project could benefit from TypeScript. This could range from better maintainability in the long run or increased developer productivity because of the features that TypeScript offers.

An immediate advantage of using TypeScript is its tooling. TypeScript is a strongly typed language that uses type inferences. These characteristics open the doors to better tooling and tighter integration with code editors. TypeScript’s strict checks catch your errors early, greatly reducing the chances of typos and other human errors from making their way to production. From an IDE’s perspective, TypeScript provides the opportunity for your IDE to understand your code better allowing it to display better hints, warnings, and errors to the developer. For example, TypeScript’s strict null check throws an error at compile time (and in your IDE) preventing a common JavaScript error of attempting to access a property of an undefined variable at runtime.

A long-run advantage of using TypeScript is its scalability and maintainability. The ability to describe the shape of objects and functions directly in your code makes your codebase easier to understand and more predictable. When used correctly, TypeScript provides a more standardized language resulting in better readability which could save time and effort down the road as the codebase grows.

Read More: Common Non-Technical Interview Questions for Software Developer Jobs

3. What are interfaces in TypeScript?
Similar to other TypeScript features-related questions, this question tests the candidate’s level of knowledge and familiarity with the language’s feature. An ideal answer should also include its usage and the benefits of using interfaces.

Interfaces are TypeScript’s way of defining the syntax of entities. In other words, interfaces are a way to describe data shapes such as objects or an array of objects.

We declare interfaces with the help of the interface keyword, followed by the interface name and its definition. Let’s look at a simple interface for a user object

interface User {
  name: string;
  age: number;
}
The interface can then be used to set the type of a variable (similar to how you assign primitive types to a variable). A variable with the User type will then conform to the interface’s properties.

let user: User = {
  name: "Bob",
  age: 20, // omitting the `age` property or a assigning a different type instead of a number would throw an error
};
Interfaces help drive consistency in your TypeScript project. Furthermore, interfaces also improve your project’s tooling, providing better autocomplete functionality in your IDEs and ensuring the correct values are being passed into constructors and functions.

4. How do you create a new type using a subset of an interface?
Being able to modify an interface is useful to remove duplicate code and max_Being able to modify an interface is useful to remove duplicate code and maximize the reusability of existing interfaces (where it makes sense). This question covers one of the many features that TypeScript offers to create a new interface from an existing interface.

TypeScript has a utility type called omit that lets you construct a new type by passing a current type/interface and selecting the keys to be excluded from the new type. The example below shows how you create a new type UserPreview based on the User interface, but without the email property.

interface User {
  name: string;
  description: string;
  age: number;
  email: string;
}

// removes the `email` property from the User interface
type UserPreview = Omit<User, "email">;

const userPreview: UserPreview = {
  name: "Bob",
  description: "Awesome guy",
  age: 20,
};
Read More: 31 Questions to Ask at an Interview for Software Development Jobs

5. How do “enums” work in TypeScript?
Enums are a common data structure in most typed languages. Understanding enums and how to use them is essential in organizing code and making code more readable. The candidate should be able to explain enums at a high level, along with their basic features and usage.

Enums or enumerated types are a means of defining a set of named constants. These data structures have a constant length and contain a set of constant values. Enums in TypeScript are commonly used to represent a set number of options for a given value using a set of key/value pairs.

Let’s look at an example of an enum to define a set of user types.

enum UserType {
  Guest = "G",
  Verified = "V",
  Admin = "A",
}

const userType: UserType = UserType.Verified;
Under the hood, TypeScript translates enums into plain JavaScript objects after compilation. This makes the use of enums more favorable compared to using multiple independent const variables. The grouping that enums offer makes your code type-safe and more readable.

6. What are arrow functions in TypeScript?
Arrow function is a popular feature of ES6 and TypeScript that introduces an alternate shorter way of defining functions. Although shorter, arrow functions come with their pros and cons, which are important to consider when choosing which method to use.

Arrow functions, also known as lambda functions, provide a short and convenient syntax to declare functions. Arrow functions are often used to create callback functions in TypeScript. Array operations such as map, filter, and reduce all accept arrow functions as their arguments.

However, arrow functions’ anonymity also has its downsides. If not careful, the shorter arrow function syntax can be more difficult to understand. Furthermore, arrow functions’ nameless nature also makes it impossible to create self-referencing functions (i.e. recursions).

Let’s take a look at a regular function that accepts two numbers and returns its sum.

function addNumbers(x: number, y: number): number {
  return x + y;
}

addNumbers(1, 2); // returns 3
Now let’s convert the function above into an arrow function.

const addNumbers = (x: number, y: number): number => {
  return x + y;
};

addNumbers(1, 2); // returns 3
Read More: Time Management Skills for Developers: Best Tips, Tools, and Strategies

7. What are the differences between var, let, and const?
TypeScript provides three ways to declare a variable, each with its recommended use cases. The ability to differentiate between the three keywords and understanding which to use when plays an important role in writing quality code. As the candidate, make sure that you explain the use case for each of the keywords along with their behavior.

var: Declares a function-scoped or global variable with similar behavior and scoping rules to JavaScript’s var variables. var variables don’t require setting its value during its declaration.
let: Declares a block-scoped local variable. let variables don’t require setting a value of a variable during its declaration. Block-scoped local variable means that the variable can only be accessed within its containing block, such as a function, an if/else block, or a loop. Furthermore, unlike var, let variables cannot be read or written to before they are declared.
// reading/writing before a `let` variable is declared
console.log("age", age); // Compiler Error: error TS2448: Block-scoped variable 'age' used before its declaration
age = 20; // Compiler Error: error TS2448: Block-scoped variable 'age' used before its declaration

let age: number;

// accessing `let` variable outside it's scope
function user(): void {
  let name: string;
  if (true) {
    let email: string;
    console.log(name); // OK
    console.log(email); // OK
  }
  console.log(name); // OK
  console.log(email); // Compiler Error: Cannot find name 'email'
}
const: Declares a block-scoped constant value that cannot be changed after it’s initialized. const variables require an initialization as part of its declaration. This is ideal for variables that don’t change throughout their lifetime.
// reassigning a `const` variable
const age: number = 20;
age = 30; // Compiler Error: Cannot assign to 'age' because it is a constant or read-only property

// declaring a `const` variable without initialization
const name: string; // Compiler Error: const declaration must be initialized
Sidenote: Linters does a great job in catching these in your IDEs and compilers will throw an error if a rule is violated as a result of misusing these keywords.

8. When do you use a return type of never and how does it differ from void?
This is a question that showcases the candidate’s understanding of TypeScript’s types and their use cases in the context of defining return types. The candidate should be able to distinguish between the two types and identify the return type of a function by looking at its contents.

Before diving into the differences between never and void, let’s talk about the behavior of a JavaScript function when nothing is returned explicitly.

Let’s take the function in the example below. It doesn’t explicitly return anything to the caller. However, if you assign it to a variable and log the value of the variable, you will see that the function’s value is undefined.

printName(name: string): void {
  console.log(name);
}

const printer = printName('Will');
console.log(printer); // logs "undefined"
The above snippet is an example of void functions. Functions with no explicit returns are inferred by TypeScript to have a return type of void.

In contrast, never is a type that represents a value that never occurs. For example, a function with an infinite loop or a function that throws an error are functions that have a never return type.

const error = (): never => {
  throw new Error("");
};
In summary, void is used whenever a function doesn’t return anything explicitly whereas never is used whenever a function never returns.

Read More: Problem-Solving Skills for Software Developers: Why & How to Improve

9. What access modifiers are supported by TypeScript?
Access modifiers and encapsulation go hand-in-hand. A question like this is an opportunity to understand the candidate’s knowledge of the concept of encapsulation and TypeScript’s approach to data access restrictions. You may also be looking for real-world applications of access modifiers, the reasoning behind them, and their advantages.

The concept of “encapsulation” is used in object-oriented programming to control the visibility of its properties and methods. TypeScript uses access modifiers to set the visibility of a class’s contents. Because TypeScript gets compiled to JavaScript, logic related to access modifiers is applied during compile time, not at run time.

There are three types of access modifiers in TypeScript: public, private, and protected.

public: All properties and methods are public by default. Public members of a class are visible and accessible from any location.
protected: Protected properties are accessible from within the same class and its subclass. For example, a variable or method with the protected keyword will be accessible from anywhere within its class and within a different class that extends the class containing the variable or method.
private: Private properties are only accessible from within the class the property or method is defined.
To use any of these access modifiers, add the public, protected, or public (if omitted, TypeScript will default to public) in front of the property or method.

class User {
  private username; // only accessible inside the `User` class

  // only accessible inside the `User` class and its subclass
  protected updateUser(): void {}

  // accessible from any location
  public getUser() {}
}
Violating the rules of the access modifier, such as attempting to access a class’s private property from a different class will result in the following error during the compilation process.

Property '<property-name>' is private and only accessible within class '<class-name>'.
In conclusion, access modifiers play an important role in arranging your code. They allow you to expose a set of public APIs and hide the implementation details. You can think of access modifiers as a form of entry gates to your class. Effective use of access modifiers reduces the chance of errors from misusing another class’s contents significantly.

10. What are generics and how to use them in TypeScript?
In addition to the “what”, an interviewer asking this question might also be looking for answers on how generics tie into the code’s flexibility and the reasoning behind using generics over other types. Your candidate should be comfortable discussing what generics are, how it works, and it’s benefits.

Good software engineering practice often encourages reusability and flexibility. The use of generics provides reusability and flexibility by allowing a component to work over a variety of types rather than a single one while preserving its precision (unlike the use of any).

Below is an example of a generic function that lets the caller define the type to be used within the function.

function updateUser<Type>(arg: Type): Type {
  return arg;
}
To call a generic function, you can either pass in the type explicitly within angle brackets or via type argument inference, letting TypeScript infer the type based on the type of the argument passed in.

// explicitly specifying the type
let user = updateUser<string>("Bob");

// type argument inference
let user = updateUser("Bob");
Generics allows us to keep track of the type information throughout the function. This makes the code flexible and reusable without compromising on its type accuracy.

Looking to hire the best remote developers? Arc can help you:

⚡️ Get instant candidate matches without searching
⚡️ Identify top applicants from our network of 350,000+
⚡️ Hire 4x faster with vetted candidates (qualified and interview-ready)

Try Arc to hire top developers now →

Intermediate TypeScript Interview Questions
The following set of questions should test the candidate’s intermediate knowledge of TypeScript and some of its widely used features.

1. When should you use the unknown type?
Knowing the differences between unknown and any and when to use which is important working with TypeScript. unknown is usually the preferred option because of its safer typing. Your candidate should be able to explain what the unknown type is used for and how to use it.

unknown is a special type that is similar to any. Like any, a common use case of the unknown type is when you don’t know the exact type upfront. unknown variables accept any value. However, when trying to operate on an unknown variable, TypeScript requires a type check or a type assertion. This difference makes unknown a

Let’s look at two examples to highlight the differences between any and unknown types.

The snippet below shows a valid TypeScript code where you could pass in any value as the callback parameter, and the invokeCallback method will try to call it. This function doesn’t throw any compile-time error, however, it could lead to a run time error when you pass in a variable that’s not callable as the callback parameter.

invokeCallback(callback: any): void {
  callback();
}
The unknown equivalent of the above example requires you to add a type check before calling the callback function. The additional type check prevents the run time error above from happening.

invokeCallback(callback: unknown): void {
  if (typeof callback === 'function') {
    callback();
  }
}
To summarize, you can assign anything to both an any and an unknown type. However, unknown types require a type check or type assertion to perform any operation on the variable.

2. What is noImplicitAny and what is its purpose?
This is a TypeScript configuration question that would give you insight into the level of familiarity the candidate has when configuring a TypeScript project. Although this is only one property from TypeScript’s list of configurable properties, noImplicitAny plays an important role in larger projects.

noImplicitAny is a property in a TypeScript project’s configuration file (tsconfig.json) that modifies how TypeScript’s compiler handles your project’s implicit any types. The noImplicitAny flag can be set to either true or false and can always be changed later. There is no correct answer as to what this value should be as each project is different. To be able to decide on what the flag should be set to, it is important to understand the differences between when it’s turned on and when it’s off.

When the noImplicitAny flag is false (by default), the compiler doesn’t infer the variable type based on how it’s used. Instead, the compiler defaults the type to any.

On the other hand, when the noImplicitAny flag is true, the compiler will attempt to infer the type, throwing a compile-time error if the compiler isn’t able to infer the type.

Setting the noImplicitAny flag to either true or false doesn’t prevent you from setting a variable’s type to any.

Read More: 10 Ways to Improve Leadership Skills (& Advance Your Developer Career)

3. What are conditional types in TypeScript?
Sometimes, a variable’s type is dependent on its input. Conditional types help bridge the input and output’s type – transforming a variable’s type based on a set condition. Conditional type is an important TypeScript feature that helps write type-safe framework-like code such as API boundaries. Although the candidate might not use this feature directly every day, they might be using them indirectly when using code from other frameworks or libraries.

Conditional types in TypeScript are similar to ternary operators. As the name suggests, it assigns a type to the variable based on a condition.

The general expression for defining a conditional type in TypeScript is as follows:

A extends B ? X : Y
Type X in the snippet above is applied if the variable fulfills the condition whereas type Y is applied if the variable doesn’t. In the example above, type X is assigned if A extends B, while type Y is assigned if A doesn’t extend B.

4. What is the difference between union and intersection types?
Union and intersection types are considered advanced types in TypeScript. Understanding this is important when creating types in developer’s TypeScript projects to reduce duplication of types. The candidate should ideally be able to explain what union and intersection types are, their differences, and their use cases.

Unions and intersection types let you compose and combine existing types instead of creating them from scratch. Both union and intersection come with their unique characteristics which make them ideal for different use cases.

A union type is described as a type that can be one of several types. Union type uses the | (vertical bar) symbol to separate the list of types that will be used in the new type. Let’s take a look at an example:

interface B {
  name: string,
  email: string
}

interface C {
  name: string,
  age: number
}

type A = B | C;
A in the snippet above can either be of type B or C. Based on B and Cs interfaces, A can either contain name and email (B) or name and age (C), but not email and age.

When accessing type A, TypeScript only lets you access properties that exist in both B and C (name) as those are the only ones that TypeScript can be certain of their existence.

Intersection on the other hand, is described as a type that combines multiple types into one – combining all the properties of each type to create a new type. Intersection uses the & symbol to separate the list of types that will be combined. Let’s look at an example:

interface B {
  name: string,
  email: string
}

interface C {
  name: string,
  age: number
}

type A = B & C;
A in the snippet above will contain all the properties from both B and C (name, email, and age).

Read More: Interpersonal Skills: What Developers Need to Know (& How to Improve)

5. What is the difference between extends and implements in TypeScript?
Inheritance is an important concept in object-oriented programming, specifically for polymorphism and code reusability. There are two main keywords that TypeScript uses for inheritance – extends and implements. This question is a chance to test your candidate’s knowledge of the concept of inheritance and how to do that in TypeScript.

Implements and extends have different uses. Let’s go through each individual and take a look at an example to compare the two.

When a class extends another class, the child class will inherit all the properties and methods of the class it extends. You can override any of the existing properties and methods of its parent and add new ones.

When a class implements another class or interface, the class has to implement all the methods and properties from the implemented class or interface. The implements keyword acts as a contract that the class has to follow, and TypeScript will make sure that the class is of the same shape as the class or interface it implements.

Let’s look at an example of a class and how another class can extend and implement it.

class User {
  name: string;
  age: number;
}

// John will contain name and age from the User class
class John extends User {}

// this will result in an error as Bob doesn't have all the properties that
// the User class has
class Bob implements User {}

// This is valid as Mike satisfies the "contract" specified by the 
// User class
class Mike implements User {
  name = 'Mike';
  age = 25
}

Advanced TypeScript Interview Questions
The following set of advanced questions for Typescript interviews should test your candidates’ deep knowledge of TS and some of its more expert-level concepts and features.

1. Explain how optional chaining works in TypeScript.
Optional chaining is a TypeScript feature that allows safer and easier accessing of values inside deep objects. Understanding how and when to use this feature will help developers write more concise code (where it makes sense). A candidate should be able to explain what optional chaining is and also elaborate on its use cases and pros and cons.

Optional chaining allows you to access properties and methods located deep within an object without having to check the validity of each reference in the chain.

Optional chaining uses the question mark followed by a period (?.) as its operator. TypeScript evaluates each reference in the chain and performs a null or undefined check before accessing its children. TypeScript immediately stops the execution when it fails the null or undefined check and returns undefined for the entire chain.

The code snippet below is an example of accessing a property with and without using optional chaining.

const user = {
  personalInfo: {
    name: 'John'
  }
}

// without optional chaining
const name = user && user.personalInfo && user.personalInfo.name || undefined;

// with optional chaining
const name = user?.personalInfo?.name;
2. What are abstract classes?
Abstract class is another feature of TypeScript that ties into the inheritance concept in object-oriented programming (OOP). You may ask this question to get an insight into the candidate’s understanding of OOP and its more advanced features in TypeScript.

Abstract classes specify a contract for the objects without the ability to instantiate them directly. However, an abstract class may also provide implementation details for its members.

An abstract class contains one or more abstract members. Any classes that extend the abstract class will then have to provide an implementation for the superclass’s abstract members.

Let’s look at an example of how an abstract class is written in TypeScript and how another class can extend it. In the example below, both Car and Bike extend the Vehicle class, however, they each have a different implementation of the drive() method.

abstract class Vehicle {

  abstract drive(): void;
  
  startEngine(): void {
    console.log('Engine starting...');
  }
}

class Car extends Vehicle {
  drive(): void {
    console.log('Driving in a car');
  }
}

class Bike extends Vehicle {
  drive(): void {
    console.log('Driving on a bike');
  }
}
Read More: 8 Great Benefits of Working From Home (A Guide for Remote Developers)

3. What are type assertions in TypeScript?
Type assertions are a way to tell TypeScript the type of a variable. As types are widely used in TypeScript applications, you often run into scenarios where you want to specify a more specific type to a variable. A candidate should be able to explain not only what type assertions are, but also their syntax and the reasons behind why you might use them.

Type assertion allows you to explicitly set the type of a value and tell the compiler not to infer it. This is useful when you know the type of an object more specifically than its current type or current inferred type. In such cases, you can use type assertions to tell TypeScript the current type of the variable.

TypeScript provides two syntaxes for type assertions – as and <>.

// using the `as` keyword
const name: string = person.name as string;

// using `<>`
const name: string = <string>person.name;
Since type assertions are only a way to tell the TypeScript compiler about the type of a variable, there is no runtime penalty of doing this in your TypeScript projects.

4. What is the difference between type inference and contextual typing?
Type inference is a key feature in TypeScript that helps write type-safe code that is both less error-prone and easier to read. You might ask this question to gauge your candidate’s understanding of both TypeScript’s type inference and their overall familiarity with TypeScript’s type system.

TypeScript can infer the type of a variable usually based on the variable’s initialization or declaration. This process is known as type inference.

The snippet below is an example of type inference where TypeScript infers the type of name as “string” based on the value assigned to it.

let name = 'john'
Contextual typing is a subset of type inference where TypeScript uses the location or context of a variable to infer its type. You can think about this as type inference in the opposite direction.

In the snippet below, TpyeScript uses information from the onmousedown function to infer the type of the mouseEvent parameter.

window.onmousedown = function(mouseEvent) {
   console.log(mouseEvent.button);   // OK
   console.log(mouseEvent.person);   // Error
};
Read More: How to Negotiate Your Salary as a Remote Developer

5. How does function overloads work in TypeScript?
Function overloading helps make functions more flexible and reusable by allowing the same function to behave a different way based on the set of input passed in. In addition to the how, you might be looking for answers on how function overloads tie into the code reusability aspect and any other benefits it provides.

Function overload is when the same function name is used multiple times with a different set of arguments – the number of arguments, types, or return types.

Let’s look at an example of how a print function can accept multiple types as its parameter by using function overloading.

print(message: string): void;
print(message: string[]): void;

print(message: unknown): void {
  if (typeof message === 'string') {
    console.log(message);
  } else if (Array.isArray(message)) {
    message.forEach((individualMessage) => {
      console.log(individualMessage);
    });
  } else {
    throw new Error('unable to print');
  }
}
Based on the code snippet above, we can now call print passing in either a single message string or an array of message strings.

print('Single message');
// Console Output:
// Single message

print(['First message', 'Second message']);
// Console Output
// First message
// Second message
Apart from the reusability of the function, function overloading also comes with autocomplete support. When calling a function (depending on your IDE), you will be provided with a list of all possible overloads that you can choose from for your specific use case, creating a better development experience.

Conclusion
Whether you’re a hiring manager looking for the ideal candidate or a developer preparing for an interview, we hope these TypeScript interview questions help you through the process.

Keep in mind that technical skills and knowledge are only one part of the hiring process. Past experiences and soft skills are equally important to make sure you hire the best candidate (or land the right job).

Good luck on your upcoming TypeScript interview! Here are a few other helpful guides to read:


What makes TypeScript different from JavaScript?
TypeScript adds static typing to JavaScript. The compiler checks your code before it runs and catches type errors during development rather than in production.

// JavaScript - fails at runtime
function calculatePrice(quantity, price) {
  return quantity * price;
}
calculatePrice(5, "20"); // Returns "2020020020" - unexpected string concatenation

// TypeScript - catches the error during compilation
function calculatePrice(quantity: number, price: number): number {
  return quantity * price;
}
calculatePrice(5, "20"); // Error: Argument of type 'string' is not assignable to parameter of type 'number'
Every JavaScript file works as TypeScript. You can rename .js to .ts and start adding types gradually. This makes migration straightforward for existing projects.

TypeScript is actually a superset of JavaScript, which means all JavaScript code is valid TypeScript code, but with added power from types and features. As a programming language, TypeScript is widely adopted in modern software development, especially in frameworks that emphasize maintainable and scalable codebases.

TypeScript’s compiler uses a powerful type system that enables features like type inference and type annotations, allowing developers to easily manage the type of a variable in complex applications.

What’s the difference between any and unknown?
This question comes up in almost every TypeScript interview. Both types accept any value, but they work differently.

The any type turns off type checking completely. You can perform any operation on an any value without compiler intervention. This makes any dangerous because errors slip through.

let data: any = "hello world";
data.toUpperCase(); // Works fine
data = 42;
data.toUpperCase(); // Runtime error! No compile-time warning
The unknown type is safer. You must check the type before using the value. This preserves type safety while still accepting any value.

let value: unknown = "hello world";

// This fails
value.toUpperCase(); // Error: Object is of type 'unknown'

// This works - we check the type first
if (typeof value === "string") {
  value.toUpperCase(); // TypeScript knows it's a string here
}
Use unknown when you don’t know what type you’ll get. Only use any when migrating old JavaScript code.

TypeScript supports both implicit and explicit type declarations, giving developers flexibility based on their workflow and project complexity.

What are interfaces and type aliases?
Interfaces and type aliases both define object shapes. Developers debate which to use constantly. Each has strengths that matter in different situations.

Interfaces can only describe object shapes, while type aliases offer more flexibility—they can represent primitives, objects, unions, and tuples. When it comes to declaration merging, interfaces can be extended by declaring them multiple times, but type aliases cannot be re-declared.

If you need to combine properties with type aliases, you’ll need to use an intersection type with the & operator. Both interfaces and type aliases work with class implementation, though there’s a catch: a class can implement an interface or an object type, but it cannot implement a union type.

Finally, the syntax differs when extending—interfaces use the extends keyword, while type aliases use the intersection type operator &.

Interfaces work great for objects. You can extend them by declaring the same interface multiple times. This feature is called declaration merging.

interface User {
  name: string;
}

// Add more properties later
interface User {
  email: string;
}

// Both properties are required now
const user: User = {
  name: "Alice",
  email: "alice@example.com"
};
Type aliases handle more than just objects. You can create union types, tuples, and primitives.

// Union type - can be one of several types
type Status = "pending" | "approved" | "rejected";

// Tuple - fixed length array with specific types
type Coordinates = [number, number];

// Function type
type Calculator = (a: number, b: number) => number;

// Intersection - combine multiple types
type Person = {
  name: string;
};

type Employee = Person & {
  employeeId: number;
};
Use interfaces for object shapes in public APIs. Use type aliases for unions, tuples, and complex type operations.

Interfaces also form the basis of object-oriented programming in TypeScript, defining the structure of class members and improving maintainability of the codebase.

What are type guards?
Type guards narrow down types in conditional blocks. They help TypeScript understand what type a variable has in different parts of your code.

function processInput(input: string | number) {
  if (typeof input === "string") {
    return input.toUpperCase();
  }
  return input.toFixed(2);
}
The typeof operator creates a basic type guard. You can also use instanceof for classes and create custom type guards for complex scenarios.

interface Fish {
  swim: () => void;
}

interface Bird {
  fly: () => void;
}

// Custom type guard using 'is' keyword
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim();
  } else {
    pet.fly();
  }
}
Custom type guards give you control over how TypeScript narrows types for your specific data structures. Developers often use type assertions within type guards to clarify how certain objects behave.

Common TypeScript Interview Questions
These questions test intermediate knowledge and come up frequently for mid-level positions.

What’s the never type?
The never type represents values that never happen. Functions that throw errors return never because they never return normally:

function throwError(message: string): never {
  throw new Error(message);
}
The never type also helps catch bugs through exhaustive checking. This pattern forces you to handle all cases in a union type:

type Shape = "circle" | "square" | "triangle";

function getArea(shape: Shape): number {
  switch (shape) {
    case "circle":
      return Math.PI * 5 * 5;
    case "square":
      return 10 * 10;
    case "triangle":
      return 0.5 * 5 * 8;
    default:
      // If we forgot a case, this line causes a compile error
      const exhaustiveCheck: never = shape;
      return exhaustiveCheck;
  }
}
If you add a new shape to the union but forget to handle it in the switch statement, TypeScript will complain. The code won’t compile until you add the missing case.

Enums are another feature that work well with union types, allowing you to create named constants that improve readability and error checking.

What are .d.ts files?
Declaration files end in .d.ts and contain only type information. No implementation code goes in these files. They describe the shape of JavaScript code that exists elsewhere.

When you install packages like @types/node or @types/react, you’re getting declaration files. TypeScript reads these files to understand what functions and properties are available in those libraries.

// math.d.ts - describes a JavaScript library
export function add(a: number, b: number): number;
export function subtract(a: number, b: number): number;
export const PI: number;
The actual JavaScript implementation lives in a separate file. The .d.ts file just tells TypeScript what types to expect.

Writing declaration files for legacy JavaScript libraries is common when migrating projects to TypeScript. This makes it easier when using TypeScript for existing codebases.

What are discriminated unions?
Discriminated unions use a common property to tell different types apart. This property is called the discriminant. It’s usually a string literal type that identifies which variant you’re dealing with.

interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

interface Triangle {
  kind: "triangle";
  base: number;
  height: number;
}

type Shape = Circle | Square | Triangle;
The kind property is the discriminant. TypeScript uses it to narrow the type automatically in switch statements:

function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    case "triangle":
      return (shape.base * shape.height) / 2;
  }
}
This pattern makes handling different variants type-safe. You can’t accidentally access the wrong properties because TypeScript narrows the type in each branch.

Conditional types often work with function overloading, where different versions of a function have different parameter and return value types.

How do generics work?
Generics let you write code that works with multiple types while staying type-safe. Think of them as type variables that get filled in when you use the function or class.

// Without generics - need separate functions
function getFirstNumber(arr: number[]): number {
  return arr[0];
}

function getFirstString(arr: string[]): string {
  return arr[0];
}

// With generics - one function handles all types
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const firstNumber = getFirst([1, 2, 3]); // TypeScript infers T as number
const firstString = getFirst(["a", "b", "c"]); // TypeScript infers T as string
The angle brackets <T> introduce a type parameter. When you call getFirst, TypeScript figures out what T should be based on the array you pass in.

You can constrain generics to specific types using the extends keyword:

interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): void {
  console.log(item.length);
}

logLength("hello"); // Works - strings have length
logLength([1, 2, 3]); // Works - arrays have length
logLength(42); // Error - numbers don't have length
Advanced TypeScript Interview Questions
These questions differentiate senior developers from mid-level ones. Interviewers use them to assess deep TypeScript knowledge.

What are conditional types?
Conditional types choose between two types based on a condition. The syntax looks like a ternary operator but works at the type level. These types separate junior developers from senior ones.

The basic pattern is T extends U ? X : Y. If T can be assigned to U, the type becomes X. Otherwise it becomes Y.

type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// Practical example
type NonNullable<T> = T extends null | undefined ? never : T;

type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>; // string
The power comes from combining conditional types with the infer keyword.

Conditional types often work with function overloading, where different versions of a function have different parameter and return value types.

TypeScript Classes and Inheritance
TypeScript supports abstract classes, access modifiers, and inheritance between a base class and a child class. These features add clarity and structure to both frontend and backend development.

abstract class Vehicle {
  abstract move(): void;
}

class Car extends Vehicle {
  move() {
    console.log("Car is moving");
  }
}


This concept helps reinforce encapsulation and better separation of logic between components.

You can use console.log to debug class methods or track data flow within a TypeScript project.

Modular Architecture
Developers often divide applications into modules to organize reusable functionality. Each module might export callback functions, classes, or constants that other files import. This modular structure makes your code more reusable and maintainable.

Compiler Configuration
What compiler options should you know?

The tsconfig.json file controls how TypeScript compiles your code. Several flags matter most for interviews.

{
  "compilerOptions": {
    "strict": true
  }
}


This enables strict mode, which improves maintainability and type safety across the entire codebase.

How does the infer keyword work?
The infer keyword lets TypeScript figure out and extract types from other types. You use it inside conditional types to capture a type that matches a pattern.

Here’s how to extract array element types:

type ElementType<T> = T extends (infer U)[] ? U : T;

type Numbers = number[];
type NumberElement = ElementType<Numbers>; // number

type NotAnArray = string;
type StillString = ElementType<NotAnArray>; // string
Here’s what happens: TypeScript checks if T is an array. If it is, infer U captures the element type and returns it. If not, it returns T unchanged.

You can extract return types from functions:

type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { name: "Alice", age: 30 };
}

type User = ReturnType<typeof getUser>; // { name: string; age: number }
You can also extract function parameters:

type Parameters<T> = T extends (...args: infer P) => any ? P : never;

function createUser(name: string, age: number, email: string) {
  return { name, age, email };
}

type CreateUserParams = Parameters<typeof createUser>; // [string, number, string]
The infer P captures the entire parameter list as a tuple. This becomes useful when building wrapper functions or decorators that need to preserve the original function’s signature.

What are mapped types?
Mapped types create new types by transforming properties of existing types. They work like a type-level for-loop and form the foundation of TypeScript’s utility types.

type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;
// {
//   readonly name: string;
//   readonly age: number;
// }
The [P in keyof T] iterates over each property in T. You can add modifiers like readonly or make properties optional with ?:

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type PartialUser = Partial<User>;
// {
//   name?: string;
//   age?: number;
// }
You can also transform property names using template literal types:

type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

type UserGetters = Getters<User>;
// {
//   getName: () => string;
//   getAge: () => number;
// }
How do you implement utility types?
Understanding how built-in utility types work shows deep TypeScript knowledge. Senior-level interviews often ask candidates to recreate these from scratch.

Pick selects specific properties from a type:

type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

type UserPreview = Pick<User, "id" | "name">;
// { id: number; name: string }
Omit excludes specific properties:

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type UserWithoutEmail = Omit<User, "email">;
// { id: number; name: string; age: number }
Record creates an object type with specified keys and values:

type Record<K extends keyof any, T> = {
  [P in K]: T;
};

type PageInfo = Record<"home" | "about" | "contact", { title: string; url: string }>;
// {
//   home: { title: string; url: string };
//   about: { title: string; url: string };
//   contact: { title: string; url: string };
// }
TypeScript Interview Questions for React
How do you type React components?
React components need types for props. Function components have become the standard way to write React code.

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

function Button({ label, onClick, disabled = false, variant = "primary" }: ButtonProps) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
}
Generic components work with any data type:

interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage
<List<number> 
  items={[1, 2, 3]} 
  renderItem={(num) => <span>Number: {num}</span>} 
/>
How do you type custom hooks?
Custom hooks follow the same typing rules as regular functions. The return type usually includes state and functions to modify that state.

Properly typed hooks enable type-safe reuse of logic across components.

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null
  });
  
  useEffect(() => {
    let cancelled = false;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch(error => {
        if (!cancelled) {
          setState({ data: null, loading: false, error });
        }
      });
    
    return () => {
      cancelled = true;
    };
  }, [url]);
  
  return state;
}

// Usage with typed data
interface User {
  id: number;
  name: string;
  email: string;
}

function UserList() {
  const { data, loading, error } = useFetch<User[]>("/api/users");
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {data?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
How do you type Higher-Order Components (HOCs)?
Higher-Order Components wrap existing components to add functionality. Typing them correctly, especially with generics, tests advanced TypeScript knowledge. This pattern appears frequently in senior-level React interviews.

An HOC is a function that takes a component and returns a new component with augmented properties:

import React, { ComponentType } from 'react';

// Simple HOC that injects a user prop
interface InjectedProps {
  user: {
    id: number;
    name: string;
  };
}

function withUser<P extends InjectedProps>(
  Component: ComponentType<P>
): ComponentType<Omit<P, keyof InjectedProps>> {
  return (props) => {
    const user = { id: 1, name: "Alice" };
    
    return <Component {...(props as P)} user={user} />;
  };
}

// Usage
interface ProfileProps extends InjectedProps {
  title: string;
}

function Profile({ user, title }: ProfileProps) {
  return (
    <div>
      <h1>{title}</h1>
      <p>User: {user.name}</p>
    </div>
  );
}

const EnhancedProfile = withUser(Profile);

// Now you can use it without passing user prop
<EnhancedProfile title="My Profile" />
The type signature must correctly define the intersection of the original component’s props and the new props introduced by the HOC. The Omit utility removes injected props from the wrapped component’s required props.

TypeScript Interview Questions for Node.js
How do you type Express middleware?
Express applications need typed middleware for request handling. You can extend Express types to add custom properties through declaration merging.

import { Request, Response, NextFunction } from 'express';

// Basic middleware
function logger(req: Request, res: Response, next: NextFunction): void {
  console.log(`${req.method} ${req.path}`);
  next();
}
Adding custom properties to the Request object:

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}

// Now you can use req.user safely
function authenticate(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization;
  
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }
  
  req.user = {
    id: 1,
    email: 'user@example.com',
    role: 'admin'
  };
  
  next();
}

function getProfile(req: Request, res: Response): void {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  res.json({ user: req.user });
}
This same declaration merging pattern works for extending other global objects. For the browser window object, create a global.d.ts file:

// global.d.ts
interface Window {
  __APP_CONFIG__: {
    apiUrl: string;
    version: string;
  };
}

// For Node.js environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      DATABASE_URL: string;
      API_KEY: string;
    }
  }
}
TypeScript Interview Questions for Angular
Angular is a TypeScript-first framework, making TypeScript proficiency essential for Angular developers. Angular interviews heavily emphasize RxJS and Observable typing.

What are Observables and how do you type them?
RxJS (Reactive Extensions for JavaScript) is a library for handling asynchronous data streams. Key concepts include: Observables are objects that emit multiple values over time, Observers are the consumers/listeners of the stream, and Operators are methods like map, filter, and switchMap that modify the data stream.

import { Observable, Observer } from 'rxjs';
import { map, filter } from 'rxjs/operators';

// Creating a typed Observable
const numbers$: Observable<number> = new Observable((observer) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
});

// Consuming with typed Observer
const observer: Observer<number> = {
  next: (value) => console.log('Received:', value),
  error: (err) => console.error('Error:', err),
  complete: () => console.log('Complete')
};

numbers$.subscribe(observer);
Practical example with HTTP requests:

interface User {
  id: number;
  name: string;
  email: string;
}

function getUsers(): Observable<User[]> {
  return new Observable((observer) => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        observer.next(data);
        observer.complete();
      })
      .catch(err => observer.error(err));
  });
}

// Using operators with types
const activeUserEmails$: Observable<string[]> = getUsers().pipe(
  map(users => users.filter(u => u.email.includes('@'))),
  map(users => users.map(u => u.email))
);
What’s the difference between Observable and Promise?
This question tests understanding of asynchronous patterns.

A Promise resolves with a single value, while an Observable can emit multiple values over time. Promises execute eagerly—they start running immediately when created—but Observables are lazy and only execute when you subscribe to them.

Once a Promise starts, you cannot cancel it, but Observables give you control through the unsubscribe() method, letting you stop the stream whenever needed.

Promises offer limited operators like then and catch, whereas Observables come with a rich operator library including map, filter, switchMap, and many more for transforming data streams.

// Promise - single value, eager execution
const userPromise: Promise<User> = fetch('/api/user/1')
  .then(res => res.json());

userPromise.then(user => console.log(user)); // Executes immediately

// Observable - multiple values, lazy execution
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

const ticks$: Observable<number> = interval(1000).pipe(take(5));

// Doesn't execute until subscribed
const subscription = ticks$.subscribe(tick => console.log('Tick:', tick));

// Can cancel
setTimeout(() => {
  subscription.unsubscribe(); // Stops emitting
}, 3000);
A Promise resolves with a single value and cannot be cancelled once started. An Observable can emit multiple values over time, is lazy (only executes upon subscription), and can be cancelled using unsubscribe().

Compiler Configuration Questions
What compiler options should you know?
The tsconfig.json file controls how TypeScript compiles your code. Several flags matter most for interviews.

The strict flag enables all strict type-checking options at once:

{
  "compilerOptions": {
    "strict": true
  }
}
This enables strictNullChecks, noImplicitAny, strictFunctionTypes, and other safety checks. Here’s what the major options catch:

// strictNullChecks - null and undefined must be explicit
let name: string;
name = null; // Error!

let optionalName: string | null;
optionalName = null; // OK

// noImplicitAny - must specify types explicitly
function process(data) { // Error: Parameter 'data' implicitly has 'any' type
  return data.length;
}

function processTyped(data: string[]) { // OK
  return data.length;
}

// strictPropertyInitialization - class properties need initialization
class User {
  name: string; // Error: Property 'name' has no initializer
  age: number = 0; // OK - initialized inline
  email: string;
  
  constructor(name: string, email: string) {
    this.name = name; // OK - initialized in constructor
    this.email = email;
  }
}
Enabling strict catches many common mistakes before they reach production. Most professional teams leave it enabled for maximum safety.

Master TypeScript for Your Next Interview
These questions cover what interviewers actually ask. Practice writing the code examples yourself rather than just reading them. Build small projects that use these patterns. The concepts stick better when you apply them to real problems.

Ready to strengthen your TypeScript skills? Mimo’s TypeScript course provides interactive lessons that build from fundamentals to advanced patterns. Each lesson includes hands-on coding exercises with instant feedback, helping you practice the exact concepts that come up in technical interviews.

Nowadays most modern ReactJS and NodeJS apps are created using TypeScript. Angular was already having it in-built. So, you go for a Reactt, Node or Angular interview, TypeScript questions ill be asked.

Question 1 — What is TypeScript?

TypeScript is a superset of JavaScript in which you add types to JavaScript. JavaScript is a loosely typed language which leads to lot of types error in production code. With TypeScript developers can catch those error, even before running the code.

Question 2 — What is explicit and implicit type assignment?

Explicit means writing out the type. Like below -

let firstName: string = "Nabendu";
Implicit means TypeScript will guess the type, based on the value. Like below type will be considered a number

let age = 41;
Question 3 — Difference between any, unknown and never in TypeScript?

The type of any is used to assign any type of a variable. It will not give error even if you reassign another type. Like below -

let x: any = 10;
x = 'hello'; // No TypeScript error
console.log(x.toUpperCase()); // No TypeScript error
The type unknown is better than type any, because it requires us checking the type before performing operations on value. Like below -

let y: unknown = 10;
// Type assertion needed before using y as number
if (typeof y === 'number') {
    console.log(y.toFixed(2));
}
The type never represents value that never occurs. It is typically used for return statements of function that doesn’t returns properly. Like below -

function throwError(message: string): never {
    throw new Error(message);
}
Question 4 — How do you give the type of Arrays?

For typing array, we need to give the type as below. In this below example the array can contain type of string only.

const names: string[] = ["Nabendu", "Shikha", "Hriday"];
names.push("Dylan"); // no error
We can also use a readonly keyword, which prevents the array been changed.

const names: readonly string[] = ["Nabendu", "Shikha", "Hriday"];
names.push("Jack"); // Error: Property 'push' does not exist on type 'readonly string[]'.
Question 5 — What is Type Inference in array?

If we don’t give any type to an array, it will infer the type. Like below -

const numbers = [1, 2, 3]; // inferred to type number[]
numbers.push(4); // no error
Question 6 — What are tuples?

It is a type array with pre-defined length and types. It is very useful in giving types of mixed array with different types, like below.

let ourTuple: [number, boolean, string];

// initialize correctly
ourTuple = [5, false, 'Coding Hero was here'];
Question 7 — What are readonly tuples?

If we don’t make a tuple readonly, we can add more items to the one defined and TypeScript will not throw any error, like below.

let ourTuple: [number, boolean, string];

// initialize correctly
ourTuple = [5, false, 'Coding Hero was here'];
//No safety in indexes from 3
ourTuple.push('This is wrong');
Now, to fix it we use the keyword readonly before the type.

let ourTuple: readonly [number, boolean, string];
// initialize correctly
ourTuple = [5, false, 'Coding Hero was here'];
// throws error as it is readonly
ourTuple.push('Coding Hero took a day off');
Question 8 — How to give the types for Objects?

We can give the type of object by creating another object like structure and specifying the keys and the type of the keys in the object.

const car: { brand: string, model: string, year: number } = {
  brand: "Tata",
  model: "Tiago",
  year: 2016
};
Question 9 — How to have optional properties in Objects?

To give an optional property or key, we need to add the ? after thet key, like below.

const car: { brand: string, model: string, year?: number } = {
  brand: "Tata",
  model: "Punch"
};
Question 10 — Explain enum in TypeScript?

An enum is a type of variables which are constants. You have to use the values within it only. The values are numeric by default and starts with 0 and increments by 1.

enum allDirections { North, East, South, West }

let currentDirection = allDirections.North;
console.log(currentDirection);
// logs 0
Question 11 — What is String enum?

If you want the enum to contain strings instead of the default number, you need to specify the same.

enum allDirections {
  North = "North",
  East = "East",
  South = "South",
  West = "West"
};

let currentDirection = allDirections.North;
console.log(currentDirection);
// logs "North"
Question 12 — What are Type Aliases?

They allow to define type with a custom name and can be used for all primitive types like string and number and also complex type like objects and arrays. Like below -

type Year = number
type Type = string
type Model = string
type Car = {
  year: Year,
  type: Type,
  model: Model
}

const carYear: Year = 2005
const carType: Type = "Tata"
const carModel: Model = "Tiago"
const car: Car = {
  year: Year,
  type: Type,
  model: Model
};
Question 13 — What are interfaces?

Interfaces are like type but can be used only for objects. Like below -

interface Square {
   length: number
}

const square: Square {
  length: 20
}
Question 14 — How to extend interfaces?

Interfaces can be extended with the extend keyword. Like below -

interface Square {
   length: number
}

interface ColorSquare extends Square {
    color: string
}

const square: ColorSquare {
  length: 20,
  color: blue
}
Question 15 — What are Union types?

Union types are used when the property can be more then one value, like string or number. For this reason, they are also called OR and are used by using | symbol. Like below -

function printSucessCode(code: string | number) {
  console.log(`My success code is ${code}.`)
}
printSucessCode(200);
printSucessCode('200');
Question 16 — How to give the return type in function?

We can give the return types of functions with : symbol after function name. Like below -

function getSum(): number {
    return 24;
}

function printMessage(): void {
    console.log("Good Morning");
}
Question 17 — How to give type of parameters in function?

We can give the type of parameters by mentioning them after each parameter with : symbol.

function sum(a: number, b: number) {
  return a + b;
}
Question 18 — How to give optional, default and rest parameters in function?

With default parameter, we can mark a parameter as optional. Like this, where c is optional and denoted by ?.

function substract(a: number, b: number, c?: number) {
  return a - b -(c || 0);
}
The default values(an ES6 feature), goes after the type/ Like below -

function multiply(a: number, b: number=10) {
  return a * b;
}
The rest parameters(an ES6 feature), are given the type of array, because they convert passed items in array. Like below -

function add(a: number, b: number, ...rest: number[]) {
  return a + b + rest.reduce((acc, curr) => acc+ curr, 0);
}
Question 19 — What is casting in TypeScript?

Casting is the process of overriding a type of a variable. Like in the below example, the type is unknown but is made string while using with the as keyword.

let y: unknown = 'Welcome';
console.log((y as string).length);
We can also use <> in place of as. Both means the same.

let y: unknown = 'Welcome';
console.log((<string>y).length);
Question 20 — How to give type of a variable in Class?

In this simple example, we have given the type of name as string in a class.

class Developer {
  name: string;
}

const dev = new Developer();
dev.name = "Nabendu";
Question 21 — What is public, private and protected in TypeScript classes?

Below is the meaning of all -

public — Default if not mentioned and allows the class member to be accessed from anywhere.
private- The class member can be accessed from only within the class.
protected — The class member can be accessed by itself or an inherited class.
Example of public -

class Developer {
  public name: string;
}

const dev = new Developer();
dev.name = "Nabendu";
Example of private. Note that we generally have a get function to access the private member.

class Developer {
  private name: string;

  public constructor(name: string) {
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }
}

const dev = new Developer("Nabendu");
console.log(person.getName());
We can also write the shorthand version of above, by directly adding the private variable in the constructor.

class Developer {
  public constructor(private name: string) {}

  public getName(): string {
    return this.name;
  }
}

const dev = new Developer("Nabendu");
console.log(person.getName());
For protected we need to inherit from a base class, which we do with the extends keyword. Also, we can get data from an interface to a class, using the implements keyword.

interface Shape {
  getArea: () => number;
}
      
class Rectangle implements Shape {
  public constructor(protected width: number, protected height: number) {}

  public getArea(): number {
    return this.width * this.height;
  }
}
      
class Square extends Rectangle {
  public constructor(width: number) {
    super(width, width);
  }
}

const mySq = new Square(20);
console.log(mySq.getArea()); //Logs 400
Question 22 — What is the readonly keyword in reference to classes in TypeScript?

The readonly keyword prevent a class member from being changed. We generally use readonly with private or protected members.

In the below example, name cannot be changed after the initial definition.

class Developer {
  private readonly name: string;

  public constructor(name: string) {
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }
}

const dev = new Developer("Nabendu");
console.log(person.getName());
Question 23 — How to implement overriding in classes of TypeScript?

Overriding is an important OOPs concept, where the inherited class overrides a function(mostly) in it’s parent class. We implement the same by using override keyword in the function.

interface Shape {
  getArea: () => number;
}

class Rectangle implements Shape {
  public constructor(protected readonly width: number, protected readonly height: number) {}

  public getArea(): number {
    return this.width * this.height;
  }

  public toString(): string {
    return `Rectangle width is ${this.width} and height is ${this.height}`;
  }
}

class Square extends Rectangle {
  public constructor(width: number) {
    super(width, width);
  }

  public override toString(): string {
    return `Square width is ${this.width}`;
  }
}

const square = new Square(20);
console.log(square.toString()); // Logs - Square width is 20
Question 24 — What are Abstract classes?

When we declare a base class with abstract keyword, we cannot create objects for the same. In this method, we generally use the methods of the abstract class in a child class.

Also, if we add abstract keyword in front of a function inside base class, we need to create it in the child class. But this is not required for a non-abstract function.

abstract class Polygon {
  public abstract getArea(): number;

  public toString(): string {
    return `Polygon area is ${this.getArea()}`;
  }
}

class Rectangle extends Polygon {
  public constructor(protected width: number, protected height: number) {
    super();
  }

  public getArea(): number {
    return this.width * this.height;
  }
}

const rect = new Rectangle(10,20);
console.log(rect.getArea()); // Logs - 200
console.log(rect.toString());// Logs - Polygon area is 200
Question 25 — What are Singleton classes.

The Singleton classes are special types of classes, to ensure that we only have one instance of a class.

To make this class, we make the constructor private, preventing the use of new to create objects. Next, we use static method to create a single instance of the class. The example is below -

class Coder {
  private static instance: Coder;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new Coder();
    return this.instance;
  }
}

const c1 = Coder.getInstance();
const c2 = Coder.getInstance();

console.log(c1 === c2); //Logs - true
Question 26 — What are Generics in TypeScript. Give examples in functions, classes and type aliases.

Generics allows to create type variables which can be used to create classes, functions and type aliases. Here, we don’t have to define the types that they use.

Function example -

function createArray<S, T>(v1: S, v2: T): [S, T] {
  return [v1, v2];
}

console.log(createArray<string, number>('JS', 42)); //Logs - ['JS', 42]
Class example -

class GenericClass<T> {
  private _value: T | undefined;

  constructor(private name: string) {}

  public setValue(value: T) {
    this._value = value;
  }

  public getValue(): T | undefined {
    return this._value;
  }

  public toString(): string {
    return `${this.name}: ${this._value}`;
  }
}
      
const value = new GenericClass<number>('theNum');2
value.setValue(10);
console.log(value.toString()); // theNum: 10
Type aliases example -

type Numberic<T> = { value: T };
const ageValue: Numberic<number> = { value: 40 };
Question 27 — What is Partial, utility type.

Partial changes all the properties to be optional in an object. In the below example, the interface have width and height. But, we have given only width because ew have made rectPart as Partial.

interface Rectangle {
  width: number;
  height: number;
}
            
let rectPart: Partial<Rectangle> = {}; 
rectPart.width = 100;

console.log(rectPart); // Logs - { width: 100 }
Question 28 — What is Required, utility type.

Required changes all the properties to be required in an object. In the belo example, the milage is made optional in the interface. But when we had made it Required while creating the object, we are forced to give the milage.

interface Car {
  make: string;
  model: string;
  mileage?: number;
}
            
let myCar: Required<Car> = {
  make: 'Tata',
  model: 'Tiago',
  mileage: 20 // `Required` forces mileage to be defined
};

console.log(myCar); // Logs - { make: 'Tata', model: 'Tiago', mileage: 20 }
Question 29 — What is Record, utility type.

Record is a shortcut to define an object, with specified key type and value type.

const nameAgeObj: Record<string, number> = {
  'Nabendu': 42,
  'Shikha': 41
};

console.log(nameAgeObj);// Logs - { Nabendu: 42, Shikha: 41 }
Question 30 — What is Omit, utility type.

Omit removes keys from any object type. Like in the below example, omit have removed age and location from the type, which cannot be defined.

interface Coder {
  name: string;
  age: number;
  location?: string;
}
    
const nabs: Omit<Coder, 'age' | 'location'> = {
  name: 'Nabendu'
};

console.log(nabs); // Logs - { name: 'Nabendu' }
Question 31— What is Pick, utility type.

Pick removes all the keys from any object, excep the specified keys. Like in the below example, pick have removed age and location from the type, which cannot be defined.

interface Coder {
  name: string;
  age: number;
  location?: string;
}
    
const nabs: Pick<Coder, 'name'> = {
  name: 'Nabendu'
};

console.log(nabs); // Logs - { name: 'Nabendu' }
Question 32 — What is Exclude, utility type.

Exclude is used to removes types from a union. Like in the below example boolean cannot be used, because it is excluded.

type Marks = string | number | boolean;

const value: Exclude<Marks, boolean> = '56';

console.log(typeof value); // Logs - string
Question 33 — What is Readonly, utility type.

Readonly is used to create a type which cannot be modified once assigned a value. Like in the below example once we had assigned a value to the person object, it cannot be changed.

interface Person {
    name: string;
    age: number;
}

const person: Readonly<Person> = {
    name: "Nabendu",
    age: 42,
};

person.name = 'Parag'; // Logs error
Question 34 — What is Nullish Coalescence.

Nullish Coalescence is used in expressions which have a fallback feature while dealing with null or undefined. It is used with the ?? operator.

Like in the below example mileage can be number, null or undefined. Here, we are using ?? to make it NA when the value is null or undefined.

function showMileage(mileage: number | null | undefined) {
  console.log(`Mileage: ${mileage ?? 'NA'}`);
}
            
showMileage(null); // Logs 'Mileage: NA'
showMileage(0); // Logs 'Mileage: 0'
showMileage(undefined); // Logs 'Mileage: NA'



TypeScript Interview Questions and Answers
Last Updated :
27 Jul, 2026
TypeScript is a statically typed superset of JavaScript developed by Microsoft. It adds static typing and modern JavaScript features to improve code quality, scalability, and maintainability. Widely used by companies like Microsoft, Meta, LinkedIn, and Evernote, it helps developers catch errors early and build reliable applications.

1. Explain the data types available in TypeScript.
TypeScript provides two categories of data types:

1. Built-in Data Types:

string: Stores text values.
number: Stores numeric values.
boolean: Stores true or false.
null: Represents an empty value.
undefined: Represents an uninitialized variable.
any: Accepts values of any type.
unknown: Stores unknown values safely.
void: Used for functions that return no value.
never: Used for functions that never return.
2. User-defined Data Types:

Array: Stores multiple values of the same type.
Tuple: Stores fixed-size values of different types.
Enum: Defines a set of named constants.
Class: Creates objects with properties and methods.
Interface: Defines the structure of an object.
Type Alias: Creates a custom name for a type.
2. In how many ways we can declare variables in TypeScript?
TypeScript provides three ways to declare variables:

var: Function-scoped. It can be redeclared and updated. Generally not recommended in modern TypeScript.
let: Block-scoped. It can be updated but cannot be redeclared within the same scope.
const: Block-scoped. It cannot be reassigned after initialization.
var name = "John";
let age = 25;
const country = "India";
3. How you can declare a explicit variables in Typescript?
You can declare an explicitly typed variable by specifying its data type after the variable name using a colon (:).

Syntax:
let variableName: dataType = value;
Example:

let companyName: string = "GeeksforGeeks";

companyName = "Cricket";   // Valid
companyName = 28;          // Error: Type 'number' is not assignable to type 'string'
This ensures type safety by allowing only values of the declared data type.

4. How to declare a function with typed annotation in TypeScript?
In TypeScript, you can declare a function by specifying the types of its parameters and its return type.

Example:

function getDetails(name: string, age: number): string {
  return `My name is ${name} and my age is ${age}.`;
}

console.log(getDetails("Emrit", 22)); // Valid
console.log(getDetails("Neha", "18")); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
5. Describe the "any" type in TypeScript.
The any type allows a variable to hold a value of any data type, disabling TypeScript's type checking for that variable. It is useful when the type of data is unknown, such as data received from an API or user input.

Example:

let studentData = `{
  "studentName": "Aakash",
  "studentID": 12345,
  "studentCourse": "B.Tech"
}`;

let student: any = JSON.parse(studentData);

console.log(student.studentName);
6. What are the advantages of using TypeScript?
Some key advantages of TypeScript are:

Static Typing: Detects type-related errors at compile time.
Compiles to JavaScript: Runs in all modern browsers and JavaScript environments.
Better IDE Support: Provides IntelliSense, auto-completion, and code navigation.
Improved Code Maintainability: Makes large applications easier to read and maintain.
Easy Refactoring: Helps safely rename variables, methods, and classes.
Supports Modern JavaScript Features: Includes the latest ECMAScript features with backward compatibility.
Better Scalability: Ideal for developing large and enterprise-level applications.
7. List some disadvantages of using TypeScript.
Some disadvantages of TypeScript are:

Compilation Required: TypeScript must be transpiled into JavaScript before execution.
Longer Build Time: Compilation can increase build time, especially in large projects.
Learning Curve: Developers need to learn TypeScript's type system and additional features.
Additional Configuration: Setting up tsconfig.json and build tools adds complexity.
Type Definitions: Some third-party libraries may require separate type definition packages (@types) if they don't include their own types.
8. Explain the void type in TypeScript.
The void type represents the absence of a return value. It is primarily used as the return type of functions that do not return any value.

Example:

function favGame(): void {
  console.log("My favourite game is Cricket.");
}

favGame();
9. What is type null and its use in TypeScript?
The null type represents the intentional absence of a value. It is commonly used to indicate that a variable or object currently has no value. In TypeScript, null is typically used with union types (e.g., string | null).

Example:

function getData(orgName: string | null): void {
  if (orgName === null) {
    console.log("No organization name provided.");
  } else {
    console.log(orgName);
  }
}

getData(null);
getData("GeeksforGeeks");
10. Describe the syntax for creating objects in TypeScript.
An object in TypeScript is a collection of key-value pairs, where each property has a defined type.

Example:

const myObj: { name: string; desc: string } = {
  name: "GeeksforGeeks",
  desc: "A Computer Science Portal",
};

console.log(myObj);
11. Can we specify the optional properties to TypeScript Object, if Yes, explain How?
Yes. TypeScript allows you to define optional properties in an object using the ? operator. Optional properties are not required when creating the object.

Example:

const myObj: { name: string; desc: string; est?: number } = {
  name: "GeeksforGeeks",
  desc: "A Computer Science Portal",
};

console.log(myObj);

myObj.est = 2008;
console.log(myObj);
12. Explain the undefined type in TypeScript.
The undefined type represents a variable that has been declared but not assigned a value. It is also used for optional properties and function parameters that are not provided.

13. Explain the behavior of arrays in TypeScript.
TypeScript arrays are JavaScript arrays with static type checking. By default, an array stores elements of the specified type, and TypeScript reports a compile-time error if a value of a different type is added.

Example:

const numbers: number[] = [1, 23, 28, 56];

console.log(numbers);

numbers.push("GeeksforGeeks"); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
14. How can you compile a TypeScript file?
To compile a TypeScript file, you use the tsc (TypeScript Compiler) command. You can compile a TypeScript file by running:

tsc filename.ts
This command compiles the .ts file into a .js (JavaScript) file. Make sure to have TypeScript installed globally or locally in your project for this to work.

15. Differentiate between the .ts and .tsx file extensions given to the TypeScript file.
.ts

.tsx

Contains only TypeScript code.

Contains TypeScript code with JSX syntax.

Used for utility functions, classes, interfaces, services, and other non-UI logic.

Primarily used for React components that return JSX.

Does not support JSX.

Supports JSX and TypeScript together.

16. What is "in" operator and why it is used in TypeScript?
The in operator is used to check whether a property exists in an object. It returns true if the property is present; otherwise, it returns false. It is also commonly used for type narrowing when working with union types.

const person = {
  name: "John",
  age: 25,
};

console.log("name" in person); // true
console.log("city" in person); // false
17. Explain the union types in TypeScript?
A union type allows a variable, parameter, or property to hold one of multiple specified types. It is defined using the pipe (|) operator.

let variableName: type1 | type2;
18. Explain type alias in TypeScript?
A type alias is used to create a custom name for an existing type. It does not create a new type; it simply provides a more meaningful and reusable name for a type.

type TypeName = ExistingType;
19. Is TypeScript strictly statically typed language?
No. TypeScript is an optionally statically typed language. It supports static typing, but developers can choose whether to explicitly specify types or rely on type inference. Additionally, the any type can be used to disable type checking for a variable.

20. Is template literal supported by TypeScript?
Yes. TypeScript supports template literals, just like JavaScript. They use backticks (`) and allow you to embed expressions or variables inside strings using the ${} syntax. They also support multi-line strings.

21. How to declare a arrow function in TypeScript?
An arrow function in TypeScript is declared using the same syntax as JavaScript. You can optionally specify the types of its parameters and return type using type annotations.

Example:

const typedArrowFunc = (orgName: string, desc: string): string => {
  return `Organization: ${orgName}, Description: ${desc}`;
};

console.log(typedArrowFunc("GeeksforGeeks", "A Computer Science Portal"));
22. How to define a function which accepts the optional parameters?
You can define an optional parameter by adding the ? operator after the parameter name. Optional parameters are not required when calling the function and must be placed after required parameters.

Example:

function cricketer(name: string, runs?: number): void {
  if (runs === undefined) {
    console.log(`Cricketer Name: ${name}, Runs Scored: Not Available`);
  } else {
    console.log(`Cricketer Name: ${name}, Runs Scored: ${runs}`);
  }
}

cricketer("Virat Kohli", 26000);
cricketer("Yuzvendra Chahal");
23. Explain noImplicitAny in TypeScript.
noImplicitAny is a compiler option in tsconfig.json that prevents TypeScript from assigning the any type implicitly. When enabled, the compiler reports an error if a variable or parameter has an inferred any type.

Example:

function greet(name) {
  console.log(name);
}
With noImplicitAny: true, the above code produces an error because name implicitly has the any type.

function greet(name: string) {
  console.log(name);
}
24. What are interfaces in TypeScript?
An interface in TypeScript defines the structure (contract) that an object or class must follow. It specifies the properties and methods without providing their implementation. Interfaces are declared using the interface keyword.

25. In how many ways you can use the for loop in TypeScript?
TypeScript supports the following ways to iterate over data:

for loop: Used when you need an index or a fixed number of iterations.
for...of loop: Iterates over the values of an iterable, such as an array or string.
for...in loop: Iterates over the keys or property names of an object.
forEach() method: An array method that executes a callback function for each element.
// for loop
for (let i = 0; i < 3; i++) { }

// for...of
for (const item of myArray) { }

// for...in
for (const key in myObject) { }

// forEach()
myArray.forEach((item) => { });
26. What is never type and its uses in TypeScript?
The never type represents values that never occur. It is used for functions that never return normally, such as functions that always throw an error or run in an infinite loop. Unlike void, a never function does not return any value.

Example:

function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}
27. Explain the working of enums in TypeScript?
An enum is a TypeScript feature used to define a collection of named constants. Enums improve code readability by assigning meaningful names to constant values. TypeScript supports both numeric and string enums.

By default, numeric enum values start from 0 and increment by 1, but you can specify a custom starting value.

Example:

enum DemoEnum {
  Milk = 1,
  Curd,
  Butter,
  Cheese,
}

let item: DemoEnum = DemoEnum.Butter;

console.log(item); // 3
28. Explain the parameter destructuring in TypeScript.
Parameter destructuring allows you to extract object properties directly in the function parameter list instead of accessing them inside the function body. It makes the code cleaner and more readable.

function getOrganisation(
  { orgName, orgDesc }: { orgName: string; orgDesc: string }
) {
  console.log(`Organization: ${orgName}, Description: ${orgDesc}`);
}

getOrganisation({
  orgName: "GeeksforGeeks",
  orgDesc: "A Computer Science Portal",
});
29. Explain type inference in TypeScript.
Type inference is the process by which TypeScript automatically determines the type of a variable, parameter, or function return value based on the assigned value. This reduces the need for explicit type annotations while maintaining type safety.

let name = "John";   // Inferred as string
let age = 25;        // Inferred as number
let isAdmin = true;  // Inferred as boolean
30. What are modules in TypeScript?
Modules are used to organize code into separate files, making it easier to manage, reuse, and maintain. A module can export functions, classes, interfaces, types, variables, or constants, which can be imported into other files using the import statement.

Example:

// math.ts
export function multiply(a: number, b: number): number {
  return a * b;
}
// app.ts
import { multiply } from "./math";

console.log(multiply(5, 4));
31. In how many ways you can classify Modules?
In modern TypeScript, modules are based on the ES Module system. A file becomes a module if it contains at least one import or export statement.

There are two commonly used module systems:

ES Modules (ESM): The standard module system in modern TypeScript. Uses the import and export keywords and is recommended for new projects.
CommonJS Modules: Uses require() and module.exports. It is mainly used in older Node.js projects and for compatibility.
32. What is the use of tsconfig.json file in TypeScript?
The tsconfig.json file is the configuration file for a TypeScript project. It specifies the compiler options and controls how the TypeScript compiler (tsc) compiles the project.

Some common configurations include:

Compiler options: Target JavaScript version, module system, strict mode, output directory, etc.
Project settings: Specify which files or folders to include or exclude from compilation.
Project root: Marks the directory as the root of the TypeScript project.
33. What are Decorators in TypeScript?
Decorators are a special syntax used to add metadata or modify the behavior of classes and class members, such as methods, properties, accessors, and parameters. They are declared using the @ symbol and are commonly used in frameworks like Angular and NestJS.

function Logger(target: Function) {
  console.log("Class created:", target.name);
}

@Logger
class Person {}
34. How to debug a TypeScript file?
A TypeScript file can be debugged using source maps, which map the generated JavaScript code back to the original TypeScript code. Source maps can be generated using the --sourceMap compiler option or by enabling "sourceMap": true in the tsconfig.json file.

tsc --sourceMap script.ts
This generates:

script.js
script.js.map
These files allow debuggers such as VS Code or browser Developer Tools to debug the original TypeScript source.

35. Describe anonymous functions and their uses in TypeScript?
An anonymous function is a function without a name. It is commonly used as a callback function, especially for event handling, timers, and array methods.

Example:

myBtn.addEventListener("click", function () {
  console.log("Button clicked");
});
36. Is it possible to call the constructor function of the base class using the child class?
Yes. In TypeScript, a child class can call the base class constructor using the super() method. If the base class constructor accepts parameters, they must be passed to super(). The super() call must be made before using this in the child class constructor.

37. How to combine multiple TypeScript files and convert them into single JavaScript file?
TypeScript provides the --outFile compiler option to combine multiple TypeScript files into a single JavaScript file. This option is mainly used with amd or system module formats and is not supported with modern ES Modules.

tsc --outFile combined.js script1.ts script2.ts script3.ts
38. Explain type of operator in TypeScript and where to use it.
The typeof operator is used to determine the type of a value at runtime. In TypeScript, it can also be used in type annotations to reuse the type of an existing variable.

Example:

const strVar = "GeeksforGeeks";
const numVar = 28;

console.log(typeof strVar); // "string"
console.log(typeof numVar); // "number"

const strVar2: typeof strVar = "Cricket";
const numVar2: typeof numVar = 25;
39. How you can compile a TypeScript file?
TypeScript code cannot be executed directly. It must first be compiled (transpiled) into JavaScript using the TypeScript Compiler (tsc).

tsc script.ts
40. Which principles of Object Oriented Programming are supported by TypeScript?
TypeScript supports all four fundamental OOP principles:

Abstraction: Hides implementation details and exposes only essential functionality using abstract classes and interfaces.
Encapsulation: Restricts direct access to data using access modifiers such as public, private, and protected.
Inheritance: Allows a class to inherit properties and methods from another class using the extends keyword.
Polymorphism: Allows the same method or interface to have different implementations through method overriding and interfaces.
41. Explain Mixins in TypeScript
Mixins are a way to reuse functionality across multiple classes. They allow a class to combine behaviors from multiple sources without using multiple inheritance. A mixin is typically implemented as a function that takes a class and returns a new class with additional functionality.

42. Is it possible to create the immutable Object properties in TypeScript?
Yes. TypeScript allows you to make object properties immutable by using the readonly keyword. A readonly property can only be assigned a value during object initialization or in a class constructor. Any attempt to reassign it later results in a compile-time error.

TypeScript Interview Questions For Experienced
43. In what situation you should use a class and a interface?
Use an interface when you want to define the structure or contract of an object or class without providing an implementation. It is commonly used for type checking and enforcing a consistent shape.

Use a class when you need to create objects with properties, methods, constructors, and implementations. Classes also support OOP features such as encapsulation, inheritance, abstraction, and polymorphism.

44. What are the differences between the classes and the interfaces in TypeScript?
Class

Interface

Declared using the class keyword.

Declared using the interface keyword.

Contains both declarations and implementations.

Contains only property and method declarations.

Can have constructors, access modifiers, and method implementations.

Cannot have constructors or method implementations.

Used to create objects.

Used to define the structure (contract) of objects or classes.

Supports inheritance using extends.

Can be extended by other interfaces and implemented by classes.

45. How to declare a class in TypeScript?
A class in TypeScript is declared using the class keyword. It can contain properties, constructors, and methods, all of which can have type annotations.

Example:

class Cricketer {
  name: string;
  runs: number;

  constructor(name: string, runs: number) {
    this.name = name;
    this.runs = runs;
  }

  updateRuns(): number {
    this.runs += 139;
    return this.runs;
  }
}
46. How the inheritance can be used in TypeScript?
Inheritance is an OOP feature that allows a child class to inherit the properties and methods of a parent class. It is implemented using the extends keyword. The child class can also add new members or override inherited methods.

class Person {
  constructor(public name: string) {}
}

class Employee extends Person {
  constructor(name: string, public id: number) {
    super(name);
  }
}

const emp = new Employee("John", 101);
47. What are the different ways for controlling the visibility of member data?
TypeScript provides three access modifiers to control the visibility of class members:

public: The default access modifier. Members can be accessed from anywhere in the program.
private: Members can only be accessed within the same class. They are not accessible outside the class or by derived classes.
protected: Members can be accessed within the same class and by its derived (child) classes, but not from outside the class.
48. How to convert a .ts file into TypeScript Definition file?
You can generate a TypeScript declaration file (.d.ts) using the --declaration compiler option. The declaration file contains only type information (such as interfaces, classes, functions, and type definitions) without the implementation.

Command:

tsc --declaration script.ts
This command generates:

script.js
script.d.ts
49. Is it possible to create the static classes in TypeScript?
No. TypeScript does not support static classes like C#. However, it does support static members (properties and methods) inside a class using the static keyword.

For utility functions or constants, TypeScript typically uses modules or top-level exports instead of static classes.

50. Explain conditional typing in TypeScript?
Conditional types allow you to select one type or another based on a condition. They use a syntax similar to the ternary operator and are evaluated at compile time.

Comment
A

abhish8rzd




Top 40 TypeScript Interview Questions and Answers for 2026
This guide helps you prepare for TypeScript interviews with essential questions, clear answers, real-world examples, and expert tips for success.
Nov 20, 2025
 · 14 min read
Explore with AI
Contents
Basic TypeScript Interview Questions
TypeScript Type System Interview Questions
Advanced TypeScript Interview Questions
TypeScript Functions and Objects Interview Questions
TypeScript OOP Interview Questions
Practical TypeScript Interview Questions
TypeScript Configuration and Tooling Interview Questions
Tips for Acing Your TypeScript Interview
Conclusion
FAQs
TypeScript has evolved from a niche JavaScript superset into a core language for modern web development. 

In my experience working on web applications, I have seen firsthand how strong typing and maintainability can significantly reduce bugs and improve collaboration across teams. 

TypeScript provides all of this, which is why it has become an industry standard for modern development.

From Microsoft (its creator) to Google, Airbnb, and Netflix, many organizations rely on TypeScript to power products written in frameworks such as React, Angular, and Node.js. 

In my work, I have often seen job postings where TypeScript proficiency is listed as a core requirement, and not an optional skill.

Having used TypeScript myself, it is safe to say that understanding its types, interfaces, and advanced features is essential for any developer preparing for technical interviews.

Basic TypeScript Interview Questions
Let’s now look at some common TypeScript interview questions and how they relate to code safety and clarity.

1. Why use TypeScript over JavaScript?
TypeScript adds static typing and compile-time error checking, which helps developers detect bugs early and make codebases more predictable.

This ensures better maintainability and scalability.

2. What problems does TypeScript solve?
TypeScript addresses JavaScript’s weaknesses in type safety, scalability, and readability.

Enforcing clear type definitions prevents subtle runtime bugs and makes refactoring safer.

3. What are the main benefits of using static typing in TypeScript?
Static typing improves code reliability, auto-completion, and developer productivity.

It helps with early detection of type errors and allows IDEs to provide richer tooling support.

4. What are type annotations and why are they useful?
Type annotations allow developers to declare variable types explicitly.

This improves code readability and reduces runtime errors.

Here is an example:

let username: string = "DataCamper";
let age: number = 25;
let isAdmin: boolean = true;

Powered By 
In the above code, the compiler ensures that only the correct type can be assigned to each variable.

For example, if you try to assign a string to age, TypeScript will throw an error, which helps catch mistakes early.

Explicit typing is especially important for function parameters, return types, and API contracts, as it communicates expectations to other developers.

5. What is type inference in TypeScript?
TypeScript can automatically infer types based on assigned values.

This means you don’t always need to explicitly declare a type. TypeScript figures it out for you.

Here is an example:

let count = 10;  // inferred as number
count = "hello"; // Error: Type 'string' is not assignable to type 'number'

Powered By 
In this example, TypeScript infers that count must be a number based on its initial value, so assigning a string later causes a compile-time error. 

Best practices for type inference include:

Use explicit types for exported functions, classes, and interfaces to provide clear contracts.
Allow inference for local variables when the type is obvious.
Avoid using any unless absolutely necessary, as it bypasses TypeScript’s safety features.
6. How does TypeScript handle arrays, tuples, and enums?
TypeScript allows developers to enforce strict types on arrays, tuples, and enums to improve clarity and prevent runtime errors.

Here is a typed array example:

let scores: number[] = [95, 80, 85];
scores.push(100); // OK
scores.push("A+"); // Error

Powered By 
Typed arrays ensure that all elements in the array follow the same type.

Here is a tuple example:

let user: [string, number] = ["Don", 25];

Powered By 
Tuples define fixed-length arrays with specific types for each position.

They are useful for structured data where the order and type of elements matter.

Here is an enum example:

enum Status {
  Active,
  Inactive,
  Pending,
}
let currentStatus: Status = Status.Active;

Powered By 
Enums provide named constants, improving readability and reducing invalid values.

They are especially useful for status codes, roles, and configuration options.

7. What is the difference between any, unknown, and never types?
The following table highlights the key differences between the any, unknown, and never types in TypeScript.

Type

Description

any

Disables type checking entirely, allowing any value.

unknown

Safer alternative to any, you must check the type before using it.

never

Represents values that never occur (e.g., functions that always throw).

Here is an example:

function fail(): never {
  throw new Error("Something went wrong");
}

Powered By 
A tip would be to prefer unknown over any to maintain type safety while retaining flexibility.

8. What is the difference between null and undefined in TypeScript?
The key differences between null and undefined are:

undefined means a variable has been declared but not assigned a value.

null is an explicit value meaning no value.

TypeScript's strictNullChecks mode treats them as separate types, which prevents accidental null-related bugs.

Here is an example:

let a: string | null = null;
let b: string | undefined = undefined;

Powered By 
9. What does the strict compiler option do?
The strict flag enables all of TypeScript’s strict type-checking rules, such as:

strictNullChecks: Prevents null and undefined values from being assigned to variables unless explicitly allowed, helping avoid runtime null reference errors.
noImplicitAny: Requires all variables to have explicit types or inferred types, preventing TypeScript from defaulting to any.

strictFunctionTypes: Enforces stricter rules for function type compatibility, catching mismatches in function parameter and return types.

strictBindCallApply: Ensures that the bind, call, and apply methods are used with the correct argument types for functions.

It ensures safer, more predictable code and catches subtle bugs early.

TypeScript Type System Interview Questions
Let’s now look at some key TypeScript type system concepts commonly discussed in technical interviews.

10. What is the difference between interfaces and type aliases in TypeScript?
Both interfaces and type aliases describe the shape of objects, but they serve slightly different purposes.

Interfaces can be extended using extends, which makes them ideal for hierarchical object models.

Type aliases can represent unions, intersections, primitives, and more complex composite types.

Here is an example:

interface Person {
  name: string;
  age: number;
}

type Employee = {
  name: string;
  department: string;
};

Powered By 
Use interfaces when defining object shapes or class contracts.

Use type aliases when you need flexible, composable types like unions or intersections.

11. What are union and intersection types in TypeScript?
Union types allow a variable to hold multiple possible types, while intersection types combine multiple types into one.

Here is a union example:

let id: string | number;
id = ‘abc’; // OK
id = 123; // OK

Powered By 
Here is an intersection example:

type Admin = { name: string };
type Permissions = { canEdit: boolean };
type AdminUser = Admin & Permissions;

Powered By 
Union types are often used in function parameters.

Intersection types are common in complex object compositions.

12. What is type narrowing, and how do type guards work?
Type narrowing lets TypeScript infer a more specific type based on control flow.

Here is an example:

function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed());
  }
}

Powered By 
Type guards ensure safe runtime operations by verifying the type before performing specific actions.

You can use:

typeof: for primitives

instanceof: for classes

Custom type guards: using the param is Type syntax

Type guards improve type safety and reduce runtime errors.

13. What are literal types and discriminated unions in TypeScript?
Literal types restrict a variable to a specific set of predefined values.

Here is an example:

let direction: "up" | "down" | "left" | "right";

Powered By 
Discriminated unions combine literal types with object variants for pattern matching.

Here is an example:

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function area(shape: Shape): number {
  if (shape.kind === "circle") return Math.PI * shape.radius ** 2;
  return shape.side ** 2;
}

Powered By 
Discriminated unions allow safe branching on object types and simplify logic in complex applications.

14. What are keyof, typeof, and in in TypeScript?
These operators provide powerful type-level reflection.

Keyof: gets the property names of a type

typeof: gets the type of a value

in: used in mapped types

Here is an example:

type Keys = keyof User; // "name" | "age"
const person = { name: "Alice", age: 25 };
type PersonType = typeof person; // { name: string; age: number }

Powered By 
15. What are index signatures in TypeScript?
Index signatures allow objects with dynamic keys.

Here is an example:

interface Errors {
  [key: string]: string;
}

const messages: Errors = {
  email: "Invalid email",
  password: "Required"
};

Powered By 
These are used for dictionaries, map-like objects, or dynamic configuration patterns.

16. What is structural typing in TypeScript?
Structural typing (duck typing) means types are compatible based on their structure, not their name.

Here is an example:

interface Point { x: number; y: number; }
let p = { x: 10, y: 20, z: 30 };
let q: Point = p; // OK because structural match

Powered By 
This makes TypeScript flexible and works well with JavaScript patterns.

17. What is declaration merging in TypeScript?
Declaration merging happens when TypeScript combines multiple declarations with the same name.

Here is an example merging two interfaces:

interface User { name: string; }
interface User { age: number; }
const u: User = { name: "Rob", age: 30 }; // merged

Powered By 
This is useful when extending third-party types or augmenting libraries.

Advanced TypeScript Interview Questions
Here are advanced TypeScript interview questions and answers.

18. What are generics in TypeScript, and why are they useful?
Generics allow you to write reusable, type-safe functions and classes that work with multiple data types.

Here is a generic function example:

function identity<T>(value: T): T {
  return value;
}

let output = identity<string>("DataCamp");
let outputNumber = identity<number>(42);

Powered By 
Here is a generic class example:

class Box<T> {
  content: T;
  constructor(content: T) {
    this.content = content;
  }
  getContent(): T {
    return this.content;
  }
}

let stringBox = new Box("Hello");
let numberBox = new Box(123);

Powered By 
Best practices include:

Use descriptive names like <T>, <K, V>, or domain-specific names.

Avoid unnecessary complexity.

Use constraints (extends) to restrict acceptable types.

Generics improve code reusability by reducing duplication and enforcing consistent typing.

19. What are TypeScript utility types, and how are they used?
TypeScript provides built-in utility types to manipulate and transform existing types efficiently.

Here is an example:

interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type PartialTodo = Partial<Todo>; // all properties optional
type RequiredTodo = Required<Todo>; // all properties required
type TodoPreview = Pick<Todo, "title" | "completed">; // select specific properties
type TodoWithoutDescription = Omit<Todo, "description">; // exclude properties

Powered By 
These are especially useful when working with API responses, forms, or component props.

A tip would be to leverage utility types whenever possible to simplify code and enforce type consistency.

20. What are conditional and mapped types in TypeScript?
Conditional types let you define logic within types based on relationships between them.

Here is an example:

type IsString<T> = T extends string ? "yes" : "no";
type Result1 = IsString<string>; // "yes"
type Result2 = IsString<number>; // "no"

Powered By 
Mapped types allow you to transform all properties of a type at once.

Here is an example:

type ReadonlyTodo = {
  readonly [K in keyof Todo]: Todo[K];
};

type OptionalTodo = {
  [K in keyof Todo]?: Todo[K];
};

Powered By 
The key differences are:

keyof extracts the property names of a type.
typeof gets the type of a variable or object. Combining them allows dynamic type manipulation and safer refactoring.
21. What is the infer keyword used for in TypeScript?
infer lets you extract (infer) a type inside a conditional type.

Here is an example:

type ReturnType<T> =
  T extends (...args: any[]) => infer R ? R : never;

type R = ReturnType<() => number>; // number

Powered By 
Often used in advanced utilities and generic type transformations.

22. What are template literal types?
Template literal types construct string types using interpolation.

Here is an example:

type Event = ${string}Changed;
let e: Event = "nameChanged"; // OK

Powered By 
This is useful for:

Event naming
CSS class patterns
API route patterns
23. What are satisfies and as const in TypeScript?
satisfies ensures a value satisfies a type but preserves its own literal type. 

For example:

const config = {
  mode: "dark",
  version: 1
} satisfies { mode: string; version: number };

Powered By 
as const makes all properties read-only and literal. 

For example:

const directions = ["up", "down"] as const;
// type is readonly ["up", "down"]

Powered By 
Both satisfies and as const are useful in React, config objects, and discriminated unions.

TypeScript Functions and Objects Interview Questions
In this section, we will explore TypeScript interview questions related to functions and objects.

24. How does function overloading work in TypeScript?
Function overloading allows you to define multiple function signatures for different argument types or patterns.

Here is an example:

function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: any, b: any): any {
  return a + b;
}

let sumNumbers = add(5, 10); // 15
let sumStrings = add("Hello, ", "World"); // "Hello, World"

Powered By 
Best practices include:

Declare all possible overloads before the implementation.
Use type guards to handle multiple types safely.
25. What are optional and rest parameters in TypeScript?
Optional and rest parameters make functions more flexible and expressive.

Here is an example:

function greet(name: string, age?: number) {
  console.log(Hello ${name}, age: ${age ?? "unknown"});
}

function sum(...numbers: number[]) {
  return numbers.reduce((a, b) => a + b, 0);
}

Powered By 
The key rules for using optional and rest parameters are:

Use ? for optional parameters.

Use ... for rest parameters (variadic arguments).

These are often tested in interviews to evaluate how well you handle dynamic function inputs.

26. What is the difference between readonly and const in TypeScript?
const applies to variables, while readonly applies to object properties.

Here is an example:

interface User {
  readonly id: number;
  name: string;
}

const user: User = { id: 1, name: "Bob" };
// user.id = 2; // Error: Cannot assign to 'id'

const { id, name } = user;
console.log(User ${name} has ID ${id});

Powered By 
Some best practices for using readonly and const are:

Use readonly for objects that should not be changed, such as data returned from an API.
Use const for variables that should not be reassigned.
Combine destructuring with type annotations for cleaner, self-documenting code.
27. What is function type variance (covariance and contravariance)?
Function type variance describes how TypeScript decides if one function type can safely replace another, based on its parameter types and return types.

Return types: Covariant

A function is allowed to return a more specific type than what the caller expects. For example:

type Animal = { name: string };
type Dog = Animal & { bark: () => void };

let f: () => Animal;
let g: () => Dog = () => ({ name: "Rex", bark() {} });

f = g; // OK: Dog is a subtype of Animal

Powered By 
Parameter types: Contravariant

A function is allowed to accept more general parameter types than expected. For example:

type Dog = { name: string; bark: () => void };
type Animal = { name: string };

type HandleDog = (dog: Dog) => void;
type HandleAnimal = (animal: Animal) => void;

let handleDog: HandleDog = d => console.log(d.bark());
let handleAnimal: HandleAnimal = a => console.log(a.name);

// A function that accepts an Animal is more general,
// so it can stand in for one that accepts a Dog
handleDog = handleAnimal; // OK

Powered By 
28. What are this types in TypeScript?
this types let methods return the same type as the class, useful for fluent APIs:

class Builder {
  setName(name: string): this {
    // ...
    return this;
  }
}
new Builder().setName("Test"); // chaining works

Powered By 
TypeScript OOP Interview Questions
The following questions cover key TypeScript OOP concepts frequently discussed in technical interviews.

29. How does TypeScript support object-oriented programming (OOP)?
TypeScript supports OOP principles such as classes, inheritance, and access modifiers.

Classes define reusable blueprints for objects, and inheritance allows one class to extend another to share properties and behaviors.

Here is an example:

class Animal {
  constructor(public name: string) {}

  move(distance: number) {
    console.log(${this.name} moved ${distance}m.);
  }
}

class Dog extends Animal {
  bark() {
    console.log("Woof!");
  }
}

const dog = new Dog("Buddy");
dog.bark();       // Woof!
dog.move(10);     // Buddy moved 10m.

Powered By 
Access modifiers include:

public: accessible anywhere
protected: accessible in the class and its subclasses
private: accessible only within the declaring class
A tip would be to use access modifiers to ensure encapsulation, which prevents unintended modification of internal class logic or state.

30. What is the difference between abstract classes and interfaces in TypeScript?
Both abstract classes and interfaces define contracts for objects or classes, but they serve different purposes.

Abstract classes can include shared implementation and abstract methods.

Interfaces only describe structure, not implementation.

Here is an example:

abstract class Shape {
  abstract getArea(): number; // must be implemented
}

class Circle extends Shape {
  constructor(public radius: number) {
    super();
  }

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }
}

Powered By 
Best practices include:

Use abstract classes when you need shared logic across related classes.
Use interfaces for flexible type contracts and decoupled code design.
31. What is the difference between private, protected, and public modifiers?
Here is a comparison of TypeScript’s access modifiers and what they control:

Modifier

Description

public

Accessible anywhere.

protected

Accessible within the class and its subclasses.

private

Accessible only inside the declaring class.

Using the correct access modifier promotes encapsulation, which ensures that internal state and logic cannot be accessed or changed unexpectedly.

32. What is the difference between implements and extends?
extends inherits behavior and properties, whereas implements enforces a contract but does not provide implementation

Here is an example:

interface Logger { log(msg: string): void; }

class Base { foo() {} }

class MyClass extends Base implements Logger {
  log(msg: string) {}
}

Powered By 
33. How do mixins work in TypeScript?
Mixins allow multiple reusable class components.

Here is an example:

type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
  };
}

class User {}
const TimestampedUser = Timestamped(User);

Powered By 
Useful when you need multiple inheritance patterns.

Practical TypeScript Interview Questions
These questions focus on real-world applications of TypeScript that often come up in interviews.

34. How would you migrate a JavaScript project to TypeScript?
Migrating a legacy JavaScript codebase to TypeScript should be incremental to minimize risk and disruption.

The recommended approach is:

Rename .js files to .ts.

Enable allowJs and checkJs in tsconfig.json.

Gradually add types, starting with core functions or modules.

Use any temporarily, then replace it with proper types as you refine the codebase.

Example tsconfig.json for gradual migration:

{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "strict": true
  }
}

Powered By 
Gradual migration ensures stability and allows teams to benefit from type checking early without major rewrites.

35. How do you use TypeScript with React?
Using TypeScript in React improves type safety for props and state, which helps prevent runtime errors.

Here is an example:

interface Props {
  title: string;
}

const Header: React.FC<Props> = ({ title }) => <h1>{title}</h1>;

Powered By 
Defining prop types helps TypeScript catch missing or incorrectly typed props at compile time, which improves reliability and developer productivity.

36. How do you use TypeScript with Node.js?
TypeScript enhances Node.js applications by adding type safety for API routes, configurations, and middleware.

Here is an example:

import express, { Request, Response } from "express";
const app = express();

app.get("/", (req: Request, res: Response) => res.send("Hello TypeScript"));

Powered By 
Typing Request and Response ensures correct parameter usage and prevents common runtime errors.

TypeScript makes Node.js APIs easier to maintain and refactor safely.

37. How do you handle third-party JavaScript libraries that lack TypeScript definitions?
Some libraries don’t include built-in types. In these cases, you have two main options:

Option 1: Install community-maintained types

npm install --save-dev @types/library-name

Powered By 
Option 2: Create a custom declaration file

// custom.d.ts
declare module "legacy-library" {
  export function init(): void;
}

Powered By 
Tips include:

Always check @types before writing custom declarations.

Gradually add types for complex libraries to ensure compatibility.

Proper typing of third-party libraries increases confidence and reduces runtime bugs.

TypeScript Configuration and Tooling Interview Questions
This section covers essential TypeScript configuration and tooling topics frequently discussed in technical interviews.

38. What is tsconfig.json, and why is it important?
The tsconfig.json file is the central configuration for any TypeScript project. 

It defines compiler behavior, includes files, and enables features.

Here is an example:

{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}

Powered By 
Key settings include:

target: JavaScript version for output

module: Module system (CommonJS, ESNext, etc.)

strict: Enables all strict type-checking options

outDir: Output folder for compiled code

esModuleInterop: Allows CommonJS module imports

Make sure you enable strict mode to catch potential bugs early and improve maintainability.

39. How do you configure TypeScript with build tools like Webpack, Vite, or Babel?
TypeScript integrates seamlessly with modern build systems.

Common setups include:

Webpack: ts-loader for on-the-fly compilation

Vite: vite-plugin-ts for fast builds

Babel: @babel/preset-typescript for JS-heavy environments

Example Vite configuration:

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    target: "es2020"
  }
});

Powered By 
Align compiler and bundler settings, enable incremental builds, and use source maps for easier debugging.

40. How do you configure ESLint with TypeScript for better code quality?
ESLint helps maintain consistent coding standards and catch errors early.

Install required packages:

npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev

Powered By 
Example ESLint configuration:

{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off"
  }
}

Powered By 
Tips include:

Avoid disabling rules globally.
Fine-tune rules per project to balance type safety and flexibility.
Use ESLint with Prettier for a consistent and clean codebase.
Tips for Acing Your TypeScript Interview
Before your interview, you should focus on mastering both your technical skills and communication skills.

Here are some of the ways in which you can do so:

Study approach:

Review official documentation on advanced types, generics, and utility types.
Focus on real-world use cases rather than memorization.
Practice reading and understanding type errors, especially since TypeScript compiler messages are often part of technical assessments.
Practice projects:

Build small but complete apps to demonstrate practical skills:
React To-Do List with typed props and state.
Express REST API with typed request and response objects.
Utility libraries using generics and mapped types.
Common pitfalls:

Overusing any, which undermines TypeScript’s type safety.
Neglecting strict mode, which leads to runtime bugs.
Confusing null and undefined in type definitions.
Forgetting to install or configure type definitions for third-party libraries.
Communication tips:

During interviews, clearly explain your reasoning for type decisions.
Describe trade-offs between approaches (for instance: interface vs type alias or abstract class vs interface).
Show how TypeScript improves maintainability and scalability in projects.


