
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '',
  // Uncomment the following code to enable proxying to API server
  // devServer: {
  //   proxy: 'http://localhost:3000/notebooks' // placeholder
  // }
})
