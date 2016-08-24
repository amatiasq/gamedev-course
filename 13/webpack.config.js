module.exports = {
  devtool: 'source-map',
  entry: './src/index.ts',
  output: { filename: './dist/built.js' },

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
