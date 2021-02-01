## JS 120 Lesson 4 Notes ##

- **OLOO**: object linking to other objects - object creation pattern that involves extracting properties common to all objects of that type to a prototype object
    - the prototype object can store common methods, and an `init` method to initialize properties that store the state of the particular object
    - **comparison to factory function pattern**: w/factory functions:
        ```javascript
        function test(a, b) {
          return {
            a,
            b,
            someMethod () {
              console.log(this.a + this.b);
            }
          };
        }

        let t = test(1, 2);
        ```
        - `t` assigned to the object returned by `test` which contains a copy of the `someMethod` method
    - **using OLOO**:
        ```javascript
        let testPrototype = {
          someMethod () {
            console.log(this.a + this.b);
          },

          init (a, b) {
            this.a = a;
            this.b = b;
            return this;
          }
        }

        let t = Object.create(testPrototype).init(1, 2);
        ```
        - `t` assigned to an empty object whose prototype is `testPrototype`; then `init` is called from that object's prototype chain assigning the `a` and `b` properties of `t`
    - **advantages of OLOO vs factory functions**: memory efficiency - objects created with the OLOO pattern inherit methods from a single prototype object, so they share the same methods in memory
    - **advantages of factory functions vs OLOO**: allows us to create objects with private state
        - any state stored in the body of the factory function instead of the returned object is private to the returned object; cannot be accessed or modified unless one of the object methods exposes the state
            - vs OLOO: any object state can be accessed and modified by outside code
        - more relevant with closures (later)
- subtypes with prototypes and constructors
    - **subtypes** inherit from **supertypes**
    - **idea**: we can implement object inheritance with the `prototype` property of constructors
        - pattern: given a `Subtype` that inherits from a `Supertype`, reassign `Subtype.prototype = Object.create(Supertype.prototype)`
            - prototype chain: `(instance of Subtype) -> Subtype.prototype -> Supertype.prototype -> Object.prototype`
            - instances of `Subtype` inherit properties/methods from `Subtype.prototype`, which inherits properties/methods from `Supertype.prototype`
            - allows for both extending the `Supertype` (by adding properties/methods to `Subtype.prototype`) and overriding the behavior of `Supertype` (adding properties/methods to `Subtype.prototype` w/the same name will take precedence due to being higher up in the prototype chain)
            - **caveats**: 
              - 1) this *reassigns* the `Subtype.prototype` property to a next object, so any properties/methods added to `Subtype.prototype` beforehand will be lost
              - 2) the `constructor` property of `Subtype.prototype` is then set to the value of `Supertype.prototype.constructor`, which is `Supertype`; should reassign `Subtype.prototype.constructor` to `Subtype` to avoid bugs
            - constructor reuse: can use the constructor of `Supertype` in the invocation of `Subtype`. example:
                ```javascript
                function Subtype(test) {
                  Supertype.call(this, test);
                };
                ```
                - when `Subtype` is invoked with `new`, the context is set to the object created by `Subtype`, which is the explicit context set by the invocation of `Supertype` via `call`
- prototypical inheritance vs psuedo-classical inheritance
    - **prototypical inheritance**: also called prototypical delegation or object inheritance; works on one object at a time, refers to the form of inheritance implemented with an object's `[[Prototype]]` property and an object can delegate property/method access to its prototype
    - **psuedo-classical inheritance**: also called constructor inheritance; refers to when a constructor's prototype (`Constructor.prototype` property) inherits from another constructor's prototype (i.e. if `Subtype.prototype` inherits from `Supertype.prototype`)
        - what happens when a subtype inherits from a supertype
        - typically "inheritance" in JavaScript refers to this form of inheritance
        - "psuedo-classical" since it mimics class inheritance from other OOP languages w/o classes
    - **comparison**: prototypical inheritance is behavior in the context of individual objects, psuedo-classical/constructor inheritance is behavior in the context of constructors and types of objects
        - psuedo-classical inheritance is implemented via prototypical inheritance on the constructor/function prototypes of constructors
- subtypes/inheritance with class syntax
    - **syntax**: `class Subtype extends Supertype` => `Subtype` inherits properties/methods from `Supertype`
        - `super`: `super(...)` calls the `constructor` of `Supertype` in the `constructor` of `Subtype`
            - if `super` is called in `Subtype`'s constructor, it must be called before using `this` in the that constructor. example:
            ```javascript
            class Subtype extends Supertype {
              constructor(test) {
                super(test);
              }
            }
            ```
    - **with class expressions**: works as intended
        ```javascript
        let Supertype = class {
          // ...
        }

        let Subtype = class extends Supertype {
          // ...
        }
        ```
- mix-ins
    - **problem**: objects in JavaScript can only inherit from one object, and classes can only extend one other class
        - this behavior is called **single inheritance**; other languages support **multiple inheritance** but not JavaScript
        - even though objects can delegate method/property access to its entire prototype chain, it can only have one object as a property; similarly, classes only directly extend one other class even though it can access properties from a chain of class extensions
            - in both cases, the objects/classes have a linear inheritance chain, which is inadequate at modeling some relationships between objects
    - **mix-ins**: design pattern that solve this problem by adding methods and properties from one object to another
        - an object that defines one or more methods that can be **mixed in** to a class with `Object.assign`
        - only real workaround to the lack of multiple inheritance aside from duplication
        - pattern: create an object with the methods to mix in, then use `Object.assign(Class.prototype, mix)` to add the methods in `mix` to the class prototype, so instances of `Class` have access to the methods of `mix` via delegation
    - **comparison to inheritance**: mix-ins are more versatile than pure inheritance since they enable objects to inherit methods/properties from multiple sources, modelling more complex relationships
        - possible to model all such object relationships with just mix-ins and factory functions
        - **issues**: the issues with factory functions still apply
        - **balance between mix-ins and classical inheritance**: use constructor or class inheritance to model "is a" relationships (ex/"a penguin **is a** bird"), use mix-ins to endow objects with some capability that isn't explicitly tied to its relationship to other objects/classes
- **polymorphism**: refers to the ability of objects with different times to respond in different ways to the same message (or method invocation)
    - **data of different types can respond to a common interface**
    - common scenario: two or more object types have a method with the same name (either via inheritance or not), so that method can be invoked with any of those objects
    - example: `toString` - `Object` provides a default implementation, but other types **override** the default implementation with their own `toString` method
        - this allows code to call `toString` on a variety of objects, which have different behavior per object due to different implementations
    - **duck typing**: occurs when objects of different, unrelated types respond to the same method name; example of polymorphism
        - informal way of classifying or ascribing types of objects ("if it acts like a duck" etc) vs formal implementation with classes/constructors