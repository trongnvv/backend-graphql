const { SchemaDirectiveVisitor } = require('apollo-server');
const { defaultFieldResolver } = require('graphql');

class UpperCaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const result = await resolve.apply(this, args);
      if (typeof result === 'string') {
        return result.toUpperCase();
      }
      return result;
    };
  }
}

class AuthDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    console.log('visitObject', type, this.args);
    // this.ensureFieldsWrapped(type);
    type._requiredAuthRole = this.args.requires;
  }
  // Visitor methods for nested types like fields and arguments
  // also receive a details object that provides information about
  // the parent and grandparent types.
  visitFieldDefinition(field, details) {
    console.log('visitFieldDefinition', field, details);
    // this.ensureFieldsWrapped(details.objectType);
    field._requiredAuthRole = this.args.requires;
  }

  // ensureFieldsWrapped(objectType) {
  //   // Mark the GraphQLObjectType object to avoid re-wrapping:
  //   if (objectType._authFieldsWrapped) return;
  //   objectType._authFieldsWrapped = true;

  //   const fields = objectType.getFields();

  //   Object.keys(fields).forEach(fieldName => {
  //     const field = fields[fieldName];
  //     const { resolve = defaultFieldResolver } = field;
  //     field.resolve = async function (...args) {
  //       // Get the required Role from the field first, falling back
  //       // to the objectType if no Role is required by the field:
  //       const requiredRole =
  //         field._requiredAuthRole ||
  //         objectType._requiredAuthRole;

  //       if (! requiredRole) {
  //         return resolve.apply(this, args);
  //       }

  //       const context = args[2];
  //       const user = await getUser(context.headers.authToken);
  //       if (! user.hasRole(requiredRole)) {
  //         throw new Error("not authorized");
  //       }

  //       return resolve.apply(this, args);
  //     };
  //   });
  // }
}

module.exports = {
  UpperCaseDirective,
  AuthDirective
}

