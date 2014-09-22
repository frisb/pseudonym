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
          this.srcKeys = [];
          this.destKeys = [];
          this.srcIndex = Object.create(null);
          this.destIndex = Object.create(null);
          i = 0;
          addMapping = (function(_this) {
            return function(s, d) {
              if (!_this.srcIndex[s]) {
                _this.srcKeys.push(s);
                _this.destKeys.push(d);
                _this.srcIndex[s] = i;
                _this.destIndex[d] = i;
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

      Schema.prototype.getSrcKey = function(dest) {
        return this.srcKeys[this.destIndex[dest]];
      };

      Schema.prototype.getDestKey = function(src) {
        return this.destKeys[this.srcIndex[src]];
      };

      return Schema;

    })();
    Formality = (function() {
      function Formality() {
        if (!this.__d) {
          this.__d = new Array(this.schema.destKeys.length);
        }
        if (!this.__p) {
          this.__p = new Array(this.schema.destKeys.length);
        }
      }

      Formality.prototype.data = function(dest, val) {
        var i;
        i = this.schema.destIndex[dest];
        if (val) {
          this.__d[i] = val;
        } else {
          return this.__d[i];
        }
      };

      Formality.prototype.prev = function(dest) {
        var i;
        i = this.schema.destIndex[dest];
        return this.__p[i];
      };

      Formality.prototype.getValue = function(src) {
        var dest;
        dest = this.schema.getDestKey(src);
        return this.data(dest);
      };

      Formality.prototype.setValue = function(src, val) {
        var dest, i, previousVal;
        dest = this.schema.getDestKey(src);
        previousVal = this.data[dest];
        if (typeof previousVal !== 'undefined') {
          i = this.schema.destIndex[dest];
          this.__p[i] = previousVal;
        }
        if (val !== previousVal) {
          this.data(dest, val);
        }
        return dest;
      };

      return Formality;

    })();
    applyProperty = function(prototype, src) {
      return Object.defineProperty(prototype, src, {
        get: function() {
          return this.getValue(src);
        },
        set: function(val) {
          return this.setValue(src, val);
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
      _ref = superConstructor.prototype.schema.srcKeys;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        applyProperty(superConstructor.prototype, s);
      }
      return superConstructor;
    };
  });

}).call(this);
