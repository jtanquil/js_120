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