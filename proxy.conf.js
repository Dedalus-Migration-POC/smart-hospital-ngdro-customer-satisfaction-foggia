module.exports = [
  {
    context: ['/survey'],
    target: 'http://54.155.59.59:5019',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
  },
]
