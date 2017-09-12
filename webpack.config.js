var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
 
module.exports = {
    entry: {
      'polyfills': './polyfills.ts',
      'vendor': './vendor.ts',
      'app': './app/main.ts',
      'css': './app/css/styles.css'
    },
    output: {
        path: path.resolve('dist'),
        filename: '[name].[hash].js',
        chunkFilename: '[id].[hash].chunk.js',
        publicPath: '/'
      },
  resolve: {
    extensions: ['.ts', '.js', '.css']
  },
 
  module: {
    rules: [
      { 
        test: require.resolve('jquery'), 
        loader: 'expose-loader?jQuery!expose-loader?$' 
      },
      {
        test: /\.ts$/,
        loaders: [{
          loader: 'awesome-typescript-loader',
          options: { configFileName: path.resolve('tsconfig.json') }
        } , 'angular2-template-loader', 'angular-router-loader']
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
      test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
      loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ fallback: 'style-loader', loader: 'css-loader' })

      }]
  },
 
  plugins: [
    new webpack.ContextReplacementPlugin(
      /angular(\|\/)core(\|\/)(esm(\|\/)src|src)(\|\/)linker/,
      path.resolve('./app'), // каталог с исходными файлами
      {} // карта маршрутов
    ),
 
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills', 'css']
    }),
 
    new HtmlWebpackPlugin({
      inject: true,
      template: 'index_webpack.html'
    }),
    new ExtractTextPlugin('[name].[hash].css'),
     
    new webpack.optimize.UglifyJsPlugin({ 
      mangle: {
        keep_fnames: true
      }
    }),
     
    new webpack.LoaderOptionsPlugin({
      htmlLoader: {
        minimize: false
      }
    }),

    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
    })
  ]
};