const bookClient = require('../bookClient');
const userClient = require('../userClient');
const recommendationClient = require('../recommendationClient');

const resolvers = {
  Query: {
    getAllBooks: async () => {
      return new Promise((resolve, reject) => {
        bookClient.GetAllBooks({}, (err, response) => {
          if (err) return reject(err);
          resolve(response.books);
        });
      });
    },

    getBook: async (_, { id }) => {
      return new Promise((resolve, reject) => {
        bookClient.GetBook({ id }, (err, response) => {
          if (err) return reject(err);
          resolve(response);
        });
      });
    },

    getUser: async (_, { id }) => {
      return new Promise((resolve, reject) => {
        userClient.GetUser({ id }, (err, response) => {
          if (err) return reject(err);
          resolve(response);
        });
      });
    },

    getRecommendations: async (_, { userId }) => {
      return new Promise((resolve, reject) => {
        recommendationClient.GetRecommendations({ userId }, (err, response) => {
          if (err) return reject(err);
          resolve(response.books);
        });
      });
    }
  },

  Mutation: {
    addBook: async (_, { title, author, genre, description, publishedYear }) => {
      return new Promise((resolve, reject) => {
        bookClient.AddBook({ title, author, genre, description, publishedYear }, (err, response) => {
          if (err) return reject(err);
          resolve(response);
        });
      });
    },

    createUser: async (_, { name, email, preferences }) => {
      return new Promise((resolve, reject) => {
        userClient.CreateUser({ name, email, preferences }, (err, response) => {
          if (err) return reject(err);
          resolve(response);
        });
      });
    }
  }
};

module.exports = resolvers;
