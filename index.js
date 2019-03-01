const panguPlugin = require('markdown-it-pangu')

module.exports = (options, context) => ({
  extendMarkdown(md) {
    md.use(panguPlugin, options)
  }
})
