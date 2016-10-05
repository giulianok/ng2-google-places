var
	gulp        = require('gulp'),
  	$		    = require('gulp-load-plugins')({lazy:false}),
  	config      = require('../gulpconfig')
;
$.runSequence 	= require('run-sequence');

/* Development Tasks
--------------------------------------------------- */
gulp.task('watch', function () {

	$.watch(`${config.folder.app}/**/*.jade`, function () {
	    gulp.start('templates');
	});

	$.watch(config.styles.listening, function () {
	    gulp.start('styles');
	});

	$.watch(config.assets.listening, function () {
	    gulp.start('assets');
	});

});


/* Running...
--------------------------------------------------- */
gulp.task('build', function(callback) {
	$.runSequence(
		'clean:public',
		'templates',
		'styles',
		'assets',
		callback);
});

gulp.task('default', ['build']);

gulp.task('serve', function(callback) {
	$.runSequence(
		'build',
		'watch',
		callback);
});



