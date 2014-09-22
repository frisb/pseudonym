((factory) ->
  if (typeof(define) is 'function' && define.amd)
    define -> factory()
  else if (typeof(module) isnt 'undefined' && typeof(module.exports) isnt 'undefined')
    module.exports = factory()
  return)(->
    class Schema
      constructor: (initializer) ->
        @init(initializer)

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

          if (@initializer instanceof Array)
            addMapping(sd, sd) for sd in @initializer
          else
            addMapping(s, d) for s, d of @initializer

      getSrcKey: (dest) -> @srcKeys[@destIndex[dest]]
      getDestKey: (src) -> @destKeys[@srcIndex[src]]

    class Formality
      constructor: ->
        @__d = new Array(@schema.destKeys.length) if !@__d
        @__p = new Array(@schema.destKeys.length) if !@__p

      data: (dest, val) ->
        i = @schema.destIndex[dest]

        if (val)
          @__d[i] = val
          return
        else
          return @__d[i]

      prev: (dest) ->
        i = @schema.destIndex[dest]
        @__p[i]

      getValue: (src) ->
        dest = @schema.getDestKey(src)
        @data(dest)

      setValue: (src, val) ->
        dest = @schema.getDestKey(src)
        previousVal = @data[dest]

        if (typeof(previousVal) isnt 'undefined')
          i = @schema.destIndex[dest]
          @__p[i] = previousVal

        @data(dest, val) if (val isnt previousVal)

        return dest

    applyProperty = (prototype, src) ->
      Object.defineProperty prototype, src,
        get: -> @getValue(src)
        set: (val) -> @setValue(src, val)

    (superConstructor, schema) ->
      if (!schema)
        schema = superConstructor
        superConstructor = Formality

      if (schema)
        if (typeof(schema) is 'string')
          schema = [schema]

        superConstructor::schema = new Schema(schema)

      applyProperty(superConstructor::, s) for s in superConstructor::schema.srcKeys

      superConstructor)
