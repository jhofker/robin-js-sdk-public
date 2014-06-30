/*
 * robin-js-sdk
 * http://getrobin.com/
 *
 * Copyright (c) 2014 Robin Powered Inc.
 * Licensed under the Apache v2 license.
 * https://github.com/robinpowered/robin-js-sdk/blob/master/LICENSE
 *
 */

var ApiBase = require('../../lib/api/base'),
    chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    assert,
    expect,
    should;

before(function () {
  chai.use(chaiAsPromised);
  assert = chai.assert;
  expect = chai.expect;
  should = chai.should();
});

describe('api - base', function () {
  describe('instantiate', function () {
    it('should instantiate without error', function () {
      var apiBase = new ApiBase();
      expect(apiBase).to.be.an.instanceof(ApiBase);
    });
  });
  describe('acccess token operations', function () {
    it('should return undefined', function () {
      var apiBase = new ApiBase();
      expect(apiBase.getAccessToken()).to.be.undefined;
    });
    it('should set the correct access token', function () {
      var apiBase = new ApiBase(),
          accessToken = 'foo';
      apiBase.setAccessToken(accessToken);
      expect(apiBase.getAccessToken()).to.equal(accessToken);
    });
  });
  describe('relay identifier operations', function () {
    it('should return undefined', function () {
      var apiBase = new ApiBase();
      expect(apiBase.getRelayIdentifier()).to.be.undefined;
    });
    it('should set the correct relay identifier', function () {
      var apiBase = new ApiBase(),
          relayIdentifier = 'bar';
      apiBase.setRelayIdentifier(relayIdentifier);
      expect(apiBase.getRelayIdentifier()).to.equal(relayIdentifier);
    });
  });
  describe('reject request', function (done) {
    it('should reject a request', function () {
      var apiBase = new ApiBase();
      apiBase.rejectRequest().should.be.rejected.and.notify(done);
    });
  });
  describe('api requests', function () {
    describe('build options', function () {
      var apiBase = new ApiBase();
      it('should throw an error without an access token', function () {
        var options;
        expect(function () {
          options = apiBase.buildOptions();
        }).to.throw(Error);
      });
      describe('headers', function () {
        var options;
        before(function () {
          apiBase.setAccessToken('foo');
          apiBase.setRelayIdentifier('bar');
          options = apiBase.buildOptions();
        });
        it('should have authorization header', function () {
          expect(options.headers.Authorization).to.equal('Access-Token foo');
        });
        it('should have relay identifier header', function () {
          expect(options.headers['Relay-Identifier']).to.equal('bar');
        });
        it('should have relay identifier header', function () {
          expect(options.method).to.be.undefined;
        });
      });
      describe('build optional options for core api', function () {
        var getOptions,
            postOptions;
        before(function () {
          getOptions = apiBase.buildOptions('/foo', 'GET', {foo: 'bar'});
          postOptions = apiBase.buildOptions('/foo', 'POST', {foo: 'bar'});
        });
        it('getOptions should have a qs property', function () {
          expect(getOptions).to.have.property('qs');
        });
        it('postOptions should have a json property', function () {
          expect(postOptions).to.have.property('json');
        });
      });
      describe('build optional options for places api', function () {
        var getOptions,
            postOptions;
        before(function () {
          getOptions = apiBase.buildOptions('/foo', 'GET', {foo: 'bar'}, true);
          postOptions = apiBase.buildOptions('/foo', 'POST', {foo: 'bar'}, true);
        });
        it('getOptions should have a qs property', function () {
          expect(getOptions).to.have.property('qs');
        });
        it('postOptions should have a json property', function () {
          expect(postOptions).to.have.property('json');
        });
      });
    });
    describe('send requests', function () {
      describe('request without access token', function (done) {
        var apiBase;
        before(function () {
          apiBase = new ApiBase();
        });
        it('should reject this request', function () {
          apiBase.sendRequest().should.be.rejected.and.notify(done);
        });
      });
      describe('request without required arguments', function (done) {
        var apiBase;
        before(function () {
          apiBase = new ApiBase();
          apiBase.setAccessToken('foo');
        });
        it('should reject this request', function () {
          apiBase.sendRequest().should.be.rejected.and.notify(done);
        });
      });
      describe('use places api url for options', function (done) {
        var apiBase;
        before(function () {
          apiBase = new ApiBase();
          apiBase.setAccessToken('foo');
        });
        it('should reject this request', function () {
          apiBase.sendRequest(null, null, null, null, true)
          .should.be.rejected.and.notify(done);
        });
      });
    });
  });
  describe('api responses', function () {
    describe('test response success', function () {
      var apiBase = new ApiBase();
      it('should return false without arguments', function () {
        expect(apiBase.isSuccess()).to.be.false;
      });
      it('should return false if there\'s an error', function () {
        var err = {};
        expect(apiBase.isSuccess(err)).to.be.false;
      });
      it('should return false if there\'s a status of less than 200', function () {
        var err = {},
            res = {};
        res.statusCode = 199;
        expect(apiBase.isSuccess(err, res)).to.be.false;
      });
      it('should return false if there\'s a status of greater than 300', function () {
        var err = {},
            res = {};
        res.statusCode = 301;
        expect(apiBase.isSuccess(err, res)).to.be.false;
      });
      it('should return false if there\'s no status code', function () {
        var err,
            res = {};
        expect(apiBase.isSuccess(err, res)).to.be.false;
      });
      it('should return true if there\'s a status between 200 and 300', function () {
        var err,
            res = {};
        res.statusCode = 204;
        expect(apiBase.isSuccess(err, res)).to.be.true;
      });
    });
  });
});
