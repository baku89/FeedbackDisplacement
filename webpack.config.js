var webpack = require('webpack');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
	entry: './src/main.js',
	output: {
		path: __dirname + "/build",
		filename: 'main.js'
	},
	devtool: 'inline-source-map',
	target: 'atom',
	stats: {
		colors: true,
		modules: true,
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
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			},
			{test: /\.(vert|frag|glsl)$/, loaders:['raw-loader','glslify-loader']}
		]
	},
	stylus: {
		use: [require('nib')()]
	},
	plugins: [
		new webpack.IgnorePlugin(/vertx/),
		new BrowserSyncPlugin({
			host: 'localhost',
			port: 9999,
			open: false,
			files: ['index.html','index.css', 'build/main.js'],
			server: {
				baseDir: ['.']
			}
		}),
		new webpack.ProvidePlugin({
			$: 'jquery'
		})
	]
};
