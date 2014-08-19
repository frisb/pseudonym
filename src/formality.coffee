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
          @src = []
          @dest = []

          @srcMap = Object.create(null)
          @destMap = Object.create(null)

          i = 0

          addMapping = (s, d) =>
            if (!@srcMap[s])
              @src.push(s)
              @dest.push(d)

              @srcMap[s] = i
              @destMap[d] = i

              i++

          if (@initializer instanceof Array)
            addMapping(sd, sd) for sd in @initializer
          else
            addMapping(s, d) for s, d of @initializer

      getSrc: (dest) -> @src[@destMap[dest]]
      getDest: (src) -> @dest[@srcMap[src]]

    class Formality
      ensure: ->
        @data = Object.create(null) if !@data
        @prev = Object.create(null) if !@prev

      get: (src) ->
        @ensure()
        dest = @schema.getDest(src)
        @data[dest]

      set: (src, val) ->
        @ensure()

        dest = @schema.getDest(src)
        currentVal = @data[dest]

        @prev[dest] = currentVal if (typeof(currentVal) isnt 'undefined')
        @data[dest] = val if (val isnt currentVal)

        return dest

    applyProperty = (prototype, src) ->
      Object.defineProperty prototype, src,
        get: -> @get(src)
        set: (val) -> @set(src, val)

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
