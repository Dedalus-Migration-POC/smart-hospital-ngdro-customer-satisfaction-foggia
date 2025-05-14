module.exports = {
  '/survey': {
    target: 'http://192.168.10.6:8080',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    // pathRewrite: {
    //   '^/survey': '/'
    // },
  },
  '/reports-engine': {
    target: 'http://192.168.10.6:8080',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    // pathRewrite: {
    //   '^/reports-engine': '/'
    // },
  },
}
