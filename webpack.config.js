var webpack = require('webpack');

module.exports = {
	entry: './src/main.js',
	output: {
		filename: 'main.js'
	},
	target: 'atom',
	stats: {
		colors: true,
		// modules: true,
		reasons: true
	},
	resolve: {
		alias: {},
		modulesDirectories: [
			'node_modules'
		],
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.jade$/,
				loader: 'jade-loader'
			},
			{
				test: /\.styl$/,
				loader: 'style!css!stylus'
			},
			{test: /\.(vert|frag|glsl)$/, loaders:['raw-loader','glslify-loader']}
		]
	},
	stylus: {
		use: [require('nib')()]
	},
	plugins: [
		new webpack.IgnorePlugin(/vertx/),
		new webpack.ProvidePlugin({
			$: 'jquery'
		})
	]
};
