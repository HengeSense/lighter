// Generated by CoffeeScript 1.4.0
(function() {
  var app, catModel, category, express, fs, helper, path, request, util, xml2js;

  require('should');

  helper = (require('../modules/helper'))();

  xml2js = require('xml2js');

  util = require('util');

  path = require('path');

  fs = require('fs');

  express = require('express');

  request = require('supertest');

  app = express();

  category = (require(__dirname + '/init')).category;

  catModel = category.category;

  (require(path.join(__dirname, '../config')))(app);

  (require(path.join(__dirname, '../routes')))(app, category.settings);

  describe('category', function() {
    var date, id;
    id = '';
    date = '';
    before(function(done) {
      var cat, obj,
        _this = this;
      obj = new Date();
      date = util.format('%s-%s-%s', obj.getMonth(), obj.getDate(), obj.getFullYear());
      cat = new catModel({
        title: date,
        permaLink: '/test'
      });
      return cat.save(function(err, data) {
        id = data._id;
        return done();
      });
    });
    it('should not create duplicate entry for refresh category ', function(done) {
      var promise,
        _this = this;
      promise = category.refresh(date);
      return promise.then(function(result) {
        result.permaLink.should.equal('/test');
        return done();
      });
    });
    return after(function(done) {
      var _this = this;
      return catModel.remove({
        title: date
      }, function() {
        return done();
      });
    });
  });

}).call(this);
