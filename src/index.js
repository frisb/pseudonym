import {createModel} from './model';
import extend from './extend';

/*
 * Define source name properties on the Model prototype
 * @method
 * @param {object} prototype Model implementation prototype.
 * @param {string} src Source name.
 */
function _defineProperty(prototype, src) {
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
    _defineProperty(prototype, key);
  }

  superConstructor.extend = extend;

  return superConstructor;
}