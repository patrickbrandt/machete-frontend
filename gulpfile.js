var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
//var vulcanize = require('gulp-vulcanize');

gulp.task('clean', function(cb) {
	del(['./dist'], cb);
});

gulp.task('copy', function() {

	gulp.src('./polymer_components/*')
		.pipe(gulp.dest('./dist/polymer_components/'));

	gulp.src('./bower_components/**/*')
		.pipe(gulp.dest('./dist/bower_components/'));

	gulp.src('./img/*')
		.pipe(gulp.dest('./dist/img/'));

	gulp.src('./js/jquery-1.11.1.min.js')
		.pipe(gulp.dest('./dist/js/'));
	gulp.src('./js/jquery-ui-custom/jquery-ui.js')
		.pipe(gulp.dest('./dist/js/jquery-ui-custom'));
	gulp.src('./js/jquery.animateSprite.js')
		.pipe(gulp.dest('./dist/js/'));
	gulp.src('index.html')
		.pipe(gulp.dest('./dist/'));
});

gulp.task('build', function(callback) {
  return runSequence(
    //['clean'],
    ['copy'],
    callback
	);
});
