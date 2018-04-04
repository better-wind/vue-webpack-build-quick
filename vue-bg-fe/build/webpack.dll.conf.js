const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry:{
    vendor: ['vue/dist/vue.esm.js', 'vuex', 'axios', 'vue-router', 'element-ui']
  },
  output:{
    path: path.join(__dirname, "../static/dll"), // 打包后文件输出的位置
    filename: '[name].dll.js',
    library: '[name]_library',
  },
  plugins:[
    new webpack.DllPlugin({
      path:path.join(__dirname,"../static/dll",'[name]-manifest.json'),
      name: '[name]_library',
      // context: __dirname
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
