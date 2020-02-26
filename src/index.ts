const { ApolloServer, gql } = require("apollo-server");
const faker = require("faker");

// Schema
const typeDefs = gql`
  type Book {
    id: Int!
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
    id: 1,
    title: "지적 대화를 위한 넓고 얕은 지식: 제로편",
    author: "채사장"
  },
  {
    id: 2,
    title: "하버드 상위 1퍼센트의 비밀(리커버 에디션)",
    author: "정주영"
  },
  {
    id: 3,
    title: "지쳤거나 좋아하는 게 없거나",
    author: "글배우"
  },
  {
    id: 4,
    title: "내가 원하는 것을 나도 모를 때",
    author: "전승환"
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
