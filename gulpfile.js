const
  	gulp = require('gulp'),
  	rollup = require('gulp-better-rollup'),
  	rev = require('gulp-rev'),
  	uglify = require('rollup-plugin-uglify-es'),
  	uglifycss = require('gulp-uglifycss'),
  	GulpSSH = require('gulp-ssh'),
  	shell = require('shelljs'),
  	fs = require('fs'),
  	os = require('os')
  	;

const 
	stagePath = 'build/stage',
	distPath = 'build/dist'
	;
  	
gulp.task('build-js', () => {
	
	return gulp.src('js/zwanzigeins-app.js')
		.pipe(rollup({plugins:[uglify()]}, 'iife'))
		.pipe(gulp.dest('build/stage/js'));
});

gulp.task('build-css', () => {

	return gulp.src('css/*')
		.pipe(uglifycss())
		.pipe(gulp.dest('build/stage/css'));
});

gulp.task('revise', () => {
		
	return gulp.src([stagePath + '/**/*.+(js|css)'])
    	.pipe(rev())
    	.pipe(gulp.dest(distPath))
    	.pipe(rev.manifest())
    	.pipe(gulp.dest(stagePath));
});

gulp.task('revise-cachaeble', ready => {
	
	let manifestPath = stagePath + '/rev-manifest.json';
	
	let manifestJson = fs.readFileSync(manifestPath);
	let manifest = JSON.parse(manifestJson);
	
	for(let srcItem in manifest){
		let resourcePath = manifest[srcItem];
		let lastHyphenIdx = resourcePath.lastIndexOf('-');
		let startPart = resourcePath.substring(0, lastHyphenIdx);
		let endPart = resourcePath.substring(lastHyphenIdx + 1);
		let cacheableResourcePath = startPart + '.cache.' + endPart;
		shell.mv(distPath + "/" + resourcePath, distPath + "/" + cacheableResourcePath);
		manifest[srcItem] = cacheableResourcePath;
	}
	
	manifestJson = JSON.stringify(manifest, null, 4);
	fs.writeFileSync(manifestPath, manifestJson, 'utf8');
	
	ready();
});

gulp.task('build-html', ready => {

	let manifestJson = fs.readFileSync(stagePath + '/rev-manifest.json');
	let manifest = JSON.parse(manifestJson); 
	let html = fs.readFileSync('zwanzigeins-app.html', 'utf8');
	
	for(let srcItem in manifest){
		html = html.replace(srcItem, manifest[srcItem]);
	}
	
	html = html.replace(' type="module"', '');
	
	fs.writeFileSync(distPath + '/index.html', html, 'utf8');
	
	ready();
});

gulp.task('deploy', ready => {
	let configJson = fs.readFileSync('deploy-config.json');
	let config = JSON.parse(configJson);
	
	config.privateKey = fs.readFileSync(os.homedir() + '/.ssh/id_rsa');
	
	let gulpSsh = new GulpSSH({
		ignoreErrors: false,
		sshConfig: config
	});
	
	config.destDirs.forEach(destDir =>{
		gulpSsh
			.exec(['rm ' + destDir + '/* -r'], {filePath: 'commands.log'})
			.pipe(gulp.dest('logs'))
	});
	
	config.destDirs.forEach(destDir =>{
		gulp.src(distPath + '/**/*')
		.pipe(gulpSsh.dest(destDir + '/'));
	});
	
	ready();
});

gulp.task('clean', ready => {
	shell.rm('-rf', 'build/*');
	ready();
});

gulp.task('default', gulp.series('clean', 'build-js', 'build-css', 'revise', 'revise-cachaeble', 'build-html'), () => {} );
