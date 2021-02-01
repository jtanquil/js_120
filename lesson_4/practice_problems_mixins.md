## Practice Problems - Mix-Ins ##

1. Mixing in the `Speed` object to both `Car.prototype` and `Truck.prototype` will give both `Car` objects and `Truck` objects access to the `goFast` method.

```javascript
Object.assign(Car.prototype, Speed);
Object.assign(Truck.prototype, Speed);

let car = new Car();
let truck = new Truck();

car.goFast();
truck.goFast();
```

2. That is done with the expression `this.constructor.name` - when called as an instance method, `this` is either a `Car` object or a `Truck` object, so `this.constructor` is either the `Car` class or `Truck` class, whose `name` is either `Car` or `Truck`.

3. We can implement a `Catamaran` class by implementing `Vehicle` as a superclass of `WheeledVehicle`, where `Vehicle` contains the code that tracks fuel efficiency and range, and `WheeledVehicle` contains the code that tracks tire pressure:

```javascript
class Vehicle {
  constructor(kmTravelledPerLiter, fuelCapInLiter) {
    this.fuelEfficiency = kmTravelledPerLiter;
    this.fuelCap = fuelCapInLiter;
  }

  range() {
    return this.fuelCap * this.fuelEfficiency;
  }
}

class Catamaran extends Vehicle {
  constructor(propellerCount, hullCount, kmTravelledPerLiter, fuelCapInLiter) {
    super(kmTravelledPerLiter, fuelCapInLiter);
    this.propellerCount = propellerCount;
    this.hullCount = hullCount;
  }
}

class WheeledVehicle extends Vehicle {
  constructor(tirePressure, kmTravelledpPerLiter, fuelCapInLiter) {
    super(kmTravelledPerLiter, fuelCapInLiter);
    this.tires = tirePressure;
  }

  tirePressure(tireIdx) {
    return this.tires[tireIdx];
  }

  inflateTire(tireIdx, pressure) {
    this.tires[tireIdx] = pressure;
  }
}

class Auto extends WheeledVehicle {
  constructor() {
    super([30, 30, 32, 32], 50, 25.0);
  }
}

class Motorcycle extends WheeledVehicle {
  constructor() {
    super([20, 20], 80, 8.0);
  }
}
```