import * as path from 'path'
import * as webpack from 'webpack'

const srcPath = path.resolve(__dirname, '../src')

const config: webpack.Configuration = {
  context: __dirname,
  mode: 'development',
  entry: [path.resolve(__dirname, './src/app.tsx')],
  output: {
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: [path.resolve(__dirname, './src')],
        exclude: /node_modules/,
        // loader: require.resolve('babel-loader'),
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      src: srcPath,
      '@mw': path.resolve(srcPath, './assets'),
      rider: path.resolve(__dirname, '../node_modules/rider/lib/rider/index.styl'),
    },
    mainFields: ['main', 'main:brower'],
  },
  externals: ['react'],
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        CODE_ENV: JSON.stringify(process.env.CODE_ENV),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        USEMOCK: JSON.stringify(process.env.USEMOCK),
      },
    }),
  ],
}
export default config
