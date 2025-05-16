const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Chemin vers le fichier recommendation.proto
const protoPath = path.join(__dirname, 'recommendation.proto');

// Charger le proto
const packageDefinition = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const recommendationPackage = grpcObject.recommendation;

// Créer un client gRPC vers le Recommendation Service
const client = new recommendationPackage.RecommendationService(
'127.0.0.1:50055' , 
  grpc.credentials.createInsecure()
);

module.exports = client;
