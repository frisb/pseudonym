import {createModel} from './model';

function __extends(child, parent) {
  for (var key in parent) {
    if (parent.hasOwnProperty(key))
      child[key] = parent[key];
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
 * @param {string[]|object} fields FieldMap initializer.
 */
export default function (fields) {
  if (typeof(fields) === 'string')
    fields = [fields];

  let superConstructor = createModel(fields);
  let {prototype, fieldMap} = superConstructor;
  let {srcKeys} = fieldMap;

  for (let i = 0, len = srcKeys.length; i < len; i++) {
    let key = srcKeys[i];
    __defineProperty(prototype, key);
  }

  superConstructor.extend = function (child) {
    let childProto = {};

    let propNames = Object.getOwnPropertyNames(child.prototype);

    for (let j = 0, len = propNames.length; j < len; j++) {
      let name = propNames[j];
      childProto[name] = child.prototype[name];
    }

    __extends(child, superConstructor);

    for (let key in childProto)
      child.prototype[key] = childProto[key];

    child.fieldMap = fieldMap;

    return child;
  };

  return superConstructor;
}