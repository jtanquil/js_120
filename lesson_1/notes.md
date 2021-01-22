## JS 120 Lesson 1 - Notes ##

- **object-oriented-programming**: a programming paradigm in which problems are solved in terms of **objects**
    - a style of programming that uses objects to organize a program
    - **state and behavior**: objects in real life (such as a car) have **state** - properties such as its color, model, year, etc. - and **behavior** - actions it can perform, such as starting, stopping, steering, parking, etc.
        - problems, in an OOP context, are thought of as sets of objects with state and behavior
    - **advantages**: OOP is useful for large programs developed and maintained by multiple people:
        - thinking of problems in terms of objects helps programmers think at a higher level of abstraction
            - OOP can allow for code to be organized in such a way that it is easier to reason about
        - OOP makes code easier to maintain and dependencies within the code easier to manage, so code is easier to maintain
            - done correctly, OOP makes code flexible, easy to understand and easy to change
    - **drawbacks**: OO code is generally larger than non-OO equivalents, and can be less efficient
- **encapsulation**: the concept of bundling together data and the operations that work on the data into a single entity (an object)
    - **example**: a banking application would have to deal with data (account numbers, balances, user information) and have operations that modify that data (withdrawing/depositing money into an account, modifying user information, opening an account, etc)
        - the data and the operations that modify that data are related: it wouldn't make sense to withdraw money from a user, but it would make sense to withdraw money from an account, so it makes sense to group the code responsible for withdrawing from an account with the code responsible for handling the data associated with the account
    - encapsulation (and OOP more generally) is about **bundling state (data) and behavior (operations) to form an object**
    - **encapsulation in other OOP languages**: more generally refers to restricting access to the state/behaviors of objects in code
        - in some languages, objects can be created that only expose certain data/behaviors to other parts of the application needed to work
            - these objects expose a **public interface** to the rest of the application and keep implementation details hidden
        - access restrictions don't really exist in JavaScript
- **methods**: object properties that have function values
    - possible since functions are first-class in JavaScript
    - since OOP is about grouping state and behavior into an object, methods typically implement the behavior and/or modify the state of an object
        - advantage: don't have to search for a separate function to modify the state of an object - can just use object methods that already exist within the object
    - **method syntax**: can be defined just like any other property:
        ```javascript
        let obj = {
          propertyName: function () {
            console.log("hi");
          }
        };
        ```
        or with **compact method syntax**:
        ```javascript
        let obj = {
          propertyName() {
            console.log("hi");
          }
        };
        ```
        both allow method access/invocation with the `.` operator (`obj.propertyName();`)
        - there is a subtle difference but covered later w/prototypes
- **object property access in OOP**: technically, object properties can be directly accessed and changed with the `.` operator, but this is strongly discouraged in OOP - preferred implementation is to interface with objects and their properties using object methods
- `this`: keyword used in a method to refer to an object that contains the method. example:
    ```javascript
    let obj = {
      prop: 1,
      test () {
        this.prop += 1; // does the same thing as obj.prop = 2;
      },
      test2 () {
        this.test(); // does the same this as obj.test();
      }
    }
    ```
    - advantage over using the object name itself to refer to the containing object within a method because with `this`, the code will still work if the object's name is changed
    - `this` can be very confusing but in this context it is just used in methods to refer to the object containing the method
- **collaborator objects (collaborators)**: objects that are used to provide state within another object
    - example: a `car` object might have an `engine` property that is itself an object, that represents the car's engine - in this instance, `engine` is a **collaborator** of `car`
    - a collaborator works in conjunction (collaborates) with the object to which it belongs to represent that object's state
    - **why**: collaborators represent the connection between various actors in a program
        - collaborators help break down larger problems into smaller ones, and also help model the relationship between different parts of a program
    - collaborators can be custom objects, generic objects/arrays; in principle, they can also just be primitives
        - just need to form the state of an object
- **object factories**: functions that create and return objects of a particular type
    - can be used to automate object creation, solves the problem of creating many/dynamic amounts of objects of a particular **type** (ex/a `car` object with some fixed properties like model/year/color) without copy/pasting object literal code
    - usage: identify the distinctions between instances of an object and use those as parameters for the factory function. example:
        ```javascript
        const createCar = (model, year, color) => {
          return {
            model: model,
            year: year,
            color: color,
            drive () {
              console.log("car go fast");
            },
            stop () {
              console.log("car go stop");
            }
          }
        };
        ```
    - this function is an object factory that creates car objects with different models/years/colors but with the same behavior, and takes model/year/color arguments that are used as values for the model/year/color properties of the returned object
    - **shortened object property syntax**: with factory functions, can shorten property/property value assignment when an object property and a variable have the same name:
        ```javascript
        function createBook(title, author) {
          return {
            title, // same as 'title: title,'
            author, // same as 'author: author,'

            // etc
          }
        }
        ```
- OOP design outline:
    - write a textual description of the problem
    - extract relevant nouns and verbs from the description
    - organize and associate the verbs with the nouns
    - **idea**: roughly, the nouns are a starting point for the objects or types of objects necessary, and the verbs are behaviors or methods
    - early stages of design aren't concerned with program flow, but the organization of code into objects
    - **engine object**: can encapsulate the procedural flow of the program in an object, orchestrates the other objects in the program
        - example: a `game` object in a program that implements the game logic, creates objects representating players and other game objects, etc