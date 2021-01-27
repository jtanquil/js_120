## Practice Problems - Execution Context ##

1. The code

```javascript
function func() {
  return this;
}

let context = func();

console.log(context);
```

will output a string representation of the global object to the console. Since `func` is invoked via normal function invocation, the context at invocation is implicitly set to the global object, so `func` will return the value of `this`, which is a reference to the global object.

2. The code

```javascript
let obj = {
  func: function() {
    return this;
  },
};

let context = obj.func();

console.log(context);
```

outputs a string representation of `obj`, `{ func: [Function: func] }`. The function invocation `func()` has been replaced by the method invocation `obj.func()`, and method invocation implicitly sets the context to the caller, `obj`. `obj.func()` therefore returns a reference to `obj`.

3. The code will output

```javascript
`Hello from the global scope!`
`Hello from the function scope!`
```

The first invocation of `deliverMessage` is via normal function invocation, so the execution context is set to the global object. When the function attempts to access the `message` property of `this`, it attempts to access the `message` property of the global object, which has the value `'Hello from the global scope!'` since the undeclared variable assignment `message = 'Hello from the global scope!'` actually adds a property named `message` to the global object with that value.

The second invocation, `foo.deliverMessage()`, is a method invocation. Even though the `deliverMessage` property of `foo` points to the same function as the one invoked on line 7, because it was invoked as a method of `foo` rather than directly as a function, the execution context is set to the calling object `foo` instead of the global object. Therefore, when the function accesses the `message` property of `this`, it accesses the `message` property of `foo`, which evaluates to the string `'Hello from the function scope!'`.

4. What built-in methods have we learned about that we can use to specify a function's execution context explicitly?

The methods `Function.prototype.call` and `Function.prototype.apply` can both be called on functions (or methods, since they are also functions that have access to these methods) to explicitly set the execution context for the invocation. The first argument of both is the object to set as the execution context. `call` also takes any number of arguments to pass to the calling function. `apply` takes an array of arguments that are passed to the calling function.

5. The code

```javascript
let foo = {
  a: 1,
  b: 2,
};

let bar = {
   a: 'abc',
   b: 'def',
   add: function() {
     return this.a + this.b;
   },
};

console.log(bar.add.call(foo)); // added line
```

will log `3` to the console. The last line calls the `call` method on the `add` method of `bar`, passing `foo` as the argument which serves as the execution context for the invocation of `bar.add`. Normally, the execution context of `bar.add` would be the calling object, `bar`, but `call` sets it to `foo`, so when `add` attempts to access the `a` and `b` properties of `this`, it accesses the `a` and `b` properties of `foo`, whose respective values are `1` and `2`, so `add` returns `3`. Contrast to

```javascript
console.log(bar.add()); // "abcdef", bar.add() sets context to bar
```