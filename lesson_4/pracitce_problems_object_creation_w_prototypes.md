## Practice Problems - Object Creation with Prototypes ##

1. 

```javascript
let createPet = function(animal, name) {
  return {
    animal,
    name,

    sleep () {
      console.log("I am sleeping");
    },

    wake () {
      console.log("I am awake");
    },
  };
}
```

2.

```javascript
let PetPrototype = {
  sleep () {
    console.log("I am sleeping");
  },

  wake () {
    console.log("I am awake");
  },

  init (animal, name) {
    this.animal = animal;
    this.name = name;
    return this;
  }
};
```

3. In both problems 1 and 2, the objects created differ from each other by having different values for their `animal` and `name` properties. But in problem 1, each object has its own copies of the `sleep` and `wake` methods, whereas in problem 2, neither object contains those methods and they both delegate access of those methods to a shared prototype object, `PetPrototype`.