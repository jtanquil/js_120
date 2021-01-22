## Practice Problems - OOP and Encapsulation ##

1. In your own words, what is Object Oriented Programming?

Object Oriented Programming is a method of designing and organizing programs that conceptualizes problems in terms of objects that have **state** and **behavior**, like objects in the real world. An Object-Oriented approach to designing a program would involve breaking down various aspects of the program and grouping them together into objects - for instance, a shopping application might be broken down into code for a shopping cart object, a user account object, an inventory item object, etc.

2. Describe some advantages and disadvantages of OOP.

The advantages of OOP are that, if done correctly, it can make code easier to organize and maintain, especially for complex programs developed/maintained by multiple developers. Being able to reason about parts of code in the same way as real-world objects helps programmers think about the code at a higher level of abstraction, less about implementation details and more about general program logic. It can also help organize code in a way that is easier to maintain and make dependencies within the code easier to manage.

The downsides of OOP is that generally, OO programs are larger than similar non-OO programs, and can be less efficient.

3. In your own words, what does encapsulation refer to in JavaScript?

In JavaScript, encapsulation refers to the concept of grouping together data (state or properties) and the operations that work on that data (behavior or methods) into a single entity - an object.

4. In JavaScript, how does encapsulation differ from encapsulation in most other OO languages?

In most other OO languages, encapsulation refers to the ability for objects to restrict access to certain data or methods from other parts of an application. In those languages, the option exists for an object to only allow access to certain data or methods through a **public interface** by other parts of an application - the object is only exposed through this interface, and the implementation of an object is hidden from the rest of the program. JavaScript does not have features that allow objects to restrict access in such a way.