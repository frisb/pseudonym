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

      getSrc: (dest) -> @srcKeys[@destIndex[dest]]
      getDest: (src) -> @destKeys[@srcIndex[src]]

    class Formality
      constructor: ->
        @__d = new Array(@schema.dest.length) if !@__d
        @__p = new Array(@schema.dest.length) if !@__p

      data: (dest, val) ->
        i = @schema.destMap[dest]

        if (val)
          @__d[i] = val
          return
        else
          return @__d[i]

      prev: (dest) ->
        i = @schema.destMap[dest]
        @__p[i]

      getValue: (src) ->
        dest = @schema.getDest(src)
        @data(dest)

      setValue: (src, val) ->
        dest = @schema.getDest(src)
        currentVal = @data[dest]

        if (typeof(currentVal) isnt 'undefined')
          i = @schema.destMap[dest]
          @__p[i] = currentVal

        @data(dest, val) if (val isnt currentVal)

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

      applyProperty(superConstructor::, s) for s in superConstructor::schema.src

      superConstructor)
