module.exports = {
  '/survey': {
    target: 'http://192.168.10.6:8085',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/survey': '/'
    },
  },
}
