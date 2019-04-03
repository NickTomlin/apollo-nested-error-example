## Full Stack Error Handling

This is a playground to sketch out an approach for richer service errors when resolving a graph across microservices.

In this example, we are building an internal dashboard for an e-commerce site and want to surface the relevant service information to business and engineering teams to help notify the root cause of issues (this is a complement to built-in error handling that exists in those services).

## Running

```
# install dependencies
npm i

# start client and server
npm start
```

## Project Structure

```
src # client code
server # server side code
├── graphql.js # defines resolvers and loads schema.graphqls
├── index.js # starts webserver
├── orderService.js
└── services # contains services that resolve edges of graph
    ├── DataSourceError.js
    ├── customer-service.js
    └── ...
```

## Contributing

Contributions or comments are welcome. Please open a PR!
