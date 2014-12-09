module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    clean:
      lib:
        src: ['lib']
        
    coffee:
      compile:
        options:
          bare: false
          join: true
        files: [
          src: [
            'src/aliasmap.coffee'
            'src/model.coffee'
            'src/factory.coffee'
          ]
          dest: 'lib/aka.js'
        ]
        
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.registerTask('default', ['clean', 'coffee'])
