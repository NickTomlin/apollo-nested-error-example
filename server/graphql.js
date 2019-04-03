const OrderService = require("./services/orderService");
const ProductService = require("./services/ProductService");
const { readFileSync } = require("fs");
const typeDefs = readFileSync("schema.graphqls", "utf8");
const CustomerService = require("./services/customer-service");

const wishList = {
  id: "wishlist-1234",
  name: "Birthday items",
  ownerId: "customer-1234",
  productIds: ["product-2222"]
};
const wishLists = [wishList];

const customerService = new CustomerService();
const productService = new ProductService();
const orderService = new OrderService();

const resolvers = {
  Query: {
    customer: (obj, { id }) => customerService.get(id)
  },
  Customer: {
    wishlists: ({ id }, _) => wishLists.filter(w => w.ownerId === id),
    orders: async customer => {
      return orderService.getForOwner(customer);
    }
  },
  WishList: {
    owner: async obj => {
      return customerService.get(obj.ownerId);
    }
  },
  Order: {
    products: async ({ productIds }) => {
      return Promise.all(productIds.map(productService.find));
    },
    amount: async obj => {
      const products = await Promise.all(
        obj.productIds.map(productService.find)
      );
      return products.reduce((a, p) => a + p.price, 0);
    }
  }
};

module.exports = {
  typeDefs,
  resolvers
};
