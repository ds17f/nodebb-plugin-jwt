(function (module) {
    "use strict";

    console.log('lopez was here')

    var meta = module.parent.require('./meta'),
        user = module.parent.require('./user'),
        controllers = require('./lib/controllers'),
        nconf = require("nconf");

    var constants = Object.freeze({
        'name': "JWT",
        'admin': {
            'route': '/plugins/jwt',
            'icon': 'fa-file-archive-o'
        }
    });

    var JWT = {};
    JWT.settings = {
      cookiedomain: '',
      cookielifetime: 60,
      cookiename: 'nodebb',
      secret: 'donotusethissecret'
    };

    JWT.init = function (params, callback) {
        var jwt = require('jsonwebtoken'),
            _ = require('lodash'),
            router = params.router,
            hostMiddleware = params.middleware,
            hostControllers = params.controllers,
            url=nconf.get("url");

        router.get('/admin/plugins/jwt', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
        router.get('/api/admin/plugins/jwt', controllers.renderAdminPage);

        function getToken(req, res, next) {

          if (req.user && req.user.uid) {

            meta.settings.get('jwt', function (err, settings) {
              user.getUserData(req.user.uid, function (err, user) {
                user._uid=user.uid;
                var token = jwt.sign(_.omit(user, 'password'), settings.secret, {
                  expiresIn: 60 * 5
                });

                res.send(token);
              });
            });
          } else {
            res.redirect('/login');
          }
        }

        router.get('/api/jwt', getToken);

        JWT.reloadSettings();
        callback();
    };

    JWT.addAdminNavigation = function (header, callback) {
        header.plugins.push({
            "route": constants.admin.route,
            "icon": constants.admin.icon,
            "name": constants.name
        });

        callback(null, header);
    };

    JWT.reloadSettings=function(){
        meta.settings.get('jwt', function(err, settings) {
          JWT.settings.cookiedomain = settings.cookiedomain || JWT.settings.cookiedomain;
          JWT.settings.cookielifetime = settings.cookielifetime || JWT.settings.cookielifetime;
          JWT.settings.cookiename = settings.cookiename || JWT.settings.cookiename;
          JWT.settings.secret = settings.secret || JWT.settings.secret;
        });
    };

    JWT.writeCookieOnPage = function (req, res, next) {
      var jwt = require('jsonwebtoken'),
        _ = require('lodash');

      if (req.user && req.user.uid) {
          user.getUserData(req.user.uid, function (err, user) {
            user._uid = user.uid;
            var token = jwt.sign(_.omit(user, 'password'), JWT.settings.secret, {
              expiresIn: parseInt(JWT.settings.cookielifetime)
            });

            var exp = new Date();
            exp.setSeconds(exp.getSeconds() + parseInt(JWT.settings.cookielifetime));
            res.cookie(JWT.settings.cookiename, token, {
              domain: JWT.settings.cookiedomain,
              expires: exp,
              httpOnly: false
            });

            next();
          });
      } else {
        next();
      }
    };

    JWT.removeCookieOnLogout = function(data, callback) {
      data.res.clearCookie(
        JWT.settings.cookiename, {
          domain: JWT.settings.cookiedomain,
          expires: new Date(),
          path: '/'
        });

      if (typeof callback === 'function') {
        callback();
      } else {
        return true;
      }
    };
    module.exports = JWT;

}(module));
