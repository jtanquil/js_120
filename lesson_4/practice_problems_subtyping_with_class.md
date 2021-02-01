1. Adding a `play` method to the `Bingo` class would cause any invocations of `play` from instances of `Bingo` objects to invoke the `play` method in `Bingo` instead of going up the prototype chain and calling the `play` method in the `Game` class, since adding a method to a subclass **overrides** the corresponding method in the superclass.

2. 

```javascript
class Greeting {
  greet (string) {
    console.log(string);
  }
}

class Hello extends Greeting {
  hi () {
    this.greet("Hello");
  }
}

class Goodbye extends Greeting {
  bye () {
    this.greet("Goodbye");
  }
}

let hello = new Hello();
hello.hi();

let goodbye = new Goodbye();
goodbye.bye();
```