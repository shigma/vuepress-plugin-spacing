const panguPlugin = require('./markdown')

module.exports = (options, context) => ({
  name: 'vuepress-plugin-spacing',

  extendMarkdown (md) {
    md.use(panguPlugin, options, context)
  },
})
