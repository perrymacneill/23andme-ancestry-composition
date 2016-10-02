module.exports = {
    entry: './src/app.js',
    output: {
        path: './static/js',
        filename: 'bundle.js',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }]
    }
}
