/*
 * robin-js-sdk
 * http://getrobin.com/
 *
 * Copyright (c) 2014 Robin Powered Inc.
 * Licensed under the Apache v2 license.
 * https://github.com/robinpowered/robin-js-sdk/blob/master/LICENSE
 *
 */

var RobinApi,
    _apiModules,
    q = require('q'),
    util = require('../util'),
    RobinApiBase = require('./base');

// This is an awful hack, but it has to be done for browserify.
_apiModules = {
  accounts: require('./modules/accounts'),
  apps: require('./modules/apps'),
  auth: require('./modules/auth'),
  channels: require('./modules/channels'),
  devicemanifests: require('./modules/devicemanifests'),
  devices: require('./modules/devices'),
  identifiers: require('./modules/identifiers'),
  me: require('./modules/me'),
  organizations: require('./modules/organizations'),
  projects: require('./modules/projects'),
  triggers: require('./modules/triggers'),
  users: require('./modules/users')
};

RobinApi = (function (_super) {

  function _RobinApi (accessToken, baseUrl) {
    _RobinApi.__super__.constructor.apply(this, arguments);
    this.setAccessToken(accessToken);
    this.setBaseUrl(baseUrl);
    this.loadModules();
  }

  util.__extends(_RobinApi, _super);

  _RobinApi.prototype.authorize = function (accessToken) {
    this.setAccessToken(accessToken);
  };

  _RobinApi.prototype.loadModules = function () {
    var ApiModule,
        _newModules = {},
        _this = this;
    for (var _rm in _apiModules) {
      ApiModule = _apiModules[_rm];
      _newModules[_rm] = new ApiModule(_this);
    }
    for (var _nm in _newModules) {
      this[_nm] = _newModules[_nm];
    }
  };

  _RobinApi.prototype.getCurrentUser = function() {
    var d = q.defer();
    this.sendRequest('/me', 'GET', d);
    return d.promise;
  };

  return _RobinApi;

}).apply(this, [RobinApiBase]);


module.exports = RobinApi;