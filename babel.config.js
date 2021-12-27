module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-env': {
          targets: '>0.2%, not dead, not op_mini all'
        }
      }
    ]
  ],
  plugins: [
    'inline-react-svg',
    '@babel/plugin-proposal-object-rest-spread',
    ['styled-components', { ssr: true, displayName: false }],
    ['polyfill-corejs3', { method: 'usage-global' }],
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
