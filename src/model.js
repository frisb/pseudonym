function createModel(aliases) {
  let _aliasMap = new AliasMap(aliases);

  return class Model {
    /*
     * Get a Model class
     * @class
     * @property {object} aliasMap AliasMap instance.
     * @property {array} __d Current internal data values.
     * @property {array} __p Previous internal data values.
     * @return {Model} Model
     */
    constructor() {

    }

    get aliasMap() {
      return _aliasMap;
    }

    init() {
      if (!this.__d) {
        this.__d = new Array(_aliasMap.destKeys.length);
        this.__p = new Array(_aliasMap.destKeys.length);
      }
    }

    /*
     * Get / Set internal value for property alias.
     * @virtual
     * @param {string} dest Destination property alias.
     * @param {object} val Optional value to set.
     * @return {object} Value if val undefined.
     */
    data(dest, val) {
      this.init();

      let i = _aliasMap.destIndex[dest];

      if (typeof(val) !== 'undefined') {
        this.__d[i] = val;
        return;
      }
      else if (dest) {
        return this.__d[i];
      }
      else {
        return this.__d;
      }
    }

    Serialize() {
      throw new Error('not implemented');
    }

    Deserialize(obj) {
      throw new Error('not implemented');
    }

    /*
     * Function to implement when JSON.stringify called on instance.
     * @method
     * @return {object} Object to stringify.
     */
    toJSON() {
      return this.toDocument();
    }

    /*
     * Returns a simple document with aliased property names.
     * @method
     * @param {boolean} aliased Boolean switch to specify whether property name aliases should be returned with document.
     * @return {object} Value if val undefined.
     */
    toDocument(aliased) {
      let doc = Object.create(null);
      let {__d} = this;

      if (__d) {
        for (let i = 0, len = __d.length; i < len; i++) {
          let val = __d[i];

          if (typeof(val) !== 'undefined') {
            let src = _aliasMap.srcKeys[i];

            let key = aliased ? _aliasMap.getDestKey(src) : src;
            doc[key] = this.getValue(src);
          }
        }
      }

      return doc;
    }

    /*
     * Return previous internal value for property alias
     * @method
     * @param {string} dest Destination property alias.
     * @return {object} Value.
     */
    prev(dest) {
      let i = _aliasMap.destIndex[dest];
      return this.__p[i];
    }

    /*
     * Get value for property name.
     * @virtual
     * @param {string} src Source property name.
     * @return {object} Value.
     */
    getValue(src) {
      let dest = _aliasMap.getDestKey(src);
      return this.data(dest);
    }

    /*
     * Set value for property name.
     * @virtual
     * @param {string} src Source property name.
     * @param {object} val Value to set.
     * @return {string} Property alias.
     */
    setValue(src, val) {
      let dest = _aliasMap.getDestKey(src);
      let previousVal = this.data[dest];

      if (typeof(previousVal) !== 'undefined') {
        let i = _aliasMap.destIndex[dest];
        this.__p[i] = previousVal;
      }

      if (val !== previousVal)
        this.data(dest, val);

      return dest;
    }
  };
}