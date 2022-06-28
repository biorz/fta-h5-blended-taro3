module.exports = {
  comments: true,
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['>0.2%', 'not dead', 'not op_mini all'],
        },
      },
    ],
    ['react-app'],
    ['@babel/preset-react'],
  ],
}
