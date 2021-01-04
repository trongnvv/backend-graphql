const gql = require('apollo-server-express').gql;
const user = require('./user');
const varGQL = gql`
  # scalar Date

  # directive @capitalize on FIELD_DEFINITION
  # directive @date(
  #   defaultFormat: String = "MMMM Do YYYY"
  # ) on FIELD_DEFINITION

  enum Role {
    ADMIN
    REVIEWER
    USER
    UNKNOWN
  }
  directive @upper on FIELD_DEFINITION
  directive @auth(requires: Role = ADMIN) on OBJECT | FIELD_DEFINITION
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`
module.exports = [varGQL, user];
