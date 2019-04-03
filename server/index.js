const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const { typeDefs, resolvers } = require("./graphql");

const port = process.env.port || 4000;

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

app.use(express.static("build"));
server.applyMiddleware({ app });

app.get("*", (_, res) => {
  res.sendFile(__dirname + "./build/index.html");
});

app.listen({ port }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
);
