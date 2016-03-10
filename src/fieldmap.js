export default class FieldMap {
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
  constructor(fields) {
    this.index = 0;
    this.init(fields);
  }

  add(src, dest = src) {
    let {index, srcIndex, destIndex, srcKeys, destKeys} = this;

    if (!srcIndex[src]) {
      srcKeys.push(src);
      destKeys.push(dest);

      srcIndex[src] = index;
      destIndex[dest] = index;

      this.index++;
    }
  }

  /*
   * Initialize instance properties
   * @method
   * @param {string[]|object} fields Array or object of alias mappings.
   */
  init(fields) {
    if (fields) {
      this.srcKeys = [];
      this.destKeys = [];

      this.srcIndex = Object.create(null);
      this.destIndex = Object.create(null);

      if (fields instanceof Array) {
        for (let j = 0, len = fields.length; j < len; j++)
          this.add(fields[j]);
      }
      else {
        for (let src in fields) {
          if (fields.hasOwnProperty(src)) {
            let dest = fields[src];
            this.add(src, dest);
          }
        }
      }

      this.fields = fields;
    }
  }

  /*
   * Get source key name for destination key name
   * @method
   * @param {string} dest Destination key name.
   * @return {string} Source key name.
   */
  getSrcKey(dest) {
    return  this.srcKeys[this.destIndex[dest]];
  }

  /*
   * Get destination key name for source key name
   * @method
   * @param {string} src Source key name.
   * @return {string} Destination key name.
   */
  getDestKey(src) {
    return this.destKeys[this.srcIndex[src]];
  }
}
