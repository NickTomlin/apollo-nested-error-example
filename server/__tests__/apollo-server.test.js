"use strict";

const { resolvers, typeDefs } = require("../graphql");
const { ApolloServer } = require("apollo-server");
const { createTestClient } = require("apollo-server-testing");
const gql = require("graphql-tag");

const GET_CUSTOMER_ORDERS = gql`
  query getCustomerOrders($customerId: ID!) {
    customer(id: $customerId) {
      id
      wishlists {
        id
        name
        owner {
          name
        }
      }
      orders {
        amount
        id
        products {
          price
          name
        }
      }
    }
  }
`;

describe("basic service", () => {
  let server;

  beforeEach(async () => {
    server = new ApolloServer({
      typeDefs,
      resolvers
    });
  });

  test("smoke test", async () => {
    const { query } = createTestClient(server);
    const res = await query({
      query: GET_CUSTOMER_ORDERS,
      variables: { customerId: "customer-1234" }
    });
    expect(res.data).toMatchSnapshot();
    expect(res.errors).toBeUndefined();
  });

  test("error handling", async () => {
    const { query } = createTestClient(server);
    const res = await query({
      query: GET_CUSTOMER_ORDERS,
      variables: { customerId: "customer-6666" }
    });
    const [errorOne, errorTwo] = res.errors;

    expect(errorOne.path).toEqual(["customer", "orders", 0, "amount"]);
    expect(errorOne.message).toEqual(
      "There was an issue talking to ProductService for product id product-6666"
    );
    expect(errorOne.extensions.exception).toEqual(
      expect.objectContaining({
        service: "product-service",
        owner: "product-team",
        support: "#product-support",
        additionalData: {
          requestId: "xyz-123"
        }
      })
    );
    expect(errorTwo.path).toEqual(["customer", "orders", 0, "products"]);
    expect(errorTwo.extensions.exception).toEqual(
      expect.objectContaining({
        service: "product-service",
        owner: "product-team",
        support: "#product-support",
        additionalData: {
          requestId: "xyz-123"
        }
      })
    );
  });
});
