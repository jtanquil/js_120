## Practice Problems - Classes ##

1. Classes are first-class values in the sense that they are values that can be passed as arguments to a function, returned from a function, or assigned to a variable. Since JavaScript classes are functions, and functions are first-class, classes must also be first-class.

2. The `static` modifier in `static manufacturer() ...` turns `manufacturer` into a static method of the `Television` class, which defines it as a method of `Television` instead of `Television.prototype`. It would be called by calling it on the class `Television`, i.e. `Television.manufacturer()`, as opposed to calling it on an instance of a `Television` object.