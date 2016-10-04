var
	gulp        = require('gulp'),
  	$		    = require('gulp-load-plugins')({ camelize: true }),
  	config      = require('../gulpconfig')
;

    
gulp.task('templates', ['componentTemplates'], function() {
	return gulp.src(config.templates.src)
		.pipe($.plumber())
		.pipe($.jade({
			pretty: true
	    }))
	    .pipe(gulp.dest(config.templates.dest));
});

gulp.task('componentTemplates', function() {
	return gulp.src(config.componentTemplates.src)
		.pipe($.plumber())
		.pipe($.jade({
			pretty: true
	    }))
	    .pipe(gulp.dest(config.componentTemplates.dest));
});