## Practice Problems - Dealing with Context Loss ##

1. This code outputs `undefined undefined is a undefined`. The reason why is because the method `turk.getDescription` is passed as an argument to `logReturnVal`, and when this function is invoked on line 12 of `logReturnVal`, it is invoked as a regular function, so `this` is implicitly set to the global object, so `this.firstName`, `this.lastName` and `this.occupation` are all attempting to access properties of the global object, instead of properties of `turk` as expected.

2. Modifying the code:

```javascript
function logReturnVal(func, context) {
  let returnVal = func.call(context);
  console.log(returnVal);
}

logReturnVal(turk.getDescription, turk);
```

This will produce the desired output, `Christopher Turk is a surgeon`. The difference is instead of invoking `func` normally, `logReturnVal` invokes `func` via the `call` method, passing the value of the `context` argument to it. This allows the function to invoke the `getDescription` function with the intended context, `turk`.

3. The code

```javascript
let func = turk.getDescription.bind(turk);
logReturnVal(func);
```

will assign to `func` a copy of `getDescription` with the execution context permanently set to `turk`. This extracts `getDescription` from `turk` and permanently sets its execution context to `turk`.

4. The code 

```javascript
const TESgames = {
  titles: ['Arena', 'Daggerfall', 'Morrowind', 'Oblivion', 'Skyrim'],
  seriesTitle: 'The Elder Scrolls',
  listGames: function() {
    this.titles.forEach(function(title) {
      console.log(this.seriesTitle + ': ' + title);
    });
  }
};

TESgames.listGames();
```

produces the output

```javascript
undefined: Arena
undefined: Daggerfall
undefined: Morrowind
undefined: Oblivion
undefined: Skyrim
```

When `TESgames.listGames` is invoked, the context is set to the calling object, `TESGames`. The first part of the expression in `listGames`, `this.titles`, returns the value of the `titles` property of `TESgames` since within the invocation of `TESgames.listGames` as a method, the value of `this` is `TESgames`. `forEach` is called on the array `this.titles`, passing a callback. When this callback is executed, it is executed as a function, so the value of `this` inside the callback is the global object. The expression `this.seriesTitle` evaluates to `undefined` since `this` is the global object, which has no `seriesTitle` property. The underlying concept here is that functions lose their surrounding context when used as arguments to another function.

5. Change `TESgames.listGames` to:

```javascript
listGames: function() {
  let self = this;
  this.titles.forEach(function(title) {
    console.log(self.seriesTitle + ': ' + title);
  });
}
```

6. Use the optional `thisArg` parameter of `forEach`:

```javascript
listGames: function() {
  this.titles.forEach(function(title) {
    console.log(this.seriesTitle + ': ' + title);
  }, this);
```

7. Use an arrow function:

```javascript
listGames: function() {
  this.titles.forEach((title) => {
    console.log(this.seriesTitle + ': ' + title);
  });
}
```

8. The value of `foo.a` is still `0` after this code runs. When `increment` is invoked during the invocation of `foo.incrementA`, the context of `increment` is set to the global object. `this.a` attempts to access the `a` property of the global object, instead of the `a` property of `foo` as expected, so the value of `foo.a` remains `0`.

9. Using `call`:

```javascript
incrementA: function() {
  function increment() {
    this.a += 1;
  }

  increment.call(this);
}
```