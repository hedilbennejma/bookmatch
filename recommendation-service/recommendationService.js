const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const bookClient = require('./bookClient'); // Client BookService
const userClient = require('./userClient'); // Client UserService

// Chargement du proto recommendation.proto
const protoPath = path.join(__dirname, 'recommendation.proto');
const packageDef = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const recommendationPackage = grpcObject.recommendation;

// Implémentation du service Recommendation
const recommendationService = {
  GetRecommendations: (call, callback) => {
    const { userId } = call.request;
    if (!userId) {
      console.error('No userId provided');
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        details: "userId is required",
      });
    }

    console.log(`Fetching recommendations for user: ${userId}`);

    // Récupérer les préférences utilisateur
    userClient.GetUser({ id: userId }, (err, userResponse) => {
      if (err) {
        console.error('Error fetching user:', err);
        return callback({
          code: grpc.status.NOT_FOUND,
          details: "User not found",
        });
      }

      const userPreferences = userResponse.preferences || [];
      console.log(`User preferences: ${userPreferences}`);

      // Récupérer tous les livres
      bookClient.GetAllBooks({}, (bookErr, bookList) => {
        if (bookErr) {
          console.error('Error fetching books:', bookErr);
          return callback({
            code: grpc.status.INTERNAL,
            details: "Error fetching books",
          });
        }

        console.log('All books:', bookList.books);

        // Filtrer selon préférences utilisateur
        const recommendedBooks = bookList.books.filter(book =>
          userPreferences.includes(book.genre)
        );

        callback(null, { books: recommendedBooks });
      });
    });
  },
};

// Démarrage du serveur gRPC Recommendation Service sur port 50054
const server = new grpc.Server();
server.addService(recommendationPackage.RecommendationService.service, recommendationService);
server.bindAsync('0.0.0.0:50055', grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Erreur lors du bind du serveur gRPC:', err.message);
    return;
  }

  console.log(`Recommendation Service running on port ${port}`);
  server.start();
});