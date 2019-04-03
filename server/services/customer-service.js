const customerOne = {
  name: "Good Customer",
  id: "customer-1234",
  orderIds: ["order-1234"],
  wishListIds: ["wishlist-1234"]
};

const customerTwo = {
  name: "Error Customer",
  id: "customer-6666",
  orderIds: ["order-6666"]
};

const customerThree = {
  name: "Empty Customer",
  id: "customer-6578",
  orderIds: [],
  wishListIds: []
};

const customers = [customerOne, customerTwo, customerThree];

module.exports = class CustomerService {
  async get(id) {
    return customers.find(c => c.id === id);
  }
};
