## Practice Problems - Constructors and Prototypes ##

1. The code outputs

```javascript
NaN
NaN
```

because the `area` and `perimeter` properties of `rect1` are set to the return values of the method invocations `RECTANGLE.area()` and `RECTANGLE.perimeter()`, respectively. In both invocations, the execution context `this` is set to the calling object, `RECTANGLE`, which has no `width` or `height` properties, so the expressions `this.width` and `this.height` return `undefined`, and the method invocations will therefore both return `NaN`.

2. The following change will cause the code to produce the desired output:

```javascript
function Rectangle(width, height) {
  // ...

  this.area = RECTANGLE.area;
  this.perimeter = RECTANGLE.perimeter;
}

// ...

console.log(rect1.area());
console.log(rect1.perimeter());
```

The method invocations `rect1.area()` and `rect1.perimeter()` will set the execution context to `rect1`, which does contain `width` and `perimeter` properties, so the functions will return the desired values.

3. 

```javascript
function Circle(radius) {
  this.radius = radius;
}

Circle.prototype.area = function() {
  return (this.radius ** 2) * Math.PI;
}
```

4. This code logs `true` to the console. The method invocation `ninja.swingSword()` on line 11 sets the execution context to the calling object, `ninja`. `swingSword` returns the value of `this.swung`, which is `ninja.swung`, which is `true`. `true` is then output to the console.

5. This throws a `typeError` on line 13, since `ninja.swingSword` is not a function that can be invoked. Line 7 reassigns the `prototype` property of `Ninja` to an object that contains a `swingSword` method, but that reassignment doesn't change the `[[prototype]]` property of `ninja`. Then `ninja` doesn't have a `swingSword` property in its prototype chain, so `ninja.swingSword` returns `undefined`, and attempting to invoke `undefined` throws an error.

6. 

```javascript
Ninja.prototype.swing = function() {
  this.swung = true;
  return this;
}
```

7.

```javascript
let ninjaB = new ninjaA.constructor();
```

8.

```javascript
function User(first, last) {
  if (this instanceof User) {
    this.name = `${first} ${last}`;
  } else {
    return new User(first, last);
  }
}
```