import FieldMap from './fieldmap';
import {createModelClass} from './model';
import buildProperties from './buildproperties';

function _inherits(child, parent) {
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

function _extendClassAndPrototype(child, parent) {
  let originalChildPrototype = {};

  let propNames = Object.getOwnPropertyNames(child.prototype);

  for (let j = 0, len = propNames.length; j < len; j++) {
    let name = propNames[j];
    originalChildPrototype[name] = child.prototype[name];
  }

  _inherits(child, parent);

  // put back child's original prototype properties
  for (let key in originalChildPrototype) {
    child.prototype[key] = originalChildPrototype[key];
  }
}

function extend(child, moreFields) {
  let fieldMap = new FieldMap(this.fieldMap.fields);

  if (!child) {
    // clone

    child = createModelClass(this.fieldMap.fields);
  }
  else if (!child.prototype) {
    // fields only

    moreFields = child;
    fieldMap.merge(moreFields);
    child = createModelClass(fieldMap.fields);
  }
  else {
    // child is new Class

    fieldMap.merge(moreFields);
    child.fieldMap = fieldMap;
  }

  _extendClassAndPrototype(child, this);

  child.fieldMap = fieldMap;
  buildProperties(child);

  return child;
}

/*
 * Exposed function to implement Pseudonym module.
 * @method
 * @param {object} [superConstructor] Class to inherit Pseudonym Model.
 * @param {string[]|object} fields FieldMap initializer.
 */
export default function (fields) {
  let Pseudo = createModelClass(fields);
  Pseudo.fieldMap = new FieldMap(fields);
  Pseudo.extend = extend;
  buildProperties(Pseudo);

  return Pseudo;
}