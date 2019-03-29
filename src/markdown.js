const { spacing, spacingBetween } = require('./utils')
const { escapeHtml, isWhiteSpace } = require('markdown-it/lib/common/utils')

module.exports = (md, options = {}, context) => {
  const {
    tagRules = ['s', 'u', 'em', 'strong'],
    breakRules = ['html_inline'],
    spacingRules = ['code_inline'],
    useFullWidth = ['zh', 'jp', 'kr', 'lzh'],
  } = options

  const tagRulesOpen = tagRules.map(tag => `${tag}_open`)
  const tagRulesClose = tagRules.map(tag => `${tag}_close`)
  const breakRulesOpen = [...tagRulesOpen, ...breakRules]
  const breakRulesClose = [...tagRulesClose, ...breakRules]

  function getPrevChar (tokens, index) {
    let prevChar = ''
    for (let i = index - 1; i >= 0; --i) {
      const { content, type } = tokens[i]
      if (breakRulesOpen.includes(type)) break
      if (content && content.length) {
        prevChar = content.slice(-1)
        break
      }
    }
    return prevChar
  }

  function getNextChar (tokens, index) {
    let nextChar = ''
    for (let i = index + 1; i < tokens.length; ++i) {
      const { content, type } = tokens[i]
      if (breakRulesClose.includes(type)) break
      if (content && content.length) {
        nextChar = content.slice(0, 1)
        break
      }
    }
    return nextChar
  }

  function resolveUseFullWidth (env) {
    const { relativePath = '', frontmatter } = env

    // use `frontmatter.useFullWidth`
    if (frontmatter.useFullWidth !== undefined) {
      return frontmatter.useFullWidth
    }

    // use `options.useFullWidth` (boolean)
    if (!Array.isArray(useFullWidth)) return useFullWidth

    // use `options.useFullWidth` (array)
    for (const path in context.siteConfig.locales) {
      if (relativePath.startsWith(path.replace(/^\//, ''))) {
        const { lang = '' } = context.siteConfig.locales[path]
        if (useFullWidth.includes(lang.match(/^[a-z]+/)[0])) {
          return true
        } else {
          return false
        }
      }
    }

    // disable by default
    return false
  }

  tagRulesOpen.forEach((type) => {
    const rule = md.renderer.rules[type] || ((tokens, index, options) => {
      return md.renderer.renderToken(tokens, index, options)
    })

    md.renderer.rules[type] = (tokens, index, options, env, self) => {
      const prevChar = getPrevChar(tokens, index)
      const nextChar = getNextChar(tokens, index)
      return spacingBetween(prevChar, nextChar) + rule(tokens, index, options, env, self)
    }
  })

  md.renderer.rules.text = (tokens, index, options, env, self) => {
    const prevChar = getPrevChar(tokens, index)
    const useFullWidth = resolveUseFullWidth(env)
    return escapeHtml(spacing(prevChar + tokens[index].content, useFullWidth).slice(prevChar.length))
  }

  spacingRules.forEach((type) => {
    const rule = md.renderer.rules[type]
    if (!rule) return

    md.renderer.rules[type] = (tokens, index, options, env, self) => {
      let output = rule(tokens, index, options, env, self)
      if (output.length) {
        if (index > 0 && !isWhiteSpace(output.charAt(0))) {
          output = ' ' + output
        }
        if (index < tokens.length - 1 && !isWhiteSpace(output.charAt(output.length - 1))) {
          output += ' '
        }
      }
      return output
    }
  })
}
