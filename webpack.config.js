var CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require('path');

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: './index.html',
        to: 'index.html'
      }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          js: 'babel?presets[]=es2015'
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(jpe?g|gif|png|svg|woff2?|eot|ttf|wav|mp3)(\?.*$|$)/,
        loader: 'file-loader'
      }
    ]
  }
};
