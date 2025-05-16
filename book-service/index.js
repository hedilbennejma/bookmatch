const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'book.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const bookPackage = grpcObject.book;

const Book = require('./models/book.model');

// Implémentation des méthodes gRPC
const bookService = {
  GetBook: async (call, callback) => {
    try {
      const book = await Book.findById(call.request.id);
      if (book) {
        callback(null, book);
      } else {
        callback({
          code: grpc.status.NOT_FOUND,
          details: 'Book not found'
        });
      }
    } catch (err) {
      callback(err);
    }
  },

  AddBook: async (call, callback) => {
    try {
      const book = new Book(call.request);
      await book.save();


      callback(null, book);
    } catch (err) {
      callback(err);
    }
  },

  GetAllBooks: async (call, callback) => {
    try {
      const books = await Book.find();
      callback(null, { books });
    } catch (err) {
      console.error('Erreur lors de la récupération des livres:', err);
      callback(err);
    }
  }
};

// Connexion à MongoDB et démarrage serveur gRPC
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/book-service')
  .then(() => {
    console.log('MongoDB connected');
  })
  .then(() => {
    const server = new grpc.Server();
    server.addService(bookPackage.BookService.service, bookService);

    server.bindAsync('0.0.0.0:50053', grpc.ServerCredentials.createInsecure(), () => {
      console.log('✅ gRPC Book Service started on port 50053');
      server.start();
    });
  })
  .catch(err => {
    console.error('Startup error:', err);
  });
