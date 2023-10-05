const { authJwt } = require("../middleware");
const { verifySignUp } = require('../middleware');
const controller = require('../controllers/auth.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  // Used for signup, dont need to get JWT token
  app.post(
    '/api/auth/signup',
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  // Used for signin, no need to get JWT token
  app.post('/api/auth/signin', controller.signin);

  // Used for getting removing user profile, need to get JWT token
  // [authJwt.verifyToken] is the middleware to verify JWT token
  // After authJwt.verifyToken, the req object will have userId decoded from JWT token
  // The req object will be passed to controller.removeUser
  app.delete('/api/auth/removeuser', [authJwt.verifyToken], controller.removeUser);

  app.patch(
    '/api/auth/updateprofile/:id',
    [verifySignUp.checkUpdateUsernameOrEmail],
    controller.updateProfile
  );

  // app.patch('/api/auth/updatepassword/:id', controller.updatePassword);

  app.patch('/api/auth/updatepassword', [authJwt.verifyToken], controller.updatePassword);

  app.get('/api/auth/getuser/:id', controller.getProfile);
};
