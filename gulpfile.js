var gulp = require('gulp-help')(require('gulp'));
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

gulp.task('coveralls', function () {
	gulp.src('coverage/**/lcov.info')
		.pipe(plugins.coveralls());
});

gulp.task('test', function(done) {
	return runSequence('test-unit', done);
});

gulp.task('test-unit', function() {
	return gulp.src(['test/**/*.js', '!test/fixture/*.js'])
		.pipe(plugins.mocha());
});

gulp.task('test-cover', function() {
	return gulp.src(['./*.js'])
		.pipe(plugins.istanbul())
		.pipe(plugins.istanbul.hookRequire());
});

gulp.task('test-coverage', ['test-cover'], function() {
	return gulp.src(['test/**/*.js', '!test/fixture/*.js'])
		.pipe(plugins.mocha())
		.pipe(plugins.istanbul.writeReports());
});