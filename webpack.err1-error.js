/**
 *  sample configuration do investigate missing imports
 *
 *
 */

//const merge = require('webpack-merge');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const glob = require('glob');



const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");


const groupsOptions = {chunks: "all", minSize:0, minChunks: 1, reuseExistingChunk: true, enforce: true};


const entries = glob.sync('./src/entrypoint/**/*.js');

const entry = {};
const htmlPlugins = [];
for (const path of entries) {

const chunkName = path.slice('./src/entrypoint/'.length, -'.js'.length);


  entry[chunkName] = path ;
  htmlPlugins.push(new HtmlWebpackPlugin({ // inject entrypoint in given template file ( ie : add .js generated to .html )
    template: path.replace('.js', '.html'), // ie : ./src/entrypoint/stats/sample.html
    filename: chunkName + '.html', // ie stats/sample.html
    chunksSortMode: 'none',
    chunks: [
      'vendors','commons',
      "entrypoint/"+chunkName]
  }))
}

console.log("HtmlWebpackPlugin entries = " , htmlPlugins);


const extractMiniCss = new MiniCssExtractPlugin({
  filename: "css/[name].css", // one css for all
  chunkFilename: "chunk-[id].css"
});

function root(__path) {
  return path.join(__dirname, __path);
}

module.exports = {
  //entry: './src/js/entrypoint/index.js',
  //entry: './src/entrypoint/a.js',
  //mode: "development",

  entry: {
    //...entrypoints
    "entrypoint/index" : [path.join(root('src'),"entrypoint/index.js")],
    "entrypoint/b" : [path.join(root('src'),"entrypoint/b.js")],

  },

  output: {
    filename: 'assets/[name].[chunkhash:4].bundle.js', // ?hash=[chunkhash]
    publicPath: '/',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    alias: {

    }
  },
  stats: {   // https://webpack.js.org/configuration/stats/
//      children: false
    assets: true,

  },

  optimization: {
    minimize: false,



    splitChunks: { // https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693
      chunks: 'all',
      //minSize: 2,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
      minChunks: 2,
      name: true,

      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
         minSize:0, minChunks: 1, reuseExistingChunk: true, enforce: true
        },


        vendors: {
          name: 'vendors',
          enforce: true,
          minChunks: 1,

          //test: /\.js$/,
          //test: /[\\/]node_modules[\\/]/, // <- this is sufficent ? 

          test: function(module) {
            return (
              module.resource &&
              //module.resource.endsWith(".js") &&
              (
                module.resource.startsWith(root('node_modules')) ||
                module.resource.startsWith(root('vendor')))
            );
          },
          priority: -10,
          //reuseExistingChunk: true,
          ...groupsOptions
        },
        commons: {
          chunks: 'all',
          name: 'commons',
          //chunks: 'initial',
          minChunks: 30,
          //minSize:0,
          // ,
          test: function(module) {

            let  testOk = module.resource &&
              module.resource.endsWith(".js") &&
              module.resource.startsWith(root('src'));

            return testOk
          },
          priority: -5,
          //reuseExistingChunk: true,
          ...groupsOptions
        },
      },
    },


  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    ...htmlPlugins,
    extractMiniCss,

    //new webpack.optimize.ModuleConcatenationPlugin(), // https://webpack.js.org/plugins/module-concatenation-plugin/

  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      },
    
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        use: [ {
          loader: 'html-loader',  // more options : https://github.com/webpack-contrib/html-loader
          options: {
            minimize: false ,
            removeComments: true,
            //attrs: [':data-src'] <-- add custom attribute ( ie images on thymeleaf ) https://github.com/webpack-contrib/html-loader
          }
        }],
      },


    ]
  }




};