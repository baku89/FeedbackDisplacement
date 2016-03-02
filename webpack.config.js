var webpack = require('webpack');

module.exports = {
	entry: './src/main.js',
	output: {
		filename: 'main.js'
	},
	target: 'electron',
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
				loader: 'babel!eslint',
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
	eslint: {
		configFile: './.eslintrc',
		formatter: require('eslint-friendly-formatter'),
		failOnError: true
	},
	plugins: [
		new webpack.IgnorePlugin(/vertx/),
		new webpack.ProvidePlugin({
			$: 'jquery'
		})
	]
};
