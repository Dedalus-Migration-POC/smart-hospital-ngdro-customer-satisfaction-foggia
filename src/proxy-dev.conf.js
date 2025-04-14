module.exports = {
  '/survey': {
    target: 'http://54.155.59.59:5019',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: null,
  },
  '/protocol': {
    target: 'http://54.155.59.59:5100/realms/foggia_survey-dev',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: null,
  },
  '/oauth': {
    target: 'http://54.155.59.59:5019',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: null,
  },
}
