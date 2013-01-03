// Generated by CoffeeScript 1.4.0
(function() {

  module.exports = function() {
    var Settings;
    Settings = (function() {

      function Settings() {
        this.mongoose = require('mongoose');
        this.mongoose.connect('mongodb://localhost/lighter');
        this.marked = require('marked');
        this.marked.setOptions({
          highlight: function(code, lang) {
            var hl;
            hl = require('highlight.js');
            hl.tabReplace = '    ';
            return (hl.highlightAuto(code)).value;
          }
        });
      }

      Settings.prototype.marked = Settings.marked;

      Settings.prototype.mongoose = Settings.mongoose;

      Settings.prototype.url = 'http://localhost:3000/';

      Settings.prototype.title = 'Mehfuz\'s Blog';

      Settings.prototype.updated = new Date();

      Settings.prototype.engine = 'Lighter Blog Engine';

      Settings.prototype.format = function(content) {
        return this.marked(content);
      };

      return Settings;

    })();
    return new Settings();
  };

}).call(this);
