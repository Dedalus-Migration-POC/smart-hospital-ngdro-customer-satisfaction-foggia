module.exports = [
  {
    context: ['/api'],
    target: 'http://54.155.59.59:5019/survey',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
  },
]
