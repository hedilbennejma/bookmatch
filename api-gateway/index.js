// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');

const userClient = require('./userClient');
const bookClient = require('./bookClient');
const recommendationClient = require('./recommendationClient');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const app = express();
app.use(cors());
app.use(bodyParser.json()); // Pour toutes les routes REST

// === ROUTES REST ===

// ➕ Créer un utilisateur
app.post('/users', (req, res) => {
  userClient.CreateUser(req.body, (err, data) => {
    if (err) return res.status(500).send(err.message);
    res.json(data);
  });
});

// 🔍 Récupérer un utilisateur
app.get('/users/:id', (req, res) => {
  userClient.GetUser({ id: req.params.id }, (err, data) => {
    if (err) return res.status(404).send(err.message);
    res.json(data);
  });
});

// ➕ Ajouter un livre
app.post('/books', (req, res) => {
  const { title, author, genre, description, publishedYear } = req.body;
  bookClient.AddBook({ title, author, genre, description, publishedYear }, (err, response) => {
    if (err) {
      console.error('Erreur lors de l\'ajout du livre:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(response);
  });
});

// 🔍 Obtenir un livre par ID
app.get('/books/:id', (req, res) => {
  bookClient.GetBook({ id: req.params.id }, (err, response) => {
    if (err) {
      console.error('Erreur lors de la récupération du livre:', err);
      return res.status(404).json({ error: 'Livre introuvable' });
    }
    res.json(response);
  });
});

// 📚 Obtenir tous les livres
app.get('/books', (req, res) => {
  bookClient.GetAllBooks({}, (err, response) => {
    if (err) {
      console.error('Erreur lors de la récupération des livres:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(response);
  });
});

app.get('/recommendations/:userId', (req, res) => {
  const { userId } = req.params;
  recommendationClient.GetRecommendations({ userId }, (err, response) => {
    if (err) {
      console.error('Erreur dans GetRecommendations:', err);
      return res.status(500).json({ error: err.details || 'Erreur interne' });
    }

    console.log('Réponse du service gRPC :', response);

    res.json(JSON.parse(JSON.stringify(response))); // forcer un objet JSON pur
  });
});


// === GraphQL ===
const server = new ApolloServer({ typeDefs, resolvers });

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`🚀 API Gateway REST:     http://localhost:${PORT}`);
    console.log(`🔗 GraphQL Playground: http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startApolloServer();
