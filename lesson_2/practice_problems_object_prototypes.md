## Practice Problems - Object Prototypes ##

1. The code

```javascript
let qux = { foo: 1 };
let baz = Object.create(qux);
console.log(baz.foo + qux.foo);
```

will log `2` to the console. `baz` is an object whose prototype is `qux`. The expression `baz.foo` will search for a property `foo` on `baz`, and after not finding it, will search the prototype chain of `baz`, starting with the object `qux`. Since `qux` is an object with a property named `foo`, `baz.foo` will evaluated to the value of `qux.foo`, which is `1`. The expression `qux.foo` will return the value of `qux`'s own `foo` property, which is `1`, so the expression `baz.foo + qux.foo` evaluates to `2`, which the code logs to the console.

2. The code

```javascript
let qux = { foo: 1 };
let baz = Object.create(qux);
baz.foo = 2;

console.log(baz.foo + qux.foo);
```

will log `3` to the console. The difference between this code and the previous code is that on line 3, the property `foo` of `baz` is assigned to the value `2`, which adds `foo` as an own property of `baz`. Therefore, accessing the `foo` property of `baz` in the expression `baz.foo` evaluates to `2` instead of `1` because the own `foo` property of `baz` is returned instead of the values of any `foo` properties in the prototype chain of `baz`. Then `baz.foo + qux.foo` evaluates to `2 + 1`, or `3`, which is logged to the console.

3. The code

```javascript
let qux = { foo: 1 };
let baz = Object.create(qux);
qux.foo = 2;

console.log(baz.foo + qux.foo);
```

will log `4` to the console. The difference here is that the `foo` property of `qux` is reassigned to the value `2` on line 3. `baz` still does not have its own `foo` property, so the expression `baz.foo` will return the value of the `foo` property found in the prototype of `baz`, which is `qux.foo`, or `2`. Then `baz.foo` and `qux.foo` will both return `2`, so the console logs `2 + 2` or `4`.

4. Write a function that searches the prototype chain of an object for a given property and assigns it a new value. If the property does not exist in any of the prototype objects, the function should do nothing.

We want to iterate through the objects in the input object's prototype chain. For each object in the chain, we iterate through the object's own properties, and if we find the input property we reassign it to the input value.

```javascript
const assignProperty = (object, property, value) => {
  let currentObject = object;

  while (currentObject) {
    let properties = Object.keys(currentObject);

    for (let index = 0; index < properties.length; index += 1) {
      if (properties[index] === property) {
        currentObject[property] = value;
        return true;
      }
    }

    currentObject = Object.getPrototypeOf(currentObject);
  }
}
```

5. If `foo` is an arbitrary object, then iterating through its properties with `for/in` will iterate through properties in its prototype chain, whereas iterating through `Object.keys(foo)` will only iterate through `foo`'s own properties, since `Object.keys(foo)` will return an array of `foo`'s own properties. If an object in `foo`'s prototype chain has an enumerable property that is not `foo`'s own property, then the outputs of the two will differ - the `for/in` loop would iterate through those properties, whereas the `Object.keys` loop would only iterate through `foo`'s own properties.

6. How do you create an object that doesn't have a prototype? How can you determine whether an object has a prototype?

To create an object without a prototype, explicitly create it using `Object.create` passing `null` as an argument. This creates a "bare" object without a prototype. To check whether an object has a prototype, evaluate the truthiness of `Object.getPrototypeOf(obj)`. This is truthy whenever an object has a prototype, and falsy when it doesn't - i.e. when it was an object created with `Object.create(null)`.