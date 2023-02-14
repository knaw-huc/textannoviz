const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  devServer: {
    headers: { "Access-Control-Allow-Origin": "*" },
    historyApiFallback: {
      disableDotRule: true,
    },
    host: "0.0.0.0",
    hot: true,
    port: 3000,
    proxy: {},
  },

  entry: {
    app: "./src/index.tsx",
  },

  mode: "production",

  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ttf$/,
        use: ["file-loader"],
      },
    ],
  },

  output: {
    filename: "[name].bundle.js",
    chunkFilename: "js/[id].chunk.js",
    // path: __dirname + "/build-dev-server",
    publicPath: "/",
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "Textannoviz",
      template: "index.template.html",
    }),
    new Dotenv(),
  ],

  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    fallback: { url: false },
  },

  watchOptions: {
    ignored: /node_modules/,
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
};
