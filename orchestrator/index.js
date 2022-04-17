const { ApolloServer, gql } = require("apollo-server");
const axios = require("axios");
const PORT = process.env.PORT || 4000;
const redis = require('./config/redis')

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
    error: String
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
    getTransactionProducts: [TransactionProduct]
  }

  type Mutation {
    login(email: String, password: String): LogInResponse
  }
`;
const resolvers = {
  Query: {
    getProfile: async () => {
      try {
        const user = await axios.get("http://localhost:3000/customers", {
          headers: {
            // access_token: localStorage.access_token
            access_token: ""
          }
        });
        if (user) {
          return user.data;
        }
      } catch (err) {
        return err;
      }
    },
    getUserById: async (_, args) => {
      try {
        const user = await axios({
          method: "GET",
          url: `http://localhost:3000/users/${args.id}`,
        });
        if (user) {
          return user.data;
        }
      } catch (err) {
        return err;
      }
    },
    getBarbers: async () => {
      try {
        const barbers = await axios({
          method: "GET",
          url: "http://localhost:4001/barbers",
        });
        if (barbers) {
          return barbers.data;
        }
      } catch (err) {
        return err;
      }
    },
    getBarberById: async (_, args) => {
      try {
        const barber = await axios({
          method: "GET",
          url: `http://localhost:4001/barbers/${args.id}`,
        });
        if (barber) {
          return barber.data;
        }
      } catch (err) {
        return err;
      }
    },
    getOrders: async () => {
      try {
        const orders = await axios({
          method: "GET",
          url: "http://localhost:4001/orders",
          headers: {},
        });
        if (orders) {
          return orders.data;
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
