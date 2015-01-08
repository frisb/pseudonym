class Model
  ###*
   * Get a Model class 
   * @class
   * @property {object} aliasMap AliasMap instance.
   * @property {array} __d Current internal data values.
   * @property {array} __p Previous internal data values.
   * @return {Model} Model
  ###    
  constructor: ->
    @__d = new Array(@aliasMap.destKeys.length) if !@__d
    @__p = new Array(@aliasMap.destKeys.length) if !@__p

  ###*
   * Get / Set internal value for property alias.
   * @virtual
   * @param {string} dest Destination property alias.
   * @param {object} val Optional value to set.
   * @return {object} Value if val undefined.
  ###  
  data: (dest, val) ->
    i = @aliasMap.destIndex[dest]

    if (val)
      @__d[i] = val
      return
    else if (dest)
      return @__d[i]
    else
      return @__d

  ###*
   * Function to implement when JSON.stringify called on instance.
   * @method
   * @return {object} Object to stringify.
  ###  
  toJSON: ->
    @toDocument()
  
  ###*
   * Returns a simple document with aliased property names.
   * @method
   * @param {boolean} aliased Boolean switch to specify whether property name aliases should be returned with document.
   * @return {object} Value if val undefined.
  ###  
  toDocument: (aliased) ->
    doc = Object.create(null)

    for val, i in @__d
      if (typeof(val) isnt 'undefined')
        src = @aliasMap.srcKeys[i]

        key = if aliased then @aliasMap.getDestKey(src) else src
        doc[key] = @getValue(src)

    doc

  ###*
   * Return previous internal value for property alias
   * @method
   * @param {string} dest Destination property alias.
   * @return {object} Value.
  ###  
  prev: (dest) ->
    i = @aliasMap.destIndex[dest]
    @__p[i]

  ###*
   * Get value for property name.
   * @virtual
   * @param {string} src Source property name.
   * @return {object} Value.
  ###  
  getValue: (src) ->
    dest = @aliasMap.getDestKey(src)
    @data(dest)

  ###*
   * Set value for property name.
   * @virtual
   * @param {string} src Source property name.
   * @param {object} val Value to set.
   * @return {string} Property alias.
  ###  
  setValue: (src, val) ->
    dest = @aliasMap.getDestKey(src)
    previousVal = @data[dest]

    if (typeof(previousVal) isnt 'undefined')
      i = @aliasMap.destIndex[dest]
      @__p[i] = previousVal

    @data(dest, val) if (val isnt previousVal)

    return dest