/*
 * Pseudonym maps javascript object property names to aliases for optimal serialized document storage.
 * @module pseudonym
 * @author Ashley Brener <ashley@frisb.com>
 * @license The MIT License (MIT)
 *
 * Copyright (c) 2014 frisB.com <play@frisb.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Pseudonym = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module", "exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.fieldmap = mod.exports;
  }
})(this, function (module, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

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

  var FieldMap = function () {
    /*
     * Get an FieldMap class
     * @class
     * @param {array|object} initializer Array or object of alias mappings.
     * @property {string[]|object} initializer Array or object of alias mappings.
     * @property {string[]} srcKeys Source key names.
     * @property {string[]} destKeys Destination key names.
     * @property {object} srcIndex Dictionary mapping source key names to srcKeys array indexes.
     * @property {object} destIndex Dictionary mapping destination key names to destKeys array indexes.
     * @return {FieldMap} FieldMap.
     */

    function FieldMap(fields) {
      _classCallCheck(this, FieldMap);

      this.index = 0;
      this.init(fields);
    }

    _createClass(FieldMap, [{
      key: "add",
      value: function add(src) {
        var dest = arguments.length <= 1 || arguments[1] === undefined ? src : arguments[1];
        var index = this.index;
        var srcIndex = this.srcIndex;
        var destIndex = this.destIndex;
        var srcKeys = this.srcKeys;
        var destKeys = this.destKeys;


        if (!srcIndex[src]) {
          srcKeys.push(src);
          destKeys.push(dest);

          srcIndex[src] = index;
          destIndex[dest] = index;

          this.index++;
        }
      }
    }, {
      key: "init",
      value: function init(fields) {
        if (fields) {
          this.srcKeys = [];
          this.destKeys = [];

          this.srcIndex = Object.create(null);
          this.destIndex = Object.create(null);

          if (fields instanceof Array) {
            for (var j = 0, len = fields.length; j < len; j++) {
              this.add(fields[j]);
            }
          } else {
            for (var src in fields) {
              if (fields.hasOwnProperty(src)) {
                var dest = fields[src];
                this.add(src, dest);
              }
            }
          }

          this.fields = fields;
        }
      }
    }, {
      key: "getSrcKey",
      value: function getSrcKey(dest) {
        return this.srcKeys[this.destIndex[dest]];
      }
    }, {
      key: "getDestKey",
      value: function getDestKey(src) {
        return this.destKeys[this.srcIndex[src]];
      }
    }]);

    return FieldMap;
  }();

  exports.default = FieldMap;
  module.exports = exports['default'];
});

},{}],2:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', './model'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('./model'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.model);
    global.index = mod.exports;
  }
})(this, function (module, exports, _model) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (fields) {
    if (typeof fields === 'string') fields = [fields];

    var superConstructor = (0, _model.createModel)(fields);
    var prototype = superConstructor.prototype;
    var fieldMap = superConstructor.fieldMap;
    var srcKeys = fieldMap.srcKeys;


    for (var i = 0, len = srcKeys.length; i < len; i++) {
      var key = srcKeys[i];
      __defineProperty(prototype, key);
    }

    superConstructor.extend = function (child) {
      var childProto = {};

      var propNames = Object.getOwnPropertyNames(child.prototype);

      for (var j = 0, _len = propNames.length; j < _len; j++) {
        var name = propNames[j];
        childProto[name] = child.prototype[name];
      }

      __extends(child, superConstructor);

      for (var _key in childProto) {
        child.prototype[_key] = childProto[_key];
      }child.fieldMap = fieldMap;

      return child;
    };

    return superConstructor;
  };

  function __extends(child, parent) {
    for (var key in parent) {
      if (parent.hasOwnProperty(key)) child[key] = parent[key];
    }

    function ctor() {
      this.constructor = child;
    }

    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;

    return child;
  }

  /*
   * Define source name properties on the Model prototype
   * @method
   * @param {object} prototype Model implementation prototype.
   * @param {string} src Source name.
   */
  function __defineProperty(prototype, src) {
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
   * @param {string[]|object} fields FieldMap initializer.
   */
  module.exports = exports['default'];
});

},{"./model":3}],3:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './fieldmap'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./fieldmap'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.fieldmap);
    global.model = mod.exports;
  }
})(this, function (exports, _fieldmap) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.createModel = createModel;

  var _fieldmap2 = _interopRequireDefault(_fieldmap);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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

  function createModel(fields) {
    var _fieldMap = new _fieldmap2.default(fields);

    /*
     * Get a Model class
     * @class
     * @property {object} fieldMap FieldMap instance.
     * @property {array} __d Current internal data values.
     * @property {array} __p Previous internal data values.
     * @return {Model} Model
     */
    return function () {
      function Model(initializer, aliased) {
        _classCallCheck(this, Model);

        this.deserialize(initializer, aliased);
      }

      _createClass(Model, [{
        key: 'init',
        value: function init() {
          if (!this.__d) {
            this.__d = new Array(_fieldMap.destKeys.length);
            this.__p = new Array(_fieldMap.destKeys.length);
          }
        }
      }, {
        key: 'data',
        value: function data(dest, val) {
          this.init();

          var i = _fieldMap.destIndex[dest];

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
        key: 'serialize',
        value: function serialize() {
          return JSON.stringify(this);
        }
      }, {
        key: 'deserialize',
        value: function deserialize(obj, aliased) {
          if (typeof obj === 'string') obj = JSON.parse(obj);

          for (var dest in obj) {
            if (obj.hasOwnProperty(dest)) {
              var key = aliased ? _fieldMap.getSrcKey(dest) : dest;
              this[key] = obj[dest];
            }
          }

          return this;
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
            for (var i = 0, len = __d.length; i < len; i++) {
              var val = __d[i];

              if (typeof val !== 'undefined') {
                var src = _fieldMap.srcKeys[i];

                var key = aliased ? _fieldMap.getDestKey(src) : src;
                doc[key] = this[src];
              }
            }
          }

          return doc;
        }
      }, {
        key: 'prev',
        value: function prev(dest) {
          var i = _fieldMap.destIndex[dest];
          return this.__p[i];
        }
      }, {
        key: 'getValue',
        value: function getValue(src) {
          var dest = _fieldMap.getDestKey(src);
          return this.data(dest);
        }
      }, {
        key: 'setValue',
        value: function setValue(src, val) {
          var dest = _fieldMap.getDestKey(src);
          var previousVal = this.data[dest];

          if (typeof previousVal !== 'undefined') {
            var i = _fieldMap.destIndex[dest];
            this.__p[i] = previousVal;
          }

          if (val !== previousVal) this.data(dest, val);

          return dest;
        }
      }], [{
        key: 'fieldMap',
        get: function get() {
          return _fieldMap;
        }
      }]);

      return Model;
    }();
  }
});

},{"./fieldmap":1}]},{},[2])(2)
});