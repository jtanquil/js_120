## JS 120 Lesson 3 Notes ##

- drawbacks to factory functions:
    - each copy of the object contains a copy of the object's methods, memory inefficient
    - no way to identify an object and determine whether it was created by a factory function
        - impossible to identify the "type" of object it is, have to determine it from the properties
- **constructors**: another way of creating objects in JavaScript, similar to factory functions
    - syntax: a constructor is an ordinary function invoked with the `new` keyword:
        ```javascript
        function Obj(a, b) {
          this.a = a;
          this.b = b;
        }

        let obj = new Obj(1, 2);
        console.log(obj); // { a: 1, b: 2 }
        ```
        - constructor names start with a capital letter (not required, but convention)
        - without the `new` keyword, the invocation `Obj(1, 2)` is just a normal function invocation and would return `undefined`
        - with the `new` keyword, the invocation `new Obj(1, 2)` returns a new object with `a` and `b` properties assigned as you would expect from the function body
        - **design pattern**: similar to a factory function defining a new object, setting its properties, and returning that object
    - **`new` keyword**: JavaScript takes the following steps when invoking a function with `new`:
        - 1) it creates a new object
        - 2) it sets the prototype of the new object to the object referenced by the constructor's `prototype` property (more below)
        - 3) it sets the execution context `this` to point to the new object
            - a constructor call with `new` counts as a third way to set implicit execution context; a function called with `new` sets the context to the new object
            - without `new`, the function invocation is a normal function invocation, so any instances of `this` would refer to the global object
        - 4) it invokes the function
        - 5) once the function is finished running, `new` returns the new object (unless the function explicitly returns another object, see below)
    - most functions can be called with `new`. exceptions:
        - **arrow functions**: they use their surrounding context as the value of `this`
        - **object methods defined with concise syntax**: object methods defined with normal syntax are fine, though:
            ```javascript
            let obj = {
              Test: function(a, b) {
                this.a = a;
                this.b = b;
              },

              Test2(a, b) {
                this.a = a;
                this.b = b;
              }
            };

            new obj.Test(1, 2); // returns { a: 1, b: 2 }
            new obj.Test2(1, 2); // TypeError: obj.Test2 is not a constructor
            ```
        - **most built-in objects and methods**: `console.log`, `parseInt`, `Math`, etc cannot be called with `new`. exception is `Date` (creates a `Date` object)
        - **generators**: not covered in the course
    - **constructors and return values**: two cases for when a constructor with an explicit return value is invoked with `new`:
        - **the return value is a primitive value**: the explicit return value is ignored and the constructor will return the newly created object instead
        - **the return value is an object**: the constructor will return that object instead of the newly created object
    - `instanceof`: operator that helps determine an object's type:
        ```javascript
        function Test(a, b) {
          this.a = a;
          this.b = b;
        }

        let test = new Test(1, 2);

        console.log(test instanceof Test); // true
        ```
        - **syntax**: `obj instanceof ConstructorName`, returns `true` if `obj` was an object created by `ConstructorName`, `false` otherwise
        - **compare to objects created by factory functions**: no way to tell whether an object was created by a factory function, or what "type" of object it was if it was created this way
        - the `new` operator causes the constructor invocation to return an object with additional information that ties it to the constructor that created that object, which is used by `instanceof` to determine whether an object was created by that constructor
    - **design pattern**: passing a plain object (key/value pairs) to a constructor and using `Object.assign(this, obj)` to mass assign properties to the constructed object instead of assigning many parameters individually
    - **constructors with prototypes**
        - **question**: what is the prototype of an object created by a constructor? how do we modify it?
        - **motivation**: by itself, constructors don't solve the problem of having multiple copies of a method created for each instance of a type of object:
            ```javascript
            function Test() {
              this.test = function () {
                console.log("hi");
              };
            }

            let a = new Test();
            let b = new Test();

            console.log(a.test === b.test); // false 
            ```
          - recall that **objects delegate property access to their prototypes** - accessing a property that isn't an object's own property causes it to go up the prototype chain and access a prototype's property instead
          - therefore, we can solve the method duplication problem by delegating methods to the prototypes of the object returned by the constructor
      - **the constructor `prototype` property**: all function objects have a `prototype` property, called the **function prototype** or **constructor's prototype object**
          - when a function is invoked with `new`, the protoype of the new object is set to the object referenced by the function's `prototype` property
          - this property is only used when the function is called with `new`
          - **object vs function prototype**
              - **object prototype**: if `obj` is an object, its **object prototype** is the object from which it inherits - generic meaning, independent of how `obj` was created
                  - by default, constructor functions set the object prototype for the object they create to the constructor's prototype object
              - **function prototype**: a function object that the constructor uses as the object prototype for the object it creates
              - "prototype" generically refers to the object prototype; the "constructor's prototype"/"function prototype"/"`prototype` property" refer to the constructor's prototype object
              - **note**: constructors don't inherit from the constructor's prototype object; the objects created by the consturctor inherit from it
      - **the `prototype.constructor` property**: property of the constructor prototype set to the constructor function. example:
          ```javascript
          function Test() {
            this.a = 1;
          }

          let test1 = new Test();

          console.log(test1.constructor); // [Function: Test]
          ```
        - the `constructor` property can be reassigned to something else
            - even in this case, `instanceof` will still return the correct result
      - **overriding the prototype**: it is possible to **override** methods inherited from the prototype by defining methods with the same name on an object; due to how property access works up the prototype chain, accessing that method will access the object's own method before accessing the method defined in the prototype
          - allows for flexible customization of object behavior
      - **design pattern**: methods that return the caller allow for chainable invocations/property accesses
      - **scope-safe constructors**: constructor functions that return the same object whether or not they are called with `new`
          - implementation: use `this instanceof ConstructorName` => returns `true` if `this` is set to the object created by `ConstructorName` (so `ConstructorName` was called with `new`), `false` otherwise (if `ConstructorName` was called as a normal function)
          - set properties as normal if the constructor was called with `new`, return `new ConstructorName(...)` otherwise
          - most of JavaScript's built-in constructors like `Object`, `RegExp`, `Array` are scope-safe; `String` is not
            - should still call constructors with `new`
