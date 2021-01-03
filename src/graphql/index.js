const ApolloServer = require('apollo-server-express').ApolloServer;
const types = require('./types');
const resolvers = require('./resolvers');
const { jwtHandle } = require('../utils');

const userInfo = async (authorization) => {
  if (!authorization)
    throw new Error('Access token invalid');
  // validate type
  const [tokenType, accessToken] = authorization.split(' ');
  if (tokenType !== 'Bearer')
    throw new Error('Access token invalid');
  // verify token
  const data = await jwtHandle.verify(accessToken);
  const { userID, username, iat, exp } = data;
  if (!userID || iat > exp)
    throw new Error('Access token expired');
  return { userID, username };
};

module.exports = (app) => {
  const server = new ApolloServer({
    playground: {
      settings: {
        'editor.cursorShape': 'line',
      },
    },
    typeDefs: types,
    resolvers: resolvers,
    context: async ({ req }) => {
      // console.log('context', req.headers);
      // const user = await userInfo(req.headers.authorization);
      // return { user };
    },
    tracing: true,
    formatError: (err) => {
      console.log(err);
      // Don't give the specific errors to the client.
      if (err.message.startsWith("Database Error: ")) {
        return new Error('Internal server error');
      }
      // Otherwise return the original error.  The error can also
      // be manipulated in other ways, so long as it's returned.
      return err;
    },
  });

  server.applyMiddleware({ app, path: '/graphql' });
}