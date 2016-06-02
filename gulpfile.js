'use strict';

var childProcess = require('child_process');
var electron = require('electron-prebuilt');
var gulp = require('gulp');
var jetpack = require('fs-jetpack');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var os = require('os');
var release_windows = require('./build.windows');
var bower = './bower_components';


var projectDir = jetpack;
var srcDir = projectDir.cwd('./app');
var destDir = projectDir.cwd('./build');

// -------------------------------------
// Tasks
// -------------------------------------

gulp.task('clean', function (callback) {
    return destDir.dirAsync('.', { empty: true });
});

gulp.task('copyNode', ['clean'], function () {
    return projectDir.copyAsync('./', destDir.path(), {
        overwrite: true,
        matching: [
            './node_modules/node-uuid/**/*',
            './node_modules/mysql/**/*',
            './node_modules/q/**/*',
            './node_modules/serial-number/**/*',
            './node_modules/fs-jetpack/**/*',
            './node_modules/html-pdf/**/*',
          
        ]
    });
});
gulp.task('copy', ['copyNode'], function () {
    return projectDir.copyAsync('app', destDir.path(), {
        overwrite: true,
        matching: [
            '*.html',
            '*.css',
            'main.js',
            'package.json'
        ]
    });
});


gulp.task('build', ['copy'], function () {
    return gulp.src('./app/index.html')
        .pipe(usemin({
			jsAttributes : {
				onload : "window.$ = window.jQuery = module.exports;",
			  },
            js2: [uglify()],
            js1: [],
			
        }))
        .pipe(gulp.dest('build/'));
});


gulp.task('run', function () {
    childProcess.spawn(electron, ['./app'], { stdio: 'inherit' });
});

gulp.task('build-electron', function () {
    switch (os.platform()) {
        case 'darwin':
            // execute build.osx.js 
            break;
        case 'linux':
            //execute build.linux.js
            break;
        case 'win32':
        console.log('sdf')
            return release_windows.build();
    }
});

gulp.task('dump-asar', function () {
   
            return release_windows.build();
    
});