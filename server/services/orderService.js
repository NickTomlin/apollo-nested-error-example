const delay = require("delay");
const orders = [
  {
    id: "order-1234",
    productIds: ["product-4444", "product-3333"],
    ownerId: "customer-1234"
  },
  {
    id: "order-6666",
    productIds: ["product-6666"],
    ownerId: "customer-6666"
  }
];

module.exports = class OrderService {
  async getForOwner(customer) {
    await delay(100);
    return orders.filter(o => o.ownerId === customer.id);
  }
};
