module.exports = {
  presets: ['next/babel'],
  plugins: [
    ['styled-components', { ssr: true, displayName: false }],
    'inline-react-svg',
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src'
        }
      }
    ]
  ]
};
