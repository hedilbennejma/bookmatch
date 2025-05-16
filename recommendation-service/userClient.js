const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const protoPath = path.join(__dirname, 'user.proto');

const packageDefinition = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const userPackage = grpcObject.user;

const client = new userPackage.UserService(
  '127.0.0.1:50051', // Adresse et port où tourne ton User Service gRPC
  grpc.credentials.createInsecure()
);

module.exports = client;
