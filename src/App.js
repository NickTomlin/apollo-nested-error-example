import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import "./App.css";

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

class WishLists extends Component {
  render() {
    const { data, errors } = this.props;

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
          Internal Dashboard
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
          <Query
            query={GET_CUSTOMER_ORDERS}
            variables={{ customerId: this.state.customerId }}
          >
            {({ error, data, loading }) => {
              if (loading) {
                return "loading...";
              }
              if (error) {
                return "Error!" + JSON.stringify(error, null, 2);
              }

              return (
                <>
                  <WishLists data={data.customer.wishLists} />
                  <Orders data={data.customer.orders} />
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
