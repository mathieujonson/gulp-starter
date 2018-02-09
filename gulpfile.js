var gulp =         require('gulp'),
	sass =         require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	uglifycss =    require('gulp-uglifycss'),
	glob =         require('glob'),
	gutil   =      require("gulp-util"),
	webpack =      require('webpack')
	watch =        require('gulp-watch');

/* FOLDER SETTINGS --- */
var src = {
	bundles: './source/scripts/*.js',
	styles:  './source/styles/**/*.scss'
};
var dist = {
	bundles: './public/scripts/',
	styles:  './public/styles/'
};

gulp.task('sass', function() {
	gulp.src(src.styles)
		.pipe(watch(src.styles))
		.pipe(sass()).pipe(autoprefixer({
			browsers: ['> 1%', 'last 2 versions'],
			cascade: false
		}))
		.pipe(uglifycss())
		.pipe(gulp.dest(dist.styles));
});

gulp.task('webpack', function(callback) {
	glob(src.bundles, function(err, files) {
		/* AGGREGATE FILES -- */
		var entries = {};
		var re = new RegExp(src.bundles.replace(/\*.*/, '') + '|.js', 'ig');
		files.forEach(function(file){
			var name = file.replace(re, '');
			entries[ name ] = file;
		});

		/* DEFINE WEBPACK PLUGINS --- */
		var uglifyPlugin  = new webpack.optimize.UglifyJsPlugin({compress:{ warnings:false }});
		var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

		/* EXECUTE WEBPACK --- */
		return webpack({
			watch: true,
			entry: entries,
			output: {
				path: dist.bundles,
				filename: '[name].js' // Template based on keys in entry above
			},
			module: {
				/* WE'LL ADD JSX LOADER LATER & STAGE-0 FOR SPREAD OPERATOR [...yep] */ 
				loaders: [
					{ 
						test: /\.js$/, 
						loaders: ['babel?presets[]=es2015'],
						exclude: /node_modules/
					},
				]
			},
		  	plugins: [uglifyPlugin],
		},
		function(err, stats) {
			if(err) throw new gutil.PluginError("webpack", err);
			gutil.log("[webpack]", stats.toString({}));
		});
	});
});


gulp.task('default', ['sass', 'webpack']);