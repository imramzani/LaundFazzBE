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
    pickupDate: String
    deliveryDate: String
    longitude: String
    latitude: String
    totalPrice: Int
    Products: [TransactionGetProducts]
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

  type TransactionGetProducts {
    id: ID
    name: String
    Price: Int
    Product: Product
    TransactionProduct: TP
  }

  type TP {
    id: ID
    TransactionId: ID
    ProductId: ID
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
    getProducts: [Product]
    getProductById(id: ID!): Product
    getStaffTransactions: [Transaction]
    getStaffTransactionById(id: ID!): Transaction
    getUserTransactions: [Transaction]
    getUserTransactionById(id: ID!): Transaction
    getTransactionProducts: [TransactionProduct]
    getTransactionProductById(id: ID!): TransactionProduct
    loginUser(email: ID, password: String!): LogInResponse
    loginStaff(email: ID, password: String!): LogInResponse
  }

  type Mutation {
    userAddTransaction(StaffId: ID!): Transaction
    putTransaction(
      pickupDate: String
      deliveryDate: String
      status: String
      isPaid: Boolean
      longitude: String
      latitude: String
      totalPrice: Int
      id: ID!
    ): Transaction
  }
`;
const resolvers = {
  Query: {
    //! Products
    getProducts: async (_, args) => {
      try {
        const productsCache = await redis.get("products");

        if (productsCache) {
          const products = JSON.parse(productsCache);
          // console.log(products, "Request Cache");

          return products;
        } else {
          const products = await axios.get("http://localhost:3000/products", {
            headers: {
              access_token: token_staff,
            },
          });
          // console.log(products.data, "Request Server");
          if (products) {
            await redis.set("products", JSON.stringify(products.data));
            return products.data;
          }
        }
      } catch (err) {
        return err;
      }
    },
    getProductById: async (_, args) => {
      try {
        const product = await axios.get(
          `http://localhost:3000/products/${args.id}`,
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
        const transactionsCache = await redis.get("transactions");

        if (transactionsCache) {
          const transactions = JSON.parse(transactionsCache);
          console.log(transactions, "Request Cache");

          return transactions;
        } else {
          const transactions = await axios.get(
            "http://localhost:3000/staffs/transactions",
            {
              headers: {
                access_token: token_staff,
              },
            }
          );
          if (transactions) {
            console.log(transactions.data, "Request Server");
            await redis.set("transactions", JSON.stringify(transactions.data));
            return transactions.data;
          }
        }
      } catch (err) {
        return err;
      }
    },
    getStaffTransactionById: async (_, args) => {
      try {
        const transactions = await axios.get(
          `http://localhost:3000/staffs/transactions/${args.id}`,
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
        const transactionsCache = await redis.get("userTransactions");

        if (transactionsCache) {
          const transactions = JSON.parse(transactionsCache);
          console.log(transactions, "Request Cache");

          return transactions;
        } else {
          const transactions = await axios.get(
            "http://localhost:3000/customers/transactions",
            {
              headers: {
                access_token: token_user,
              },
            }
          );
          if (transactions) {
            await redis.set(
              "userTransactions",
              JSON.stringify(transactions.data)
            );
            return transactions.data;
          }
        }
      } catch (err) {
        return err;
      }
    },
    getUserTransactionById: async (_, args) => {
      try {
        const transactions = await axios.get(
          `http://localhost:3000/customers/transactions/${args.id}`,
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
        const TPCache = await redis.get("transactionProducts");

        if (TPCache) {
          const TP = JSON.parse(TPCache);
          console.log(TP, "Request Cache");

          return TP;
        } else {
          const TP = await axios.get(
            `http://localhost:3000/transactionProducts`,
            {
              headers: {
                access_token: token_staff,
              },
            }
          );
          if (TP) {
            await redis.set("transactionProducts", JSON.stringify(TP.data));
            return TP.data;
          }
        }
      } catch (err) {
        return err;
      }
    },
    getTransactionProductById: async (_, args) => {
      try {
        console.log(args, `MASUK`);
        const TP = await axios.get(
          `http://localhost:3000/transactionProducts/${args.id}`,
          {
            headers: {
              access_token: token_staff,
            },
          }
        );
        if (TP) {
          return TP.data;
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
    userAddTransaction: async (_, args) => {
      const { StaffId } = args;

      try {
        const newTransaction = await axios.post(
          `http://localhost:3000/customers/transactions`,
          {
            StaffId,
          },
          {
            headers: {
              access_token: token_user,
            },
          }
        );
        if (newTransaction) {
          await redis.del("transactions");
          return newTransaction.data;
        }
      } catch (err) {
        return err;
      }
    },
    putTransaction: async (_, args) => {
      const {
        pickupDate,
        deliveryDate,
        status,
        isPaid,
        longitude,
        latitude,
        totalPrice,
      } = args;
      console.log(args);

      try {
        let temp = {};

        if (pickupDate) {
          temp.pickupDate = pickupDate;
        }
        if (deliveryDate) {
          temp.deliveryDate = deliveryDate;
        }
        if (status) {
          temp.status = status;
        }
        if (isPaid) {
          // console.log(`MASUK`);
          temp.isPaid = isPaid;
        }
        if (longitude) {
          temp.longitude = longitude;
        }
        if (latitude) {
          temp.latitude = latitude;
        }
        if (totalPrice) {
          temp.totalPrice = latitude;
        }
        console.log(temp, isPaid);
        const newTransaction = await axios.put(
          `http://localhost:3000/staffs/transactions/${args.id}`,
          temp,
          {
            headers: {
              access_token: token_staff,
            },
          }
        );
        if (newTransaction) {
          await redis.del("transactions");
          return newTransaction.data;
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
server.listen(PORT).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});