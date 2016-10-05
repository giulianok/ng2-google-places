var
	gulp        = require('gulp'),
  	$		    = require('gulp-load-plugins')({ camelize: true }),
  	config      = require('../gulpconfig')
;

gulp.task('assets', function() {
	return gulp.src(config.assets.src)
	    .pipe(gulp.dest(config.assets.dest));
});