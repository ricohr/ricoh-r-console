"use strict";
//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

const gulp = require('gulp');
const sass  = require('gulp-sass');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const shell = require('gulp-shell');
const runSequence = require('run-sequence');
const minimist = require('minimist');
const request = require('request');
const FS = require('fs');
const Del = require('del');
const config = require(__dirname + '/package.json');


var knownOptions = {
  default: {user:undefined, pass:undefined }
};
var options = minimist(process.argv.slice(2), knownOptions);


function download(url, auth) {
  var opt = {
    url: url,
    method: 'GET',
    auth: auth,
    headers: {
      'User-Agent': 'gulp'
    }
  };
  return new Promise((resolve, reject)=>{
    request(opt).on('response', (response)=>{
      var data = "";
      response.on('data', (chunk)=>{
        data += chunk;
      }).on('end', ()=>{
        resolve(data);
      });
    });
  });
}

function downloadBinary(url, auth, fw) {
  var opt = {
    url: url,
    method: 'GET',
    auth: auth,
    headers: {
      'User-Agent': 'gulp',
      Accept: 'application/octet-stream'
    }
  };
  return new Promise((resolve, reject)=>{
    request(opt).on('response', (response)=>{
      fw.setDefaultEncoding('binary');
      response.setEncoding('binary');
      response.pipe(fw);
    }).on('end', resolve);
  });
}

function downloadLatest(url, dir, chmod) {
  var auth = undefined;
  if (options.user || options.pass) {
    auth = {
      user: options.user,
      pass: options.pass,
      sendImmediately: true
    };
  }
  return new Promise((resolve, reject)=>{
    download(url, auth).then((data)=>{
      const latest = JSON.parse(data);
      resolve(Promise.all(
        latest.assets.map((asset)=>{
          var filename = dir + asset.name;
          console.log('downloading', dir + asset.name, '(' + latest.name + ')');
          var fw = FS.createWriteStream(filename).on('close', ()=>{
            FS.chmodSync(filename, chmod);
          });
          return downloadBinary(asset.url, auth, fw);
        })
      ));
    });
  });
}


function compile_babel(source_glob, dest_dir) {
  var bbl = babel(config.babel);
  return new Promise((resolve, reject)=>{
    gulp.src(source_glob)
      .pipe(sourcemaps.init())
      .pipe(bbl.on('error', (e)=>{
        console.log(e.message);
        console.log(e.codeFrame);
        bbl.emit('end');
        reject(e);
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(dest_dir))
      .on('end', resolve);
    });
}

function file_cp(source_glob, dest_dir) {
  return new Promise((resolve, reject)=>{
    gulp.src(source_glob)
      .pipe(gulp.dest(dest_dir))
      .on('end', resolve);
    });
}


// download MtpHelper from github
gulp.task('update-helper', ()=>{
  return Promise.all([
    downloadLatest('https://api.github.com/repos/ricohr/win-mtphelper/releases/latest', 'lib/mtphelper/', 0o644),
    downloadLatest('https://api.github.com/repos/ricohr/osx-mtphelper/releases/latest', 'lib/mtphelper/', 0o755)
  ]);
});


// compile jsx, scss
gulp.task('babel', ()=>{
  return Promise.all([
    compile_babel(['src/*.es6', 'src/*.js'], 'js'),
    compile_babel(['src/*.jsx'], 'js'),
    compile_babel(['src/components/*.jsx'], 'js/components'),
    compile_babel(['src/containers/*.jsx'], 'js/containers'),
    compile_babel(['src/data/*.jsx'], 'js/data'),
    compile_babel(['src/views/*.jsx'], 'js/views'),
    file_cp(['src/*.json'], 'js')
  ]);
});
gulp.task('scss', ()=>{
  return gulp.src('src/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('assets/css'));
});

gulp.task('compile', ['babel', 'scss']);
gulp.task('watch', ()=>{
  gulp.watch(['src/*.es6', 'src/*.js', 'src/*.jsx', 'src/**/*.jsx'], ['babel']);
  gulp.watch('src/*.scss', ['scss']);
});


// test
gulp.task('test-build', (callback)=>{
  Del(['test-tmp/*.js', 'test-tmp/steps/*.js', 'test-tmp/*.json']).then(()=>{
    return Promise.all([
      compile_babel(['./test/*.es6', './test/*.js'], 'test-tmp'),
      compile_babel(['./test/steps/*.es6'], 'test-tmp/steps')
    ]);
  }).then(()=>callback());
});
gulp.task('exec-test', ()=>{
  const mocha = require('gulp-mocha');
  return gulp.src('test-tmp/*_test.js', {read: false})
    .pipe(mocha({timeout: 10000}));
});
gulp.task('test', (callback)=>{
  runSequence(
    ['compile', 'test-build'],
    'exec-test',
    callback
  );
});
gulp.task('test-app', (callback)=>{
  process.env.TEST_PACKAGED = true;
  runSequence(
    ['build', 'test-build'],
    'exec-test',
    callback
  );
});


// build .app, .exe
//export CSC_LINK=file://path/to/codesign.p12
//or export CSC_IDENTITY_AUTO_DISCOVERY=false
gulp.task('build-darwin', shell.task([
  "build --mac --x64 --dir"
]));
gulp.task('build-win32', shell.task([
  "build --win --ia32 --dir"
]));

// build installer
//export CSC_LINK=file://path/to/codesign.p12
gulp.task('package-darwin', shell.task([
  "build --mac dmg --x64"
]));
gulp.task('package-win32', shell.task([
  "build --win nsis --ia32"
]));

gulp.task('build', (callback)=>{
  runSequence(
    'compile',
    'build-' + process.platform,
    callback
  );
});
gulp.task('package', (callback)=>{
  runSequence(
    'compile',
    'package-' + process.platform,
    callback
  );
});
