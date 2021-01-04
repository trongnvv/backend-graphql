const gql = require('apollo-server-express').gql;

module.exports = gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  type User @auth(requires: ADMIN) {
    id: ID!
    username: String! @upper
    password: String 
  }

  type UserAuth {
    id: ID!
    username: String!
    accessToken: String!
  }
  
  extend type Mutation {
    register(username: String!, password: String!, confirmPassword: String!): UserAuth
    login(username: String!, password: String!): UserAuth
    changePassword(oldPassword: String!, newPassword: String!): User
  }  
`