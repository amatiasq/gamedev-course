module.exports = {
  entry: './src/index.ts',

  output: {
    filename: './dist/nomes.js',
  },

  devtool: 'source-map',

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },

  module: {
    loaders: [{ test: /\.ts$/, loader: 'ts-loader' }],
  },

  externals: {
    'phaser': 'Phaser',
  },

  devServer: {
    inline: true,
    stats: {
      colors: true,
      progress: true,
    },
  },
};
