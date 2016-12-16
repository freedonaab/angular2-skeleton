module.exports = function (env, conf) {
	const HtmlWebpackPlugin = require('html-webpack-plugin');
	const path = require('path');
	const webpack = require('webpack');
	const DefinePlugin = require('webpack/lib/DefinePlugin');
	const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
	const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
	const CopyWebpackPlugin = require('copy-webpack-plugin');
	const ExtractTextPlugin = require('extract-text-webpack-plugin');
	const ProgressBarPlugin = require('progress-bar-webpack-plugin');
	const ImageMinPlugin = require('imagemin-webpack-plugin').default;
	const extractRootCss = new ExtractTextPlugin("styles.css");
	const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

	const rootDir = path.resolve(__dirname, '..');
	const app = 'app';
	const dist = 'dist';
	const node_modules = 'node_modules';

	return {
		entry: {
			app: [ path.resolve(rootDir, app, 'main') ],
			vendor: [ path.resolve(rootDir, app, 'vendor') ],
			css: [ path.resolve(rootDir, app, 'app-module.scss')]
		},
		resolve: {
			extensions: [ '.js', '.ts' ],
			modules: [ path.resolve(__dirname, app), node_modules ]
		},
		module: {
			loaders: [
				{
					loader: 'raw-loader',
					test: /\.(css)$/
				},
				{
					loader: 'raw-loader!html-minify-loader',
					test: /\.(html)$/
				},
				{
					loaders: [
						'awesome-typescript-loader',
						'angular2-template-loader',
						'angular2-router-loader'
					],
					test: /\.ts$/,
					exclude: /node_modules/
				},
				{
					test: /\.scss$/,
					loaders: [
						'raw-loader',
						'sass-loader'
					],
					exclude: /app\-module\.scss$/
				},
				{
					test: /app\-module\.scss$/,
					loader: extractRootCss.extract('css!sass')
				},
				{
					test: /\.(png|jpe?g|gif|ico)$/,
					loader: 'file-loader?name=[name].[hash].[ext]'
				},
				{
					test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
					loader: 'url-loader?limit=10000&mimetype=application/font-woff'
				},
				{
					test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
					loader: 'url-loader?limit=10000&mimetype=application/font-woff'
				},
				{
					test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
					loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
				},
				{
					test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
					loader: 'file-loader'
				},
				{
					test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
					loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
				}
			]
		},
		output: {
			filename: '[name].bundle.js',
			path: path.resolve(rootDir, dist)
		},
		plugins: [
			new CommonsChunkPlugin({
				filename: 'vendor.bundle.js',
				minChunks: Infinity,
				name: 'vendor'
			}),
			new HtmlWebpackPlugin({
				filename: 'index.html',
				inject: 'body',
				template: path.resolve(rootDir, app, 'index.html')
			}),
			extractRootCss,
			new UglifyJsPlugin({
				comments: false
			}),
			new DefinePlugin({
				'process.env': JSON.stringify(conf.env || {})
			}),
			new CopyWebpackPlugin([
				{ context: app, from: "**/*.+(png|jpeg|jpg|gif|ico|svg)" }
			]),
			new CopyWebpackPlugin([
				{ context: app, from: "translations", to: "translations" }
			]),
			new ProgressBarPlugin(),
			new ImageMinPlugin(),
			new LoaderOptionsPlugin({
				debug: false,
				options: {
					sass: {
						includePaths: [path.resolve(__dirname, 'app')]
					},
					context: '/',
					'html-minify-loader': {
						empty: true,        // KEEP empty attributes
						comments: true,     // KEEP comments
						quotes: true,       //KEPP quotes
						dom: { // options of !(htmlparser2)[https://github.com/fb55/htmlparser2]
							lowerCaseAttributeNames: false, // do not call .toLowerCase for each attribute name (Angular2 use camelCase attributes)
						}
					}
				}
			})
		],
	};
};
