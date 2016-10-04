var
	gulp        = require('gulp'),
  	$		    = require('gulp-load-plugins')({ camelize: true }),
  	config      = require('../gulpconfig')
;

gulp.task('clean:public', function () {
    return gulp.src(config.clean.public, {
    	read: false
	})
    .pipe($.clean({
    	force:true
    }));
});
