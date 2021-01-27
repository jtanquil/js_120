## JS 120 Lesson 2 Notes ##

- object properties
    - property keys are always strings: if an object property is defined with a non-string key, the key will first be converted to a string
    - **property access**: two methods: **member access notation** (dot notation - `object.property`) and **computed member access notation** (bracket notation - `object[property]`)
        - **member access notation**: `property` needs to be a valid variable name
        - **computed member access notation**: any UTF-8 compatible string can be the key, and any expression in the brackets is evaluated as a string and used to reference the property.
        - example:
            ```javascript
            obj["test-key"] = 1;

            obj.test-key; // throws SyntaxError
            obj["test-key"]; // 1
            obj["test" + "-" + "key"]; // 1
            ```
    - **property existence**: accessing a non-existent property of an object evaluates to `undefined`, but so does accessing a property of an object that is set to `undefined`
        - to answer the question of whether an object has a property unambiguously, use either the `in` operator or the `hasOwnProperty` method
            - `in` operator: `propertyName in obj;`
            - `hasOwnProperty`: `obj.hasOwnProperty(propertyName);`
        - both return `true` if `propertyName` is a property of `obj`, `false` otherwise
        - there is a difference, which will be covered later
        - **enumerating object properties**: can also be used to check property existence
            - `Object.keys`: static method that takes an object as an argument and returns an array of its enumerable properties
                - **enumerability** is a characteristic of object properties that determines whether or not they appear during `for...in` loops or `Object.keys`
                    - default for properties created by assignment (`obj.property` or `obj[property]`)
                    - most properties and methods of built-in types are not enumerable
                    - `Object.prototype.propertyIsEnumerable`: takes a property of an object as an argument, returns `true` if it is enumerable, `false` if it isn't
            - `Object.getOwnPropertyNames`: static method that takes an object as an argument and returns an array of its properies (enumerable or not)
