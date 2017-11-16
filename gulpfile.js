var gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		del            = require('del'),
		imagemin       = require('gulp-imagemin'),
		cache          = require('gulp-cache'),
		autoprefixer   = require('gulp-autoprefixer'),
		ftp            = require('vinyl-ftp'),
		notify         = require("gulp-notify"),
		htmlmin 	     = require('gulp-html-minifier'),
		rsync          = require('gulp-rsync'),
		csso 		       = require('gulp-csso'),
    babel          = require('gulp-babel'),
    autopolyfiller = require('gulp-autopolyfiller'),
    merge          = require('event-stream').merge,
    order          = require("gulp-order"),
		sourcemaps     = require('gulp-sourcemaps');


gulp.task('common-js', function() {
	var all = gulp.src([
		'app/js/common.js',
		])

    .pipe(babel({
      presets: ['es2015']
    }));

    var polyfills = all.pipe(autopolyfiller('polyfills.js', {
      browsers: [ 'Android 2.3',
        'Android 4',
        'Chrome 20',
        'Firefox 24',
        'ie 8',
        'ie 9',
        'iOS 6',
        'Opera 12',
        'Safari 6']
    }));

    return merge(polyfills, all)
      .pipe(order([
        'polyfills.js',
        'all.js'
      ]))

	.pipe(concat('common.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

//gulp.task('common-js', function() {
//	return gulp.src([
//		'app/js/common.js',
//	])
//	.pipe(concat('common.min.js'))
//	.pipe(uglify())
//	.pipe(gulp.dest('app/js'));
//});

gulp.task('map-js', function() {
  return gulp.src(['app/js/map.js'])
    .pipe(concat('map.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});

gulp.task('js', ['common-js', 'map-js'], function() {
  return gulp.src([
    'app/libs/jquery/jquery.min.js',
    'app/libs/plugins-scroll/plugins-scroll.js',
    'app/libs/content-filter/js/main.js',
    'app/libs/content-filter/js/jquery.mixitup.min.js',

    'app/js/common.min.js', // Always in the end
  ])
  .pipe(concat('scripts.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('app/js'))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

gulp.task('sass', function() {
	return gulp.src('app/scss/style.scss')
	.pipe(sourcemaps.init())
	.pipe(sass({'bundleExec': true}).on("error", notify.onError()))    //  // sass({outputStyle: 'expand'})
	.pipe(csso({
      restructure: false,
      sourceMap: true,
      debug: true
    }))
	.pipe(rename({suffix: '.min'}))
	.pipe(sourcemaps.write())
	//.pipe(autoprefixer(['last 15 versions']))
  .pipe(autoprefixer([
    'Android 2.3',
    'Android >= 4',
    'Chrome >= 20',
    'Firefox >= 24',
    'Explorer >= 8',
    'iOS >= 6',
    'Opera >= 12',
    'Safari >= 6'
  ]))
  //.pipe(cleanCSS()) // comment while develop
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['sass', 'js', 'browser-sync'], function() {
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
	gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('minify', function() {
	gulp.src('app/*.html')
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('dist'));
});

gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin()))    // tiny png - сжимает лучьше, но оставляет артефакты (на 3% болюше в pagespeed insights)
	.pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'js', 'minify'], function() {

	var buildFiles = gulp.src([
		//'app/*.html',
		'app/.htaccess',
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'app/css/style.min.css',
		]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'app/js/scripts.min.js',
    'app/js/map.min.js',
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'app/fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      'webdevgranchenko.esy.es',
		user:      'u715394280',
		password:  'dAf0yfAAsm8e',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
	'dist/**',
	'dist/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/public_html/MyResume'));  // change name of progect
});

gulp.task('rsync', function() {
	return gulp.src('dist/**')
	.pipe(rsync({
		root: 'dist/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		archive: true,
		silent: false,
		compress: true
	}));
});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
