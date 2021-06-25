module.exports = {
  presets: ['next/babel'],
  plugins: [
    'inline-react-svg',
    ['styled-components', { ssr: true, displayName: false }],
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
