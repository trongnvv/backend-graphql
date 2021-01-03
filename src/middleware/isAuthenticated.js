"use strict";
const HttpStatus = require("http-status-codes");
const { jwtHandle } = require('../utils');
module.exports = module.exports.default = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    // require auth headers
    if (!authorization)
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Access token invalid' });
    // validate type
    const [tokenType, accessToken] = authorization.split(' ');
    if (tokenType !== 'Bearer')
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Access token invalid' });
    // verify token
    const data = await jwtHandle.verify(accessToken);
    const { userID, username, iat, exp } = data;
    if (!userID || iat > exp)
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Access token expired' });
    req.user = { userID, username };
    next();
  } catch (error) {
    next({
      success: false,
      code: error.code || HttpStatus.BAD_REQUEST,
      status: error.code || HttpStatus.BAD_REQUEST,
      message: error.message,
    });
  }
};