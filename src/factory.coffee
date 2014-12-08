###*
 * Define source name properties on the Model prototype
 * @method
 * @param {object} prototype Model implementation prototype.
 * @param {string} src Source name.
###  
defineProperty = (prototype, src) ->
  Object.defineProperty prototype, src,
    get: -> @getValue(src)
    set: (val) -> @setValue(src, val)

###*
 * Exposed function to implement AKA module.
 * @method
 * @param {object} superConstructor Optional class to inherit AKA Model.
 * @param {array|object} aliases AliasMap initializer.
###  
factory = ->
  (superConstructor, aliases) ->
    if (!aliases)
      aliases = superConstructor
      superConstructor = Model

    if (aliases)
      aliases = [aliases] if (typeof(aliases) is 'string')
      superConstructor::aliasMap = new AliasMap(aliases)

    defineProperty(superConstructor::, key) for key in superConstructor::aliasMap.srcKeys

    superConstructor
    
do ->
  if (typeof(define) is 'function' && define.amd)
    define -> factory()
  else if (typeof(module) isnt 'undefined' && typeof(module.exports) isnt 'undefined')
    module.exports = factory()
  return