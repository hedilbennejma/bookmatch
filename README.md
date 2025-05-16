 Overview
BookMatch est un système de recommandation de livres basé sur une architecture microservices, développé en Node.js. Chaque service est indépendant, respecte une séparation claire des responsabilités et communique via gRPC. Les API sont exposées à travers une API Gateway unifiée, offrant à la fois des points d’entrée REST et GraphQL.

 System Architecture
 Microservices
Le système se compose des services suivants :
 Book Service
Gère la création et la récupération de livres
Stocke les livres dans MongoDB
Accessible via gRPC

 User Service : 
 Gère l’enregistrement et la gestion des utilisateurs
Stocke les préférences de lecture des utilisateurs
Fonctionne en gRPC

Recommendation Service:
Reçoit les requêtes via gRPC
Appelle le Book Service et User Service
Génère des recommandations de livres basées sur les préférences utilisateurs

 API Gateway
Point d’entrée centralisé
Expose les API REST et GraphQL
Route les requêtes vers les services gRPC appropriés
