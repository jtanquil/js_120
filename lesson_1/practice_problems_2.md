1. Create three objects that represent the three books shown above.

```javascript
let book1 = {
  title: "Mythos",
  author: "Stephen Fry",
  getDescription () {
    return `${this.title} was written by ${this.author}`;
  },
};

let book2 = {
  title: "Me Talk Pretty One Day",
  author: "David Sedaris",
  getDescription () {
    return `${this.title} was written by ${this.author}`;
  },
};

let book3 = {
  title: "Aunts aren't Gentlemen",
  author: "PG Wodehouse",
  getDescription () {
    return `${this.title} was written by ${this.author}`;
  },
};
```

2. Think about the code you wrote for problem #1. Is there any unnecessary code? Does it have duplication?

The only difference between the three objects were the values for the `title` and `author` properties - the property names of all the objects are the same, and they all have the same `getDescription` method, which has been duplicated in each object. From a design perspective, they are all the same type of object - one representing a book.

3. Given our observations about the code so far, implement a factory function for our book objects that we can use with the following code:

```javascript
let book1 = createBook('Mythos', 'Stephen Fry');
let book2 = createBook('Me Talk Pretty One Day', 'David Sedaris');
let book3 = createBook("Aunts aren't Gentlemen", 'PG Wodehouse');

book1.getDescription();  // "Mythos was written by Stephen Fry."
book2.getDescription();  // "Me Talk Pretty One Day was written by David Sedaris."
book3.getDescription();  // "Aunts aren't Gentlemen was written by PG Wodehouse"
```

```javascript
function createBook (title, author) {
  return {
    title: title,
    author: author,

    getDescription () {
      return `${this.title} was written by ${this.author}`;
    }
  };
}
```

4. Update the factory function so that it returns a book object that includes a property `read` that has an initial property of `false`.

```javascript
function createBook (title, author) {
  return {
    title,
    author,
    read: false,

    getDescription () {
      return `${this.title} was written by ${this.author}`;
    }
  };
}
```

5. Suppose that we want to add a book we've already read. Modify the factory function to use an optional `read` parameter with the default value of `false`.

```javascript
function createBook (title, author, read = false) {
  return {
    title,
    author,
    read,

    getDescription () {
      return `${this.title} was written by ${this.author}`;
    }
  };
}
```

6. Let's add a method, `readBook`, that marks a book object as read by setting the `read` property to `true`:

```javascript
function createBook (title, author, read = false) {
  return {
    title,
    author,
    read,

    getDescription () {
      return `${this.title} was written by ${this.author}`;
    },

    readBook () {
      this.read = true;
    },
  };
}
```

7. Finally, let's update `getDescription` to reflect the `read` state directly.

```javascript
function createBook (title, author, read = false) {
  return {
    title,
    author,
    read,

    getDescription () {
      return `${this.title} was written by ${this.author}. I ${this.read ? "have" : "haven't"} read it.`;
    },

    readBook () {
      this.read = true;
    },
  };
}
```