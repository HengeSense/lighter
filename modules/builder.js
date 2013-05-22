// Generated by CoffeeScript 1.4.0
(function() {

  module.exports = function(settings) {
    var blog, fs, user;
    blog = require(__dirname + '/blog')(settings);
    if (process.env.NODE_ENV !== 'production') {
      fs = require('fs');
      user = require(__dirname + '/user')(settings);
      return fs.readFile(__dirname + '/../bin/post.md', 'utf8', function(err, result) {
        var categories, category, content, post, posts, promise, _i, _j, _len, _len1, _ref, _ref1;
        blog["delete"](function() {});
        posts = [];
        _ref = result.split('#post');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          post = _ref[_i];
          if (post !== '') {
            content = post.split('#block');
            categories = [];
            _ref1 = content[3].split(' ');
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              category = _ref1[_j];
              category = category.replace(/^\n*|\n*$/g, '');
              categories.push(category);
            }
            promise = blog.createPost({
              title: content[0],
              body: content[1],
              author: settings.author,
              publish: true,
              categories: categories
            });
            promise.then(function(result) {
              if (result.id !== null) {
                return console.log('[%s]', result.permaLink);
              }
            });
          }
        }
        return console.log('BootStrapping with data');
      });
    }
  };

}).call(this);