- prototypes
    - **prototypical inheritance**: how JavaScript implements inheritance in objects
    - objects inherit properties and methods from another object, its **prototype**
    - `Object.create`: takes an object as an argument, called the **prototype object**, and returns a new object that inherits properties from the prototype object
    - **objects have access to all the properties and methods of the prototype object**
    - **delegation of property/method access**: the inheriting object doesn't actually receive the properties or methods of its prototype - instead, access to those properties/methods is **delegated** to the prototype. example:
          ```javascript
          let a = { b: 1 };
          let c = Object.create(a);
          console.log(c.b); // 1 => c delegates access to the property b to its prototype
          console.log(c); // {} => c does not actually have a b property of its own
          ```
        - this makes distinguishing between properties an object inherits from its prototype and an object's **own properties** (i.e. ones that return `true` when passed to `Object.prototype.hasOwnProperty`) important
    - `[[Prototype]]`: internal property that keeps track of an object's prototype - this property is assigned to the prototype object
        - internal property so it can't be accessed directly, but it can be accessed/modified with `Object` functions:
            - `Object.getPrototypeOf`: takes an object as an argument, and returns its prototype
            - `Object.setPropertyOf`: takes two objects as arguments, and sets the prototype of the first object to the second object
        - **`[[Prototype]]` holds a reference to an object's prototype**: therefore, if the prototype is mutated in some way, this mutation is reflected in the inheriting object as well!
        - `__proto__`: pronounced **dunder proto** (double underscore), is a deprecated, non-hidden version of `[[Prototype]]` which is used in older JavaScript programs instead of `Object.setPrototypeOf/getPrototypeOf`
            - only use when needed to support very old browsers or versions of node
    - **the default prototype**: all objects created with object literal syntax inherit from the default prototype object
        - return value of `Object.getPrototypeOf({})`
        - this is the prototype object of the `Object` constructor; `Object.prototype` provides the default prototype
        - relevant methods:
            - `Object.prototype.toString()`: returns a string representation of the object
            - `Object.prototype.isPrototypeOf(obj)`: returns `true` if `obj` is part of the object's prototype chain, `false` otherwise
            - `Object.prototype.hasOwnProperty(prop)`: returns `true` if the object contains `prop` as a property, `false` otherwise
        - **objects without prototypes**: generally, objects will have `Object.prototype` in their prototype chain; the exception is explicitly creating an object with `null` as its prototype:
            ```javascript
            let a = Object.create(null);
            console.log(Object.getPrototypeOf(a)); // null
            ```
            - **why**: lets you create a "clean" or "bare" object without excess baggage coming from the prototype chain
            - doesn't have access to `Object` methods like the ones above
            - generally, objects can be assumed to have `Object.prototype` at the top of their prototype chain; sometimes libraries will have code that check for bare objects as an edge case
    - **iteration over objects with prototypes**: comparing two ways of iterating over object properties:
        - `for/in`: iterates over an object's properties, includes properties from the object's prototype chain
        - `Object.keys`: returns an array of the object's **own properties** - doesn't include properties from the object's prototype chain
    - **The Prototype Chain**: since the prototype of an object is itself an object, that prototype can also have a prototype from which it inherits
        - this creates a **prototype chain** of an object - a sequence of objects where each object inherits from the next
        - objects can access properties from every object in its prototype chain
        - this chain includes the default prototype, whose prototype is `null`
        - example: `a` is the prototype of `b`, which is the prototype of `c`. The complete prototype chain is:
            ```javascript
            c => b => a => Object.prototype => null
            ```
        - **property access in the prototype chain**: when accessing a property on an object, JavaScript first looks for an "own" property with that name on the object, then searches up the prototype chain - first it searches the object's prototype, then the prototype's prototype, etc. until reaching `Object.prototype`; if `Object.prototype` doesn't define the property, the property access returns `undefined`
            - **if two objects in the prototype chain define a property with the same name, the object closer to the calling object takes precedence**
            - example:
                ```javascript
                let a = { foo: 1 };
                let b = { foo: 2 };
                let c = Object.create(b);
                Object.setPrototypeOf(b, a); // c => b => a => Object.prototyoe => null
                console.log(c.foo); // 2, access of foo was delegated to b
                ```
            - **setting a property on an object causes it to become an "own" property of the object it is assigned to**, which causes it to have higher precedence than properties w/the same name further in the prototype chain:
                ```javascript
                c.foo = 3; // foo becomes an "own" property of c

                console.log(c.foo); // 42, c's own foo property takes precedence
                console.log(b.foo); // 2, takes precedence over a.foo, and remains unchanged by the assignment of c.foo
                ```
- **hoisting**: part of the "first pass" done by the JavaScript engine when it runs code - among other things, moves function declarations to the top of the scope in which tyhey are defined
    - functions defined via function declaration can be called before they are defined in the code **because function declarations are hoisted**; functions defined via function expressions are not hoisted, so calling them before they are defined in code throws a `ReferenceError`
- **anonymous functions**: function expressions that are defined without a name
    - an anonymous function assigned to a variable is still anonymous
- type of a function value: `typeof func` evaluates to `function`
    - functions are objects (**first-class objects** which can be passed as arguments to/returned from functions), with built-in properties and methods
- **higher-order functions**: functions that either take a function as an argument, or return a function
    - functions that accept a function as an argument: examples are array iteration functions like `map`, `forEach`, `filter` etc
        - **example**: `map` abstracts away the mechanics of mapping an array (iterating over an array, pushing values to a new array, etc) and requires only the specific mapping (the function it accepts as an argument)
    - functions that return a function as a value: can be thought of as a **function factory** - it can use arguments passed to it to determine the specific job performed by the function it returns
        - true power of this will be seen with closures
    - **general idea**: higher-order functions can abstract away implementation details and also allow for more flexibility in code
- the global object
    - created by JavaScript when it starts running
    - `global` in Node, `window` in the browser
    - serves as the **implicit execution context**
    - global values like `Infinity`, `NaN` and global functions like `isNaN` and `parseInt` are properties of the global object
        - `global` has a `global` property whose value is the global object
        - function declarations add properties to the global object
    - properties can be added to the global object like any other object
    - **undeclared variables**: assigning a variable without the `let`, `const` or `var` keyword causes the variable to be added to the global object as a property. example:
        ```javascript
        a = 3;
        global.a; // 3 (in node)
        window.a; // 3 (in browser)
        a; // 3 (can be accessed without using the global object as a caller)
        ```
        - when you try to access a variable with no local or global variables with that name, JavaScript looks at the global object for a property with that name
