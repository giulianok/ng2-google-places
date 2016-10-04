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

});


/* Running...
--------------------------------------------------- */
gulp.task('default', function(callback) {
	$.runSequence(
		'clean:public',
		'templates',
		callback);
});
gulp.task('serve', function(callback) {
	$.runSequence(
		'clean:public',
		'templates',
		'watch',
		callback);
});



