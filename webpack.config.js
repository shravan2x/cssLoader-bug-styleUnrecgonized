import _debug from 'debug';
import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';

const debug = _debug('app:webpack:config');

debug('Creating configuration ...');
const webpackConfig = {
    name: 'client',
    target: 'web',
    devtool: (process.env.NODE_ENV === 'development' ? 'source-map' : undefined),
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            path.resolve('node_modules'),
            path.resolve('src')
        ]
    },
    module: {}
}

// ------------------------------------
// Entry Points
// ------------------------------------
webpackConfig.entry = {
    app: [
        path.resolve('src/main.js')
    ]
}

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
    filename: `[name].[hash].js`,
    path: path.resolve('dist'),
    publicPath: '/'
}

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
    }),
    new HtmlWebpackPlugin({
        template: path.resolve('index.html'),
        hash: false,
        filename: 'index.html',
        inject: 'body',
        minify: {
            collapseWhitespace: true,
            minifyCSS: true
        }
    }),
    new ExtractTextPlugin('[name].[hash].css', {
        allChunks: true
    })
];

if (process.env.NODE_ENV === 'development') { }
else if (process.env.NODE_ENV === 'production') {
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
        output: {
            comments: false
        }
    }));
}

// ------------------------------------
// Loaders
// ------------------------------------
webpackConfig.module.rules = [{
        test: /\.(js|jsx)$/,
        exclude: path.resolve('node_modules'),
        loader: 'babel-loader',
        query: {
            presets: ['env', 'react', 'stage-0']
        }
    }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
            use: [{
                    loader: `css-loader?root=${path.resolve('src')}&minimize`
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: function () {
                            return [autoprefixer({
                                add: true,
                                remove: true,
                                browsers: ['last 2 versions']
                            })];
                        }
                    }
                }
            ]
        })
    }, { // WOFF is our preferred format.
        test: /\.(woff|woff2)$/,
        loader: 'url-loader',
        options: {
            name: '[path][name].[ext]',
            limit: 102400,
            emitFile: false
        }
    }, {
        test: /\.(png|eot|ttf|svg)$/,
        loader: 'url-loader',
        options: {
            name: '[path][name].[ext]',
            limit: 20480,
            emitFile: false
        }
    }
];

export default webpackConfig
