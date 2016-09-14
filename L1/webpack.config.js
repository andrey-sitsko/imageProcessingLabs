var path = require('path');

module.exports = {
  entry: {
    main: './app/scripts/index.js',
  },
  output: {
    path: path.join(__dirname, './app/'),
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
