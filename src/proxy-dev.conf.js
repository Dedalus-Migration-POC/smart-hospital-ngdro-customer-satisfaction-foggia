module.exports = {
  '/survey': {
    target: 'http://138.66.71.123:8080',
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
    target: 'http://138.66.71.123:8080',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: null,
  },
}
