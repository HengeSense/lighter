(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.exports = function(settings) {
    var Media;
    Media = (function() {
      function Media(settings) {
        this.clear = __bind(this.clear, this);
        this.media = settings.mongoose.model('media');
        this.helper = (require(__dirname + '/../helper'))();
        this.settings = settings;
      }

      Media.prototype.create = function(resource) {
        var body, promise, url,
          _this = this;
        promise = new this.settings.Promise;
        url = this.helper.linkify(resource.slug);
        body = resource.body;
        this.media.findOne({
          url: url
        }, function(err, data) {
          var db, gridStore;
          if (data === null) {
            db = _this.settings.mongoose.connection.db;
            gridStore = new settings.GridStore(db, url, 'w');
            return gridStore.open(function(err, gs) {
              return gs.write(body, function(err, gs) {
                return gs.close(function(err, result) {
                  var media;
                  GridStore.exist(db, result._id, function(err, result) {
                    return console.log(err);
                  });
                  if (err !== null) {
                    throw err;
                  }
                  media = new _this.media({
                    title: resource.slug,
                    id: resource.id,
                    url: url,
                    type: resource.type,
                    date: new Date()
                  });
                  return media.save(function(err, data) {
                    return promise.resolve(data);
                  });
                });
              });
            });
          } else {
            return promise.resolve(data);
          }
        });
        return promise;
      };

      Media.prototype.get = function(url) {
        var promise,
          _this = this;
        promise = new this.settings.Promise;
        this.media.findOne({
          url: url
        }, function(err, result) {
          var db, gridStore;
          if (result !== null) {
            db = _this.settings.mongoose.connection.db;
            gridStore = new _this.settings.GridStore(db, result.url, 'r');
            return gridStore.open(function(err, gs) {
              if (typeof gs !== 'undefined') {
                return gs.seek(0, function() {
                  return gs.read(function(err, data) {
                    var _this = this;
                    return gs.close(function(err, result) {
                      return promise.resolve({
                        type: result.type,
                        data: data
                      });
                    });
                  });
                });
              } else {
                return promise.resolve(null);
              }
            });
          } else {
            return promise.resolve(null);
          }
        });
        return promise;
      };

      Media.prototype.remove = function(url, callback) {
        var _this = this;
        return this.media.remove({
          url: url
        }, function() {
          var db, gridStore;
          db = _this.settings.mongoose.connection.db;
          gridStore = new _this.settings.GridStore(db, url, 'r');
          return gridStore.open(function(err, gs) {
            if (typeof gs !== 'undefined') {
              return gs.unlink(function(err, result) {
                if (err !== null) {
                  throw err;
                }
                return callback();
              });
            } else {
              return callback();
            }
          });
        });
      };

      Media.prototype.clear = function(callback) {
        var _this = this;
        return this.media.find(function(err, data) {
          var count, media, _i, _len, _results;
          count = 1;
          _results = [];
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            media = data[_i];
            _results.push(_this.remove(media.url, function() {
              if (count === data.length) {
                callback();
              }
              return count++;
            }));
          }
          return _results;
        });
      };

      return Media;

    })();
    return new Media(settings);
  };

}).call(this);
