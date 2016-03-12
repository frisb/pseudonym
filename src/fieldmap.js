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
    this.count = 0;

    this.fields = {};

    this.srcKeys = [];
    this.destKeys = [];

    this.srcIndex = Object.create(null);
    this.destIndex = Object.create(null);

    this.merge(fields);
  }

  add(src, dest = src) {
    let {count, fields, srcIndex, destIndex, srcKeys, destKeys} = this;

    if (!srcIndex[src]) {
      fields[src] = dest;

      srcKeys.push(src);
      destKeys.push(dest);

      srcIndex[src] = count;
      destIndex[dest] = count;

      this.count++;
    }
  }

  /*
   * Initialize instance properties
   * @method
   * @param {string[]|object} fields Array or object of alias mappings.
   */
  merge(fields) {
    if (fields) {
      if (typeof(fields) === 'string')
        fields = [fields];

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
