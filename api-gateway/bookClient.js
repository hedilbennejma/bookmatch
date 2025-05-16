const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Chemin vers le fichier book.proto
const protoPath = path.join(__dirname, 'book.proto');

// Chargement du proto
const packageDefinition = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const bookPackage = grpcObject.book;

// Création du client gRPC vers le Book Service
const client = new bookPackage.BookService(
  '127.0.0.1:50053', // Le port du book-service
  grpc.credentials.createInsecure()
);

module.exports = client;
