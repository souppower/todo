const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PurifyCSSPlugin = require('purifycss-webpack')

exports.devServer = ({ host, port } = {}) => ({
	devServer: {
		open: true,
		historyApiFallback: true,
		stats: 'errors-only',
		host,
		port,
		overlay: {
			errors: true,
			warnings: true,
		},
	},
})


exports.lintJavaScript = ({ include, exclude, options }) => ({
	module: {
		rules: [
			{
				test: /\.js$/,
				include,
				exclude,
				enforce: 'pre',
				loader: 'eslint-loader',
				options,
			},
		],
	},
})

exports.loadJavaScript = ({ include, exclude }) => ({
	module: {
		rules: [
			{
				test: /\.js$/,
				include,
				exclude,
				loader: 'babel-loader',
				options: {
					cacheDirectory: true,
				},
			},
		],
	},
})

exports.transpileTypeScript = () => ({
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'awesome-typescript-loader',
				exclude: /node_modules/,
			},
		],
	},
})

exports.loadCSS = ({ include, exclude } = {}) => ({
	module: {
		rules: [
			{
				test: /\.css$/,
				include,
				exclude,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
})

exports.extractCSS = ({ include, exclude, use }) => {
  // Output extracted CSS to a file
	const plugin = new ExtractTextPlugin({
		filename: '[name].css',
	})

	return {
		module: {
			rules: [
				{
					test: /\.css$/,
					include,
					exclude,

					loader: plugin.extract({
						use,
            // fallback: 'style-loader',
					}),
				},
			],
		},
		plugins: [plugin],
	}
}

exports.autoprefix = () => ({
	loader: 'postcss-loader',
	options: {
		plugins: () => ([
			require('autoprefixer'),
		]),
	},
})

exports.purifyCSS = ({ paths }) => ({
	plugins: [
		new PurifyCSSPlugin({ paths }),
	],
})

exports.lintCSS = ({ include, exclude }) => ({
	module: {
		rules: [
			{
				test: /\.css$/,
				include,
				exclude,
				enforce: 'pre',
				loader: 'postcss-loader',
				options: {
					plugins: () => ([
						require('stylelint')({
							ignoreFiles: 'node_modules/**/*.css',
						}),
					]),
				},
			},
		],
	},
})

exports.loadImages = ({ include, exclude, options } = {}) => ({
	module: {
		rules: [
			{
				test: /\.(png|jpg|svg)$/,
				include,
				exclude,
				use: {
					loader: 'url-loader',
					options,
				},
			},
		],
	},
})

exports.loadFonts = ({ include, exclude, options } = {}) => ({
	module: {
		rules: [
			{
				test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
				include,
				exclude,
				use: {
					loader: 'file-loader',
					options,
				},
			},
		],
	},
})

exports.generateSourceMaps = ({ type }) => ({
	devtool: type,
})
