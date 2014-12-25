
/**
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

(function() {
  var AliasMap, Model, defineProperty, factory;

  AliasMap = (function() {

    /**
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
      this.init(initializer);
    }


    /**
     * Initialize instance properties 
     * @method
     * @param {string[]|object} initializer Array or object of alias mappings.
     */

    AliasMap.prototype.init = function(initializer) {
      var addMapping, d, i, s, sd, _i, _len, _ref, _ref1;
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
              i++;
            }
          };
        })(this);
        if (this.initializer instanceof Array) {
          _ref = this.initializer;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            sd = _ref[_i];
            addMapping(sd, sd);
          }
        } else {
          _ref1 = this.initializer;
          for (s in _ref1) {
            d = _ref1[s];
            addMapping(s, d);
          }
        }
      }
    };


    /**
     * Get source key name for destination key name 
     * @method
     * @param {string} dest Destination key name.
     * @return {string} Source key name.
     */

    AliasMap.prototype.getSrcKey = function(dest) {
      return this.srcKeys[this.destIndex[dest]];
    };


    /**
     * Get destination key name for source key name 
     * @method
     * @param {string} src Source key name.
     * @return {string} Destination key name.
     */

    AliasMap.prototype.getDestKey = function(src) {
      return this.destKeys[this.srcIndex[src]];
    };

    return AliasMap;

  })();

  Model = (function() {

    /**
     * Get a Model class 
     * @class
     * @property {object} aliasMap AliasMap instance.
     * @property {array} __d Current internal data values.
     * @property {array} __p Previous internal data values.
     * @return {Model} Model
     */
    function Model() {
      if (!this.__d) {
        this.__d = new Array(this.aliasMap.destKeys.length);
      }
      if (!this.__p) {
        this.__p = new Array(this.aliasMap.destKeys.length);
      }
    }


    /**
     * Get / Set internal value for property alias.
     * @method
     * @param {string} dest Destination property alias.
     * @param {object} val Optional value to set.
     * @return {object} Value if val undefined.
     */

    Model.prototype.data = function(dest, val) {
      var i;
      i = this.aliasMap.destIndex[dest];
      if (val) {
        this.__d[i] = val;
      } else if (dest) {
        return this.__d[i];
      } else {
        return this.__d;
      }
    };


    /**
     * Function to implement when JSON.stringify called on instance.
     * @method
     * @return {object} Object to stringify.
     */

    Model.prototype.toJSON = function() {
      return this.toDocument(true);
    };


    /**
     * Returns a simple document with aliased property names.
     * @method
     * @param {boolean} aliased Boolean switch to specify whether property name aliases should be returned with document.
     * @return {object} Value if val undefined.
     */

    Model.prototype.toDocument = function(aliased) {
      var doc, i, key, src, val, _i, _len, _ref;
      doc = Object.create(null);
      _ref = this.__d;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        val = _ref[i];
        if (typeof val !== 'undefined') {
          src = this.aliasMap.srcKeys[i];
          key = aliased ? this.aliasMap.getDestKey(src) : src;
          doc[key] = this.getValue(src);
        }
      }
      return doc;
    };


    /**
     * Return previous internal value for property alias
     * @method
     * @param {string} dest Destination property alias.
     * @return {object} Value.
     */

    Model.prototype.prev = function(dest) {
      var i;
      i = this.aliasMap.destIndex[dest];
      return this.__p[i];
    };


    /**
     * Get value for property name.
     * @method
     * @param {string} src Source property name.
     * @return {object} Value.
     */

    Model.prototype.getValue = function(src) {
      var dest;
      dest = this.aliasMap.getDestKey(src);
      return this.data(dest);
    };


    /**
     * Set value for property name.
     * @method
     * @param {string} src Source property name.
     * @param {object} val Value to set.
     * @return {string} Property alias.
     */

    Model.prototype.setValue = function(src, val) {
      var dest, i, previousVal;
      dest = this.aliasMap.getDestKey(src);
      previousVal = this.data[dest];
      if (typeof previousVal !== 'undefined') {
        i = this.aliasMap.destIndex[dest];
        this.__p[i] = previousVal;
      }
      if (val !== previousVal) {
        this.data(dest, val);
      }
      return dest;
    };

    return Model;

  })();


  /**
   * Define source name properties on the Model prototype
   * @method
   * @param {object} prototype Model implementation prototype.
   * @param {string} src Source name.
   */

  defineProperty = function(prototype, src) {
    return Object.defineProperty(prototype, src, {
      get: function() {
        return this.getValue(src);
      },
      set: function(val) {
        return this.setValue(src, val);
      }
    });
  };


  /**
   * Exposed function to implement Pseudonym module.
   * @method
   * @param {object} [superConstructor] Class to inherit Pseudonym Model.
   * @param {string[]|object} aliases AliasMap initializer.
   */

  factory = function() {
    return function(superConstructor, aliases) {
      var key, _i, _len, _ref;
      if (!aliases) {
        if (!superConstructor) {
          throw new Error('Model must have fields');
        }
        aliases = superConstructor;
        superConstructor = Model;
      }
      if (aliases) {
        if (typeof aliases === 'string') {
          aliases = [aliases];
        }
        superConstructor.prototype.aliasMap = new AliasMap(aliases);
      }
      _ref = superConstructor.prototype.aliasMap.srcKeys;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        defineProperty(superConstructor.prototype, key);
      }
      return superConstructor;
    };
  };

  (function() {
    if (typeof define === 'function' && define.amd) {
      define(function() {
        return factory();
      });
    } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
      module.exports = factory();
    }
  })();

}).call(this);
