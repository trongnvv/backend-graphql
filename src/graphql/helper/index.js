const { jwtHandle } = require('../../utils');

const userType = {
  userID: null,
  username: null
}

const userInfo = async (authorization) => {
  if (!authorization) return { user: userType, isAuthenticated: false };
  const [tokenType, accessToken] = authorization.split(' ');
  if (tokenType !== 'Bearer') return { user: userType, isAuthenticated: false };
  // verify token
  const data = await jwtHandle.verify(accessToken);
  const { userID, username, iat, exp } = data;
  if (!userID || iat > exp) return { user: userType, isAuthenticated: false };
  return { user: { userID, username }, isAuthenticated: true };
};

module.exports = {
  userInfo
}