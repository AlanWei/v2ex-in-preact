const webpack = require('webpack');
const ExtractTextPlugin = require ('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require ('html-webpack-plugin');
const autoprefixer = require ('autoprefixer');
const CopyWebpackPlugin = require ('copy-webpack-plugin');
const ReplacePlugin = require ('replace-bundle-webpack-plugin');
const OfflinePlugin = require ('offline-plugin');
const path = require ('path');
const V8LazyParseWebpackPlugin = require ('v8-lazy-parse-webpack-plugin');
const ENV = process.env.NODE_ENV || 'development';

module.exports = {
  // better to set to make configuration independent from CWD
  context: path.resolve(__dirname, "src"),
  entry: './index.js',

  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: './',
    filename: 'bundle.js'
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [ 'es2015' ]
        }
      }
    }, {
      test: /\.(less|css)$/,
      include: path.resolve(__dirname, 'src'),
      exclude: path.resolve(__dirname, 'src/components'),
      use: ExtractTextPlugin.extract({
        fallback: {
          loader: 'style-loader',
          options: {
            singleton: true
          }
        },
        use: [{
          loader: 'css-loader',
          options: {
            minimize: ENV === 'production',
            sourceMap: ENV === 'development',
            importLoaders: 1
          }
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: () => {
              return [
                require('autoprefixer')
              ];
            }
          }
        }, {
          loader: 'less-loader',
          options: {
            sourceMap: ENV === 'development'
          }
        }]
      })
    }, {
      // Transform our own .(less|css) files with PostCSS and CSS-modules
      test: /\.(less|css)$/,
      include: path.resolve(__dirname, 'src/components'),
      use: ExtractTextPlugin.extract({
        fallback: {
          loader: 'style-loader',
          options: {
            singleton: true
          }
        },
        use: [{
          loader: 'css-loader',
          options: {
            modules: true,
            localIdentName: '[path][name]__[local]',
            minimize: ENV === 'production',
            sourceMap: ENV === 'development',
            importLoaders: 1
          }
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: () => {
              return [
                require('autoprefixer')
              ];
            }
          }
        }, {
          loader: 'less-loader',
          options: {
            sourceMap: ENV === 'development'
          }
        }]
      })
    }, {
      test: /\.(xml|html|txt|md)$/,
      use: {
        loader: 'raw-loader'
      }
    },
    {
      test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
      use: ENV === 'production' ? {
        loader: 'file-loader?name=[path][name]_[hash:base64:5].[ext]'
      } : {
        loader: 'url-loader'
      }
    }]
  },

  resolve: {
    extensions: ['.jsx', '.js', '.json', '.less'],
    modules: [
      path.resolve(__dirname, "src/lib"),
      path.resolve(__dirname, "node_modules"),
      'node_modules'
    ],
    alias: {
      components: path.resolve(__dirname, "src/components"),    // used for tests
      style: path.resolve(__dirname, "src/style"),
      'react': 'preact-compat',
      'react-dom': 'preact-compat'
    }
  },

  plugins: ([
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin({
      filename: 'style.css',
      allChunks: true,
      disable: ENV !== 'production'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV)
    }),
    new HtmlWebpackPlugin({
      template: './index.ejs',
      minify: { collapseWhitespace: true }
    }),
    new CopyWebpackPlugin([
      { from: './manifest.json', to: './' },
      { from: './favicon.ico', to: './' }
    ])
  ]).concat(ENV === 'production' ? [
    new V8LazyParseWebpackPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      compress: {
        warnings: false,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        negate_iife: false
      }
    }),

    // strip out babel-helper invariant checks
    new ReplacePlugin([{
      // this is actually the property name https://github.com/kimhou/replace-bundle-webpack-plugin/issues/1
      partten: /throw\s+(new\s+)?[a-zA-Z]+Error\s*\(/g,
      replacement: () => 'return;('
    }]),
    new OfflinePlugin({
      relativePaths: false,
      AppCache: false,
      excludes: ['_redirects'],
      ServiceWorker: {
        events: true
      },
      publicPath: '/'
    })
  ] : []),

  stats: { colors: true },

  node: {
    global: true,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false
  },

  devtool: ENV === 'production' ? 'cheap-module-source-map' : 'cheap-module-eval-source-map',

  devServer: {
    port: process.env.PORT || 8080,
    host: 'localhost',
    publicPath: '/',
    contentBase: './src',
    historyApiFallback: true,
    open: true,
    proxy: {
      // OPTIONAL: proxy configuration:
      // '/optional-prefix/**': { // path pattern to rewrite
      //   target: 'http://target-host.com',
      //   pathRewrite: path => path.replace(/^\/[^\/]+\//, '')   // strip first path segment
      // }
    }
  }
};
