const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Chemin vers ton fichier book.proto
const protoPath = path.join(__dirname, 'book.proto');

// Chargement du proto avec options
const packageDefinition = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Chargement du package gRPC
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const bookPackage = grpcObject.book;

// Création du client gRPC BookService vers localhost:50053
const client = new bookPackage.BookService(
  '127.0.0.1:50053',
  grpc.credentials.createInsecure()
);

module.exports = client;
