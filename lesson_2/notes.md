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
    - properties can be added to the global object like any other object
    - **undeclared variables**: assigning a variable without the `let`, `const` or `var` keyword causes the variable to be added to the global object as a property. example:
        ```javascript
        a = 3;
        global.a; // 3 (in node)
        window.a; // 3 (in browser)
        a; // 3 (can be accessed without using the global object as a caller)
        ```
        - when you try to access a variable with no local or global variables with that name, JavaScript looks at the global object for a property with that name