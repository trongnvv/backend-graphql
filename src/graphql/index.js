const ApolloServer = require('apollo-server-express').ApolloServer;
const types = require('./types');
const resolvers = require('./resolvers');
const { UpperCaseDirective, AuthDirective } = require('./directives');
const { userInfo } = require('./helper');

module.exports = (app) => {
  const server = new ApolloServer({
    playground: {
      settings: {
        'editor.cursorShape': 'line',
      },
    },
    typeDefs: types,
    resolvers: resolvers,
    schemaDirectives: {
      upper: UpperCaseDirective,
      auth: AuthDirective
    },
    context: async ({ req }) => {
      const { user, isAuthenticated } = await userInfo(req.headers.authorization);
      return { user, isAuthenticated };
    },
    tracing: true,
    formatError: (err) => {
      console.log(err);
      return ({ message: err.message, code: err.extensions.code });
    },
  });

  server.applyMiddleware({ app, path: '/graphql' });
}