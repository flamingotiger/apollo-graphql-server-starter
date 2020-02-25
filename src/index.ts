const { ApolloServer, gql } = require("apollo-server");
const faker = require("faker");

// Schema
const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Person {
    image: String
    firstName: String
    lastName: String
    jobTitle: String
  }

  type Query {
    books: [Book]
    persons: [Person]
  }

  type Mutation {
    addBook(title: String, author: String): Book
  }
`;

// Data set
const books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling"
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton"
  }
];

const persons = new Array(10).fill({
  image: faker.image.avatar(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  jobTitle: faker.name.jobTitle()
});

// Resolver
const resolvers = {
  Query: {
    books: () => books,
    persons: () => persons
  }
};

// Create an instance of ApolloServer
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
