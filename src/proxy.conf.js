module.exports = {
  '/survey': {
    target: 'http://54.155.59.59:5019',
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

// 'http://192.168.10.6:8080'
