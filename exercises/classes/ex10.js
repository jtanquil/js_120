class Cat {
  constructor(name) {
    this.name = name;
  }

  personalGreeting() {
    console.log(`Hello! My name is ${this.name}!`);
  }

  static genericGreeting() {
    console.log("Hello! I'm a cat!");
  }
}

let kitty = new Cat("Sophie");
Cat.genericGreeting();
kitty.personalGreeting();