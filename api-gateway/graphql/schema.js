const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String
    genre: String
    description: String
    publishedYear: Int
  }

  type User {
    id: ID!
    name: String!
    email: String
    preferences: [String!]
  }

  type Query {
    getAllBooks: [Book]
    getBook(id: ID!): Book
    getUser(id: ID!): User
    getRecommendations(userId: ID!): [Book]
  }

  type Mutation {
    addBook(
      title: String!
      author: String
      genre: String
      description: String
      publishedYear: Int
    ): Book

    createUser(
      name: String!
      email: String
      preferences: [String!]
    ): User
  }
`;

module.exports = typeDefs;
