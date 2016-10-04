var
	gulp        = require('gulp'),
  	config      = require('../gulpconfig'),
	$		    = require('gulp-load-plugins')(config.plugins)
;

gulp.task('styles', function() {
	return gulp.src(config.styles.src)
		.pipe($.plumber())
		.pipe($.inject(gulp.src(config.styles.inject), {
			starttag: '// inject:{{ext}}',
			endtag: '// endinject',
			transform: function (filepath) {
				filepath = filepath.replace('/src/', '../');
				return '@import "' + filepath + '";';
			}
		}))
		// Initializes sourcemaps
		.pipe($.sourcemaps.init())
		.pipe($.sass({
			errLogToConsole: true
		}))
		// Writes sourcemaps into the CSS file
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest(config.styles.dest));
});

