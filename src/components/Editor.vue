<template lang="pug">
  q-card
    q-card-title Source
    q-card-main
      ACE(:content="asmsource" @editor-update="sourceChanged" :lint="asmParser.lint")
    q-card-actions
      //- q-btn(@click="lint") Lint
      q-btn(@click="assemble") Assemble
      q-btn(@click="assemble2" :disable="asmParser.lint !== null") Assemble2
      q-btn Run
      q-btn(@click="step") Step
      q-btn(@click="reset") Reset
</template>

<script>

console.log('Editor.vue started')

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
import 'brace/mode/assembly_x86'
import 'brace/theme/chrome'

import helloasm from './hello.asm'

import { mapGetters } from 'vuex'

export default {
  name: 'editor',
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
      asmsource: helloasm
    }
  },
  computed: {
    ...mapGetters(['asmParser'])
  },
  methods: {
    lint: function () {
      // console.log('Linting...')
      this.$store.commit('parseCode', this.asmsource)
    },
    assemble: function () {
      console.log('Assembling...')
      this.$store.dispatch('assembleSourceCode', this.asmsource)
    },
    assemble2: function () {
      console.log('Assembling2...')
      console.log('1: Parsing to AST')
      this.$store.commit('parseCode', this.asmsource)
      console.log('2: Assembling AST to byte code')
      this.$store.dispatch('assembleSourceCode2', this.asmParser.results)
    },
    sourceChanged: function (changedSource) {
      this.asmsource = changedSource
      this.lint()
    },
    reset: function () {
      console.log('Resetting...')
      this.$store.dispatch('reset')
    },
    step: function () {
      console.log('Step...')
      this.$store.dispatch('step')
    }
  },
  mounted: function () {
    this.lint()
  }
}
</script>

<style lang="stylus">

</style>