- static and instance methods
    - individual objects of a specific data type are **instances** of that type
        - can apply to objects created via constructors, factory functions; etc
    - **instance properties**: properties that belong to a specific instance of an object; typically properties that differ between instances of objects
    - **instance methods**: methods that operate on individual instances
        - typically stored in an object's prototype, and are called by an instance of the object/will operate on an instance's properties
        - methods might be stored in an object's prototype but it's not recommended to call from there (ex/use `dog.bark()` instead of `dog.prototype.bark()`) due to the possibility of instances of an object overriding behavior
            - any method defined in any prototype in the prototype chain of an object can be considered an instance method
            - can't use the constructor to call instance methods
    - **static properties**: properties defined and accessed directly on the constructor, instead of an instance
        - belong to the type (ex/`Dog`) rather than an instance or the prototype object (`dog`)
    - **static methods**: methods defined and accessed directly on the constructor
        - ex/`Object.assign`, `Array.isArray`, `Date.now`
    - **idea**: instance properties/methods reflect the state/behavior of instances of an object, static properties/methods reflect the state/behavior of an entire type of object
- built-in constructors
    - `Array`: scope-safe, also creates the same object as equivalent w/array literal syntax
        - takes as arguments either:
            - no arguments: `new Array(); // []`
            - a comma-separated list of values: `new Array(1, 2); // [1, 2]`
                - bc of the next case, passing exactly 1 number won't work; any other type of value will work though: `new Array("a"); // ["a"]`
            - one nonnegative whole number: `new Array(3); // [<3 empty items>]`
                - if the number is negative or not whole, will throw a `RangeError`
                - `Array.prototype.fill`: takes an argument, replaces the elements of the caller with that value (in place), returns a reference to the caller
                    - optional `start/end` index arguments, defaults are `0` and `array.length`
        - `Array.prototype`: all arrays inherit from `Array.prototype`; array instance methods are all defined on it
        - static methods: defined on `Array` constructor
            - `Array.isArray`: takes a value as an argument, returns `true` if it is an array, `false` otherwise 
                - use to determine if something is an array since `typeof` can't distinguish between arrays and objects
            - `Array.from`: takes an array-like object as an argument and returns a new array with equivalent element values
                - **array-like object**: any object that has a `length` property
                - possible implementation: given an object `obj`, iterate from `0` to `obj.length`, for each `idx` add `obj[idx]` to an output array, return that array
                    - this will work with strings since bracket indexing works on strings
                - **why**: some functions and methods return array-like objects that can be converted to arrays (ex/node lists from the DOM)
    - `Object`: also scope-safe, returns an empty object `{}`
        - `Object.prototype`: all objects created with `Object` constructor or literal syntax inherit from this; almost all objects do (includes prototype objects of constructors)
            - relevant instance methods: `getPrototypeOf`, `setPrototypeOf`, `toString` (typically overridden, by default just returns `[object Object]`)
        - relevant static methods: `Object.assign`, `Object.create`, `Object.entries`, `Object.freeze`, `Object.isFrozen`, `Object.keys`, `Object.values`
    - `Date`: creates a `Date` object which represents a specific date and time. **not scope-safe**
        - takes as arguments:
            - no arguments: returns a `Date` object representing the creation date/time of the object
            - various string arguments: check MDN, common examples:
                - month/day/year: `new Date("May 1, 1983")`
                - month/day/year w/time: `new Date("May 1, 1983 05:03 am")
                    - time zones are messy, again check MDN
        - `Date.prototype`: relevant instance methods are
            - `Date.prototype.toString`: returns a string representation of the date (verbose, check MDN)
            - `Date.prototype.getFullYear`: returns the year of the caller as a number in YYYY format
            - `Date.prototype.getDay`: returns the day of the week of the caller as a number between `0` (Sunday) and `6` (Saturday)
    - `String`: takes a string and creates a `String` object from the argument
        - **this is not a primitive value like a (lowercase) string**: `"abc" === new String("abc"); // false`
        - **not scope-safe**: without `new`, `String` will return a primitive value: `"abc" === String("abc"); // true`
        - **why**: JavaScript has two types of strings - string primitives (created with string literal syntax or invoking `String` without `new`) and `String` objects (created with `String` invoked with `new`)
            - despite being primitive values, we can access properties or methods of string primitives because JavaScript **wraps** the primitive in a `String` object behind the scenes, then returns a string primitive afterwards
        - **general rule**: avoid creating `String` objects explicitly; can cause problems distinguishing between `String` objects and string primitives
            - can use `String.prototype.valueOf()` to retrieve the value of a `String` object as a primitive
    - `Number`/`Boolean`: work in the same way as `String` constructor
        - **neither are scope-safe**: without `new` they will return primitives of the corresponding type
        - otherwise, will return `Number` or `Boolean` objects
        - similarly, JavaScript wraps primitive numbers and booleans to access methods and properties, and returns primitives afterward
        - similarly, avoid explicitly creating these objects
    - **extending primitives**: can extend primitives of built-in types by adding properties or methods to their `prototype` property, but not recommended
    - **borrowing `Array` methods for `String`s**: since functions are first-class, they can be accessed as properties of a constructor and called on a different type of object via explicit context setting:
        - by default, an array instance method in `Array.prototype` would have `this` set to either `Array.prototype` or `global`, but using `call` or `apply` can invoke it using a different object as a context, effectively calling it on that object
        - relevant example: using `Array` instance methods to manipulate strings:
            ```javascript
            let string = "test";
            Array.prototype.map.call(string, (char) => char.toUpperCase()); // ["T", "E", "S", "T"]
            [1, 2].map.call(string, (char) => char + char); // also works, returns ["tt", "ee", "ss", "tt"]
            ```
            - **idea**: in this case `string` is set as the context for `Array.prototype.map` (behind the scenes, JavaScript wraps `string` in a `String` object), then the call iterates through the indices of `string` as it would an array, then returns an array
            - **caveat**: this works because the implementation of methods like `map`, `filter`, etc iterate through the indices of the caller, which you can still do with strings
                - **cannot do this with all `Array` methods**: for instance, methods that mutate the caller like `push`:
                    ```javascript
                    let test = "test";
                    [].push.call(test, " test 2"); // throws TypeError
                    ```
                - this throws a `TypeError` by attempting to mutate a string
