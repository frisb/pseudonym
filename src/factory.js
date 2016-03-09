/*
 * Define source name properties on the Model prototype
 * @method
 * @param {object} prototype Model implementation prototype.
 * @param {string} src Source name.
 */
function defineProperty(prototype, src) {
  Object.defineProperty(prototype, src, {
    get() {
      return this.getValue(src);
    },
    set(val) {
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
  if (typeof(aliases) === 'string')
    aliases = [aliases];

  let superConstructor = createModel(aliases);
  let {prototype} = superConstructor;
  let {srcKeys} = prototype.aliasMap;

  for (let i = 0, len = srcKeys.length; i < len; i++) {
    let key = srcKeys[i];
    defineProperty(prototype, key);
  }

  superConstructor.extend = function (child) {
    let childProto = {};

    let propNames = Object.getOwnPropertyNames(child.prototype);

    for (let j = 0, len = propNames.length; j < len; j++) {
      let name = propNames[i];
      childProto[name] = child.prototype[name];
    }

    child.extends(superConstructor);

    for (let key in childProto) {
      let val = childProto[key];
      child.prototype[key] = val;
    }

    return child;
  };

  return superConstructor;
};