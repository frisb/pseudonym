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
    browserify: {
      compile: {
        options: {
          browserifyOptions: {
            standalone: 'Pseudonym'
          },
          plugin: [
            [ 'browserify-header', { file: 'src/header.js' } ]
          //  [ "browserify-derequire" ]
          ],
          transform: [
            [
              'babelify'
            ]
          ]
        },
        files: { 'lib/pseudonym.js': 'src/index.js' }
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
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['clean', 'jshint', 'browserify', 'uglify', 'mochaTest']);
};