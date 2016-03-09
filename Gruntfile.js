module.exports = function (grunt) {
  grunt.initConfig({
    clean: {
      default: {
        src: ['lib']
      }
    },
    jshint: {
      options: {
        jshintrc: true
      },
      es6: ['src/**/*.js']
    },
    concat: {
      compile: {
        src: [
          'src/intro.js',
          'src/aliasmap.js',
          'src/model.js',
          'src/factory.js'
        ],
        dest: 'lib/pseudonym.js'
      }
    },
    babel: {
      compile: {
        files: [ { 'lib/pseudonym.js': 'lib/pseudonym.js' } ]
      }
    },
    uglify: {
      minify: {
        files: { 'lib/pseudonym.min.js': 'lib/pseudonym.js' }
      }
    },
    mochaTest: {
      modularize: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['clean', 'jshint', 'concat', 'babel', 'uglify', 'mochaTest']);
};