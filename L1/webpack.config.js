var path = require('path');

module.exports = {
  entry: {
    main: './app/index.js',
  },
  output: {
    path: path.join(__dirname, './'),
    filename: "app.js",
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }
    ]
  }
};
