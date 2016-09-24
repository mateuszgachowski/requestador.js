module.exports = {
    entry: './src/demo.js',
    output: {
        path: './dist',
        filename: 'app.bundle.js',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
	        query: {
                presets: ['es2015'],
                cacheDirectory: false
            }
        }]
    }
};
