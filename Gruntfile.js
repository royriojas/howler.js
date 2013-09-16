module.exports = function(grunt) {
  'use strict';

  var path = require('path'),
    lib = require('grunt-r3m/lib/lib.js'),
    pkg = require('./package.json'),
    format = lib.format,
    gruntFile = grunt.file,
    gruntTaskUtils = require('grunt-r3m/lib/grunt-task-utils.js')(grunt);


  //region Base Folders
  var
    BASE_RESOURCES = '',

    BASE_FOLDER = BASE_RESOURCES + './',

    // The base directory where the app code is
    BASE_SOURCE_DIR = BASE_FOLDER + 'src/',

    // The base directory where the javascript files are
    JS_CODE_DIR = BASE_SOURCE_DIR + 'js/',

    // The base directory for the image resources
    IMG_FOLDER = BASE_SOURCE_DIR + 'img/',

    // The base code where the CSS for this app is
    LESS_CODE_DIR = BASE_SOURCE_DIR + 'less/',

    // The default directory in the public folder where all the files are going to be copied
    BASE_DEPLOY_PATH = BASE_RESOURCES + "dist/",

    JS_DEPLOY_PATH = BASE_DEPLOY_PATH + 'js/',

    CSS_DEPLOY_PATH = BASE_DEPLOY_PATH + 'css/',

    IMG_FOLDER_DEPLOY_PATH = BASE_DEPLOY_PATH + '/img/';


  //endregion

  var bannerSource = BASE_FOLDER + 'license.banner.txt';
  var bannerOuputPath = BASE_DEPLOY_PATH + 'license.txt';
  var bannerContent = gruntFile.read(bannerSource);
  

  var filesToProcess = [
    {
      src : [ bannerOuputPath, JS_CODE_DIR + 'howler.js' ],
      dest : JS_DEPLOY_PATH + 'howler.js'
    }
  ];

  // Project configuration.
  var cfg = {
    pkg: pkg,
    meta: {
      banner: bannerContent
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        expr: true,
        laxcomma: true,
        multistr: true,
        globals: {
          jQuery: true,
          kno: true,
          doT: true,
          Element: true,
          require: true,
          module: true,
          console: true,
          define: true
        }
      },
      develFiles: {
        files: {
          src: ['Gruntfile.js', JS_CODE_DIR + '**/*.js' ]
        }
      }
    },

    preprocess: {
      options: {
        tokenRegex: /\[\[\s*(\w*)\s*([\w="'-.\/\s]*)\s*\]\]/gi
      }
    },

    uglify: {
      options : {
        banner : bannerContent
      }
    },

    clean : {
      build : [BASE_DEPLOY_PATH]
    },
    watch: {
      js: {
        files: [
          JS_CODE_DIR + '/**/*.js'
        ],
        tasks: 'js'
      }
    }
  };

  var npmTasks = [
    "grunt-exec",
    "grunt-contrib-clean",
    "grunt-r3m",
    "grunt-contrib-jshint",
    "grunt-contrib-uglify",
    "grunt-contrib-watch"
    
  ];

  npmTasks.forEach(function(task) {
    grunt.loadNpmTasks(task);
  });

  grunt.initConfig(cfg);

  gruntTaskUtils.createJSAndCSSTasks(cfg, filesToProcess);

  var tasksDefinition = {
    'banner': function() {
      gruntFile.write(bannerOuputPath, grunt.config('meta.banner'));
    },

    'js': ["jshint", "preprocess", "uglify"],
    'dev-build': ['clean', 'banner', 'js'],
    'dev' : ['dev-build'],
    'prod' : ['dev-build'],
    'default': ['dev']
  };

  for (var taskName in tasksDefinition) {
    if (tasksDefinition.hasOwnProperty(taskName)) {
      var task = tasksDefinition[taskName];
      grunt.registerTask(taskName, task);
    }
  }

};