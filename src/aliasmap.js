class AliasMap {
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
  constructor(initializer) {
    this.init(initializer);
  }

  /*
   * Initialize instance properties
   * @method
   * @param {string[]|object} initializer Array or object of alias mappings.
   */
  init(initializer) {
    if (initializer) {
      this.srcKeys = [];
      this.destKeys = [];

      this.srcIndex = Object.create(null);
      this.destIndex = Object.create(null);

      let i = 0;

      let addMapping = (src, dest = src) => {
        if (!this.srcIndex[src]) {
          this.srcKeys.push(src);
          this.destKeys.push(dest);

          this.srcIndex[src] = i;
          this.destIndex[dest] = i;

          i++;
        }
      };

      if (initializer instanceof Array) {
        for (let j = 0, len = initializer.length; j < len; j++)
          addMapping(initializer[j]);
      }
      else {
        for (let src in initializer) {
          if (initializer.hasOwnProperty(src)) {
            let dest = initializer[src];
            addMapping(src, dest);
          }
        }
      }

      this.initializer = initializer;
    }

    console.log(this);
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
