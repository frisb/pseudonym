var webpack = require('webpack');

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    headline: '<%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today("ddd, d mmm yyyy hh:MM:ss") %>)',
    license: grunt.file.read('LICENSE'),
    banner: '/*! <%= headline %>\n\
\n\
<%= pkg.description %>\n\
@module <%= pkg.name %>\n\
@author <%= pkg.contributors[0].name %> <<%= pkg.contributors[0].email %>>\n\
@license <%= pkg.license %>\n\
\n\
<%= license %>\n\
*/\n\n',

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

    webpack: {
      compile: {
        // webpack options
        entry  : './src/index.js',

        output : {
          path     : './lib',
          filename : 'pseudonym.js',
          libraryTarget: 'umd',
          sourceMapFilename: '[file].map',
          umdNamedDefine: true
        },
        devtool: 'source-map',
        module : {
          loaders: [
            {
              loader : 'babel-loader'
            }
          ]
        },
        plugins: [
          new webpack.BannerPlugin('<%= banner %>', { raw: true })
        ]
      }
    },

    uglify: {
      compile: {
        options: {
          banner: '/*! <%= headline %> */',
          mangle: true,
          report: 'gzip',
          sourceMap: true,
          sourceMapIn: 'lib/pseudonym.js.map'
        },
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
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['clean', 'jshint', 'webpack', 'uglify', 'mochaTest']);
};