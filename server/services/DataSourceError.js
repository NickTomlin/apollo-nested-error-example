const { ApolloError } = require("apollo-server");

module.exports = class DataSourceError extends ApolloError {
  constructor(message, additionalData) {
    super(message, "DataSourceError", additionalData);
  }
};
