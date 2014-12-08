class AliasMap
  ###*
   * Get an AliasMap class 
   * @class
   * @param {array|object} initializer Array or object of alias mappings.
   * @property {array|object} initializer Array or object of alias mappings.
   * @property {array} srcKeys Source key names.
   * @property {array} destKeys Destination key names.
   * @property {object} srcIndex Dictionary mapping source key names to srcKeys array indexes.
   * @property {object} destIndex Dictionary mapping destination key names to destKeys array indexes.
   * @return {AliasMap} AliasMap.
  ###    
  constructor: (initializer) ->
    @init(initializer)
  
  ###*
   * Initialize instance properties 
   * @method
   * @param {array|object} initializer Array or object of alias mappings.
  ###      
  init: (@initializer) ->
    if (@initializer)
      @srcKeys = []
      @destKeys = []
      
      @srcIndex = Object.create(null)
      @destIndex = Object.create(null)
      
      i = 0
      
      addMapping = (s, d) =>
        if (!@srcIndex[s])
          @srcKeys.push(s)
          @destKeys.push(d)
    
          @srcIndex[s] = i
          @destIndex[d] = i
    
          i++
         
        return
        
      if (@initializer instanceof Array)
        addMapping(sd, sd) for sd in @initializer
      else
        addMapping(s, d) for s, d of @initializer
      
      return
    
  ###*
   * Get source key name for destination key name 
   * @method
   * @param {string} dest Destination key name.
   * @return {string} Source key name.
  ###    
  getSrcKey: (dest) -> @srcKeys[@destIndex[dest]]
  
  ###*
   * Get destination key name for source key name 
   * @method
   * @param {string} src Source key name.
   * @return {string} Destination key name.
  ###    
  getDestKey: (src) -> @destKeys[@srcIndex[src]]