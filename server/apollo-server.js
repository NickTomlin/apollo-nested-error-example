const ProductService = require("./services/ProductService");
const { ApolloServer, gql } = require("apollo-server-express");
const { readFileSync } = require("fs");
const typeDefs = readFileSync("schema.graphqls", "utf8");

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

const wishList = {
  id: "wishlist-1234",
  name: "Birthday items",
  ownerId: "customer-1234",
  productIds: ["product-2222"]
};

const wishLists = [wishList];

const customerOne = {
  name: "Jane",
  id: "customer-1234",
  orderIds: ["order-1234"],
  wishListIds: ["wishlist-1234"]
};

const customerTwo = {
  name: "Bob",
  id: "customer-6666",
  orderIds: ["order-6666"]
};

const customers = [customerOne, customerTwo];

class CustomerService {
  async get(id) {
    return customers.find(c => c.id === id);
  }

  async getOrders(customer) {
    return orders.filter(o => o.ownerId === customer.id);
  }
}

const customerService = new CustomerService();
const productService = new ProductService();

const resolvers = {
  Query: {
    customer: (obj, { id }) => customerService.get(id),
    products: async () => productService.all()
  },
  Customer: {
    wishlists: ({ id }, _) => wishLists.filter(w => w.ownerId === id) || [],
    orders: async customer => {
      return customerService.getOrders(customer);
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

const server = new ApolloServer({ typeDefs, resolvers });

module.exports = {
  typeDefs,
  resolvers,
  server
};
