module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    clean:
      lib:
        src: ['lib']
      tmp:
        src: ['tmp']
    
    concat:
      dist:
        src: [
          'src/aliasmap.coffee'
          'src/model.coffee'
          'src/factory.coffee'
        ]
        dest: 'tmp/aka.coffee'
        
    coffee:
      compile:
        options:
          bare: false
          join: false
        files: [
          expand: true
          cwd: 'tmp'
          src: '**/*.coffee'
          dest: 'lib'
          ext: '.js'
        ]
        
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.registerTask('default', ['clean:lib', 'concat', 'coffee', 'clean:tmp'])
