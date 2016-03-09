(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.pseudonym = mod.exports;
  }
})(this, function (module) {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var AliasMap = function () {
    /*
     * Get an AliasMap class
     * @class
     * @param {array|object} initializer Array or object of alias mappings.
     * @property {string[]|object} initializer Array or object of alias mappings.
     * @property {string[]} srcKeys Source key names.
     * @property {string[]} destKeys Destination key names.
     * @property {object} srcIndex Dictionary mapping source key names to srcKeys array indexes.
     * @property {object} destIndex Dictionary mapping destination key names to destKeys array indexes.
     * @return {AliasMap} AliasMap.
     */

    function AliasMap(initializer) {
      _classCallCheck(this, AliasMap);

      this.init(initializer);
    }

    /*
     * Initialize instance properties
     * @method
     * @param {string[]|object} initializer Array or object of alias mappings.
     */


    _createClass(AliasMap, [{
      key: 'init',
      value: function init(initializer) {
        var _this = this;

        if (initializer) {
          (function () {
            _this.srcKeys = [];
            _this.destKeys = [];

            _this.srcIndex = Object.create(null);
            _this.destIndex = Object.create(null);

            var i = 0;

            var addMapping = function addMapping(src) {
              var dest = arguments.length <= 1 || arguments[1] === undefined ? src : arguments[1];

              if (!_this.srcIndex[src]) {
                _this.srcKeys.push(src);
                _this.destKeys.push(dest);

                _this.srcIndex[src] = i;
                _this.destIndex[dest] = i;

                i++;
              }
            };

            if (initializer instanceof Array) {
              for (var j = 0, len = initializer.length; j < len; j++) {
                addMapping(initializer[j]);
              }
            } else {
              for (var src in initializer) {
                if (initializer.hasOwnProperty(src)) {
                  var dest = initializer[src];
                  addMapping(src, dest);
                }
              }
            }

            _this.initializer = initializer;
          })();
        }

        console.log(this);
      }
    }, {
      key: 'getSrcKey',
      value: function getSrcKey(dest) {
        return this.srcKeys[this.destIndex[dest]];
      }
    }, {
      key: 'getDestKey',
      value: function getDestKey(src) {
        return this.destKeys[this.srcIndex[src]];
      }
    }]);

    return AliasMap;
  }();

  function createModel(aliases) {
    var _aliasMap = new AliasMap(aliases);

    return function () {
      /*
       * Get a Model class
       * @class
       * @property {object} aliasMap AliasMap instance.
       * @property {array} __d Current internal data values.
       * @property {array} __p Previous internal data values.
       * @return {Model} Model
       */

      function Model() {
        _classCallCheck(this, Model);
      }

      _createClass(Model, [{
        key: 'init',
        value: function init() {
          if (!this.__d) {
            this.__d = new Array(_aliasMap.destKeys.length);
            this.__p = new Array(_aliasMap.destKeys.length);
          }
        }
      }, {
        key: 'data',
        value: function data(dest, val) {
          this.init();

          var i = _aliasMap.destIndex[dest];

          if (typeof val !== 'undefined') {
            this.__d[i] = val;
            return;
          } else if (dest) {
            return this.__d[i];
          } else {
            return this.__d;
          }
        }
      }, {
        key: 'Serialize',
        value: function Serialize() {
          throw new Error('not implemented');
        }
      }, {
        key: 'Deserialize',
        value: function Deserialize(obj) {
          throw new Error('not implemented');
        }
      }, {
        key: 'toJSON',
        value: function toJSON() {
          return this.toDocument();
        }
      }, {
        key: 'toDocument',
        value: function toDocument(aliased) {
          var doc = Object.create(null);
          var __d = this.__d;


          if (__d) {
            for (var _i = 0, len = __d.length; _i < len; _i++) {
              var val = __d[_i];

              if (typeof val !== 'undefined') {
                var src = _aliasMap.srcKeys[_i];

                var key = aliased ? _aliasMap.getDestKey(src) : src;
                doc[key] = this.getValue(src);
              }
            }
          }

          return doc;
        }
      }, {
        key: 'prev',
        value: function prev(dest) {
          var i = _aliasMap.destIndex[dest];
          return this.__p[i];
        }
      }, {
        key: 'getValue',
        value: function getValue(src) {
          var dest = _aliasMap.getDestKey(src);
          return this.data(dest);
        }
      }, {
        key: 'setValue',
        value: function setValue(src, val) {
          var dest = _aliasMap.getDestKey(src);
          var previousVal = this.data[dest];

          if (typeof previousVal !== 'undefined') {
            var _i2 = _aliasMap.destIndex[dest];
            this.__p[_i2] = previousVal;
          }

          if (val !== previousVal) this.data(dest, val);

          return dest;
        }
      }, {
        key: 'aliasMap',
        get: function get() {
          return _aliasMap;
        }
      }]);

      return Model;
    }();
  }
  /*
   * Define source name properties on the Model prototype
   * @method
   * @param {object} prototype Model implementation prototype.
   * @param {string} src Source name.
   */
  function defineProperty(prototype, src) {
    Object.defineProperty(prototype, src, {
      get: function get() {
        return this.getValue(src);
      },
      set: function set(val) {
        this.setValue(src, val);
      }
    });
  }

  /*
   * Exposed function to implement Pseudonym module.
   * @method
   * @param {object} [superConstructor] Class to inherit Pseudonym Model.
   * @param {string[]|object} aliases AliasMap initializer.
   */
  module.exports = function (aliases) {
    if (typeof aliases === 'string') aliases = [aliases];

    var superConstructor = createModel(aliases);
    var prototype = superConstructor.prototype;
    var srcKeys = prototype.aliasMap.srcKeys;


    for (var _i3 = 0, len = srcKeys.length; _i3 < len; _i3++) {
      var key = srcKeys[_i3];
      defineProperty(prototype, key);
    }

    superConstructor.extend = function (child) {
      var childProto = {};

      var propNames = Object.getOwnPropertyNames(child.prototype);

      for (var j = 0, _len = propNames.length; j < _len; j++) {
        var name = propNames[i];
        childProto[name] = child.prototype[name];
      }

      child.extends(superConstructor);

      for (var _key in childProto) {
        var val = childProto[_key];
        child.prototype[_key] = val;
      }

      return child;
    };

    return superConstructor;
  };
});
