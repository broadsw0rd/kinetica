import pkg from './package.json'
import buble from 'rollup-plugin-buble'

export default {
  input: 'src/kinetic.js',
  output: [
    { file: pkg.main, format: 'umd', name: 'Kinetic' },
    { file: pkg.module, format: 'es' }
  ],
  plugins: [
    buble()
  ]
}
