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