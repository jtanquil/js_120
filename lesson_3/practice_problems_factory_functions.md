## Practice Problems - Factory Functions ##

1. The two disadvantages to using factory functions are that each copy of the returned object contains a copy of the object's methods, which is memory inefficient, and it is impossible to determine when an object was created by a particular factory function - you can't tell what "type" of object it is from examining its properties.

2.

```javascript
function makeObj() {
  return {
    propA: 10,
    propB: 20,
  };
}
```

3. 

```javascript
function createInvoice(services = {}) {
  return {
    phone: services.phone || 3000,
    internet: services.internet || 5500,

    total () {
      return this.phone + this.internet;
    },
  };
}
```

4.

```javascript
function createPayment(services) {
  let payments = Object.assign({}, services);

  payments.total = function () {
    if (this.hasOwnProperty("amount")) {
      return this.amount;
    } else {
      let internetPayment = this.internet || 0;
      let phonePayment = this.phone || 0;

      return internetPayment + phonePayment;
    }
  };

  return payments;
}
```

5.

```javascript
function createInvoice(services = {}) {
  return {
    phone: services.phone || 3000,
    internet: services.internet || 5500,
    payments: [], 

    total () {
      return this.phone + this.internet;
    },

    addPayment (payment) {
      this.payments.push(payment);
    },

    addPayments (payments) {
      this.payments.push(...payments);
    },

    paymentTotal () {
      return this.payments.reduce((sum, payment) => sum + payment.total(), 0);
    }

    amountDue () {
      return this.total() - this.paymentTotal();
    },
  };
}
```
