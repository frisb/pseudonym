(function() {
  (function(factory) {
    if (typeof define === 'function' && define.amd) {
      define(function() {
        return factory();
      });
    } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
      module.exports = factory();
    }
  })(function() {
    var Formality, Schema, applyProperty;
    Schema = (function() {
      function Schema(initializer) {
        this.init(initializer);
      }

      Schema.prototype.init = function(initializer) {
        var addMapping, d, i, s, sd, _i, _len, _ref, _ref1, _results, _results1;
        this.initializer = initializer;
        if (this.initializer) {
          this.src = [];
          this.dest = [];
          this.srcMap = Object.create(null);
          this.destMap = Object.create(null);
          i = 0;
          addMapping = (function(_this) {
            return function(s, d) {
              if (!_this.srcMap[s]) {
                _this.src.push(s);
                _this.dest.push(d);
                _this.srcMap[s] = i;
                _this.destMap[d] = i;
                return i++;
              }
            };
          })(this);
          if (this.initializer instanceof Array) {
            _ref = this.initializer;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              sd = _ref[_i];
              _results.push(addMapping(sd, sd));
            }
            return _results;
          } else {
            _ref1 = this.initializer;
            _results1 = [];
            for (s in _ref1) {
              d = _ref1[s];
              _results1.push(addMapping(s, d));
            }
            return _results1;
          }
        }
      };

      Schema.prototype.getSrc = function(dest) {
        return this.src[this.destMap[dest]];
      };

      Schema.prototype.getDest = function(src) {
        return this.dest[this.srcMap[src]];
      };

      return Schema;

    })();
    Formality = (function() {
      function Formality() {}

      Formality.prototype.ensure = function() {
        if (!this.data) {
          this.data = Object.create(null);
        }
        if (!this.prev) {
          return this.prev = Object.create(null);
        }
      };

      Formality.prototype.get = function(src) {
        var dest;
        this.ensure();
        dest = this.schema.getDest(src);
        return this.data[dest];
      };

      Formality.prototype.set = function(src, val) {
        var currentVal, dest;
        this.ensure();
        dest = this.schema.getDest(src);
        currentVal = this.data[dest];
        if (typeof currentVal !== 'undefined') {
          this.prev[dest] = currentVal;
        }
        if (val !== currentVal) {
          this.data[dest] = val;
        }
        return dest;
      };

      return Formality;

    })();
    applyProperty = function(prototype, src) {
      return Object.defineProperty(prototype, src, {
        get: function() {
          return this.get(src);
        },
        set: function(val) {
          return this.set(src, val);
        }
      });
    };
    return function(superConstructor, schema) {
      var s, _i, _len, _ref;
      if (!schema) {
        schema = superConstructor;
        superConstructor = Formality;
      }
      if (schema) {
        if (typeof schema === 'string') {
          schema = [schema];
        }
        superConstructor.prototype.schema = new Schema(schema);
      }
      _ref = superConstructor.prototype.schema.src;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        applyProperty(superConstructor.prototype, s);
      }
      return superConstructor;
    };
  });

}).call(this);
