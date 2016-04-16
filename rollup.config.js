import babel from 'rollup-plugin-babel'

export default {
  moduleName: 'Kinetic',
  entry: 'src/kinetic.js',
  dest: 'dist/kinetic.js',
  format: 'umd',
  plugins: [ 
    babel()
  ]
}