- `this` and execution context
    - **execution context**: (or **context**) refers to the environment in which a function executes
        - in JavaScript, most commonly refers to the value of `this` as a function or method call executes
        - **the execution context of a function or method depends on on how it was invoked, NOT where it was defined or where/when it was called**
            - **contrast with variable scope**: variables in JavaScript are **lexically scoped**, so their scope is determined by their location in the source code - execution context is determined by **how the function was invoked** instead (examples later)
        - two ways of setting context when calling a function or method:
            - **explicit**: execution context is set explicitly
            - **implicit**: execution context is set by JavaScript when your code doesn't provide an explicit context
        - setting context is sometimes called **binding `this`** or **setting the binding**; refers to the fact that a function/method call binds `this` to a specific object
    - **implicit execution context**: every time a function or method is called, JavaScript binds some object to `this`
        - **function execution context**: regular function calls set the binding of `this` to the global object (`global` in node, `window` in browser). example:
            ```javascript
            function test() {
              console.log("this is: " + this);
            }

            test(); // "this is: [object global]"
            ```
            - we say this execution context is set implicitly because the function invocation doesn't supply an explicit alternative
            - **strict mode**: enabling strict mode causes `this` to be bound to `undefined`:
                ```javascript
                "use strict"; // enables strict mode

                function test() {
                  console.log("this is: " + this);
                }

                test(); // "this is: undefined"
                ```
                - strict mode is not relevant yet but it will show up in JavaScript classes and coderpad
        - **method execution context**: when a method is called, the execution context inside the method call is the object used to call the method
            - even though an explicit object is used to call the method, JavaScript is interpreting that object as the implicit context, so we say that method calls provide an implicit execution context
            - example:
            ```javascript
            let obj = {
              f () {
                console.log(this);
              }
            };

            obj.f(); // { f: [Function: f] } => obj is the implicit execution context for the method call
            ```
        - **because functions are first-class**, it is possible to call methods as methods of an object and as functions, which can change the execution context. example:
        ```javascript
        let obj = {
          a: 1,
          func () {
            console.log(this.a);
          }
        };

        obj.func(); // 1 => method call, this = obj

        let calledAsFunc = obj.func; // calledAsFunc points to the obj.func function
        global.a = 2;
        calledAsFunc(); // 2 => called AS A FUNCTION, this = global object
        ```
        - in this example, the context changes from the method call `obj.func()` to the function call `calledAsFunc()` **because of the difference in how the function/method was called** - `obj.func()` calls `func` as a method belonging to `obj`, which sets its context to `obj`, whereas `calledAsFunc` calls `func` as a function, which sets its context to the global object
        - tl;dr:
            - **regular function invocation**: context is implicitly set to the global object
            - **method invocation**: context is implicitly set to the calling object
    - **explicit execution context**: normal function/method invocation implicitly sets the execution context, but context can be explicitly provided using the `call` and `apply` methods
        - `Function.prototype.call`: method available to every function that provides a function with an explicit execution context passed to it as an argument. example:
            ```javascript
            function test() {
              console.log(this.num);
            }

            let obj = {
              num: 1,
            };

            global.num = 2;

            test.call(obj); // 1 => context is explicitly set to obj
            test(); // 2 => context is implicitly set to the global object
            ```
            - can also explicitly set execution context on methods:
            ```javascript
            let obj1 = {
              num: 1,
              logNum() {
                console.log(this.num);
              },
            };

            let obj2 = {
              num: 2,
            };

            obj1.logNum.call(obj2); // 2 => context is explicitly set to obj2
            obj1.logNum(); // 1 => context is implicitly set to obj1
            ```
            - first argument of `call` is the execution context, also accepts any number of arguments after that are passed to the calling function/method as arguments:
            ```javascript
            function test(arg1, arg2) {
              console.log(this.num + arg1 + arg2);
            }

            let obj = {
              num: 1,
            };

            global.num = 2;
            test.call(obj, 1, 2); // 4 => obj is the context, 1 and 2 are passed to test
            test(1, 2); // 5 => global object is the context
            ```
            - general syntax: `func.call(context, arg1, arg2, ...)`
        - `Function.prototype.apply`: similar to `call`, first argument is the execution context, but 2nd argument is an array of arguments passed to the function
            - general syntax: `func.apply(context, [arg1, arg2, ...])`
            - with spread syntax in ES6+, arguments in array form can be destructured and passed to call: `func.call(context, ...args)` is the same as `func.apply(context, args)`
    - `Function.prototype.bind`: takes a `context` as an argument and returns a copy of the calling function whose execution context is **permanently** set to `context`
        - **returns a new function** and does not mutate the caller
        - the returned function's context **cannot be changed** even by calling `call`/`apply` or getting a new copy of it by calling `bind`
            - **idea**: `bind`'s implementation returns a function that calls the calling function with `apply`, explicitly setting the execution context:
            ```javascript
            Function.prototype.bind = function (...args) {
              let fn = this;
              let context = args.shift();

              return function () {
                // the context of THIS function invocation is always context, cannot be changed
                return fn.apply(context, args); 
              };
            };
            ```
            - given this implementation, the behavior of the function returned by `bind` doesn't contradict the idea that how a function/method is invoked determines the execution context - the context of the anonymous function returned by `bind` can change based on how it was invoked, but that function calls the original function **explicitly setting the execution context via `apply`** so its context will never change from the one passed to `bind`