- classes
    - introduced in ES6
    - **syntactic sugar**: syntax designed to be easier to read/use, makes it easier for programmers migrating from other OOP languages, more familiar way to create constructors/prototypes
    - example: **constructor syntax**
        ```javascript
        function Test(test) {
          this.test = test;
        }

        Test.prototype.testFunc = function() {
          console.log(this.test);
        };

        let t = new Test("hi");
        console.log(typeof Test); // function
        console.log(t instanceof Test); // true
        console.log(t.constructor); // [Function: Test]
        console.log(t.testFunc()); // "hi"
        ```
    - **class syntax**: uses a **class declaration** which begins with the `class` keyword, followed by the name of the class
        ```javascript
        class Test {
          constructor(test) {
            this.test = test;
          }

          testFunc() {
            console.log(this.test);
          }
        }

        let t = new Test("hi");
        console.log(typeof Test); // function
        console.log(t instanceof Test); // true
        console.log(t.constructor); // [class Test]
        console.log(t.testFunc()); // "hi"
        ```
    - `class` syntax: similar to concise object method definition for object literals, except no commas between properties
        - `constructor` method plays the same role as the constructor function in the constructor syntax, but is written as a standalone function instead
        - other methods are added as properties of `ClassName.prototype` (unless they start with the `static` keyword, see below)
    - **constructor syntax vs class syntax**: they are functionally the same, but with small differences:
        - with class syntax, you **must use `new`** to call the constructor, otherwise a `TypeError` is raised
        - the `constructor` property of the returned object point to the constructor/`class`, respectively - the constructor is logged as `[Function: ConstructorName]` and the class is logged as `[class ClassName]`
            - implementation dependent, not really relevant
        - **note**: `typeof ClassName` logs `function`, so classes are functions **and are therefore first-class**
    - **class expressions**: similar to function definition vs function declaration - any class definition that **doesn't** begin with the `class` keyword is a class expression
        - can be assigned to variables, passed as arguments to functions, returned from functions, used in expressions etc. just like function expressions
    - **static methods and properties**: in constructor syntax, these are defined directly as properties of the constructor; with class syntax, use the `static` keyword before static properties/methods:
        ```javascript
        class Test {
          // ...

          // same as Test.testStaticMethod = function... in constructor syntax
          static testStaticMethod() {
            return "hi";
          }

          // same as Test.description = ... in constructor syntax
          static description = "this is a description";
        }

        console.log(Test.testStaticMethod()); // "hi";
        console.log(Test.description); // "this is a description"
        ```
        - static properties are a relatively new addition to JavaScript, not fully supported as of late 2020
            - check MDN to check browser/node compatibility
            - if they don't work, just add directly to the class as a property like w/constructor syntax
                ```javascript
                Test.description = "...";
                ```