const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin;
const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: `${__dirname}/../dist`,
    publicPath: '/',
    // filename: 'bundle.[contenthash].js',
    filename: '[name].[chunkhash].js',
  },
  module: {
    rules: [
      // js/jsx loader
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: true,
        },
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
      // js/jsx loader
      // {
      //   test: /\.(js|jsx)$/,
      //   exclude: /node_modules/,
      //   use: ['babel-loader'],
      // },
      // (s)css loader for those files which is outside of node_modules
      // use modules options here
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              localIdentName: '[name]__[local]__[hash:base64:5]',
            },
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      // image file-loader
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true, // true outputs JSX tags
            },
          },
        ],
      },
      {
        test: /\.(woff2|ttf)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin([{ from: './src/assets/files', to: 'files' }]),
    new Dotenv(),
    new FaviconsWebpackPlugin({
      logo: './src/assets/images/rz_favicon.png',
      prefix: 'favicon/icons-[hash]/',
    }),
    new HtmlWebpackPlugin({
      title: 'ReaderZone',
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      },
      template: 'src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css?q=[hash]',
    }),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    // }),
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    alias: {
      assets: path.resolve(__dirname, '../src/assets/'),
      src: path.resolve(__dirname, '../src/'),
    },
  },
  stats: {
    children: false,
    colors: true,
    entrypoints: false,
  },
  // optimization
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      cacheGroups: {
        default: false,
        vendors: false,
        react: {
          filename: 'vendors/react.[chunkhash].js',
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
        },
        semantic: {
          filename: 'vendors/semantic.[chunkhash].js',
          test: /[\\/]node_modules[\\/](semantic-ui-react|semantic-ui-calendar-react)[\\/]/,
        },
        lodash: {
          filename: 'vendors/lodash.[chunkhash].js',
          test: /[\\/]node_modules[\\/](lodash|lodash-es)[\\/]/,
        },
        moment: {
          filename: 'vendors/moment.[chunkhash].js',
          test: /[\\/]node_modules[\\/](moment|moment-timezone)[\\/]/,
        },
        xlsx: {
          filename: 'vendors/xlsx.[chunkhash].js',
          test: /[\\/]node_modules[\\/](xlsx)[\\/]/,
        },
        braintree: {
          filename: 'vendors/braintree.[chunkhash].js',
          test: /[\\/]node_modules[\\/](braintree-web-drop-in)[\\/]/,
        },
        react_dates: {
          filename: 'vendors/react-dates.[chunkhash].js',
          test: /[\\/]node_modules[\\/](react-dates)[\\/]/,
        },
        vendor: {
          test: module => {
            let path = require('path');
            const resourcePath = module.resource || '';
            const getPackagePath = name =>
              `${path.sep}node_modules${path.sep}${name}${path.sep}`;
            const nodeModulesPath = `${path.sep}node_modules${path.sep}`;

            // we are ignoring below package because we have already defined them above
            const ignorePaths = [
              getPackagePath('react'),
              getPackagePath('react-dom'),
              getPackagePath('semantic-ui-react'),
              getPackagePath('semantic-ui-calendar-react'),
              getPackagePath('lodash'),
              getPackagePath('lodash-es'),
              getPackagePath('moment'),
              getPackagePath('moment-timezone'),
              getPackagePath('xlsx'),
              getPackagePath('braintree-web-drop-in'),
              getPackagePath('react-dates'),
            ];
            // check whether resourcePath is in one of the ignored path
            const doesContainIgnorePath = ignorePaths.some(p =>
              resourcePath.includes(p)
            );
            if (
              !doesContainIgnorePath &&
              resourcePath.includes(nodeModulesPath)
            ) {
              // if path is not in ignore path list and path is from node_modules then count it
              return true;
            }
            return false;
          },
          filename: 'vendors/others.[chunkhash].js',
        },
      },
    },
  },
};
