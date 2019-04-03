import React, { Component } from "react";
import { Query } from "react-apollo";
import partition from "lodash.partition";
import gql from "graphql-tag";
import "./App.css";

export const GET_CUSTOMER_ORDERS = gql`
  query getCustomerOrders($customerId: ID!) {
    customer(id: $customerId) {
      id
      name
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

export const errorClass = "DataSourceError";

class ErrorDetail extends Component {
  render() {
    const { error } = this.props;
    const { name, owner, support } = error.extensions.exception;
    // TODO: de-dupe errors (being mindful of paths that may be useful)
    return (
      <div>
        {name}
        {owner}
        Reach out to {support}
      </div>
    );
  }
}

/*
  This is responsible for marshalling our custom DataSource errors and other errors
  into something that a user can action on.

  In a perfect world a use would know:
    - who is responsible for the failure (is it us, or is it the external service)
    - what to do about that failure (slack, jira, "nothing: it is being handled")
    - how this affects them
 */
class ErrorDisplay extends Component {
  render() {
    const { errors } = this.props;
    if (!errors) {
      return null;
    }
    const [dataErrors, otherErrors] = partition(
      errors.graphQLErrors,
      e => e.extensions.code === errorClass
    );

    if (!errors || errors.length === 0) {
      console.log("returning null", errors);
      return null;
    }

    return (
      <>
        <h4>Data Errors</h4>
        {dataErrors.map((d, idx) => {
          return (
            <div key={idx}>
              {d.message}
              <ErrorDetail error={d} />
            </div>
          );
        })}
        <h4>Other Errors</h4>
        <ul>
          {otherErrors.map(e => (
            <li>{e.message}</li>
          ))}
        </ul>
      </>
    );
  }
}

class WishLists extends Component {
  render() {
    const { data } = this.props;
    return (
      <div>
        <h2>Wishlists</h2>
        {!data ? (
          "No Data"
        ) : (
          <div>
            <ul>
              {data.map(({ id, name, owner }, idx) => (
                <li key={idx}>
                  ID: {id}
                  Name: {name}
                  Owner Name: {owner.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

class Orders extends Component {
  render() {
    const { data } = this.props;
    return (
      <div>
        <h2>Orders</h2>

        {!data ? (
          "No Data"
        ) : (
          <div>
            <ul>
              {data.map(({ id, amount, products }, idx) => (
                <li key={idx}>
                  ID: {id}
                  Amount: {amount}
                  Products:
                  <ul>
                    {products.map(({ name, price }, idx) => (
                      <li key={idx}>
                        {name} {price}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

class App extends Component {
  state = {
    customerId: "customer-1234"
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Internal Dashboard for customer {this.state.customerId}
          <button
            onClick={() => this.setState({ customerId: "customer-6666" })}
          >
            Bad Customer
          </button>
          <button
            onClick={() => this.setState({ customerId: "customer-1234" })}
          >
            Good Customer
          </button>
          <button
            onClick={() => this.setState({ customerId: "customer-6578" })}
          >
            Empty Customer
          </button>
          <Query
            // temporary workaround for https://github.com/apollographql/react-apollo/issues/2202
            key={this.state.customerId}
            // if we _want_ to populate errors this is a good bet
            // errorPolicy={"ignore"}
            query={GET_CUSTOMER_ORDERS}
            variables={{ customerId: this.state.customerId }}
          >
            {({ error, data, loading }) => {
              if (loading) {
                return "loading...";
              }
              return (
                <>
                  <ErrorDisplay errors={error} />
                  {data && data.customer ? (
                    <>
                      {data.customer.name}
                      <WishLists data={data.customer.wishLists} />
                      <Orders data={data.customer.orders} />
                    </>
                  ) : null}
                </>
              );
            }}
          </Query>
        </header>
      </div>
    );
  }
}

export default App;
