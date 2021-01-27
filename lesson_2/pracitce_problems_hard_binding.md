## Practice Problems - Hard Binding Functions with Contexts ##

1. What method can we use to bind a function permanently to a particular execution context?

The `bind` method of a function takes a `context` as an argument and returns a copy of the calling function whose context is **permanently** set to `context`.

2. The code

```javascript

let obj = {
  message: 'JavaScript',
};

function foo() {
  console.log(this.message);
}

foo.bind(obj);
```

outputs nothing to the console; `foo.bind(obj)` returns a copy of the function `foo` whose context is permanently bound to `obj` and doesn't output anything to the console or invoke the calling function.

3. The code

```javascript
let obj = {
  a: 2,
  b: 3,
};

function foo() {
  return this.a + this.b;
}

let bar = foo.bind(obj);

console.log(foo());
console.log(bar());
```

logs

```javascript
NaN
5
```

to the console. The invocation of `foo` on line 12 implicitly sets the context to the global object, so the expressions `this.a` and `this.b` both attempt to access the `a` and `b` properties of the global object, respectively, and since the global object doesn't have either of those properties, both expressions evaluate to `undefined`, so this invocation of `foo` returns the value of `undefined + undefined`, which is `NaN`. `bar` is assigned to the return value of `foo.bind(obj)`, which is a copy of `foo` whose context is permanently bound to `obj`, so the invocation of `bar` on line 13 invokes the function `foo` with the context set to `obj`. In this case, `this.a` and `this.b` will access the `a` and `b` properties of `obj`, whose values are `2` and `3` respectively, so this invocation of `foo` returns the value `2 + 3`, or `5`.

4. The code

```javascript
let positivity = {
  message: 'JavaScript makes sense!',
};

let negativity = {
  message: 'JavaScript makes no sense!',
};

function foo() {
  console.log(this.message);
}

let bar = foo.bind(positivity);

negativity.logMessage = bar;
negativity.logMessage();
```

will log `JavaScript makes sense!` to the console. `bar` is assigned to the function returned by `foo.bind(positivity)`, which is a copy of `foo` whose context is **permanently** bound to `positivity`. The `logMessage` property is added to `negativity` and assigned to this function. Since `bind` permanently sets the context of the function it returns, the method call `negativity.logMessage()` invokes a copy of `foo` whose context is still `positivity`, so `this.message` evaluates to `JavaScript makes sense!`.

5. The code

```javascript
let obj = {
  a: 'Amazebulous!',
};
let otherObj = {
  a: "That's not a real word!",
};

function foo() {
  console.log(this.a);
}

let bar = foo.bind(obj);

bar.call(otherObj);
```

logs `Amazebulous!` to the console. `bar` is assigned to the value of `foo.bind(obj)`, which is a copy of `foo` whose context is permanently set to `obj`. Invoking `bar` via `call`, passing a different context (`otherObj`) doesn't change the context of the invocation of `foo` that happens when invoking `bar` due to how `bind` is implemented, so the call `bar.call(otherObj)` will still call `foo` with `obj` as the execution context, which logs the value of `obj.a`, `Amazebulous!`, to the console.