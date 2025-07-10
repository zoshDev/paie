/** @type {import('vitest').Config} */
module.exports = {
  test: {
    environment: 'jsdom', // Simule un environnement de navigateur pour les tests React
    globals: true, // Rend les APIs de test (expect, etc.) globalement disponibles
    setupFiles: ['./jest.setup.js'], // Exécute ce fichier avant chaque test
  },
  resolve: {
    alias: {
      '@': '/src', // Permet d'utiliser l'alias @ pour importer depuis le dossier src
    },
  },
};