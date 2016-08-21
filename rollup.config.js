import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  moduleName: 'Kinetic',
  entry: 'src/kinetic.js',
  dest: 'dist/kinetic.js',
  format: 'umd',
  plugins: [ 
    babel(),
    nodeResolve(),
    commonjs()
  ]
}