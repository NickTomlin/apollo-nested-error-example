const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const { typeDefs, resolvers } = require("./graphql");

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

app.use(express.static("build"));
server.applyMiddleware({ app });

app.get("*", (_, res) => {
  res.sendFile(__dirname + "./build/index.html");
});

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
