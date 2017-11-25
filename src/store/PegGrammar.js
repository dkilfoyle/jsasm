
const peg = require('pegjs')

class PegGrammar {
  constructor () {
    this.compile('main = .*')
    this.results = []
    this.lint = null
    this.parser = null
  }
  compile (code) {
    this.parser = peg.generate(code)
  }

  parse (code) {
    try {
      console.log(this.parser.parse(code))
    }
    catch (err) {
      console.log(err)
    }
  }
}

export default PegGrammar
