const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Chemin vers le fichier user.proto
const protoPath = path.join(__dirname, 'user.proto');

// Charger le proto
const packageDefinition = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const userPackage = grpcObject.user;

// Créer le client gRPC vers le User Service
const client = new userPackage.UserService(
  '127.0.0.1:50051', // Port du user-service
  grpc.credentials.createInsecure()
);

module.exports = client;
