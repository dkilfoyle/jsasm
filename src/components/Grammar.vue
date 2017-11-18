<template lang="pug">
  q-card
    q-card-title Grammar
    q-card-main
      ACE(:content="asmsource" @editor-update="sourceChanged")
    q-card-actions
      q-btn(@click="compile") Compile
</template>

<script>

console.log('Grammar.vue started')

import {
  QCard,
  QCardTitle,
  QCardMain,
  QCardActions,
  QBtn
} from 'quasar'

import ACE from './ACE.vue'
import 'brace/mode/jsasm'
import 'brace/mode/javascript'
import 'brace/theme/chrome'

// const nearley = require('nearley')
// const compile = require('nearley/lib/compile')
// const generate = require('nearley/lib/generate')
// const nearleyGrammar = require('nearley/lib/nearley-language-bootstrapped')

// function compileGrammar (sourceCode) {
//   // Parse the grammar source into an AST
//   const grammarParser = new nearley.Parser(nearleyGrammar)
//   grammarParser.feed(sourceCode)
//   const grammarAst = grammarParser.results[0] // TODO check for errors

//   // Compile the AST into a set of rules
//   const grammarInfoObject = compile(grammarAst, {})
//   // Generate JavaScript code from the rules
//   const grammarJs = generate(grammarInfoObject, 'grammar')

//   // Pretend this is a CommonJS environment to catch exports from the grammar.
//   const module = { exports: {} }
//   eval(grammarJs)
//   return module.exports
// }

import { Parser, Grammar } from 'nearley'
import grammar from './grammar.ne'

// import { mapGetters } from 'vuex'

export default {
  name: 'grammar',
  components: {
    QCard,
    QCardTitle,
    QCardMain,
    QCardActions,
    ACE,
    QBtn
  },
  data () {
    return {
      asmsource: `; my comment
mylabel:
`
    }
  },
  computed: {
  },
  methods: {
    compile: function () {
      console.log('Compiling...')
      const parser = new Parser(Grammar.fromCompiled(grammar))
      console.log(parser.feed(this.asmsource).results[0])
    },
    sourceChanged: function (changedSource) {
      this.asmsource = changedSource
    }
  }
}
</script>

<style lang="stylus">

</style>
