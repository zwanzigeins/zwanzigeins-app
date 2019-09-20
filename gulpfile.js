const
  gulp = require('gulp'),
  rollup = require('gulp-better-rollup'),
  rev = require('gulp-rev'),
  uglify = require('rollup-plugin-uglify-es'),
  shell = require('shelljs')
  ;

gulp.task('build-js', () => {
	
	return gulp.src('js/zwanzigeins-app.js')
		.pipe(rollup({plugins:[uglify()]}, 'iife'))
//		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest('build/dist'));
});

gulp.task('clean', ready => {
	shell.rm('-rf', 'build');
	ready();
})

gulp.task('default', gulp.series('clean', 'build-js'), () => {} );

