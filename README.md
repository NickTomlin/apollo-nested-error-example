## Full Stack Error Handling

This is a playground to sketch out an approach for richer service errors when resolving a graph across microservices.

In this example, we are building an internal dashboard for an e-commerce site and want to surface the relevant service information to business and engineering teams to help notify the root cause of issues. We are _assuming_ those internal teams already have notifications and metrics for failures on their side, and that we are building a user focused bridge.

Because our audience is internal, the goals here are to provide a truthful, hopefully actionable, display of error data that helps users and maintainers share a moment of truth.

## Running

```
# install dependencies
npm i

# start client and server
npm start

# run client and server tests (single run)
npm t
```

## Todo

- [x] Surface "service" information with errors on error extensions
- [x] Display basic information on front-end when there is an error
- [ ] Drive error information from configuration
- [ ] Use Apollo DataSources to wrap and automate error extension generation
- [ ] Deal with caching
- [ ] Handle partial data
- [ ] Dedupe errors for services
- [ ] Remove stack trace information from service errors

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
