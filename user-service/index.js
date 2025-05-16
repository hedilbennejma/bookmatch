require('dotenv').config();

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const userService = require('./services/user.service');

const PROTO_PATH = './user.proto';
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObject.user;

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected (User Service)');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }

  const server = new grpc.Server();

  server.addService(userPackage.UserService.service, userService);
  server.bindAsync(`0.0.0.0:${process.env.PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`✅ gRPC User Service started on port ${process.env.PORT}`);
   
  });
}

start();
