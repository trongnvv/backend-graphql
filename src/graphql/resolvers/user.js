const mongoose = require('mongoose');
const { UserModel } = require('../../models');
const { jwtHandle, bcryptHandle } = require('../../utils');

module.exports = {
  Query: {
    me: (parent, args, context) => { },
    user: async (parent, { id }, context, info) => {
      const user = await UserModel.findById(id);
      return user;
    },
    users: async (parent, args, context) => {
      const users = await UserModel.find({});
      return users;
    }
  },
  Mutation: {
    register: async (parent, { username, password, confirmPassword }, context) => {

      if (password !== confirmPassword) throw new Error('Confirm password wrong');

      const userExisted = await UserModel.findOne({ username });
      if (userExisted) throw new Error('Account existed');

      const user = await UserModel.create({
        username,
        password: await bcryptHandle.encrypt(password),
      });

      const accessToken = jwtHandle.sign({
        userID: user._id,
        username
      });

      return {
        id: user._id,
        username,
        accessToken: 'Bearer ' + accessToken,
      };
    },
    login: async (parent, { username, password }, context) => {
      const user = await UserModel.findOne({ username });
      if (!user) throw new Error(`Account wasn't existed`);
      const checkPass = await bcryptHandle.compare(password, user.password);
      if (!checkPass) throw new Error('Password wrong!');

      const accessToken = jwtHandle.sign({
        userID: user._id,
        username: user.username,
      });

      return {
        accessToken: 'Bearer ' + accessToken,
        id: user._id,
        username: user.username,
      };
    },
  },
  User: {
    password: () => null
  }
}