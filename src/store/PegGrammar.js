
const peg = require('pegjs')

class PegGrammar {
  constructor (grammar) {
    this.parser = null
    this.results = []
    this.lint = null
    this.compile(grammar)
  }
  compile (code) {
    // console.log('compiling')
    try {
      this.parser = peg.generate(code)
    }
    catch (err) {
      console.log(err)
    }
  }

  parse (code) {
    // console.log('parsing')
    try {
      this.results = this.parser.parse(code)
    }
    catch (err) {
      this.lint = err
    }
  }
}

export default PegGrammar
