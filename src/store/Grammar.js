const nearley = require('nearley')
const compile = require('nearley/lib/compile')
const generate = require('nearley/lib/generate')
const nearleyGrammar = require('nearley/lib/nearley-language-bootstrapped')

class Grammar {
  constructor () {
    this.loadGrammar('main -> [.]:*')
    this.results = []
  }
  loadGrammar (code) {
    this.grammar = this.getCompiledGrammar(code)
    this.parser = new nearley.Parser(nearley.Grammar.fromCompiled(this.grammar))
  }
  getCompiledGrammar (nesource) {
    console.log('Compiling nesource')
    // Parse the grammar source into an AST
    const grammarParser = new nearley.Parser(nearleyGrammar)
    grammarParser.feed(nesource)
    const grammarAst = grammarParser.results[0] // TODO check for errors

    // Compile the AST into a set of rules
    const grammarInfoObject = compile(grammarAst, {})
    // Generate JavaScript code from the rules
    const grammarJs = generate(grammarInfoObject, 'grammar')

    // Pretend this is a CommonJS environment to catch exports from the grammar.
    const module = { exports: {} }
    eval(grammarJs)
    return module.exports
  }
  parse (code) {
    this.results = this.parser.feed(code).results
  }
}

export default Grammar