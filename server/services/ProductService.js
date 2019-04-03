const delay = require("delay");
const DataSourceError = require("./DataSourceError");

const wheel = {
  id: "product-2222",
  name: "Wheel",
  price: 10.99
};

const spoke = {
  id: "product-3333",
  name: "Spoke",
  price: 4.99
};

const chain = {
  id: "product-4444",
  name: "Chain",
  price: 2.99
};

const brokenHub = {
  id: "product-6666",
  name: "Broken Hub",
  price: 2.99
};

const products = [wheel, spoke, chain, brokenHub];

module.exports = class ProductService {
  async find(id) {
    delay(100);
    const product = products.find(p => p.id === id);

    if (/6666/.test(id)) {
      throw new DataSourceError(
        `There was an issue talking to ProductService for product id ${id}`,
        {
          service: "product-service",
          owner: "product-team",
          support: "#product-support",
          additionalData: {
            requestId: "xyz-123"
          }
        }
      );
      // call to "method" for "args" failed with ...
    }

    if (!product) {
      throw new Error("Not found");
    }

    return product;
  }

  async all() {
    delay(100);
    return products;
  }
};
