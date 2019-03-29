/**
 * @jest-environment node
 */

const { fs, path, parseFrontmatter } = require('@vuepress/shared-utils')
const { createApp } = require('@vuepress/core')

describe('spacing', () => {
  let app

  beforeAll(async () => {
    app = createApp({
      siteConfig: {
        locales: {
          '/zh/': { lang: 'zh-CN' },
          '/en/': { lang: 'en-US' },
        },
        plugins: [
          [require('..'), {
          }],
        ],
      },
    })
    return app.process()
  })

  const fragmentDir = path.join(__dirname, 'fragments')
  fs.readdirSync(fragmentDir).forEach((name) => {
    const filepath = path.join(fragmentDir, name)
    const rawFile = fs.readFileSync(filepath, 'utf8')
    const { data, content } = parseFrontmatter(rawFile)
    test(name, () => {
      const { html } = app.markdown.render(content, {
        ...(data.ENV || {}),
        frontmatter: data,
      })
      expect(html).toMatchSnapshot()
    })
  })
})