- **context loss**: instances when the value of `this` might be unintuitive
    - strictly speaking, functions/methods don't lose context, it can just be different from what is expected
    - **method copied from an object**: when a method is called as a method of an object, its context is the calling method, but if it is copied and called as a regular function, that context is "lost" since the context when invoked as a regular function is the global object
        - commonly happens if a method is passed as an argument to another function where it is called
        - solutions:
            - 1) pass `context` along with the method to any functions that might call it
                - example: array iteration methods like `map` take an optional `thisArg` object that can serve as the context for the callback
                - drawback: functions become more unwieldy the more arguments they take
             - 2) use `bind` to created a copy of the method whose context is explicitly bound to the calling object
                - advantage: permanently binds the copy to the calling object
                - disadvantage: you can no longer tell what the context of the copied method is just from the seeing it invoked
    - **nested functions not using the surrounding context**: an inner function, when invoked, will still implicitly set the context to the global object
        - this can be unintuitive due to how the behavior differs from how variable scope is determined lexically (if it behaved analogously, a nested function invocation would set context to the scope in which it was defined)
        - solutions:
            - 1) preserve context with a variable in the outer scope: assigning an outer scope variable to `this` and replacing instances of `this` with that variable in the nested function definition will cause the function, when invoked, to use the "expected" context instead of the global object
            - 2) use `call` and explicitly set the context
            - 3) use `bind` to explicitly set the context
            - 4) use an arrow function: **arrow functions inherit their execution context from the surrounding scope**, which means that an arrow function defined inside another function has the same scope as the outer function
                - if an arrow function is defined inside a method, its context on invocation will always be the context of the method in which it was defined; it behaves similarly to if the function's context was permanently set using `bind`
                - **arrow functions don't work as expected when used to define methods on an object**: in this case, the context of the arrow function will be inherited from its surrounding scope, **which will be the scope of the object in which it was defined** - example:
                    ```javascript
                    let obj = {
                      a: 1,
                      test: () => { 
                        // the surrounding scope here is top-level code (the let statement is in the global scope), the corresponding context is the global object
                        console.log(this.a);
                      },
                    };

                    obj.test(); // undefined
                    ```
                    - this appears to contradict the idea that the context of a function/method invocation only depends on how it was called; we would expect the context of `obj.test` to be `obj`
                    - but the property of arrow functions to set their context to the scope in which they are defined is why this seemingly contradictory behavior occurs and why it should be avoided in this case
      - **functions passed as arguments losing context**: common example is callbacks written within a method that access `this` expecting it to be the object containing the method
          - any of the solutions from the previous sections work to solve this

- **TODO EXAMPLES**: context loss (examples of each), context of arrow functions (defined within a method vs defined at the top level/as a method)