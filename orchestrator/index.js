const { ApolloServer, gql } = require("apollo-server");
const axios = require("axios");
const PORT = process.env.PORT || 4000;
const redis = require("./config/redis");

const token_staff = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdGFmZklkIjoxLCJlbWFpbCI6InN0b3JlMUBtYWlsLmNvbSIsImlhdCI6MTY1MDE2NzQxMn0.EtRXd1J4OXss3U8Wg0EdzPF0btydmCjqkJz3RkOJc5w`;
const token_user = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDdXN0b21lcklkIjoxLCJlbWFpbCI6ImN1c3RvbWVyMUBtYWlsLmNvbSIsImlhdCI6MTY1MDE2OTY4MH0.O1EYLAD_DCiruDbFcciO6OXcPJwlnTp5Zj1zRDYZEy4`;

const typeDefs = gql`
  type Customer {
    id: ID
    email: String
    password: String
    phoneNumber: String
    name: String
  }

  type Staff {
    id: ID
    email: String
    password: String
    longitude: String
    latitude: String
  }

  type Transaction {
    id: ID
    CustomerId: ID
    StaffId: ID
    isPaid: Boolean
    status: String
    pickupDate: Date
    deliveryDate: Date
    longitude: String
    latitude: String
    totalPrice: Int
  }

  type Product {
    id: ID
    name: String
    price: Int
  }

  type TransactionProduct {
    id: ID
    TransactionId: ID
    ProductId: ID
    Product: Product
    Transaction: Transaction
  }

  type LogInResponse {
    access_token: String
  }

  input NewUser {
    username: String
    email: String
    password: String
    phoneNumber: String
  }

  type Query {
    getProfile: Customer
    getUserById(id: ID): Customer
    getStaffs: [Staff]
    getStaffById(id: ID): Staff
    getProducts(access_token: String!): [Product]
    getProductById(access_token: String!, id: ID!): Product
    getStaffTransactions(access_token: String!): [Transaction]
    getStaffTransactionById(access_token: String!, id: ID!): Transaction
    getUserTransactions(access_token: String!): [Transaction]
    getUserTransactionById(access_token: String!, id: ID!): Transaction
    getTransactionProducts(access_token: String!): [TransactionProduct]
    getTransactionProductById(
      access_token: String!
      id: ID!
    ): TransactionProduct
    loginUser(email: ID, password: string!): LogInResponse
    loginStaff(email: ID, password: string!): LogInResponse
  }

  type Mutation {
    addTransaction(
      StaffId: ID!
    ): Transaction
  }
`;
const resolvers = {
  Query: {
    //! Products
    getProducts: async (_, args) => {
      try {
        const products = await axios.get("http://localhost:3000/products", {
          headers: {
            access_token: token_staff,
          },
        });
        if (products) {
          return products.data;
        }
      } catch (err) {
        return err;
      }
    },
    getProductById: async (_, args) => {
      try {
        const product = await axios.get(
          `http://localhost:3000/products/${args.ID}`,
          {
            headers: {
              access_token: token_staff,
            },
          }
        );
        if (product) {
          return product.data;
        }
      } catch (err) {
        return err;
      }
    },

    //! Transactions Staff
    getStaffTransactions: async (_, args) => {
      try {
        const transactions = await axios.get(
          "http://localhost:3000/staffs/transactions",
          {
            headers: {
              access_token: token_staff,
            },
          }
        );
        if (transactions) {
          return transactions.data;
        }
      } catch (err) {
        return err;
      }
    },
    getStaffTransactionById: async (_, args) => {
      try {
        const transactions = await axios.get(
          `http://localhost:3000/staffs/transactions/${args.ID}`,
          {
            headers: {
              access_token: token_staff,
            },
          }
        );
        if (transactions) {
          return transactions.data;
        }
      } catch (err) {
        return err;
      }
    },

    //! Transactions User
    getUserTransactions: async (_, args) => {
      try {
        const transactions = await axios.get(
          "http://localhost:3000/customers/transactions",
          {
            headers: {
              access_token: token_user,
            },
          }
        );
        if (transactions) {
          return transactions.data;
        }
      } catch (err) {
        return err;
      }
    },
    getUserTransactionById: async (_, args) => {
      try {
        const transactions = await axios.get(
          `http://localhost:3000/customers/transactions/${args.ID}`,
          {
            headers: {
              access_token: token_user,
            },
          }
        );
        if (transactions) {
          return transactions.data;
        }
      } catch (err) {
        return err;
      }
    },

    //! TransactionProducts
    getTransactionProducts: async () => {
      try {
        const user = await axios.get(
          `http://localhost:3000/customers/transactionProducts/${args.ID}`,
          {
            headers: {
              access_token: token_staff,
            },
          }
        );
        if (user) {
          return user.data;
        }
      } catch (err) {
        return err;
      }
    },
    getTransactionProductById: async (_, args) => {
      try {
        const user = await axios.get(
          `http://localhost:3000/customers/transactionProducts/${args.ID}`,
          {
            headers: {
              access_token: token_staff,
            },
          }
        );
        if (user) {
          return user.data;
        }
      } catch (err) {
        return err;
      }
    },

    //! Credentials
    loginUser: async (_, args) => {
      try {
        const user = await axios.post(`http://localhost:3000/customers/login`, {
          email: args.email,
          password: args.password,
        });
        if (user) {
          return user.data;
        }
      } catch (err) {
        return err;
      }
    },
    loginStaff: async (_, args) => {
      try {
        const staff = await axios.post(`http://localhost:3000/staffs/login`, {
          email: args.email,
          password: args.password,
        });
        if (staff) {
          return staff.data;
        }
      } catch (err) {
        return err;
      }
    },
  },

  Mutation: {
    login: async (_, args) => {
      const { email, password } = args;
      try {
        const user = await axios({
          method: "POST",
          url: "http://localhost:4001/login",
          data: args,
        });
        if (user) {
          console.log(user.data.access_token);
          return user.data;
        }
      } catch (err) {
        return err;
      }
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
