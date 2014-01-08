/*global
  module: false,
  require: false
*/
module.exports = function( grunt ){
  'use strict';

  grunt.initConfig({
    dirs : {
      src    : 'assets',
      dist   : 'public',
      http   : ''
    },

    clean : {
      /* https://npmjs.org/package/grunt-contrib-clean */

      scripts : '<%= dirs.dist %>/scripts/',
      styles  : '<%= dirs.dist %>/styles/',
      images  : '<%= dirs.dist %>/images/',
      fonts   : '<%= dirs.dist %>/fonts/',
    },

    copy : {
      /* https://npmjs.org/package/grunt-contrib-copy */

      fonts : {
        expand : true,
        cwd    : '<%= dirs.src %>/fonts',
        src    : '**/*.{woff,ttf,otf,eot,svg}',
        dest   : '<%= dirs.dist %>/fonts'
      },

      images : {
        expand : true,
        cwd    : '<%= dirs.src %>/images',
        src    : '**/*.{jpg,jpeg,svg,png,gif,webp}',
        dest   : '<%= dirs.dist %>/images'
      },

      scripts : {
        expand : true,
        cwd    : '<%= dirs.src %>/scripts/',
        src    : '**/*.{js,map}',
        dest   : '<%= dirs.dist %>/scripts/'
      }
    },

    compass : {
      /* https://npmjs.org/package/grunt-contrib-compass */

      options : {
        sassDir   : '<%= dirs.src %>/styles',
        imagesDir : '<%= dirs.src %>/images',
        fontsDir  : '<%= dirs.src %>/fonts',

        generatedImagesDir : '<%= dirs.dist %>/images',
        cssDir             : '<%= dirs.dist %>/styles',

        httpPath                : '/',
        httpStylesheetsPath     : '<%= dirs.http %>/styles',
        httpImagesPath          : '<%= dirs.http %>/images',
        httpGeneratedImagesPath : '<%= dirs.http %>/images',
        httpFontsPath           : '<%= dirs.http %>/fonts'
      },

      clean : {
        options : {
          clean : true
        }
      },

      dev : {
        options : {
          outputStyle : 'expanded',
          // raw         : 'sass_options = { :debug_info => true }\n',
          debugInfo   : true
        }
      },

      watch : {
        options : {
          outputStyle : 'expanded',
          // raw         : 'sass_options = { :debug_info => true }\n',
          watch       : true,
          debugInfo   : true
        }
      },

      dist : {
        options : {
          force       : true,
          outputStyle : 'compressed',
          raw         : 'asset_cache_buster :none\n'
        }
      }
    },

    watch : {
      /* https://npmjs.org/package/grunt-contrib-watch */

      fonts : {
        files : '<%= dirs.src %>/fonts/**/*.{woff,ttf,otf,eot,svg}',

        tasks : [
          'copy:fonts'
        ],

        options : {
          spawn : false
        }
      },

      images : {
        files : '<%= dirs.src %>/fonts/**/*.{jpg,jpeg,svg,png,gif,webp}',

        tasks : [
          'copy:images'
        ],

        options : {
          spawn : false
        }
      },

      scripts: {
        files : [
          '<%= dirs.src %>/scripts/**/*.js',
          'Gruntfile.js'
        ],

        tasks : [
          'jshint:dev',
          'copy:scripts'
        ],

        options : {
          spawn : false
        }
      }
    },

    connect : {
      serve: {
        options: {
          port      : 0,
          base      : '<%= dirs.dist %>',
          keepalive : true,
          open      : true
        }
      }
    },

    concurrent : {
      options : {
        logConcurrentOutput: true
      },

      watch : [
        'watch',
        'compass:watch',
        'connect:serve'
      ]
    }
  });

  require( 'matchdep' )
    .filterAll( 'grunt-*', require( './package.json' ) )
      .forEach( grunt.loadNpmTasks );

  // grunt for distribution
  grunt.registerTask( 'dist', [
    'clean',
    'copy',

    'compass:clean',
    'compass:dist'
  ]);

  // grunt for development
  grunt.registerTask( 'dev', [
    'clean',
    'copy',

    'compass:clean',
    'compass:dev'
  ]);

  // grunt [default]
  grunt.registerTask( 'default', [
    'dev',
    'concurrent:watch'
  ]);
};
