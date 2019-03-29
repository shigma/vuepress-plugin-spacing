const pangu = require('pangu')

const _spacing = (text) => pangu.spacing(text)

const spacingBetween = (char1, char2) => {
  return _spacing(char1 + char2).slice(char1.length, -char2.length)
}

const spacing = (text, fullWidth = true) => {
  return fullWidth
    ? _spacing(text + '\uf900').slice(0, -1)
    : _spacing(text)
      .replace(/～/g, ' ~ ')
      .replace(/！/g, '! ')
      .replace(/；/g, '; ')
      .replace(/：/g, ': ')
      .replace(/，/g, ', ')
      .replace(/。/g, '. ')
      .replace(/？/g, '? ')
      .trim()
}

module.exports = {
  spacing,
  spacingBetween,
}
